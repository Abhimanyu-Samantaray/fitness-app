package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.Repository.ActivityRepository;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityResponse addUserActivity(ActivityRequest request) {

        Activity activityObj = new Activity();
        activityObj.setUserId(request.getUserId());
        activityObj.setType(request.getType());
        activityObj.setDuration(request.getDuration());
        activityObj.setCaloriesBurned(request.getCaloriesBurned());
        activityObj.setStartTime(request.getStartTime());
        activityObj.setAdditionalMetrics(request.getAdditionalMetrics());

        Activity savedActivity = activityRepository.save(activityObj);

        return activityResponse(savedActivity);
    }

    private ActivityResponse activityResponse(Activity savedActivity) {

        return getActivityResponse(savedActivity);
    }

    public List<ActivityResponse> getAllActivities() {

        List<Activity> getAll = activityRepository.findAll();

        return getAll.stream()
                .map(this::activityResponse).toList();

    }

    private static ActivityResponse getActivityResponse(Activity activity) {
        ActivityResponse obj = new ActivityResponse();

        obj.setId(activity.getId());
        obj.setUserId(activity.getUserId());
        obj.setType(activity.getType());
        obj.setDuration(activity.getDuration());
        obj.setCaloriesBurned(activity.getCaloriesBurned());
        obj.setStartTime(activity.getStartTime());
        obj.setAdditionalMetrics(activity.getAdditionalMetrics());
        obj.setCreatedAt(activity.getCreatedAt());
        obj.setUpdatedAt(activity.getUpdatedAt());
        return obj;
    }

    public ActivityResponse getActivitiesByActivityId(String activityId) {

        Optional<Activity> activities = activityRepository.findById(activityId);

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException(
                        "No activity found for id: " + activityId));

        return getActivityResponse(activity);

    }
}
