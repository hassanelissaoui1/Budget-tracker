package com.example.budgettracker.service;

import com.example.budgettracker.model.TransactionCategory;
import com.example.budgettracker.model.Transactions;
import com.example.budgettracker.model.User;
import com.example.budgettracker.repository.TransactionsRepository;
import com.example.budgettracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionsService {

    @Autowired
    private TransactionsRepository transactionsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionCategoryService transactionCategoryService;

    public List<Transactions> getTransactionsByUserEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return List.of();
        }

        return transactionsRepository.findByUser(userOptional.get());
    }

    public Transactions addTransaction(String email, String name, String category, String date, Double amount, String type) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return null;
        }

        User user = userOptional.get();
        TransactionCategory transactionCategory = transactionCategoryService.findOrCreateCategory(user, category);

        Transactions transaction = new Transactions();
        transaction.setTransaction_name(name);
        transaction.setTransaction_category(category.trim());
        transaction.setTransaction_date(Date.valueOf(date));
        transaction.setTransaction_amount(amount);
        transaction.setTransaction_type(type);
        transaction.setUser(user);
        transaction.setTransactionCategory(transactionCategory);

        return transactionsRepository.save(transaction);
    }

    public Transactions updateTransaction(Integer id, String name, String category, String date, Double amount, String type) {
        Optional<Transactions> transactionOptional = transactionsRepository.findById(id);

        if (transactionOptional.isEmpty()) {
            return null;
        }

        Transactions transaction = transactionOptional.get();
        TransactionCategory transactionCategory = transactionCategoryService.findOrCreateCategory(transaction.getUser(), category);

        transaction.setTransaction_name(name);
        transaction.setTransaction_category(category.trim());
        transaction.setTransaction_date(Date.valueOf(date));
        transaction.setTransaction_amount(amount);
        transaction.setTransaction_type(type);
        transaction.setTransactionCategory(transactionCategory);

        return transactionsRepository.save(transaction);
    }

    public boolean deleteTransaction(Integer id) {
        Optional<Transactions> transactionOptional = transactionsRepository.findById(id);

        if (transactionOptional.isEmpty()) {
            return false;
        }

        transactionsRepository.delete(transactionOptional.get());
        return true;
    }
}
