package com.policyme.Policyme.service;

import com.policyme.Policyme.dto.LoginRequest;
import com.policyme.Policyme.dto.LoginResponse;
import com.policyme.Policyme.entity.User;
import com.policyme.Policyme.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService
 * 
 * Test Coverage:
 * - Successful login with valid credentials
 * - Failed login with invalid username
 * - Failed login with invalid password
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private String testPassword = "testPassword123";
    private String encodedPassword = "$2a$10$encodedPasswordHash";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword(encodedPassword);
    }

    @Test
    @DisplayName("Test successful login with valid credentials")
    void testLogin_Success() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("testuser", testPassword);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(testPassword, encodedPassword)).thenReturn(true);

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertEquals("testuser", response.getUsername());
        assertEquals(1L, response.getUserId());
        
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches(testPassword, encodedPassword);
    }

    @Test
    @DisplayName("Test login failure with invalid username")
    void testLogin_InvalidUsername() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("nonexistent", testPassword);
        
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid username or password", response.getMessage());
        assertNull(response.getUsername());
        assertNull(response.getUserId());
        
        verify(userRepository, times(1)).findByUsername("nonexistent");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Test login failure with invalid password")
    void testLogin_InvalidPassword() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("testuser", "wrongPassword");
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", encodedPassword)).thenReturn(false);

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid username or password", response.getMessage());
        assertNull(response.getUsername());
        assertNull(response.getUserId());
        
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("wrongPassword", encodedPassword);
    }
}


