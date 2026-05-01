package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Slf4j
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
                .bodyToMono(UserResponse.class)
                .timeout(Duration.ofSeconds(5))
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(2)))
                .doOnError(ex -> System.out.println("UserService error: " + ex.getMessage()));
    }

//    @Async
//    public void addRecommendation(String activityId) {
//
//        Mono.delay(Duration.ofSeconds(3)) // ⏳ wait for DB commit
//                .flatMap(i ->
//                        webClient.build()
//                                .post()
//                                .uri("http://AISERVICE/api/recommendation/add/{activityId}", activityId)
//                                .header("X-Internal-Key", internalKey)
//                                .retrieve()
//                                .bodyToMono(Void.class)
//                )
//                .retryWhen(
//                        Retry.backoff(10, Duration.ofSeconds(3))
//                                .maxBackoff(Duration.ofSeconds(30))
//                                .doBeforeRetry(signal ->
//                                        log.warn("Retry attempt: {}", signal.totalRetries() + 1))
//                )
//                .doOnError(ex -> log.error("AI call failed: {}", ex.getMessage()))
//                .subscribe();
//
//    }

    @Async
    public void addRecommendation(String activityId) {

        Mono.delay(Duration.ofSeconds(2)) // small delay is fine
                .then(
                        webClient.build()
                                .post()
                                .uri("http://AISERVICE/api/recommendation/add/{activityId}", activityId) // 👈 use correct URL
                                .header("X-Internal-Key", internalKey)
                                .retrieve()

                                // ✅ handle HTTP errors
                                .onStatus(HttpStatusCode::is5xxServerError, response ->
                                        response.bodyToMono(String.class)
                                                .flatMap(body -> {
                                                    log.error("AI service 5xx error: {}", body);
                                                    return Mono.error(new RuntimeException("Retryable AI error"));
                                                })
                                )
                                .onStatus(status -> status.value() == 429, response -> {
                                    log.warn("🚫 Rate limit hit (429). Not retrying.");
                                    return Mono.error(new IllegalStateException("Rate limit"));
                                })

                                .toBodilessEntity()
                )

                // ✅ timeout
                .timeout(Duration.ofSeconds(10))

                .retryWhen(
                        Retry.backoff(2, Duration.ofSeconds(2)) // 👈 reduce to 2
                                .maxBackoff(Duration.ofSeconds(5))
                                .filter(ex ->
                                        ex instanceof RuntimeException &&
                                                !(ex instanceof IllegalStateException) // 🚫 don't retry 429
                                )
                                .doBeforeRetry(signal ->
                                        log.warn("Retry attempt: {}", signal.totalRetries() + 1))
                )

                // ✅ logging
                .doOnSuccess(res -> log.info("AI call successful"))
                .doOnError(ex -> log.error("AI call failed: {}", ex.getMessage()))

                // ✅ don't crash thread
                .onErrorResume(ex -> Mono.empty())

                .subscribe();
    }
}
