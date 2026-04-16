package com.fitness.aiservice.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationResponse {
    private String activityId;
    private String userId;

    private String activityType;
    private String intensity;

    private String summary;

    private List<String> improvements;
    private List<String> suggestions;
    private List<String> safetyTips;
}
