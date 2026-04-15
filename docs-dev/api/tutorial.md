# Tutoriel d’utilisation de l’API

Ce tutoriel présente les étapes essentielles pour utiliser l’API.

---

## 1. Créer un utilisateur

```js
POST /auth/register
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Secret123!"
}
```

---

## 2. Se connecter

```js
POST /auth/login
{
  "email": "alice@example.com",
  "password": "Secret123!"
}
```

Réponse :

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 3. Appeler une route protégée

Ajouter le token dans le header :

```js
Authorization: Bearer <token>
```

Exemple :

```js
GET /catways
```

---

## 4. Créer une réservation

```js
POST /catways/123/reservations
{
  "checkIn": "2026-04-01",
  "checkOut": "2026-04-03"
}
```

---
