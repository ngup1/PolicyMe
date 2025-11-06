package com.policyme.Policyme.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.policyme.Policyme.dto.LoginRequest;
import com.policyme.Policyme.dto.LoginResponse;
import com.policyme.Policyme.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController
 * 
 * Test Coverage:
 * - Successful login endpoint
 * - Failed login endpoint
 * - Request validation
 * - HTTP status codes
 * - Response body structure
 */
@WebMvcTest(AuthController.class)
@DisplayName("AuthController Integration Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Test successful login endpoint - returns 200 OK")
    void testLoginEndpoint_Success() throws Exception {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("testuser", "password123");
        LoginResponse successResponse = new LoginResponse(
            "Login successful", 
            "testuser", 
            1L, 
            true
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.userId").value(1L));
    }

    @Test
    @DisplayName("Test failed login endpoint - returns 400 Bad Request")
    void testLoginEndpoint_Failure() throws Exception {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("testuser", "wrongpassword");
        LoginResponse failureResponse = new LoginResponse(
            "Invalid username or password", 
            null, 
            null, 
            false
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(failureResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"))
                .andExpect(jsonPath("$.username").isEmpty())
                .andExpect(jsonPath("$.userId").isEmpty());
    }

    @Test
    @DisplayName("Test login endpoint with invalid request - returns 400 Bad Request")
    void testLoginEndpoint_InvalidRequest() throws Exception {
        // Arrange - missing password field
        String invalidRequest = "{\"username\":\"testuser\"}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequest))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test CORS headers are present")
    void testCorsHeaders() throws Exception {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("testuser", "password123");
        LoginResponse successResponse = new LoginResponse(
            "Login successful", 
            "testuser", 
            1L, 
            true
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
}


