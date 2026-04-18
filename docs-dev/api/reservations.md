# 🛥️ Endpoints Reservations — API REST

Toutes les routes Reservations nécessitent une **authentification JWT** :

```js
Authorization: Bearer <token>
```

Les réservations sont toujours liées à un catway.

---

## ▶️ 1. GET /catways/:id/reservations

Liste les réservations d’un catway.

### 🔸 1.1 Réponse 200

```json
[
  {
    "_id": "string",
    "clientName": "Butterfly",
    "boatName": "My Little Butterfly",
    "checkIn": "2026-04-01",
    "checkOut": "2026-04-03"
  }
]
```

### 🔸 1.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | ID catway invalide         |
| 404  | Catway introuvable         |
| 401  | Token manquant ou invalide |

---

## ▶️ 2. GET /catways/:id/reservations/:idReservation

Détail d’une réservation.

### 🔸 2.1 Réponse 200

```json
{
  "_id": "string",
  "clientName": "Butterfly",
  "boatName": "My Little Butterfly",
  "checkIn": "2026-04-01",
  "checkOut": "2026-04-03"
}
```

### 🔸 2.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | ID invalide                |
| 404  | Réservation introuvable    |
| 401  | Token manquant ou invalide |

---

## ▶️ 3. POST /catways/:id/reservations

Créer une réservation.

### 🔸 3.1 Body

```json
{
  "clientName": "Butterfly",
  "boatName": "My Little Butterfly",
  "checkIn": "2026-04-01",
  "checkOut": "2026-04-03"
}
```

### 🔸 3.2 Réponse 201

```json
{
  "_id": "string",
  "clientName": "Butterfly",
  "boatName": "My Little Butterfly",
  "checkIn": "2026-04-01",
  "checkOut": "2026-04-03"
}
```

### 🔸 .3 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | Données invalides          |
| 404  | Catway introuvable         |
| 401  | Token manquant ou invalide |

---

## ▶️ 5. DELETE /catways/:id/reservations/:idReservation

Supprimer une réservation.

### 🔸 5.1 Réponse 200

```json
{
  "message": "Réservation supprimée"
}
```

### 🔸 5.2 Erreurs possibles

| Code | Description                |
|------|----------------------------|
| 400  | ID invalide                |
| 404  | Réservation introuvable    |
| 401  | Token manquant ou invalide |

---
