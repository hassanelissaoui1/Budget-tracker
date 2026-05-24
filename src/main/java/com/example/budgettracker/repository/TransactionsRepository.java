package com.example.budgettracker.repository;

import com.example.budgettracker.model.Transactions;
import com.example.budgettracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionsRepository extends JpaRepository<Transactions, Integer> {
    List<Transactions> findByUser(User user);
}
