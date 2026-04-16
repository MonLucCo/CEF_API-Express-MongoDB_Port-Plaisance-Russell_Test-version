# Vue d’ensemble de l’API

L’API REST du Port de Plaisance Russell permet de gérer :

- l’authentification des utilisateurs,
- les utilisateurs,
- les catways,
- les réservations associées aux catways.

Elle repose sur :

- une architecture REST,
- une authentification JWT,
- un format JSON pour toutes les requêtes,
- une séparation claire entre les ressources.

---

## URL de base

```bash
/api/port-plaisance-russell
```

Sur Alwaysdata :

- `https://perlucco.alwaysdata.net/api/port-plaisance-russell`

---

## **Ressources principales**

---

### 🔐 1. Authentification

L’API utilise un système d’authentification basé sur JWT.

#### 1.1 Endpoints

- `POST /auth/login`  
  → Retourne un token JWT à utiliser dans les routes protégées.

#### 1.2 Header requis pour les routes protégées

```js
Authorization: Bearer <token>
```

---

### 👤 2. Users

Gestion des utilisateurs de la capitainerie.

#### 2.1 Endpoints

- `GET /users`  
  → Liste des utilisateurs

- `POST /users`  
  → Création d’un utilisateur

- `PATCH /users/:id`  
  → Mise à jour partielle

- `DELETE /users/:id`  
  → Suppression

#### 2.2 Notes

- Toutes les routes Users sont **protégées par JWT**.  
- Les anciennes routes `/auth/register` et `/auth/delete/:id` sont **dépréciées**.

---

### ⚓ 3. Catways

Gestion des emplacements d’amarrage.

#### 3.1 Endpoints

- `GET /catways`  
  → Liste des catways

- `GET /catways/:id`  
  → Détail d’un catway

- `POST /catways`  
  → Création d’un catway

- `PUT /catways/:id`  
  → Modification complète

- `PATCH /catways/:id`  
  → Modification partielle

- `DELETE /catways/:id`  
  → Suppression

---

### 🛥️ 4. Reservations

Gestion des réservations d’un catway.

#### 4.1 Endpoints

- `GET /catways/:id/reservations`  
  → Liste des réservations d’un catway

- `GET /catways/:id/reservations/:idReservation`  
  → Détail d’une réservation

- `POST /catways/:id/reservations`  
  → Création d’une réservation

- `DELETE /catways/:id/reservations/:idReservation`  
  → Suppression d’une réservation

---
