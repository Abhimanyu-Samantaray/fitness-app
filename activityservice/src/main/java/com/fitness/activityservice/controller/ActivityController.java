package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


//
//    @GetMapping("/{activityId}")
//    public ActivityResponse getActivity(@PathVariable String activityId) {
//        return activityService.getActivitiesByActivityId(activityId);
//    }



}
