package com.fitness.aiservice.service;

import com.fitness.aiservice.dto.ActivityResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class ApiService {

    private final WebClient.Builder webClientBuilder;
    private final WebClient.Builder externalWebClient;

    public ApiService(
            @Qualifier("loadBalancedWebClient") WebClient.Builder loadBalancedWebClient,
            @Qualifier("externalWebClient") WebClient.Builder externalWebClient) {

        this.webClientBuilder = loadBalancedWebClient;
        this.externalWebClient = externalWebClient;
    }

    @Value("${gemini.api.key}")
    private String API_KEY;


    public Mono<ActivityResponse> getActivities(String activityId) {

        return webClientBuilder.build()
                .get()
                .uri("http://ACTIVITYSERVICE/api/activities/{activityId}", activityId)
                .retrieve()
                .bodyToMono(ActivityResponse.class);
    }

    public Mono<String> getAiResponse(String prompt) {
        return externalWebClient.build()
                .post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + API_KEY)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(buildRequestBody(prompt))
                .retrieve()
                .bodyToMono(String.class);
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

        prompt.append("Type: ").append(a.getType()).append("\n");
        prompt.append("Duration: ").append(a.getDuration()).append("\n");
        prompt.append("Calories: ").append(a.getCaloriesBurned()).append("\n\n");

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
}
