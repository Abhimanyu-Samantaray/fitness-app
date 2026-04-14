package com.fitness.userservice.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserException.class)
    public ResponseEntity<String> handle(UserException ex) {
        return ResponseEntity
                .status(ex.getStatus())   // ✅ important
                .body(ex.getMessage());  // ✅ message from super(message)
    }

}
