# Documentation des tests — Vue d’ensemble

Ce dossier regroupe l’ensemble de la documentation liée aux tests du projet.  
Les tests sont organisés selon **deux axes complémentaires** :

1. **Catégorie fonctionnelle**  
2. **Niveau de test**

Cette organisation permet une lecture claire, une maintenance facilitée et une montée en puissance progressive au fil des phases du projet.

---

## 1. Catégories de tests

Les tests sont regroupés en trois grandes catégories, correspondant aux domaines fonctionnels du projet :

### 🔐 1. Authentification

Tests portant sur :

- le contrôleur `authController`
- le middleware JWT
- les routes `/auth/*`

Dossier :  
`docs-dev/tests/auth/`

### 🧱 2. Modélisation

Tests portant sur :

- les modèles Mongoose (`User`, `Catway`, `Reservation`)
- la validation des schémas
- les comportements internes des modèles

Dossier :  
`docs-dev/tests/modeles/`

### ⚙️ 3. Fonctionnalités

Tests portant sur :

- les routes Catways
- les routes Reservations
- les workflows complets (CRUD)

Dossier :  
`docs-dev/tests/fonctions/`

> Cette catégorie sera alimentée progressivement lors des phases 4 et 5.

---

## 2. Niveaux de tests

Chaque catégorie est testée selon **trois niveaux**, conformément à la stratégie globale définie dans  
`docs-dev/tests-strategy.md`.

### 🟦 Niveau 1 — Tests unitaires

Objectif : tester la logique interne de manière isolée.

- Aucun accès à MongoDB  
- Utilisation de stubs (authentification)  
- Tests rapides et indépendants

### 🟩 Niveau 2 — Tests d’intégration

Objectif : tester l’interaction réelle entre Express, Mongoose et MongoDB.

- Utilisation de **MongoMemoryServer**  
- Tests des routes Express  
- Tests des modèles avec `save()`, `find()`, `delete()`  
- Vérification des erreurs MongoDB (`E11000`, `CastError`)

### 🟥 Niveau 3 — Tests E2E

Objectif : tester l’API complète du point de vue d’un client externe.

Deux environnements :

- **E2E simulé** (local, MongoMemoryServer, Postman)
- **E2E réel** (Alwaysdata + MongoDB Atlas)

> Les tests de niveau-3 seront ajoutés lors de l'issue-22.

---

## 3. Arborescence documentaire

```text
docs-dev/tests/
│
├── README_tests.md              ← Vue d’ensemble (ce document)
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
    └── (à compléter lors des phases 4 et 5)
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

---
