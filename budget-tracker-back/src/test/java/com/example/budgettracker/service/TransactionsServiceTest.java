package com.example.budgettracker.service;

import com.example.budgettracker.model.TransactionCategory;
import com.example.budgettracker.model.Transactions;
import com.example.budgettracker.model.User;
import com.example.budgettracker.repository.TransactionsRepository;
import com.example.budgettracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionsServiceTest {

    @Mock
    private TransactionsRepository transactionsRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionCategoryService transactionCategoryService;

    @InjectMocks
    private TransactionsService transactionsService;

    @Test
    void addTransaction_whenUserNotFound_returnsNull() {
        when(userRepository.findByEmail("unknown@gmail.com"))
                .thenReturn(Optional.empty());

        Transactions result = transactionsService.addTransaction(
                "unknown@gmail.com",
                "Food",
                "Restaurant",
                "2026-06-08",
                50.0,
                "EXPENSE"
        );

        assertNull(result);
        verify(transactionsRepository, never()).save(any(Transactions.class));
    }

    @Test
    void addTransaction_whenUserExists_savesTransaction() {
        User user = new User();
        user.setEmail("test@gmail.com");

        TransactionCategory category = new TransactionCategory();
        category.setCategoryName("Restaurant");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(transactionCategoryService.findOrCreateCategory(user, "Restaurant"))
                .thenReturn(category);

        when(transactionsRepository.save(any(Transactions.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transactions result = transactionsService.addTransaction(
                "test@gmail.com",
                "Food",
                "Restaurant",
                "2026-06-08",
                50.0,
                "EXPENSE"
        );

        assertNotNull(result);
        assertEquals("Food", result.getTransaction_name());
        assertEquals("Restaurant", result.getTransaction_category());
        assertEquals(Date.valueOf("2026-06-08"), result.getTransaction_date());
        assertEquals(50.0, result.getTransaction_amount());
        assertEquals("EXPENSE", result.getTransaction_type());
        assertSame(user, result.getUser());
        assertSame(category, result.getTransactionCategory());

        verify(transactionsRepository).save(any(Transactions.class));
    }

    @Test
    void deleteTransaction_whenTransactionNotFound_returnsFalse() {
        when(transactionsRepository.findById(1))
                .thenReturn(Optional.empty());

        boolean result = transactionsService.deleteTransaction(1);

        assertFalse(result);
        verify(transactionsRepository, never()).delete(any(Transactions.class));
    }
}
