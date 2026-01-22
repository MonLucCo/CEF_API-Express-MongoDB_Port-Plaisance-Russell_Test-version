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

## Principes

- Architecture modulaire
- Séparation claire des responsabilités
- Respect des bonnes pratiques Express/Mongoose
