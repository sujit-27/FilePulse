package com.myproject.FilePulse.controller;

import com.myproject.FilePulse.dao.PaymentTransactionDao;
import com.myproject.FilePulse.model.PaymentTransaction;
import com.myproject.FilePulse.model.Profile;
import com.myproject.FilePulse.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("transactions")
public class TransactionController {

    @Autowired
    private PaymentTransactionDao paymentTransactionDao;
    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getUserTransactions(){
        Profile currentProfile = profileService.getCurrentProfile();
        String clerkId = currentProfile.getClerkId();

        List<PaymentTransaction> transactions = paymentTransactionDao.findByClerkIdAndStatusOrderByTransactionDateDesc(clerkId,"SUCCESS");

        return ResponseEntity.ok(transactions);
    }
}
