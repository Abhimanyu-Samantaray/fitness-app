package com.fitness.userservice.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET = "my-super-secret-key-my-super-secret-key-123456";// MUST match Gateway | Environment Variable

    public String generateToken(String userId, String userRole, String userEmail) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userRole);
        claims.put("email", userEmail);

        Key key = Keys.hmacShaKeyFor(SECRET.getBytes());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 10 * 60 * 1000)) // Token Valid For 1 hour
                .signWith(key)
                .compact();
    }

}
