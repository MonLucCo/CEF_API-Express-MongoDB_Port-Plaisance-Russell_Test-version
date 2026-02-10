# CEF_API-Express-MongoDB_Port-Plaisance-Russell_Test-version

Etablissement d'une API avec Node.js/Express et MongoDB d'une "gestion des réservations de catway" (petit appontement de bateau du port de plaisance Russell) selon les spécifications du CEF.

![Licence MIT](https://img.shields.io/badge/License-MIT-green.svg) ![npm](https://img.shields.io/badge/npm-9+-blue) ![Node.js](https://img.shields.io/badge/node-18+-green) ![Express](https://img.shields.io/badge/Express.js-5.x-lightgrey) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![Alwaysdata](https://img.shields.io/badge/hosted%20on-Alwaysdata-blue)

---

![Milestone Phase 2](https://img.shields.io/badge/Phase%202-Authentification-green) ![Issues ouvertes](https://img.shields.io/github/issues/MonLucCo/CEF_API-Express-MongoDB_Port-Plaisance-Russell_Test-version) ![Dernier commit](https://img.shields.io/github/last-commit/MonLucCo/CEF_API-Express-MongoDB_Port-Plaisance-Russell_Test-version)
![Statut du dépôt](https://img.shields.io/badge/statut-en%20développement-blue)
  
> 🔗 [Accès aux phases](https://github.com/MonLucCo/CEF_API-Express-MongoDB_Port-Plaisance-Russell_Test-version/milestones/)
> 🔗 [Accès aux issues](https://github.com/MonLucCo/CEF_API-Express-MongoDB_Port-Plaisance-Russell_Test-version/issues/)

---

> **Préambule — Version en cours de développement**  
> Ce dépôt correspond à la version de travail du projet API REST Express/MongoDB du CEF.  
> Le README, l’architecture et la documentation sont mis à jour progressivement jusqu’à la livraison finale.  
> Les sections indiquant des fonctionnalités non encore implémentées seront actualisées au fil de l’avancement (se reporter à la section [Roadmap](#-roadmap) pour l'avancement du projet).

---

## 🛥️ Port de Plaisance Russell – API REST Express/MongoDB

Gestion des catways et des réservations du port de plaisance Russell.  
Ce projet met en œuvre une API REST sécurisée en Node.js/Express, connectée à une base MongoDB, accompagnée d’un front minimal, d’une authentification JWT, de tests unitaires Mocha/Chai et d’une documentation JSDoc.

---

## 📌 Objectifs du projet

Ce projet vise à :

- Concevoir une API REST sécurisée  
- Manipuler MongoDB via Mongoose  
- Mettre en place une authentification JWT  
- Implémenter les opérations CRUD sur les catways et les réservations  
- Développer un front minimal  
- Documenter l’API avec JSDoc  
- Tester les fonctionnalités avec Mocha/Chai  
- Déployer l’application sur Alwaysdata  

---

## 🧱 Architecture du projet

L’architecture suit une organisation modulaire inspirée des bonnes pratiques Express/Mongoose, enrichie par une documentation versionnée et des scripts de déploiement.

```text
├── src/               ← Dossier principal du code de l'API
│   ├── app.js                   ← Configuration Express (middlewares, routes, erreurs)
│   ├── server.js                ← Lancement du serveur (écoute du port)
│   │
│   ├── models/        ← Modèles Mongoose        
│   ├── controllers/   ← Contrôleurs Express (logique métier liée aux routes)
│   ├── middlewares/   ← Middlewares Express (authentification, validation, sécurité…)        
│   ├── services/      ← Logique métier réutilisable (accès DB, règles métier…)  
│   └── routes/        ← Définition des routes Express     
│
├── config/            ← Configuration globale (JWT, paramètres transversaux)
│   └── dev/                     ← Configurations de l'environnement de développement (nodemon…)
│
├── public/            ← Fichiers statiques pour le front minimal
│
├── tests/             ← Tests Mocha, Chai, Sinon et Supertest
│   ├── test-app.js              ← Serveur Express dédié aux tests E2E simulés
│   │
│   ├── controllers/             ← Tests unitaires (niveau‑1)
│   ├── middlewares/             ← Tests unitaires (niveau‑1)
│   ├── integration/             ← Tests d’intégration (niveau‑2)
│   ├── e2e/                     ← Tests E2E (niveau‑3)
│   └── mocks/                   ← Mocks/stubs pour isoler les dépendances
│
├── data/              ← Fichiers catways.json et reservations.json
│
├── docs/              ← Documentation JSDoc générée automatiquement
│
├── docs-dev/          ← Documentation interne versionnée
│   ├── architecture.md          ← Structure technique et organisation du projet
│   ├── conventions.md           ← Conventions de code, nommage et organisation
│   ├── workflow-git.md          ← Stratégie Git (branches, commits, PR)
│   ├── securite.md              ← Mesures de sécurité (JWT, bcrypt, Helmet, CORS…)
│   ├── tests-strategy.md        ← Stratégie globale des tests (niveaux 1 à 3)
│   ├── decisions-techniques.md  ← Historique des choix techniques majeurs
│   │
│   ├── hebergement/             ← Documentation Alwaysdata & MongoDB
│   ├── deploiement/             ← Procédures de déploiement et validation
│   └── tests/                   ← Documentation détaillée des tests par niveau

├── scripts/           ← Scripts de déploiement et de vérification
├── logs/              ← Logs générés par les scripts (check:local, check:site…)
├── scratches/         ← Dossier privé (non versionné) pour scripts sensibles, notes et brouillons
│
├── .env.example       ← Modèle des variables d'environnement
├── .gitignore         ← Exclusions Git
├── .nvmrc             ← Version Node recommandée
│
├── package.json       ← Dépendances et scripts
└── README.md          ← Documentation principale du projet
```

👉 Détails complets : [docs-dev/architecture.md](./docs-dev/architecture.md)

---

## 🔐 Authentification

L’API utilise :

- **bcrypt** pour le hashage des mots de passe  
- **JWT** pour l’accès aux routes protégées  
- un **middleware d’authentification** pour sécuriser les endpoints sensibles  

---

## 📐 Spécifications fonctionnelles

### ⚓ Ressource : Catways

- `GET /catways`  
- `GET /catways/:id`  
- `POST /catways`  
- `PUT /catways/:id`  
- `PATCH /catways/:id`  
- `DELETE /catways/:id`  

### 🛥️ Ressource : Reservations

- `GET /catways/:id/reservations`  
- `GET /catways/:id/reservations/:idReservation`  
- `POST /catways/:id/reservations`  
- `DELETE /catways/:id/reservations/:idReservation`  

---

## 🖥️ Front-end minimal

- Page d’accueil  
- Dashboard utilisateur  
- Liste des catways  
- Liste des réservations  
- Détails d’un catway  
- Détails d’une réservation
- Documentation de l'API (JSDoc)

---

## 🧪 Tests unitaires

Tests réalisés avec :

- **Mocha**
- **Chai**
- **Sinon**
- **Supertest**

Les tests couvrent les **9 fonctionnalités demandées** :

1. Création catway  
2. Suppression catway  
3. Liste catways  
4. Création réservation  
5. Suppression réservation  
6. Liste réservations  
7. Création utilisateur  
8. Suppression utilisateur  
9. Connexion utilisateur  

Les tests couvrent les 9 fonctionnalités demandées.

👉 Détails complets : [docs-dev/tests-strategy.md](./docs-dev/tests-strategy.md)

---

## 📚 Documentation

La documentation technique est générée avec **JSDoc** et accessible via :

```text
docs/
```

Elle inclut :

- Vue d’ensemble  
- Tutoriel  
- Exemples  
- Glossaire  

---

## 📚 Documentation de développement

La **documentation interne versionnée** est disponible dans le dossier `docs-dev/` :

- [Architecture](./docs-dev/architecture.md)
- [Conventions](./docs-dev/conventions.md)
- [Workflow Git](./docs-dev/workflow-git.md)
- [Sécurité](./docs-dev/securite.md)
- [Stratégie de tests](./docs-dev/tests-strategy.md)
- [Tests niveau‑1, niveau‑2, niveau‑3](./docs-dev/tests/)
- [Décisions techniques](./docs-dev/decisions-techniques.md)
- [Déploiement](./docs-dev/deploiement/README_deploiement.md)
- [Hébergement](./docs-dev/hebergement/alwaysdata.md)
- [Développement continu (CI/CD)](./docs-dev/developpement-continu.md)

**Scripts et outils** dans le dossier `scripts/` :

- [Vue d’ensemble des scripts](./scripts/README_scripts.md)
- [Scripts de déploiement](./scripts/deploy-README.md)
- [Checklists de déploiement](./scripts/deploy-checklist-README.md)
- [Scripts SSH](./scripts/ssh-README.md)

> Les scripts sensibles, les notes internes et les brouillons sont conservés dans le dossier privé `scratches/` (non versionné).

---

## 🔐 Sécurité (résumé)

- Helmet pour renforcer les headers HTTP  
- CORS pour contrôler les accès cross-origin  
- Authentification JWT  
- Hashage bcrypt  
- Middleware d’authentification  
- URI MongoDB sécurisé  

👉 Détails complets : [docs-dev/securite.md](./docs-dev/securite.md)

---

## 🧭 Workflow Git (résumé)

- Développement sur `feature/...`  
- Intégration sur `dev`  
- Validation via PR  
- Merge final sur `main`  

👉 Détails complets : [docs-dev/workflow-git.md](./docs-dev/workflow-git.md)

---

## ⚙️ Automatisation GitHub

Le projet utilise des scripts privés (non versionnés) pour automatiser :

- la création des labels  
- la création des milestones  
- la création des issues  
- l’initialisation du dépôt  

Ces scripts utilisent :

- **GitHub CLI (`gh`)**  
- **jq** pour lire les fichiers JSON  

Les scripts sont conservés dans le dossier privé `scratches/`.

---

## ☁️ Déploiement

Le projet est déployé sur **Alwaysdata** : 🔗 [API du port de plaisance Russell](https://perlucco.alwaysdata.net/api/port-plaisance-russell)

Le déploiement est réalisé via un script automatisé :

```bash
npm run deploy
```
  
Les modalités techniques sont disponibles dans la documentation de développement [docs-dev/deploiement](./docs-dev/deploiement/README_deploiement.md).
  
Le processus de validation inclut :

- vérification locale (script : `npm run check:local`)
- transfert (`rsync`) des fichiers (script : `npm run deploy`)
- redémarrage manuel du site (via Alwaysdata)
- vérification distante (script : `npm run check:site`)
- archivage des logs (résultats : `logs/deploy-checklist-*.log`)

Le projet intègre une logique de **[développement continu (CI/CD)](./docs-dev/developpement-continu.md)**

---

## 🔧 Prérequis

- **Node.js** : version minimale recommandée `18+`  
  - version locale actuelle : `v24.12.0`  
  - version hébergée sur Alwaysdata : `v24.13.0` (mise à jour automatique)
  - version fixée localement via `.nvmrc` : 24
- **NPM** : `9+`
- **MongoDB Atlas**
- **Git**

> La version Node utilisée sur le site est gérée par Alwaysdata et peut être légèrement supérieure à la version locale.
> Le fichier `.nvmrc` est fixé à 24 pour garantir la cohérence entre les environnements.
> Le script `check:site` permet de vérifier la version réelle utilisée par l’API via le header `X-API-SYSTEM`.

---

## 🛠️ Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/<ton-repo>.git
cd <ton-repo>
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d’environnement

Créer un fichier `.env` à partir de `.env.example`.

### 4. Lancer le serveur en développement

Deux modes sont disponibles :

#### 4.1 Mode développement (avec nodemon)

Recharge automatique à chaque modification :

```bash
npm run dev
```

#### 4.2 Mode standard (sans nodemon)

Lancement simple du serveur :

```bash
npm start
```

### 5. Lancer les tests

Deux modes sont disponibles :

#### 5.1 Tests automatisés

```bash
npm test
```

#### 5.2 Tests manuels avec Postman

Un serveur Express dédié (`tests/test-app.js`) permet d’exécuter les tests E2E locaux via Postman, avec une base MongoMemoryServer.

Commandes disponibles :

```bash
npm run test:app         # sans nodemon (recommandé)
npm run test:app:watch   # avec nodemon (développement)
```

👉 Collection Postman :  [docs-dev/tests/assets/collection-e2e-local.json](./docs-dev/tests/assets/collection-e2e-local.json)

👉 Détails complets : [docs-dev/tests/03-niveau-3-e2e.md](./docs-dev/tests/03-niveau-3-e2e.md)

---

## 📌 Technologies utilisées

- Node.js / Express  
- MongoDB / Mongoose  
- JWT / bcrypt  
- Helmet (sécurisation des headers HTTP)
- Mocha / Chai / Sinon / Supertest  
- JSDoc  
- Alwaysdata (hébergement)  
- GitHub Actions (CI/CD)  

---

## 🧭 Roadmap

- [x] Phase 1 — Préparation du projet  
- [x] Phase 2 — Authentification  
- [ ] Phase 3 — Modèles & données  
- [ ] Phase 4 — Catways  
- [ ] Phase 5 — Reservations  
- [ ] Phase 6 — Front-end  
- [ ] Phase 7 — Tests  
- [ ] Phase 8 — Documentation API  
- [ ] Phase 9 — Déploiement final  

> Le projet est suivant dans un kanban [CEF-API_Port-Plaisance-Russell](https://github.com/users/MonLucCo/projects/10/views/2)

---

## 📄 Licence

Distribué sous la licence **MIT**.

---

## 👤 Auteur

Projet réalisé par **Luc PERARD**, dans le cadre du **Centre Européen de Formation**.

---
