package com.policyme.Policyme.service;


import com.policyme.Policyme.dto.*;
import com.policyme.Policyme.exception.EmailAlreadyExistsException;
import com.policyme.Policyme.exception.InvalidCredentialsException;
import com.policyme.Policyme.model.UserModel.AuthProvider;
import com.policyme.Policyme.model.UserModel.User;
import com.policyme.Policyme.repository.UserRepository;
import com.policyme.Policyme.security.CustomUserDetails;
import com.policyme.Policyme.security.JwtUtil;
import io.jsonwebtoken.Jwt;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@AllArgsConstructor
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        return new CustomUserDetails(user);
    }


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

        UserDTO userDto = new UserDTO(user);

        return new SignUpResponseDTO(
                token,
                userDto,
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
        UserDTO userDto = new UserDTO(user);

        return new LoginResponseDTO(
                token,
                userDto,
                true,
                "User authenticated successfully"
        );

    }






}
