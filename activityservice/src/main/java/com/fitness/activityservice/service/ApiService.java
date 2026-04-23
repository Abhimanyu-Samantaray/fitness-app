package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.UserResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ApiService {

    private final WebClient.Builder webClient;
    private final String internalKey;

    public ApiService(@Value("${Internal.gateway.key}") String internalKey, WebClient.Builder webClient) {
        this.internalKey = internalKey;
        this.webClient = webClient;
    }

    public Mono<UserResponse> getUserId(String userId) {

        return webClient.build()
                .get()
                .uri("http://USERSERVICE/api/users/{userId}", userId)
                .header("X-Internal-Key", internalKey)
                .retrieve()
                .bodyToMono(UserResponse.class);
    }

    public void addRecommendation(String activityId) {

        webClient.build()
                .post()
                .uri("http://AISERVICE/api/recommendation/add/{activityId}", activityId)
                .header("X-Internal-Key", internalKey)
                .retrieve()
                .bodyToMono(void.class)
                .subscribe();
    }

}
