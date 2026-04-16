package com.fitness.aiservice.controller;

import com.fitness.aiservice.dto.RecommendationResponse;
import com.fitness.aiservice.service.Aiservice;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class AiserviceController {

    private final Aiservice aiservice;

    @GetMapping("/{activityId}")
    public Mono<RecommendationResponse> getRecommendation(@PathVariable String activityId) {

        return aiservice.generateAiRecommendation(activityId);

    }



}
