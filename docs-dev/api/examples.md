# Exemples de requêtes

Nécessite pour chaque route une authentification et la transmission du `<token>`.

---

## Exemple : Liste des catways

```js
GET /catways
```

Réponse :

```json
[
  {
    "_id": "65f1...",
    "catwayNumber": 1,
    "type": "short",
    "catwayState": "bon état",
    "createdAt": "2026-02-15T16:43:28.908Z",
    "updatedAt": "2026-02-15T16:43:28.908Z"
  }
]
```

---

## Exemple : Détail d’un catway

```js
GET /catways/65f1...
```

---

## Exemple : Créer une réservation

```js
POST /catways/65f1.../reservations
{
  "clientName": "Butterfly",
  "boatName": "My Little Butterfly",
  "checkIn": "2026-04-01",
  "checkOut": "2026-04-03"
}
```

---
