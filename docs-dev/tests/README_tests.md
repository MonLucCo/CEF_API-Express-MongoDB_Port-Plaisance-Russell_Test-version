# Documentation des tests — Vue d’ensemble

Ce dossier regroupe l’ensemble de la documentation liée aux tests du projet.  
Les tests sont organisés selon **deux axes complémentaires** :

1. **Catégorie fonctionnelle**  
2. **Niveau de test**

Cette organisation permet une lecture claire, une maintenance facilitée et une montée en puissance progressive au fil des phases du projet.

---

## 1. Catégories de tests

Les tests sont regroupés en trois grandes catégories, correspondant aux domaines fonctionnels du projet :

### 1.1 Authentification

Tests portant sur :

- le contrôleur `authController`
- le middleware JWT
- les routes `/auth/*`

Dossier :  
`docs-dev/tests/auth/`

### 1.2 Modélisation

Tests portant sur :

- les modèles Mongoose :
  - `Catway` : issue-18
  - `Reservation` : issue-19
  - `User` : issue-20
- la validation des schémas
- les comportements internes des modèles

Dossier :  
`docs-dev/tests/modeles/`

### 1.3 Fonctionnalités

Tests portant sur :

- les routes Catways (Phase 4)
- les routes Reservations (Phase 5)
- les workflows complets (CRUD)
- la privatisation JWT des routes API Catways et Reservations (Phase 6)

Dossier :  
`docs-dev/tests/fonctions/`

Documents disponibles :

- [catways-niveau-1-unitaires.md](./fonctions/catways-niveau-1-unitaires.md)
- [catways-niveau-2-integration.md](./fonctions/catways-niveau-2-integration.md)
- [reservations-niveau-1-unitaires.md](./fonctions/reservations-niveau-1-unitaires.md)
- [reservations-niveau-2-integration.md](./fonctions/reservations-niveau-2-integration.md)
- [api-niveau-2-integration.md](./fonctions//api-niveau-2-integration.md)

---

## 2. Niveaux de tests

Chaque catégorie est testée selon **trois niveaux**, conformément à la stratégie globale définie dans  
`docs-dev/tests-strategy.md`.

### 2.1 Niveau 1 — Tests unitaires

Objectif : tester la logique interne de manière isolée.

- Aucun accès à MongoDB  
- Utilisation de stubs (authentification)  
- Tests rapides et indépendants

---

### 2.2 Niveau 2 — Tests d’intégration

Objectif : tester l’interaction réelle entre Express, Mongoose et MongoDB.

- Utilisation de **MongoMemoryServer**  
- Tests des routes Express  
- Tests des modèles avec `save()`, `find()`, `delete()`  
- Vérification des erreurs MongoDB (`E11000`, `CastError`)
- Tests de la privatisation des routes de l'API (Catways et Reservations)

---

### 2.3 Niveau 3 — Tests E2E

Objectif : tester l’API complète du point de vue d’un client externe.

Deux environnements :

- **E2E simulé** (local, MongoMemoryServer, Postman)
- **E2E réel** (Alwaysdata + MongoDB Atlas)

#### 2.3.1 E2E simulé

##### 2.3.1.1 Insertion de données

Les tests manuels de niveau-3 de l'insertion de données sont ajoutés lors de l'issue-22, la fin de la phase 3 du projet.

Cette campagne de tests manuels a été réalisée via Postman, en utilisant :

- le serveur Express local (`npm run dev`)
- la base MongoDB Atlas réelle
- la collection Postman locale (`docs-dev/tests/assets/collection-e2e-local.json`)

Les scénarios suivants ont été validés :

- POST /auth/register : création d'un utilisateur (identifiant ID)
- POST /auth/login : connexion d'un utilisateur (jeton JWT)
- DELETE /auth/delete/:id : suppression définitive d'un utilisateur (ID et JWT)

Résultat : conformité totale avec les statuts attendus et cohérence avec les tests automatisés.

---

##### 2.3.1.2 CRUD Catways

Les tests manuels de niveau-3 du CRUD Catways sont ajoutés lors de la fin de la phase 4 du projet.  

Cette campagne de tests manuels a été réalisée via Postman, en utilisant :

- le serveur Express local (`npm run dev`)
- la base MongoDB Atlas réelle
- la collection Postman locale (`docs-dev/tests/assets/collection-e2e-local.json`)

Les scénarios suivants ont été validés :

- GET /catways : liste vide puis liste peuplée
- GET /catways/:id : ObjectId et catwayNumber
- POST /catways : création + gestion des duplications
- PUT /catways/:id : mise à jour complète
- PATCH /catways/:id : mise à jour partielle
- DELETE /catways/:id : suppression définitive

Résultat : conformité totale avec les statuts attendus et cohérence avec les tests automatisés.

---

##### 2.3.1.3 CRUD Reservations

Les tests manuels de niveau-3 du CRUD Reservations seront ajoutés lors de la fin de la phase 5 du projet.

Cette campagne de tests manuels a été réalisée via Postman, en utilisant :

- le serveur Express local (`npm run dev`)
- la base MongoDB Atlas réelle
- la collection Postman locale (`docs-dev/tests/assets/collection-e2e-local.json`)

Les scénarios suivants ont été validés :

- GET /catways/:id/reservations : liste vide puis liste peuplée des reservations d'un catway
- GET /catways/:id/reservations/:idReservation : pour Catways (ObjectId et catwayNumber), pour Reservations (ObjectId)
- POST /catways/:id/reservations : création d'une réservation d'un catway
- DELETE /catways/:id/reservations/:idReservation : suppression définitive

Résultat : conformité totale avec les statuts attendus et cohérence avec les tests automatisés.

---

#### 2.3.2 E2E réel

Les tests de niveau-3 des fonctions de l'API seront ajoutés lors des phases 6 et 7 du projet.

---

## 3. Arborescence documentaire

```text
docs-dev/tests/
│
├── README_tests.md              ← Vue d’ensemble (ce document)
├── root-hooks.js                ← Définition des Hooks globaux de MOCHA et chargement `dotenv` (issue‑37)
├── test-app.js                  ← Serveur Express dédié aux tests E2E simulés (issue‑17)
│
├── helpers/
│   └── createTestUser.js        ← Helper centralisé pour créer un utilisateur + token JWT cohérent
│
├── assets/                      ← Images, captures, collections Postman
│   └── collection-e2e-local.json
│
├── auth/                        ← Catégorie Authentification
│   ├── auth-niveau-1-unitaires.md
│   ├── auth-niveau-2-integration.md
│   └── auth-niveau-3-e2e.md
│
├── modeles/                     ← Catégorie Modélisation
│   ├── modeles-niveau-1-unitaires.md
│   ├── modeles-niveau-2-integration.md
│   └── modeles-niveau-3-e2e.md
│
└── fonctions/                   ← Catégorie Fonctionnalités
    ├── api-niveau-2-integration.md
    ├── catways-niveau-1-unitaires.md
    ├── catways-niveau-2-integration.md
    ├── reservations-niveau-1-unitaires.md
    └── reservations-niveau-2-integration.md
```

---

## 4. Références

- Stratégie globale des tests : [docs-dev/tests-strategy.md](../tests-strategy.md)
- Architecture du projet : [docs-dev/architecture.md](../architecture.md)
- Tests automatisés :  
  - `npm test`  
  - `npm run tests:models`  
  - `npm run test:app`

---

## 5. Notes

- Cette documentation est versionnée et évolue au fil des issues.  
- Les tests de niveau 3 (E2E réels) seront finalisés lors de l’issue‑22.  
- Les tests de la catégorie Fonctionnalités seront introduits lors des phases 4 et 5.
- La Phase 6 (issue‑37) introduit :
  - la séparation API / Frontend,
  - la protection JWT des routes du frontend,
  - les tests transversaux de privatisation des routes API.

---
