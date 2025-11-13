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
import io.jsonwebtoken.Jwt;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@AllArgsConstructor
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public SignUpResponseDTO registerUser(SignUpRequestDTO request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new EmailAlreadyExistsException();
        }
        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .authProvider(AuthProvider.NONE)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateJwtToken(user.getUserId());

        return new SignUpResponseDTO(
                token,
                user.getUserId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                true,
                "User created successfully"
        );

    }

    public LoginResponseDTO login(LoginRequestDTO request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException());

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtUtil.generateJwtToken(user.getUserId());

        return new LoginResponseDTO(
                token,
                user.getUserId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                true,
                "User authenticated successfully"
        );

    }






}
