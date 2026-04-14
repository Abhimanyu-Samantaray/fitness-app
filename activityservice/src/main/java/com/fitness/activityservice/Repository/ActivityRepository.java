package com.fitness.activityservice.Repository;

import com.fitness.activityservice.mode.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActivityRepository extends MongoRepository<Activity, String> {
}
