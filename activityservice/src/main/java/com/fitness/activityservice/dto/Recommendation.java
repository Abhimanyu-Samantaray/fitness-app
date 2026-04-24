package com.fitness.activityservice.dto;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Recommendation {

    private String id;

    private String activityId;
    private String userId;

    private String activityType;
    private String intensity;

    private String summary;

    private List<String> improvements;
    private List<String> suggestions;
    private List<String> safetyTips;

    @CreatedDate
    private LocalDateTime createdAt;

}
