package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.UserResponse;
import com.fitness.activityservice.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ApiService {

    private final WebClient.Builder webClient;

    public Mono<UserResponse> getUserId(String userId) {

        return webClient.build()
                .get()
                .uri("http://USERSERVICE/api/users/{userId}", userId)
                .retrieve()
                .bodyToMono(UserResponse.class);


    }

}
