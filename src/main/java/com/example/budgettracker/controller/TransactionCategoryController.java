package com.example.budgettracker.controller;

import com.example.budgettracker.service.TransactionCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/categories")
public class TransactionCategoryController {

    @Autowired
    private TransactionCategoryService transactionCategoryService;

    @GetMapping("/user")
    public ResponseEntity<List<String>> getCategoriesByUser(@RequestParam String email) {
        return ResponseEntity.ok(transactionCategoryService.getCategoryNamesByUserEmail(email));
    }
}
