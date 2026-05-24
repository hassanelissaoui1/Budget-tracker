package com.example.budgettracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_id;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "password")
    private String password;

    @Column(name = "created_at")
    private Date created_at;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<TransactionCategory> transactionCategoryList;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Transactions> transactionsList;
}
