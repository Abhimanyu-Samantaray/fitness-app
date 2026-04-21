package com.fitness.gateway.service;

import com.fitness.gateway.dto.LoginRequest;
import com.fitness.gateway.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ApiService {

    private final WebClient.Builder webClient;

    private final String internalKey;

    public ApiService(@Value("${internal.microservice.key}") String internalKey, WebClient.Builder webClient) {
        this.internalKey = internalKey;
        this.webClient = webClient;
    }

    public Mono<UserResponse> getUserDetails(LoginRequest request) {
        return webClient.build()
                .post()
                .uri("http://USERSERVICE/api/auth/login")
                .header("X-Internal-Key", internalKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(UserResponse.class);
    }

}
