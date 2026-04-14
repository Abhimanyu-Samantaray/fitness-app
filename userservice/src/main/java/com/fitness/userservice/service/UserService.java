package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.exception.UserException;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new UserException("User already exists", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User saved = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(saved.getId());
        response.setFirstName(saved.getFirstName());
        response.setLastName(saved.getLastName());
        response.setEmail(saved.getEmail());
        response.setPassword(saved.getPassword());
        response.setRole(saved.getRole());
        response.setCreatedAt(saved.getCreatedAt());
        response.setUpdatedAt(saved.getUpdatedAt());

        return response;
    }

    public List<UserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> {
                    UserResponse response = new UserResponse();
                    response.setId(user.getId());
                    response.setFirstName(user.getFirstName());
                    response.setLastName(user.getLastName());
                    response.setEmail(user.getEmail());
                    response.setPassword(user.getPassword());
                    response.setRole(user.getRole());
                    response.setCreatedAt(user.getCreatedAt());
                    response.setUpdatedAt(user.getUpdatedAt());
                    return response;
                }).toList();
    }

    public Optional<UserResponse> getSingleUser(String userId) {

        Optional<User> user =  userRepository.findById(userId);

       return Optional.ofNullable(user.map(usr -> {
                   UserResponse obj = new UserResponse();
                   obj.setId(usr.getId());
                   obj.setFirstName(usr.getFirstName());
                   obj.setLastName(usr.getLastName());
                   obj.setEmail(usr.getEmail());
                   obj.setPassword(usr.getPassword());
                   obj.setRole(usr.getRole());
                   obj.setCreatedAt(usr.getCreatedAt());
                   obj.setUpdatedAt(usr.getUpdatedAt());
                   return obj;
               })
               .orElseThrow(() -> UserException.userNotFound(userId)));
    }
}
