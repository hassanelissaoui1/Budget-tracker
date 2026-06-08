# Budget Tracker

## Description

Budget Tracker est une application web de gestion de budget personnel.

Elle permet à un utilisateur de créer un compte, se connecter, ajouter des transactions, classer les transactions par catégorie et consulter ses dépenses ou revenus.

## Structure du projet

Le projet contient deux parties :

- `budget-tracker-back` : backend développé avec Spring Boot.
- `budget-tracker-front` : frontend de l'application.

## Fonctionnalités principales

- Création de compte utilisateur.
- Connexion utilisateur.
- Ajout de transactions.
- Modification de transactions.
- Suppression de transactions.
- Consultation des transactions par utilisateur.
- Gestion des catégories de transactions.

## Backend

Le backend contient plusieurs couches :

- `controller` : reçoit les requêtes HTTP.
- `service` : contient la logique métier.
- `repository` : communique avec la base de données.
- `model` : contient les entités.

Les principales entités sont :

- `User`
- `Transactions`
- `TransactionCategory`

## Tests unitaires

Le backend contient des tests unitaires avec JUnit 5 et Mockito.

Les tests couvrent :

- la création d'un utilisateur ;
- la vérification du mot de passe ;
- la création d'une catégorie ;
- l'ajout d'une transaction ;
- la suppression d'une transaction ;
- les cas où une donnée n'existe pas.

Pour lancer les tests, il faut aller dans le dossier du backend et exécuter les tests Maven.

## GitHub Actions

Le projet utilise GitHub Actions pour lancer automatiquement les tests du backend.

Le workflow est dans :

` .github/workflows/backend-ci.yml `

Ce workflow se lance lors d'un push ou d'une pull request sur la branche `main`.

## Technologies utilisées

- Java 17
- Spring Boot
- Maven
- JUnit 5
- Mockito
- GitHub Actions

## Objectif

L'objectif du projet est de créer une application de gestion de budget avec un backend testé automatiquement grâce à une intégration continue.