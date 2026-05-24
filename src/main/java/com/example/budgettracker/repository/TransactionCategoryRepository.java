package com.example.budgettracker.repository;

import com.example.budgettracker.model.TransactionCategory;
import com.example.budgettracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionCategoryRepository extends JpaRepository<TransactionCategory, Integer> {
    List<TransactionCategory> findByUser(User user);

    Optional<TransactionCategory> findByUserAndCategoryNameIgnoreCase(User user, String categoryName);
}
