package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/addActivity")
    public ResponseEntity<ActivityResponse> addActivity(@RequestBody ActivityRequest request, @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(activityService.addUserActivity(request, userId));
    }

    @GetMapping("/")
    public ResponseEntity<List<ActivityResponse>> getAllActivity(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(activityService.getAllActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ActivityResponse getActivity(@PathVariable String activityId) {
        return activityService.getActivitiesByActivityId(activityId);
    }

    @DeleteMapping("/del/{activityId}")
    public ResponseEntity<String> deleteActivity(@PathVariable String activityId) {
        activityService.deleteActivity(activityId);
        return ResponseEntity.ok(activityId + " Deleted Successfully");
    }

    @PutMapping("/{activityId}/status")
    public ResponseEntity<String> updateStatusAfterRecommendationAdd(
            @PathVariable String activityId,
            @RequestBody String status) {
        activityService.updateStatus(activityId, status);

        return ResponseEntity.ok(activityId + " Status Update Successfully");
    }
}
