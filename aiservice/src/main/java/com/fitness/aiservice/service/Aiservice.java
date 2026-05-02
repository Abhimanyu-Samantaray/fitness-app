package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.RecommendationResponse;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
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
                                    apiService.updateActivityStatus(activityId, "GENERATED")
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

            // 🚨 Check if API returned error
            if (root.has("error")) {
                throw new RuntimeException("Gemini API error: " + root.path("error").toString());
            }

            JsonNode candidates = root.path("candidates");

            if (candidates == null || !candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException("Invalid Gemini response: candidates missing");
            }

            JsonNode firstCandidate = candidates.get(0);
            if (firstCandidate == null) {
                throw new RuntimeException("Invalid Gemini response: candidate is null");
            }

            JsonNode parts = firstCandidate.path("content").path("parts");

            if (parts == null || !parts.isArray() || parts.isEmpty()) {
                throw new RuntimeException("Invalid Gemini response: parts missing");
            }

            String text = parts.get(0).path("text").asText(null);

            if (text == null || text.isBlank()) {
                throw new RuntimeException("Gemini returned empty text");
            }

            return mapper.readValue(text, RecommendationResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    public Mono<Recommendation> getUserRecommendation(String activityId) {
        return aiRepository.findByActivityId(activityId);
    }

    public Mono<Boolean> existsByActivityId(String activityId) {
        return aiRepository.existsByActivityId(activityId);
    }
}
