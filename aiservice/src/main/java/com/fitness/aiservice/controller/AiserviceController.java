package com.fitness.aiservice.controller;

import com.fitness.aiservice.dto.RecommendationResponse;
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
}
