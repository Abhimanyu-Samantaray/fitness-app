package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.Recommendation;
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
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

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

    public Mono<Boolean> getActivityByActivityID(String activityId) {

        return webClient.build()
                .get()
                .uri("http://AISERVICE/api/recommendation/exists/{activityId}", activityId)
                .header("X-Internal-Key", internalKey)
                .retrieve()
                .bodyToMono(String.class)
                .doOnNext(res -> log.info("RAW RESPONSE FROM AI: {}", res))
                .map(res -> Boolean.parseBoolean(res.trim()));
    }

    private final Set<String> processing = ConcurrentHashMap.newKeySet();
    private final AtomicInteger dailyCount = new AtomicInteger(0);
    private static final int DAILY_LIMIT = 20;

    public void addRecommendation(String activityId) {

        if (dailyCount.get() >= DAILY_LIMIT) {
            log.warn("🚫 Daily AI limit reached. Skipping call.");
            return;
        }

        if (!processing.add(activityId)) {
            return; // already processing
        }

        dailyCount.incrementAndGet(); // ✅ FIX 1

        webClient.build()
                .post()
                .uri("http://AISERVICE/api/recommendation/add/{activityId}", activityId)
                .header("X-Internal-Key", internalKey)
                .retrieve()
                .toBodilessEntity()
                .timeout(Duration.ofSeconds(300))
                .doOnSuccess(res -> log.info("AI call successful"))
                .doOnError(ex -> log.error("AI call failed", ex))

                .doFinally(signal -> processing.remove(activityId)) // ✅ FIX 3 cleanup

                .subscribe();
    }
}
