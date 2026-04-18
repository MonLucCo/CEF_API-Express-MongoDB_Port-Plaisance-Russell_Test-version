# ⚓ Endpoints Catways — API REST

Toutes les routes Catways nécessitent une **authentification JWT** :

```js
Authorization: Bearer <token>
```

Ces routes sont utilisées par le dashboard (pages EJS) pour afficher, créer et modifier les catways.

---

## ▶️ 1. GET /catways

Liste tous les catways.

### 🔸 1.1 Réponse 200

```json
[
  {
    "_id": "string",
    "catwayNumber": 10,
    "type": "long",
    "catwayState": "ok"
  }
]
```

### 🔸 1.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 401  | Token manquant ou invalide |

---

## ▶️ 2. GET /catways/:id

Retourne les détails d’un catway.

### 🔸 2.1 Réponse 200

```json
{
  "_id": "string",
  "catwayNumber": 10,
  "type": "long",
  "catwayState": "ok"
}
```

### 🔸 2.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | ID invalide                |
| 404  | Catway introuvable         |
| 401  | Token manquant ou invalide |

---

## ▶️ 3. POST /catways

Crée un catway.

### 🔸 3.1 Body

```json
{
  "catwayNumber": 999,
  "type": "long",
  "catwayState": "free for testing"
}
```

### 🔸 3.2 Réponse 201

```json
{
  "_id": "string",
  "catwayNumber": 999,
  "type": "long",
  "catwayState": "free for testing"
}
```

### 🔸 3.3 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | Données invalides          |
| 409  | Catway déjà existant       |
| 401  | Token manquant ou invalide |

---

## ▶️ 4. PATCH /catways/:id

Met à jour partiellement un catway.

### 🔸 4.1 Body (exemple)

```json
{
  "catwayState": "occupied"
}
```

### 🔸 4.2 Réponse 200

```json
{
  "_id": "string",
  "catwayNumber": 10,
  "type": "long",
  "catwayState": "occupied"
}
```

### 🔸 4.3 Erreurs possibles

| Code | Description                      |
|------|----------------------------------|
| 400  | ID invalide ou payload incorrect |
| 404  | Catway introuvable               |
| 401  | Token manquant ou invalide       |

---

## ▶️ 5. DELETE /catways/:id

Supprime un catway.

### 🔸 5.1 Réponse 204

Aucun contenu.

### 🔸 5.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | ID invalide                |
| 404  | Catway introuvable         |
| 401  | Token manquant ou invalide |

---
