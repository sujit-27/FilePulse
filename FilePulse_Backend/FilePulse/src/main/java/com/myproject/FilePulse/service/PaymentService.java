package com.myproject.FilePulse.service;

import com.myproject.FilePulse.dao.PaymentTransactionDao;
import com.myproject.FilePulse.dto.PaymentDto;
import com.myproject.FilePulse.dto.PaymentVerificationDto;
import com.myproject.FilePulse.model.PaymentTransaction;
import com.myproject.FilePulse.model.Profile;
import com.myproject.FilePulse.model.UserCredits;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private ProfileService profileService;
    @Autowired
    private UserCreditsService userCreditsService;
    @Autowired
    private PaymentTransactionDao repo;

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;
    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    public PaymentDto createOrder(PaymentDto paymentDto) {
        PaymentDto paymentDto1 = new PaymentDto();
        try {
            Profile profile = profileService.getCurrentProfile();
            String clerkId = profile.getClerkId();

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", paymentDto.getAmount());
            orderRequest.put("currency", paymentDto.getCurrency());
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);

            String orderId = order.get("id");

            PaymentTransaction transaction = new PaymentTransaction();
            transaction.setClerkId(clerkId);
            transaction.setOrderId(orderId);
            transaction.setPlanId(paymentDto.getPlanId());
            transaction.setAmount(paymentDto.getAmount());
            transaction.setCurrency(paymentDto.getCurrency());
            transaction.setStatus("PENDING");
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setUserEmail(profile.getEmail());
            transaction.setUserName(profile.getFirstName() + " " + profile.getLastName());

            repo.save(transaction);

            paymentDto1.setOrderId(orderId);
            paymentDto1.setSuccess(true);
            paymentDto1.setMessage("Order Created Successfully!");
        } catch (Exception e) {
            logger.error("Error Creating Order", e);
            paymentDto1.setSuccess(false);
            paymentDto1.setMessage("Error Creating Order: " + e.getMessage());
        }
        return paymentDto1;
    }

    private static String generateHmacSha256Signature(String data, String key) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // HEX encoding which Razorpay expects
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public PaymentDto verifyPayment(PaymentVerificationDto request) {
        PaymentDto paymentDto = new PaymentDto();
        try {
            Profile currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            String data = request.getRazorpay_order_id() + "|" + request.getRazorpay_payment_id();

            String generatedSignature = generateHmacSha256Signature(data, razorpayKeySecret);

            if (!generatedSignature.equals(request.getRazorpay_signature())) {
                updateTransactionStatus(request.getRazorpay_order_id(), "FAILED", request.getRazorpay_payment_id(), null);
                paymentDto.setSuccess(false);
                paymentDto.setMessage("Payment Signature Verification failed.");
                return paymentDto;
            }

            int creditsToAdd = 0;
            String plan = "BASIC";

            switch (request.getPlanId()) {
                case "premium":
                    creditsToAdd = 500;
                    plan = "PREMIUM";
                    break;
                case "ultimate":
                    creditsToAdd = 5000;
                    plan = "ULTIMATE";
                    break;
            }

            if (creditsToAdd > 0) {
                UserCredits userCredits = userCreditsService.getUserCredits(clerkId);
                userCreditsService.addCredits(clerkId, creditsToAdd, plan);
                updateTransactionStatus(request.getRazorpay_order_id(), "SUCCESS", request.getRazorpay_payment_id(), creditsToAdd);
                paymentDto.setSuccess(true);
                paymentDto.setMessage("Payment verified and credits added successfully.");
                paymentDto.setCredits(userCredits != null ? userCredits.getCredits() : 0);
            } else {
                updateTransactionStatus(request.getRazorpay_order_id(), "FAILED", request.getRazorpay_payment_id(), null);
                paymentDto.setSuccess(false);
                paymentDto.setMessage("Invalid plan selected.");
            }
        } catch (Exception e) {
            logger.error("Error verifying payment", e);
            try {
                updateTransactionStatus(request.getRazorpay_order_id(), "ERROR", request.getRazorpay_payment_id(), null);
            } catch (Exception ex) {
                logger.error("Error updating transaction status", ex);
            }
            paymentDto.setSuccess(false);
            paymentDto.setMessage("Error verifying payment: " + e.getMessage());
        }
        return paymentDto;
    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsToAdd) {
        Optional<PaymentTransaction> transactionOpt = repo.findByOrderId(razorpayOrderId);
        transactionOpt.ifPresent(transaction -> {
            transaction.setStatus(status);
            transaction.setPaymentId(razorpayPaymentId);
            if (creditsToAdd != null) {
                transaction.setCreditsAdded(creditsToAdd);
            }
            repo.save(transaction);
        });
    }
}
