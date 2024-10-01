# Authentification d'Allo media

## Introduction
Ce document décrit l'implémentation de la fonctionnalité d'authentification pour la gestion des utilisateurs dans ce projet. Ce système permet aux utilisateurs de s'enregistrer, de se connecter, de réinitialiser leur mot de passe et d'utiliser une authentification à deux facteurs (2FA) via une API RESTful utilisant Node.js, Express et MongoDB.

## Table des Matières
- [Fonctionnalités](#fonctionnalités)
  - [Inscription d'un Utilisateur](#1-inscription-dun-utilisateur)
  - [Connexion d'un Utilisateur](#2-connexion-dun-utilisateur)
  - [Réinitialisation de Mot de Passe](#3-réinitialisation-de-mot-de-passe)
  - [Vérification de Compte](#4-vérification-de-compte)
- [Technologies Utilisées](#technologies-utilisées)
- [Structure des Fichiers](#structure-des-fichiers)
  - [Controllers](#controllers)
  - [Middleware](#middleware)
  - [Routes](#routes)
  - [Modèles](#modèles)
  - [Utilitaires](#utilitaires)

## Fonctionnalités

### 1. Inscription d'un Utilisateur
- **Endpoint**: `POST /api/auth/register`
- **Description**: Permet aux utilisateurs de créer un nouveau compte avec un email et un mot de passe.
- **Validation des données**: Les données d'entrée sont validées pour garantir la conformité des informations.
- **Enregistrement dans la base de données**: Les nouveaux utilisateurs sont sauvegardés dans la base de données via un modèle MongoDB.

### 2. Connexion d'un Utilisateur
- **Endpoint**: `POST /api/auth/login`
- **Description**: Permet aux utilisateurs de se connecter à leur compte.
- **Authentification**: Vérifie les identifiants et génère un token JWT pour l'authentification.

### 3. Réinitialisation de Mot de Passe
- **Endpoint**: `POST /api/auth/reset-password`
- **Description**: Les utilisateurs peuvent demander un lien de réinitialisation de mot de passe.
- **Validation du token**: Vérifie le token de réinitialisation et permet à l'utilisateur de définir un nouveau mot de passe.

### 4. Vérification de Compte
- **Endpoint**: `GET /api/auth/verify/:token`
- **Description**: Envoie un email de vérification après l'inscription pour confirmer le compte de l'utilisateur.
- **Activation du compte**: Le compte est activé une fois le lien de vérification cliqué.

## Technologies Utilisées

- **Node.js**: Environnement d'exécution pour JavaScript côté serveur.
- **Express.js**: Framework pour créer des applications web rapides et modulaires.
- **MongoDB**: Base de données NoSQL pour stocker les données des utilisateurs.
- **JWT**: Utilisé pour l'authentification sécurisée.
- **Nodemailer**: Pour l'envoi d'emails de vérification et de réinitialisation.
- **Mongoose**: ODM pour interagir avec la base de données MongoDB.
- **Express-validator**: Middleware pour valider les données des formulaires.

## Structure des Fichiers

### Controllers
Les contrôleurs gèrent la logique métier du projet.
- **auth.controller.js**: Gère les opérations d'inscription, de connexion, de réinitialisation de mot de passe et de vérification de compte.

### Routes
Les routes définissent les points d'accès pour chaque opération d'authentification.
- **auth.router.js**: Définit les routes pour l'inscription, la connexion, la réinitialisation de mot de passe et la vérification de compte.

### Modèles
Les modèles représentent la structure des données dans la base de données.
- **User.js**: Modèle Mongoose représentant un utilisateur, avec ses champs (email, mot de passe, statut de vérification, etc.).

### Util
Les utilitaires encapsulent des fonctions génériques pour diverses opérations nécessaires à l'application.
- **util**:
  - **generateRandomCode()**: Génère un code aléatoire pour les opérations de vérification, par exemple pour l'envoi de mails de confirmation.
  - **hashPassword(password)**: Hache les mots de passe avant de les stocker dans la base de données à l'aide d'algorithmes sécurisés (par exemple, bcrypt).
  - **createToken(user)**: Crée un token JWT pour l'authentification des utilisateurs, ce qui permet de sécuriser les sessions.
  - **sendEmail(to, subject, text)**: Envoie un email avec le contenu spécifié, utilisé pour la vérification du compte et la réinitialisation de mot de passe.

