# Endpoints Reservations

---

## GET /catways/:id/reservations

Liste des réservations d’un catway.

---

## GET /catways/:id/reservations/:idReservation

Détail d’une réservation.

---

## POST /catways/:id/reservations

Créer une réservation.

Payload :

```json
{
  "checkIn": "2026-04-01",
  "checkOut": "2026-04-03"
}
```

---

## DELETE /catways/:id/reservations/:idReservation

Supprimer une réservation.

---
