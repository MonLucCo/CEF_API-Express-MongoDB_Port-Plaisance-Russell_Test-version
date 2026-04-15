# Exemples de requêtes

---

## Exemple : Liste des catways

```js
GET /catways
```

Réponse :

```json
[
  {
    "id": "65f1...",
    "identifier": "A1",
    "status": "free"
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
  "startDate": "2026-04-01",
  "endDate": "2026-04-03"
}
```

---
