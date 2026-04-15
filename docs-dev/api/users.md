# Endpoints Users

---

## POST /auth/register

Créer un utilisateur.

Payload :

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Secret123!"
}
```

---

## POST /auth/login

Connexion d’un utilisateur.

Réponse :

```json
{
  "token": "<jwt>"
}
```

---

## DELETE /auth/delete/:id

Supprimer un utilisateur (JWT requis).

---
