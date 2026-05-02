package com.fitness.aiservice.service;

import com.fitness.aiservice.dto.ActivityResponse;
import io.netty.handler.timeout.TimeoutException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ApiService {

    private final WebClient.Builder webClientBuilder;
    private final WebClient.Builder externalWebClient;

    private final String internalKey;

    public ApiService(
            @Qualifier("loadBalancedWebClient") WebClient.Builder loadBalancedWebClient,
            @Qualifier("externalWebClient") WebClient.Builder externalWebClient,
            @Value("${Internal.gateway.key}") String internalKey) {

        this.webClientBuilder = loadBalancedWebClient;
        this.externalWebClient = externalWebClient;
        this.internalKey = internalKey;
    }

    @Value("${gemini.api.key}")
    private String API_KEY;


    public Mono<ActivityResponse> getActivities(String activityId) {

        return webClientBuilder.build()
                .get()
                .uri("http://ACTIVITYSERVICE/api/activities/{activityId}", activityId)
                .header("X-Internal-Key", internalKey)
                .retrieve()
                .bodyToMono(ActivityResponse.class)
                .timeout(Duration.ofSeconds(5))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))
                .onErrorResume(ex -> {
                    log.error("Failed to fetch activity {}: {}", activityId, ex.getMessage());
                    return Mono.empty(); // ⚠️ don't crash
                });
    }

    public Mono<String> getAiResponse(String prompt) {

        log.info("🔥 Gemini Prompt: {}", prompt);

        Map<String, Object> requestBody = buildRequestBody(prompt);
        log.info("📤 Gemini Request Body: {}", requestBody);

        return externalWebClient.build()
                .post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + API_KEY)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .doOnNext(res -> log.info("📥 Gemini RAW Response: {}", res))
                .timeout(Duration.ofSeconds(15))
                .onErrorResume(ex -> {
                    log.error("Gemini API failed: {}", ex.getMessage());
                    return Mono.just(getFallbackResponse());
                });
    }

    private String getFallbackResponse() {
        return """
    {
      "activityType": "unknown",
      "intensity": "medium",
      "summary": "Unable to analyze activity at this time.",
      "improvements": [],
      "suggestions": [],
      "safetyTips": []
    }
    """;
    }

    private Map<String, Object> buildRequestBody(String prompt) {

        return Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );
    }

    String buildPrompt(ActivityResponse a) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("Act as a professional fitness coach.\n");
        prompt.append("Analyze single user activity data.\n\n");

        prompt.append("Type: ").append(safe(a.getType())).append("\n");
        prompt.append("Duration: ").append(safe(a.getDuration())).append("\n");
        prompt.append("Calories: ").append(safe(a.getCaloriesBurned())).append("\n\n");

        prompt.append("""
        Return ONLY JSON:
        {
          "activityType": "",
          "intensity": "",
          "summary": "",
          "improvements": [],
          "suggestions": [],
          "safetyTips": []
        }
        """);

        return prompt.toString();
    }

    private String safe(Object value) {
        return value == null ? "N/A" : value.toString();
    }

    public Mono<Void> updateActivityStatus(String activityId, String status) {
        System.out.println("Calling Activity Service...");

        return webClientBuilder.build()
                .put()
                .uri("http://ACTIVITYSERVICE/api/activities/{activityId}/status", activityId)
                .header("X-Internal-Key", internalKey)
                .bodyValue(status)
                .retrieve()
                .toBodilessEntity()   // ✅ better than bodyToMono(Void.class)
                .doOnSuccess(res -> System.out.println("Update success: " + res.getStatusCode()))
                .doOnError(err -> System.out.println("Update failed: " + err.getMessage()))
                .then();
    }
}
