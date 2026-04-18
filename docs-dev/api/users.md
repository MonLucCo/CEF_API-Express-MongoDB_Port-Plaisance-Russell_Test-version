# 👤 Endpoints Users — API REST

Toutes les routes Users nécessitent une **authentification JWT** :

```js
Authorization: Bearer <token>
```

Les routes Users sont utilisées par le dashboard (pages EJS) mais font partie intégrante de l’API REST.

---

## ▶️ 1. GET /users

Retourne la liste des utilisateurs.

### 🔸 1.1 Réponse 200

```json
[
  {
    "_id": "string",
    "name": "Alice",
    "email": "alice@example.com"
  }
]
```

### 🔸 1.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 401  | Token manquant ou invalide |

---

## ▶️ 2. GET /users/:id

Retourne les détails d’un utilisateur.

### 🔸 2.1 Réponse 200

```json
{
  "_id": "string",
  "name": "Alice",
  "email": "alice@example.com"
}
```

### 🔸 2.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | ID invalide                |
| 404  | Utilisateur introuvable    |
| 401  | Token manquant ou invalide |

---

## ▶️ 3. POST /users

Crée un utilisateur.

### 🔸 3.1 Body

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Secret123!"
}
```

### 🔸 3.2 Réponse 201

```json
{
  "_id": "string",
  "name": "Alice",
  "email": "alice@example.com"
}
```

### 🔸 3.3 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | Données invalides          |
| 409  | Email déjà utilisé         |
| 401  | Token manquant ou invalide |

---

## ▶️ 4. PATCH /users/:id

Met à jour un utilisateur.

### 🔸 4.1 Body (exemple)

```json
{
  "name": "Nouveau nom"
}
```

### 🔸 4.2 Réponse 200

```json
{
  "_id": "string",
  "name": "Nouveau nom",
  "email": "alice@example.com"
}
```

### 🔸 4.3 Erreurs possibles

| Code | Description                      |
|------|----------------------------------|
| 400  | ID invalide ou payload incorrect |
| 404  | Utilisateur introuvable          |
| 401  | Token manquant ou invalide       |

---

## ▶️ 5. DELETE /users/:id

Supprime un utilisateur.

### 🔸 5.1 Réponse 200

```json
{
  "message": "Utilisateur supprimé"
}
```

### 🔸 5.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | ID invalide                |
| 404  | Utilisateur introuvable    |
| 401  | Token manquant ou invalide |

---
