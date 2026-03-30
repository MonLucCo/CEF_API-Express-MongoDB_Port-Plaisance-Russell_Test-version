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

- les routes Users (Phase 6)
- les routes Catways (Phase 4)
- les routes Reservations (Phase 5)
- les workflows complets (CRUD)
- la privatisation JWT des routes API Catways et Reservations (Phase 6)

Dossier :  
`docs-dev/tests/fonctions/`

Documents disponibles :

- [users-niveau-1-unitaires.md](./fonctions/users-niveau-1-unitaires.md)
- [users-niveau-2-integration.md](./fonctions/users-niveau-2-integration.md)
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
- Tests des routes Express :
  - `/api/users`
  - `/api/catways`
  - `/api/catways/:id/reservations`
- Tests des modèles avec `save()`, `find()`, `delete()`  
- Vérification des erreurs MongoDB (`E11000`, `CastError`)
- Tests de la privatisation des routes de l'API (Users, Catways et Reservations)

---

### 2.3 Niveau 3 — Tests E2E

Objectif : tester l’API complète du point de vue d’un client externe.

Deux environnements :

- **E2E simulé** (local, MongoMemoryServer, Postman)
- **E2E réel** (Alwaysdata + MongoDB Atlas)

#### 2.3.1 E2E simulé

##### 2.3.1.1 Insertion de données

Les tests manuels de niveau-3 de l'insertion de données ont été ajoutés lors de l'issue-22, la fin de la phase 3 du projet.

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

Les tests manuels de niveau-3 du CRUD Catways ont été ajoutés lors de la fin de la phase 4 du projet.  

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

Les tests manuels de niveau-3 du CRUD Reservations ont été ajoutés lors de la fin de la phase 5 du projet.

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

##### 2.3.1.4 CRUD Users

Les tests manuels de niveau-3 du CRUD Users ont été ajoutés lors de la phase 6 (issue-37) du projet.

Cette campagne de tests manuels a été réalisée via Postman, en utilisant :

- le serveur Express local (`npm run dev`)
- la base MongoDB Atlas réelle
- la collection Postman locale (`docs-dev/tests/assets/API-Port-Russell_v0.2.1-dev_01-PreDeploy.json`)

Les scénarios suivants ont été validés :

- GET /users : liste vide puis liste peuplée des utilisateurs
- POST /users : création d'un utilisateur
- PATCH /users/:id : actualisation (partielle) d'un utilisateur
- DELETE /users/:id : suppression définitive d'un utilisateur

Les routes historiques `/api/auth/register` et `/api/auth/delete/:id` sont désormais :

- privatisées  
- dépréciées  
- accompagnées du header `X-Deprecated: true`

Résultat : conformité totale avec les statuts attendus et cohérence avec les tests automatisés.

---

#### 2.3.2 E2E réel

Les tests de niveau-3 des fonctions de l'API seront ajoutés lors des phases 6 et 7 du projet.

---

## 2.4 Niveau 4 — Tests de pipeline (PreDeploy / Deploy / PostDeploy)

À partir de l’issue‑37 (Phase 6), un **quatrième niveau de tests** est introduit pour valider les opérations liées à l’hébergement et au déploiement de l’API.

Ce niveau regroupe les tests exécutés dans les trois pipelines :

- **validation pré‑déploiement** (PreDeploy)  
- **validation du déploiement** (Deploy)  
- **validation post‑déploiement** (PostDeploy)

Ces tests garantissent que :

- la version testée correspond exactement à la version déployée  
- les routes critiques sont protégées (JWT)  
- les opérations CRUD essentielles fonctionnent en conditions réelles  
- la base reste propre après test  
- les régressions non détectées par les tests automatisés sont identifiées  
- les résultats sont archivés pour assurer la traçabilité

### 2.4.1 Tests PreDeploy

Le pipeline PreDeploy utilise une collection Postman dédiée (archivée dans `docs-dev/tests/assets/`) :

- **`collection-v0.2.0-dev_01-PreDeploy.json`**  
- **`collection-v0.2.1-dev_01-PreDeploy.json`**  

Ces collections sont spécifiques à chaque version et doivent être mises à jour lorsque l’API évolue (ex. séparation Auth/Users en v0.2.1-dev).

Elle valide :

- login  
- protection des routes Auth  
- protection des routes Catways  
- protection des routes Reservations  
- cohérence du JWT  
- création/suppression contrôlée  
- nettoyage de la base après test  

Les résultats sont archivés dans :

```txt
docs-dev/deploiements/<version>/
```

### 2.4.2 Tests Deploy et PostDeploy

Ces tests seront introduits dans l'étape 8 de l’issue‑37.  
Ils valideront respectivement :

- la publication de la version sur Alwaysdata  
- le fonctionnement réel de l’API déployée

Le pipeline Deploy utilise une collection Postman dédiée (archivée dans `docs-dev/tests/assets/`) :

- **`collection-v0.2.1-dev_02-PostDeploy.json`**  

---

## 3. Arborescence documentaire

```text
docs-dev/`tests`/
│
├── README_tests.md              ← Vue d’ensemble (ce document)
├── root-hooks.js                ← Définition des Hooks globaux de MOCHA et chargement `dotenv` (issue‑37)
├── test-app.js                  ← Serveur Express dédié aux tests E2E simulés (issue‑17)
│
├── helpers/
│   └── createTestUser.js        ← Helper centralisé pour créer un utilisateur + token JWT cohérent
│
├── assets/                      ← Images, captures, collections Postman
│   ├── collection-e2e-local.json
│   ├── API-Port-Russell_v0.2.0-dev_01-PreDeploy.json
│   ├── API-Port-Russell_v0.2.1-dev_00-Tests-6c-inc1.json
│   ├── API-Port-Russell_v0.2.1-dev_01-PreDeploy.json
│   └── API-Port-Russell_v0.2.1-dev_02-PostDeploy.json
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
├── fonctions/                   ← Catégorie Fonctionnalités
│   ├── api-niveau-2-integration.md
│   ├── users-niveau-1-unitaires.md
│   ├── users-niveau-2-integration.md
│   ├── catways-niveau-1-unitaires.md
│   ├── catways-niveau-2-integration.md
│   ├── reservations-niveau-1-unitaires.md
│   └── reservations-niveau-2-integration.md
│
└── deploiements/                  ← Catégorie Hébergement et Publication
    ├── v0.2.0-dev_01_predeploy_2026-03-19_18-49/   ← Archivage des validations pré-déploiement (v0.2.0-dev : refus)
    ├── v0.2.1-dev_01_predeploy_2026-03-26_11-35/   ← Archivage des validations pré-déploiement (v0.2.1-dev : accord)
    ├── v0.2.1-dev_02_deploy_2026-03-29_09-01/      ← Archivage des validations pré-déploiement (v0.2.1-dev : accord partiel - patch A)
    ├── v0.2.1-dev.a_02_deploy_2026-03-30_10-03/    ← Archivage des validations pré-déploiement (v0.2.1-dev : accord partiel - patch B)
    ├── v0.2.1-dev.b_02_deploy_2026-03-30_10-34/    ← Archivage des validations pré-déploiement (v0.2.1-dev : accord partiel - patch C)
    └── v0.2.1-dev.a_02_deploy_2026-03-30_20-0/     ← Archivage des validations pré-déploiement (v0.2.1-dev : accord - patch D)
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
- Les tests de niveau 3 (E2E réels) seront finalisés lors de la phase 7.  
- Les tests de la catégorie Fonctionnalités seront introduits lors des phases 4 et 5.
- La Phase 6 (issue‑37) introduit :
  - la séparation API / Frontend,
  - la protection JWT des routes du frontend,
  - les tests transversaux de privatisation des routes API
  - la séparation des routes Auth et Users (création)
  - la gestion des fonction **dépréciées** de l'API.
- La phase 8 (issue-37) introduit :
  - la validation partielle nécessitant un correctif (patch)
  - la validation d'une version publiée.

---
