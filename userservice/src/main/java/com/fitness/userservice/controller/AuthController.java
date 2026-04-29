package com.fitness.userservice.controller;

import com.fitness.userservice.dto.*;
import com.fitness.userservice.service.PasswordResetService;
import com.fitness.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// PUBLIC CONTROLLER
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request.getEmail(), request.getPassword());
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody SendOtpRequest request) {
        passwordResetService.sendOtp(request.getEmail());
        return "OTP sent Successfully";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {
        passwordResetService.verifyOtp(request.getEmail(), request.getOtp());
        return "OTP Verified";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getEmail(), request.getPassword());
        return "Password Reset Successfully";
    }

}
