# Budget Tracker

## Description

Budget Tracker est une application web de gestion de budget personnel.

Elle permet à un utilisateur de créer un compte, se connecter, ajouter des transactions, modifier des transactions, supprimer des transactions et consulter ses revenus et dépenses.

L’application permet aussi d’organiser les transactions par catégories et d’afficher des informations de suivi dans un tableau de bord.

## Structure du projet

Le projet est composé de deux parties principales :

* `budget-tracker-back` : backend développé avec Spring Boot.
* `budget-tracker-front` : frontend développé avec React.

```txt
Budget-tracker/
├── .github/
│   └── workflows/
│       └── backend-ci.yml
│
├── budget-tracker-back/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
└── budget-tracker-front/
    └── src/
        ├── App.js
        ├── index.js
        └── components/
            ├── LoginPage.js
            ├── RegisterPage.js
            └── DashboardPage.js
```

## Fonctionnalités principales

* Création de compte utilisateur.
* Connexion utilisateur.
* Déconnexion utilisateur.
* Ajout d’une transaction.
* Modification d’une transaction.
* Suppression d’une transaction.
* Consultation des transactions par utilisateur.
* Gestion automatique des catégories.
* Recherche de transactions.
* Affichage des revenus, dépenses et solde.
* Suivi des données par semaine, mois ou année.
* Interface avec mode sombre.

## Frontend

Le frontend est développé avec React.

Il contient les composants principaux suivants :

* `App.js` : gère la navigation entre les pages.
* `LoginPage.js` : permet à l’utilisateur de se connecter.
* `RegisterPage.js` : permet à l’utilisateur de créer un compte.
* `DashboardPage.js` : affiche le tableau de bord et permet de gérer les transactions.

Le frontend communique avec le backend à travers des requêtes HTTP vers les routes suivantes :

* `/api/v1/user/login/`
* `/api/v1/user/signup/`
* `/api/v1/transactions/user`
* `/api/v1/transactions/add`
* `/api/v1/transactions/update/{id}`
* `/api/v1/transactions/delete/{id}`
* `/api/v1/categories/user`

## Backend

Le backend est développé avec Spring Boot.

Il est organisé en plusieurs couches :

* `controller` : reçoit les requêtes HTTP.
* `service` : contient la logique métier.
* `repository` : communique avec la base de données.
* `model` : contient les entités de l’application.

Les principales entités sont :

* `User`
* `Transactions`
* `TransactionCategory`

## Tests unitaires

Le backend contient des tests unitaires avec JUnit 5 et Mockito.

Les tests vérifient :

* la création d’un utilisateur ;
* la vérification du mot de passe ;
* la création d’une catégorie ;
* l’ajout d’une transaction ;
* la suppression d’une transaction ;
* les cas où une donnée n’existe pas.

## GitHub Actions

Le projet utilise GitHub Actions pour lancer automatiquement les tests du backend.

Le workflow est dans :

```txt
.github/workflows/backend-ci.yml
```

Ce workflow se lance lors d’un push ou d’une pull request sur la branche `main`.

## Technologies utilisées

### Frontend

* React
* JavaScript
* Fetch API
* LocalStorage
* CSS

### Backend

* Java 17
* Spring Boot
* Maven
* Spring Data JPA
* JUnit 5
* Mockito

### CI/CD

* GitHub Actions

## Objectif du projet

L’objectif du projet est de créer une application complète de gestion de budget personnel avec une séparation claire entre frontend et backend.

Le projet montre aussi comment ajouter des tests unitaires au backend et comment automatiser leur exécution avec GitHub Actions.
