package com.example.budgettracker.controller;

import com.example.budgettracker.model.User;
import com.example.budgettracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login/")
    public ResponseEntity<User> loginUser(@RequestParam String email, @RequestParam String password) {

        Optional<User> userOptional = userService.getUserByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (!userService.checkPassword(userOptional.get(), password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/signup/")
    public ResponseEntity<User> signupUser(@RequestParam String name, @RequestParam String email, @RequestParam String password) {

        User user = userService.signup(name, email, password);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
