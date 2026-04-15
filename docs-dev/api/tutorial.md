# Tutoriel d’utilisation de l’API

Ce tutoriel présente les étapes essentielles pour utiliser l’API.

---

## 1. Se connecter

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

## 2. Appeler une route protégée

Ajouter le token dans le header :

```js
Authorization: Bearer <token>
```

Exemples de requête :

- **Créer un utilisateur**

    ```js
    POST /auth/register
    {
      "name": "Alice",
      "email": "alice@example.com",
      "password": "Secret123!"
    }
    ```

- **Liste des catways**

    ```js
    GET /catways
    ```

- **Créer une réservation pour le catway `123`**

    ```js
    POST /catways/123/reservations
    {
      "clientName": "Butterfly",
      "boatName": "My Little Butterfly"
      "checkIn": "2026-04-01",
      "checkOut": "2026-04-03"
    }
    ```

---
