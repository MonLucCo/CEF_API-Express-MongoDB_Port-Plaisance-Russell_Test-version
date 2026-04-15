# Vue d’ensemble de l’API

L’API REST du Port de Plaisance Russell permet de gérer :

- les utilisateurs,
- les catways (emplacements d’amarrage),
- les réservations associées aux catways.

Elle repose sur les principes suivants :

- Architecture REST,
- Authentification JWT,
- Format JSON pour toutes les requêtes et réponses,
- Séparation claire entre les ressources.

---

## Ressources principales

### Users

Gestion des utilisateurs de la capitainerie :

- création,
- connexion,
- suppression,
- consultation.

### Catways

Gestion des emplacements d’amarrage :

- liste,
- détail,
- création,
- modification,
- suppression.

### Reservations

Gestion des réservations d’un catway :

- liste,
- détail,
- création,
- suppression.

---

## URL de base

```bash
/api/port-plaisance-russell
```

Sur Alwaysdata :

- [https://perlucco.alwaysdata.net/api/port-plaisance-russell](https://perlucco.alwaysdata.net/api/port-plaisance-russell)

---
