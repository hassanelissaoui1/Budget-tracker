package com.example.budgettracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Transactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transaction_id;

    private String transaction_name;
    private String transaction_category;
    private Double transaction_amount;
    private Date transaction_date;
    private String transaction_type;

    @JsonIgnore
    @ManyToOne
    private User user;

    @JsonIgnore
    @ManyToOne
    private TransactionCategory transactionCategory;
}
