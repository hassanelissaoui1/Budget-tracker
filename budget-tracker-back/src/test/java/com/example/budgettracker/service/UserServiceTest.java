package com.example.budgettracker.service;

import com.example.budgettracker.model.User;
import com.example.budgettracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void signup_whenEmailAlreadyExists_returnsNull() {
        User existingUser = new User();
        existingUser.setEmail("test@gmail.com");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(existingUser));

        User result = userService.signup("Ali", "test@gmail.com", "1234");

        assertNull(result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void signup_whenEmailDoesNotExist_savesUser() {
        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.empty());

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.signup("Ali", "test@gmail.com", "1234");

        assertNotNull(result);
        assertEquals("Ali", result.getName());
        assertEquals("test@gmail.com", result.getEmail());
        assertNotEquals("1234", result.getPassword());
        assertTrue(result.getPassword().startsWith("$2"));

        verify(userRepository).save(any(User.class));
    }

    @Test
    void checkPassword_whenPasswordIsWrong_returnsFalse() {
        User user = new User();
        user.setPassword("1234");

        boolean result = userService.checkPassword(user, "wrong");

        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
    }
}
