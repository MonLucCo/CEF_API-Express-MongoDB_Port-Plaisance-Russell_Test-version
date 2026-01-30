# Architecture du projet

**En préambule** : cette version initiale du document présente la situation d'architecture du dépôt pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

Ce document décrit l’architecture technique de l’API REST Port de Plaisance Russell.

## Structure générale

- `src/app.js` : configuration Express (middlewares, routes, erreurs)
- `src/server.js` : lancement du serveur
- `src/models/` : modèles Mongoose
- `src/middlewares/` : middlewares Express (authentification, validation, sécurité…)
- `src/services/` : logique métier réutilisable (accès DB, règles métier…)
- `src/routes/` : définition des routes
- `public/` : front-end minimal
- `tests/` : tests Mocha/Chai/Supertest
- `docs/` : documentation JSDoc générée

> Les dossiers `models/`, `middlewares/`, `services/` et `routes/` sont créés dès l’initialisation pour refléter l’architecture prévue.
> Les dossiers `public/`, `tests/` et `docs/` seront créés lors de la mise en oeuvre de la fonctionnalité.

---

## Principes

- Architecture modulaire
- Séparation claire des responsabilités
- Respect des bonnes pratiques Express/Mongoose

---

## Modèles Mongoose

Les modèles définissent la structure des données stockées dans MongoDB.  
Ils sont centralisés dans le dossier `src/models/`.

### Modèle **User**

Représente un utilisateur de la capitainerie.  
Il est utilisé pour l’inscription, la connexion, la gestion des comptes et la protection des routes via authentification.

**Structure du document :**

```json
{
  "name": "String",
  "email": "String (unique, lowercase, format email)",
  "password": "String (hashé ultérieurement)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Règles principales :**

- `name` : requis  
- `email` : requis, unique, format valide, trim, lowercase  
- `password` : requis (validation de complexité effectuée dans le contrôleur d’authentification)  
- timestamps automatiques (`createdAt`, `updatedAt`)

**Emplacement :**

```txt
src/models/user.js
```

**Interactions :**

- utilisé par le contrôleur d’authentification (issue‑12)  
- utilisé par le middleware JWT (issue‑13)  
- utilisé pour sécuriser les routes (issue‑14)

---
