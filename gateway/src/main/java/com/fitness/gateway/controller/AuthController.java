package com.fitness.gateway.controller;

import com.fitness.gateway.dto.LoginRequest;
import com.fitness.gateway.securityConfig.JwtUtil;
import com.fitness.gateway.service.ApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ApiService apiService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Mono<ResponseEntity<?>> login(@RequestBody LoginRequest request) {
        return apiService.getUserDetails(request)
                .map(user -> {

                    String token = jwtUtil.generateToken(user.getId(), user.getEmail(), String.valueOf(user.getRole()));

                    return ResponseEntity.ok(
                            Map.of(
                                    "token", token,
                                    "email",user.getEmail(),
                                    "role", user.getRole()
                            )
                    );

                });
    }


}
