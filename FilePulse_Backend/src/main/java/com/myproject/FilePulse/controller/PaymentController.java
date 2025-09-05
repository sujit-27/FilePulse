package com.myproject.FilePulse.controller;

import com.myproject.FilePulse.dto.PaymentDto;
import com.myproject.FilePulse.dto.PaymentVerificationDto;
import com.myproject.FilePulse.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentDto paymentDto){
        PaymentDto response = paymentService.createOrder(paymentDto);

        if(response.getSuccess()){
            return ResponseEntity.ok(response);
        }
        else{
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDto request) throws Exception {
        PaymentDto response = paymentService.verifyPayment(request);

        if(response.getSuccess()){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
