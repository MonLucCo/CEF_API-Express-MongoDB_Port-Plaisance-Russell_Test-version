# Architecture du projet

**En préambule** : cette version initiale du document présente la situation d'architecture du dépôt pour ce projet. Il fait des hypothèses quant à la mise en œuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

Ce document décrit l’architecture technique de l’API REST Port de Plaisance Russell.

---

## 1. Fondements de l’architecture

Cette section présente les principes directeurs, la structure technique du projet et l’organisation fonctionnelle progressive (Phases 2 à 8).  
Elle constitue la base de l’architecture logicielle de l’API Port de Plaisance Russell.

---

### 1.1. Principes d’architecture

L’API repose sur plusieurs principes structurants :

- **Architecture modulaire** : chaque dossier a une responsabilité claire.  
- **Séparation stricte des rôles** : modèles, contrôleurs, middlewares, services et routes sont isolés.  
- **Évolutivité** : l’architecture est conçue pour accueillir progressivement les fonctionnalités.  
- **Documentation continue** : chaque étape enrichit la documentation interne (`docs-dev/`).  
- **Approche architecture‑first** : la structure est définie avant l’implémentation complète.  
- **Intégration progressive** : les fonctionnalités sont ajoutées par phases successives (issues 2 à 8).  

---

### 1.2. Structure technique du projet

L’arborescence du projet suit les bonnes pratiques Express/Mongoose :

```text
src/
  ├── app.js             ← Configuration Express (middlewares, routes, erreurs)
  ├── server.js          ← Lancement du serveur
  │
  ├── models/            ← Modèles Mongoose
  ├── controllers/       ← Contrôleurs Express (logique métier)
  ├── middlewares/       ← Middlewares (auth, validation, sécurité)
  ├── services/          ← Logique métier réutilisable
  └── routes/            ← Définition des routes Express

public/                ← Front-end minimal
tests/                 ← Tests Mocha/Chai/Supertest
docs/                  ← Documentation JSDoc générée
docs-dev/              ← Documentation interne versionnée
```

Les dossiers `models/`, `controllers/`, `middlewares/`, `services/` et `routes/` sont créés dès l’initialisation pour refléter l’architecture prévue.  
Les autres dossiers apparaissent au fur et à mesure des phases fonctionnelles.

---

### 1.3. Organisation fonctionnelle (Phases 2 à 8)

L’architecture est construite progressivement selon les phases fonctionnelles du projet :

#### 1.3.1 Phase 2 — Authentification

- Issue 11 : Modèle User  
- Issue 12 : Contrôleur d’authentification (sans sécurité)  
- Issue 13 : Routes d’authentification  
- Issue 14 : Hashage du mot de passe (bcrypt)  
- Issue 15 : Génération du JWT  
- Issue 16 : Middleware JWT + routes protégées  
- Issue 17 : Tests Postman & validation  

#### 1.3.2 Phase 3 — Modèles & données

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.3 Phase 4 — Catways

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.4 Phase 5 — Reservations

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.5 Phase 6 — Front-end minimal

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.6 Phase 7 — Tests unitaires

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.7 Phase 8 — Documentation API

(sera complété avec les issues lors de l'engagement de la phase)

---

## 2. Architecture fonctionnelle (Phases 2 à 8)

Cette section décrit l’architecture technique selon les phases fonctionnelles du projet.  
Les phases 1, 9 et 10 ne sont pas détaillées ici car elles concernent respectivement la préparation, le déploiement final et la validation, et ne modifient pas directement l’architecture interne.

---

### 2.1 Phase 2 — Authentification

#### 2.1.1 Issue 11 — Modèle User

Représente un utilisateur de la capitainerie.  
Utilisé pour l’inscription, la connexion, la gestion des comptes et la protection des routes.

**Structure du document :**

```json
{
  "name": "String",
  "email": "String (unique, lowercase, format email)",
  "password": "String (hashé ultérieurement)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Règles principales :**

- `name` : requis  
- `email` : requis, unique, format valide, trim, lowercase  
- `password` : requis (validation de complexité dans le contrôleur)  
- timestamps automatiques

**Emplacement :** `src/models/user.js`

---

#### 2.1.2 Issue 12 — Contrôleur d’authentification (sans sécurité)

Le contrôleur `authController.js` gère les opérations de base sur le modèle `User` :

- `register` : création d’un utilisateur  
- `login` : recherche d’un utilisateur par email  
- `deleteUser` : suppression d’un utilisateur par ID  

Aucune sécurité dans cette version :

- pas de hashage  
- pas de vérification du mot de passe  
- pas de jeton JWT  

**Emplacement :** `src/controllers/authController.js`

---

#### 2.1.3 Issue 13 — Routes d’authentification

Définition des routes Express :

- `POST /auth/register`  
- `POST /auth/login`  
- `DELETE /auth/delete/:id`  

Ces routes appellent les fonctions du contrôleur (issue 12).  
Aucune sécurité appliquée à ce stade.

**Emplacement :** `src/routes/authRoutes.js`

---

#### 2.1.4 Issue 14 — Hashage du mot de passe

Intégration de **bcrypt** dans le contrôleur :

- hashage du mot de passe lors du register  
- comparaison du mot de passe lors du login  

Mise à jour du contrôleur et de la documentation.

---

#### 2.1.5 Issue 15 — Génération du JWT

Intégration de **jsonwebtoken** :

- génération du token lors du login  
- signature avec `JWT_SECRET`  
- durée de validité  
- retour du token dans la réponse  

Mise à jour du contrôleur et de la documentation.

---

#### 2.1.6 Issue 16 — Middleware JWT et routes protégées

Création du middleware d’authentification :

- extraction du token  
- vérification du token  
- ajout de `req.userId`  
- protection des routes sensibles  

Mise à jour des routes Catways et Reservations.

**Emplacement :** `src/middlewares/authMiddleware.js`

---

#### 2.1.7 Issue 17 — Tests Postman & validation

- tests manuels via Postman  
- scénarios d’inscription, connexion, suppression  
- tests des routes protégées  
- captures d’écran  
- mise à jour de la documentation  
- vérification sur Alwaysdata  

---

### 2.2 Phase 3 — Modèles & données

(sera complété avec les issues correspondantes)

---

### 2.3 Phase 4 — Catways

(sera complété avec les issues correspondantes)

---

### 2.4 Phase 5 — Reservations

(sera complété avec les issues correspondantes)

---

### 2.5 Phase 6 — Front-end minimal

(sera complété avec les issues correspondantes)

---

### 2.6 Phase 7 — Tests unitaires

(sera complété avec les issues correspondantes)

---

### 2.7 Phase 8 — Documentation API

(sera complété avec les issues correspondantes)

---
