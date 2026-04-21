package com.fitness.userservice.dto;

import com.fitness.userservice.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String id;
    private String email;
    private UserRole role = UserRole.USER;
}
