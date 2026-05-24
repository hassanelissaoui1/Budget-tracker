package com.example.budgettracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class TransactionCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer category_id;

    @Column(name = "category_name")
    private String categoryName;

    @Column(name = "Category_color")
    private String categoryColor;

    @ManyToOne
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "transactionCategory")
    private List<Transactions> transactionsList;
}
