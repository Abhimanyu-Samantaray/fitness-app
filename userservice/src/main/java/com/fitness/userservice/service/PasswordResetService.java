package com.fitness.userservice.service;

import com.fitness.userservice.model.PasswordResetOpt;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.PasswordResetOtpRepository;
import com.fitness.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

   private final PasswordResetOtpRepository passwordResetOtpRepository;
   private final UserRepository userRepository;
   private final JavaMailSender javaMailSender;
   private final PasswordEncoder passwordEncoder;

   public void sendOtp(String email) {

       userRepository.findByEmail(email)
               .orElseThrow(() -> new RuntimeException("User Not Found"));

       String otp = String.valueOf(new Random().nextInt(900000) + 100000);

       PasswordResetOpt passwordResetOpt = new PasswordResetOpt();
       passwordResetOpt.setEmail(email);
       passwordResetOpt.setOtp(otp);
       passwordResetOpt.setExpiryTime(LocalDateTime.now().plusMinutes(5));
       passwordResetOpt.setVerified(false);

       passwordResetOtpRepository.save(passwordResetOpt);

       sendEmail(email, otp);

   }

    private void sendEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Your otp is "+ otp + " (Valid For 5 minutes)");
        javaMailSender.send(message);

    }

    public void verifyOtp(String email, String otp) {

        PasswordResetOpt record = passwordResetOtpRepository
                .findTopByEmailOrderByIdDesc(email)
                .orElseThrow(() -> new RuntimeException("No OTP found"));

        if(!record.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (record.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        record.setVerified(true);
        passwordResetOtpRepository.save(record);
    }

    // 🔹 3. Reset Password
    public void resetPassword(String email, String newPassword) {

        PasswordResetOpt record = passwordResetOtpRepository
                .findTopByEmailOrderByIdDesc(email)
                .orElseThrow(() -> new RuntimeException("No OTP found"));

        if (!record.isVerified()) {
            throw new RuntimeException("OTP not verified");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetOtpRepository.delete(record);
    }

}
