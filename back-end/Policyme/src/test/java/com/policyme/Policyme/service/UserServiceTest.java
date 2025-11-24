package com.policyme.Policyme.service;

import com.policyme.Policyme.dto.LoginRequestDTO;
import com.policyme.Policyme.dto.LoginResponseDTO;
import com.policyme.Policyme.dto.SignUpRequestDTO;
import com.policyme.Policyme.dto.SignUpResponseDTO;
import com.policyme.Policyme.exception.EmailAlreadyExistsException;
import com.policyme.Policyme.exception.InvalidCredentialsException;
import com.policyme.Policyme.model.UserModel.AuthProvider;
import com.policyme.Policyme.model.UserModel.User;
import com.policyme.Policyme.repository.UserRepository;
import com.policyme.Policyme.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
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

import org.mockito.stubbing.Answer;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private String testToken;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId("test-user-id")
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("encodedPassword123")
                .authProvider(AuthProvider.NONE)
                .build();
        
        testToken = "jwt.token.here";
    }

    @Test
    void registerUser_WithNewEmail_ShouldReturnSignUpResponse() {
        // Arrange
        SignUpRequestDTO request = SignUpRequestDTO.builder()
                .email("newuser@example.com")
                .password("password123")
                .firstName("Jane")
                .lastName("Smith")
                .build();

        String generatedUserId = "generated-user-id";

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        
        // Simulate MongoDB's behavior of setting the ID on the object when saved
        when(userRepository.save(any(User.class))).thenAnswer((Answer<User>) invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(generatedUserId);
            return user;
        });
        
        when(jwtUtil.generateJwtToken(generatedUserId)).thenReturn(testToken);

        // Act
        SignUpResponseDTO response = userService.registerUser(request);

        // Assert
        assertNotNull(response);
        assertEquals(testToken, response.getToken());
        assertEquals(generatedUserId, response.getUserId());
        assertEquals(request.getEmail(), response.getEmail());
        assertEquals(request.getFirstName(), response.getFirstName());
        assertEquals(request.getLastName(), response.getLastName());
        assertTrue(response.isSuccess());
        assertEquals("User created successfully", response.getMessage());

        verify(userRepository).findByEmail(request.getEmail());
        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateJwtToken(generatedUserId);
    }

    @Test
    void registerUser_WithExistingEmail_ShouldThrowEmailAlreadyExistsException() {
        // Arrange
        SignUpRequestDTO request = SignUpRequestDTO.builder()
                .email("existing@example.com")
                .password("password123")
                .firstName("Jane")
                .lastName("Smith")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(EmailAlreadyExistsException.class, () -> userService.registerUser(request));
        
        verify(userRepository).findByEmail(request.getEmail());
        verify(userRepository, never()).save(any(User.class));
        verify(jwtUtil, never()).generateJwtToken(anyString());
    }

    @Test
    void login_WithValidCredentials_ShouldReturnLoginResponse() {
        // Arrange
        LoginRequestDTO request = LoginRequestDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(request.getPassword(), testUser.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateJwtToken(testUser.getUserId())).thenReturn(testToken);

        // Act
        LoginResponseDTO response = userService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals(testToken, response.getToken());
        assertEquals(testUser.getUserId(), response.getUserId());
        assertEquals(testUser.getEmail(), response.getEmail());
        assertEquals(testUser.getFirstName(), response.getFirstName());
        assertEquals(testUser.getLastName(), response.getLastName());
        assertTrue(response.isSuccess());
        assertEquals("User authenticated successfully", response.getMessage());

        verify(userRepository).findByEmail(request.getEmail());
        verify(passwordEncoder).matches(request.getPassword(), testUser.getPasswordHash());
        verify(jwtUtil).generateJwtToken(testUser.getUserId());
    }

    @Test
    void login_WithInvalidEmail_ShouldThrowInvalidCredentialsException() {
        // Arrange
        LoginRequestDTO request = LoginRequestDTO.builder()
                .email("nonexistent@example.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> userService.login(request));
        
        verify(userRepository).findByEmail(request.getEmail());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateJwtToken(anyString());
    }

    @Test
    void login_WithInvalidPassword_ShouldThrowInvalidCredentialsException() {
        // Arrange
        LoginRequestDTO request = LoginRequestDTO.builder()
                .email("test@example.com")
                .password("wrongpassword")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(request.getPassword(), testUser.getPasswordHash())).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> userService.login(request));
        
        verify(userRepository).findByEmail(request.getEmail());
        verify(passwordEncoder).matches(request.getPassword(), testUser.getPasswordHash());
        verify(jwtUtil, never()).generateJwtToken(anyString());
    }
}

