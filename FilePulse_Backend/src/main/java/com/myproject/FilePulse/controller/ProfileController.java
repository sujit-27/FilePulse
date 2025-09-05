package com.myproject.FilePulse.controller;

import com.myproject.FilePulse.dto.ProfileDto;
import com.myproject.FilePulse.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProfileController {

    @Autowired
    private ProfileService service;

    @PostMapping("/register")
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileDto profileDto){
        HttpStatus status = service.existsByClerkId(profileDto.getClerkId()) ?
                HttpStatus.ACCEPTED : HttpStatus.CREATED;
        ProfileDto savedProfile = service.createProfile(profileDto);
        return ResponseEntity.status(status).body(savedProfile);
    }
}
