package com.example.budgettracker.controller;

import com.example.budgettracker.model.Transactions;
import com.example.budgettracker.service.TransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionsController {

    @Autowired
    private TransactionsService transactionsService;

    @GetMapping("/user")
    public ResponseEntity<List<Transactions>> getTransactionsByUser(@RequestParam String email) {
        return ResponseEntity.ok(transactionsService.getTransactionsByUserEmail(email));
    }

    @PostMapping("/add")
    public ResponseEntity<Transactions> addTransaction(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String date,
            @RequestParam Double amount,
            @RequestParam String type
    ) {
        Transactions transaction = transactionsService.addTransaction(email, name, category, date, amount, type);

        if (transaction == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Transactions> updateTransaction(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String date,
            @RequestParam Double amount,
            @RequestParam String type
    ) {
        Transactions transaction = transactionsService.updateTransaction(id, name, category, date, amount, type);

        if (transaction == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Integer id) {
        boolean deleted = transactionsService.deleteTransaction(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
