package com.example.budgettracker.service;

import com.example.budgettracker.model.User;
import com.example.budgettracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(User user, String password) {
        String savedPassword = user.getPassword();

        if (savedPassword != null && savedPassword.startsWith("$2")) {
            return passwordEncoder.matches(password, savedPassword);
        }

        if (password.equals(savedPassword)) {
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return true;
        }

        return false;
    }

    public User signup(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            return null;
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setCreated_at(new Date());

        return userRepository.save(user);
    }
}
