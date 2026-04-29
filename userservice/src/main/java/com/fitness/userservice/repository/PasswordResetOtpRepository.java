package com.fitness.userservice.repository;

import com.fitness.userservice.model.PasswordResetOpt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOpt, Long> {

    Optional<PasswordResetOpt> findTopByEmailOrderByIdDesc(String email);

}
