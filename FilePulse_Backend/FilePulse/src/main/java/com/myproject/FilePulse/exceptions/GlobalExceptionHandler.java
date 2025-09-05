package com.myproject.FilePulse.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDuplicateEmailException(DataIntegrityViolationException ex){
        Map<String,Object> data = new HashMap<>();
        data.put("status", HttpStatus.CONFLICT);
        data.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(data);
    }
}
