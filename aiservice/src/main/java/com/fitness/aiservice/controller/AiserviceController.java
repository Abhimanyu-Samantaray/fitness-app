package com.fitness.aiservice.controller;

import com.fitness.aiservice.dto.RecommendationResponse;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.Aiservice;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class AiserviceController {

    private final Aiservice aiservice;

    @PostMapping("/add/{activityId}")
    public Mono<RecommendationResponse> getRecommendation(@PathVariable String activityId) {
        return aiservice.generateAiRecommendation(activityId);
    }

    @GetMapping("/getRecommendation/{activityId}")
    public Mono<Recommendation> getActivityRecommendation(@PathVariable String activityId) {
        return aiservice.getUserRecommendation(activityId);
    }

    @GetMapping("/exists/{activityId}")
    public Mono<Boolean> checkRecommendationIsPresent(@PathVariable String activityId) {
        return aiservice.existsByActivityId(activityId);
    }
}
