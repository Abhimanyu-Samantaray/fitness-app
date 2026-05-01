package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.RecommendationResponse;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;


@Service
@RequiredArgsConstructor
public class Aiservice {

    private final ApiService apiService;
    private final AiRepository aiRepository;

    public Mono<RecommendationResponse> generateAiRecommendation(String activityId) {

        return apiService.getActivities(activityId)
                .flatMap(activity -> {

                    String userId = activity.getUserId();

                    String prompt = apiService.buildPrompt(activity);

                    return apiService.getAiResponse(prompt)
                            .map(this::parseResponse)
                            .map(dto -> toEntity(userId, activityId, dto))
                            .flatMap(entity ->
                                aiRepository.findByActivityId(activityId)
                                    .flatMap(existing -> {
                                        existing.setSummary(entity.getSummary());
                                        existing.setImprovements(entity.getImprovements());
                                        existing.setSuggestions(entity.getSuggestions());
                                        existing.setSafetyTips(entity.getSafetyTips());
                                        return aiRepository.save(existing); // update
                                    })
                                    .switchIfEmpty(aiRepository.save(entity)) // insert if not exists
                            )
                            .flatMap(savedEntity ->
                                    apiService.updateActivityStatus(activityId, "SUCCESS")
                                            .doOnSuccess(v -> System.out.println("✅ Status updated"))
                                            .doOnError(e -> System.out.println("❌ Update failed: " + e.getMessage()))
                                            .onErrorResume(e -> Mono.empty()) // 👈 important (don’t break flow)
                                            .thenReturn(savedEntity)
                            )

                            .map(this::toResponse);
                });
    }

    private RecommendationResponse toResponse(Recommendation entity) {

        return RecommendationResponse.builder()
                .userId(entity.getUserId())
                .activityId(entity.getActivityId())
                .activityType(entity.getActivityType())
                .intensity(entity.getIntensity())
                .summary(entity.getSummary())
                .improvements(entity.getImprovements())
                .suggestions(entity.getSuggestions())
                .safetyTips(entity.getSafetyTips())
                .build();
    }

    private Recommendation toEntity(String userId, String activityId, RecommendationResponse dto) {

        return Recommendation.builder()
                .userId(userId)
                .activityId(activityId)
                .activityType(dto.getActivityType())
                .intensity(dto.getIntensity())
                .summary(dto.getSummary())
                .improvements(dto.getImprovements())
                .suggestions(dto.getSuggestions())
                .safetyTips(dto.getSafetyTips())
                .build();
    }

    private RecommendationResponse parseResponse(String response) {

        try {
            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(response);

            // 🔥 Extract Gemini generated text
            String text = root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            // 🔥 Convert AI JSON string → DTO
            return mapper.readValue(text, RecommendationResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    public Mono<Recommendation> getUserRecommendation(String activityId) {
        return aiRepository.findByActivityId(activityId);
    }
}
