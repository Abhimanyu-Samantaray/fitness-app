package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/addActivity/{userId}")
    public ResponseEntity<ActivityResponse> addActivity(@RequestBody ActivityRequest request, @PathVariable String userId) {
        return ResponseEntity.ok(activityService.addUserActivity(request, userId));
    }

//    @GetMapping("/all")
//    public ResponseEntity<List<ActivityResponse>> getAllActivity() {
//        return ResponseEntity.ok(activityService.getAllActivities());
//    }
//
//    @GetMapping("/{activityId}")
//    public ActivityResponse getActivity(@PathVariable String activityId) {
//        return activityService.getActivitiesByActivityId(activityId);
//    }



}
