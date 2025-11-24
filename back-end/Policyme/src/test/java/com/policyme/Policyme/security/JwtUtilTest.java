package com.policyme.Policyme.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private String secretKey;
    private Key key;

    @BeforeEach
    void setUp() {
        secretKey = "testSecretKeyThatIsLongEnoughForHS256Algorithm1234567890";
        jwtUtil = new JwtUtil(secretKey);
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    @Test
    void generateJwtToken_ShouldReturnValidToken() {
        // Arrange
        String userId = "test-user-123";

        // Act
        String token = jwtUtil.generateJwtToken(userId);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Verify token structure (JWT has 3 parts separated by dots)
        String[] tokenParts = token.split("\\.");
        assertEquals(3, tokenParts.length);
    }

    @Test
    void validateAndGetUserId_WithValidToken_ShouldReturnUserId() {
        // Arrange
        String userId = "test-user-123";
        String token = jwtUtil.generateJwtToken(userId);

        // Act
        String extractedUserId = jwtUtil.validateAndGetUserId(token);

        // Assert
        assertEquals(userId, extractedUserId);
    }

    @Test
    void validateAndGetUserId_WithInvalidSignature_ShouldThrowException() {
        // Arrange
        String userId = "test-user-123";
        String differentSecretKey = "differentSecretKeyForTestingInvalidSignature12345678";
        Key wrongKey = Keys.hmacShaKeyFor(differentSecretKey.getBytes());
        
        // Create a token with wrong key
        String invalidToken = Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(wrongKey)
                .compact();

        // Act & Assert
        assertThrows(SignatureException.class, () -> jwtUtil.validateAndGetUserId(invalidToken));
    }

    @Test
    void validateAndGetUserId_WithExpiredToken_ShouldThrowExpiredJwtException() {
        // Arrange
        String userId = "test-user-123";
        
        // Create an expired token (expired 1 hour ago)
        String expiredToken = Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date(System.currentTimeMillis() - 7200000)) // 2 hours ago
                .setExpiration(new Date(System.currentTimeMillis() - 3600000)) // 1 hour ago
                .signWith(key)
                .compact();

        // Act & Assert
        assertThrows(ExpiredJwtException.class, () -> jwtUtil.validateAndGetUserId(expiredToken));
    }

    @Test
    void generateJwtToken_WithDifferentUserIds_ShouldGenerateDifferentTokens() {
        // Arrange
        String userId1 = "user-123";
        String userId2 = "user-456";

        // Act
        String token1 = jwtUtil.generateJwtToken(userId1);
        String token2 = jwtUtil.generateJwtToken(userId2);

        // Assert
        assertNotEquals(token1, token2);
        
        // Verify both tokens extract correct user IDs
        assertEquals(userId1, jwtUtil.validateAndGetUserId(token1));
        assertEquals(userId2, jwtUtil.validateAndGetUserId(token2));
    }

    @Test
    void validateAndGetUserId_WithMalformedToken_ShouldThrowException() {
        // Arrange
        String malformedToken = "not.a.valid.jwt.token";

        // Act & Assert
        assertThrows(Exception.class, () -> jwtUtil.validateAndGetUserId(malformedToken));
    }
}

