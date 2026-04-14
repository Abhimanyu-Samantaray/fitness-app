package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.Repository.ActivityRepository;
import com.fitness.activityservice.mode.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

        ActivityResponse resObj = new ActivityResponse();

        resObj.setId(savedActivity.getId());
        resObj.setUserId(savedActivity.getUserId());
        resObj.setType(savedActivity.getType());
        resObj.setDuration(savedActivity.getDuration());
        resObj.setCaloriesBurned(savedActivity.getCaloriesBurned());
        resObj.setStartTime(savedActivity.getStartTime());
        resObj.setAdditionalMetrics(savedActivity.getAdditionalMetrics());
        resObj.setCreatedAt(savedActivity.getCreatedAt());
        resObj.setUpdatedAt(savedActivity.getUpdatedAt());

        return resObj;
    }

    public List<ActivityResponse> getAllActivities() {

        List<Activity> getAll = activityRepository.findAll();

        return getAll.stream()
                .map(this::activityResponse).toList();

    }
}
