package com.myproject.FilePulse.controller;

import com.myproject.FilePulse.dto.UserCreditsDto;
import com.myproject.FilePulse.model.UserCredits;
import com.myproject.FilePulse.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserCreditsController {

    @Autowired
    private UserCreditsService userCreditsService;

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(){
        UserCredits credits =  userCreditsService.getUserCredits();

        UserCreditsDto userCreditsDto = new UserCreditsDto();
        userCreditsDto.setCredits(credits.getCredits());
        userCreditsDto.setPlan(credits.getPlan());

        return ResponseEntity.ok(userCreditsDto);
    }
}
