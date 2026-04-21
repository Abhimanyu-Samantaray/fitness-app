package com.fitness.gateway.dto;

import lombok.Data;

@Data
public class UserResponse {
    private String id;
    private String email;
    private UserRole role = UserRole.USER;
}
