package com.example.budgettracker.service;

import com.example.budgettracker.model.TransactionCategory;
import com.example.budgettracker.model.User;
import com.example.budgettracker.repository.TransactionCategoryRepository;
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
class TransactionCategoryServiceTest {

    @Mock
    private TransactionCategoryRepository transactionCategoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TransactionCategoryService transactionCategoryService;

    @Test
    void getCategoryNamesByUserEmail_whenUserNotFound_returnsEmptyList() {
        when(userRepository.findByEmail("unknown@gmail.com"))
                .thenReturn(Optional.empty());

        var result = transactionCategoryService.getCategoryNamesByUserEmail("unknown@gmail.com");

        assertTrue(result.isEmpty());
        verify(transactionCategoryRepository, never()).findByUser(any(User.class));
    }

    @Test
    void findOrCreateCategory_whenCategoryIsBlank_returnsNull() {
        User user = new User();

        TransactionCategory result = transactionCategoryService.findOrCreateCategory(user, "   ");

        assertNull(result);
        verify(transactionCategoryRepository, never()).save(any(TransactionCategory.class));
    }

    @Test
    void findOrCreateCategory_whenCategoryDoesNotExist_createsCategory() {
        User user = new User();

        when(transactionCategoryRepository.findByUserAndCategoryNameIgnoreCase(user, "Food"))
                .thenReturn(Optional.empty());

        when(transactionCategoryRepository.save(any(TransactionCategory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionCategory result = transactionCategoryService.findOrCreateCategory(user, "  Food  ");

        assertNotNull(result);
        assertEquals("Food", result.getCategoryName());
        assertEquals("#f36b2f", result.getCategoryColor());
        assertSame(user, result.getUser());

        verify(transactionCategoryRepository).save(any(TransactionCategory.class));
    }
}
