package com.example.budgettracker.service;

import com.example.budgettracker.model.TransactionCategory;
import com.example.budgettracker.model.User;
import com.example.budgettracker.repository.TransactionCategoryRepository;
import com.example.budgettracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionCategoryService {

    @Autowired
    private TransactionCategoryRepository transactionCategoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<String> getCategoryNamesByUserEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return List.of();
        }

        return transactionCategoryRepository.findByUser(userOptional.get())
                .stream()
                .map(TransactionCategory::getCategoryName)
                .distinct()
                .sorted()
                .toList();
    }

    public TransactionCategory findOrCreateCategory(User user, String categoryName) {
        if (categoryName == null || categoryName.trim().isEmpty()) {
            return null;
        }

        String cleanCategoryName = categoryName.trim();

        Optional<TransactionCategory> categoryOptional =
                transactionCategoryRepository.findByUserAndCategoryNameIgnoreCase(user, cleanCategoryName);

        if (categoryOptional.isPresent()) {
            return categoryOptional.get();
        }

        TransactionCategory category = new TransactionCategory();
        category.setCategoryName(cleanCategoryName);
        category.setCategoryColor("#f36b2f");
        category.setUser(user);

        return transactionCategoryRepository.save(category);
    }
}
