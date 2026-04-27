package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.Repository.ActivityRepository;
import com.fitness.activityservice.dto.UserResponse;
import com.fitness.activityservice.exception.UserNotFoundException;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ApiService apiService;

    public ActivityResponse addUserActivity(ActivityRequest request, String userId) {

        UserResponse validUserId;
        try {
            validUserId = apiService.getUserId(userId).block();
            if (validUserId == null) {
                throw new UserNotFoundException("User not found with id: " + userId);
            }
        } catch (Exception ex) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }

        Activity activityObj = new Activity();
        activityObj.setUserId(userId);
        activityObj.setType(request.getType());
        activityObj.setDuration(request.getDuration());
        activityObj.setCaloriesBurned(request.getCaloriesBurned());
        activityObj.setStartTime(request.getStartTime());
        activityObj.setAdditionalMetrics(request.getAdditionalMetrics());

        Activity savedActivity = activityRepository.save(activityObj);

        String activityId = savedActivity.getId();
        apiService.addRecommendation(activityId);

        return activityResponse(savedActivity);
    }

    private ActivityResponse activityResponse(Activity savedActivity) {

        return getActivityResponse(savedActivity);
    }

    public List<ActivityResponse> getAllActivities(String userId) {

        List<Activity> getAllByUserID = activityRepository.findByUserId(userId);

        return getAllByUserID.stream()
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
