package com.fitness.aiservice.service;

import com.fitness.aiservice.dto.ActivityResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

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
        return externalWebClient.build()
                .post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + API_KEY)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(buildRequestBody(prompt))
                .retrieve()
                .onStatus(status -> status.value() == 429 || status.is5xxServerError(),
                        response -> Mono.error(new RuntimeException("Retryable error: " + response.statusCode())))
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(15))

                // ✅ smarter retry
                .retryWhen(
                        Retry.backoff(5, Duration.ofSeconds(5)) // more attempts
                                .maxBackoff(Duration.ofSeconds(30))
                                .filter(ex -> ex instanceof RuntimeException) // retry only these
                                .doBeforeRetry(signal ->
                                        log.warn("Retrying Gemini API... attempt: {}", signal.totalRetries() + 1))
                )

                // ✅ final fallback
                .onErrorResume(ex -> {
                    log.error("Gemini API failed after retries: {}", ex.getMessage());
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
}
