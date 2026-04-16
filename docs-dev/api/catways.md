# Endpoints Catways

Nécessite pour chaque route une authentification et la transmission du `<token>`.

---

## GET /catways

Liste des catways.

---

## GET /catways/:id

Détail d’un catway.

---

## POST /catways

Créer un catway.

Payload :

```json
{
  "catwayNumber": 999,
  "type": "long",
  "catwayState": "free for testing"
}
```

---

## PUT /catways/:id

Modifier un catway.

---

## PATCH /catways/:id

Mettre à jour partiellement un catway.

---

## DELETE /catways/:id

Supprimer un catway.

---
