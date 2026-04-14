package com.fitness.userservice.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public class UserException extends RuntimeException {

    private final HttpStatus status;

    public UserException(String userAlreadyExists, HttpStatus httpStatus) {
        super(userAlreadyExists);
        this.status = httpStatus;
    }

    public static UserException userNotFound(String userId) {
        return new UserException(
                "User not found with id: " + userId,
                HttpStatus.NOT_FOUND
        );
    }
}
