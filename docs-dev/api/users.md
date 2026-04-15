# Endpoints Users

Nécessite pour chaque route une authentification et la transmission du `<token>`.

---

## GET /users

Liste des utilisateurs.

---

## POST /users

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

## PATCH /users/:id

Modification d’un utilisateur.

Payload :

```json
{
  "name": "Nouveau nom",
}
```

---

## DELETE /users/:id

Supprimer un utilisateur.

---
