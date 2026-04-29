package com.fitness.userservice.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String password;
}
