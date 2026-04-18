package com.fitness.aiservice.repository;

import com.fitness.aiservice.model.Recommendation;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface AiRepository extends ReactiveMongoRepository<Recommendation, String> {


    //Mono<Object> findByActivityId(String activityId);
    Mono<Recommendation> findByActivityId(String activityId);
}
