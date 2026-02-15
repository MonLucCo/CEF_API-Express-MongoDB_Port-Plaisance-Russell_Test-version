# Architecture du projet

**En préambule** : cette version initiale du document présente la situation d'architecture du dépôt pour ce projet. Il fait des hypothèses quant à la mise en œuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

Ce document décrit l’architecture technique de l’API REST Port de Plaisance Russell.

---

## 1. Fondements de l’architecture

Cette section présente les principes directeurs, la structure technique du projet et l’organisation fonctionnelle progressive (Phases 2 à 8).  
Elle constitue la base de l’architecture logicielle de l’API Port de Plaisance Russell.

---

### 1.1. Principes d’architecture

L’API repose sur plusieurs principes structurants :

- **Architecture modulaire** : chaque dossier a une responsabilité claire.  
- **Séparation stricte des rôles** : modèles, contrôleurs, middlewares, services et routes sont isolés.  
- **Évolutivité** : l’architecture est conçue pour accueillir progressivement les fonctionnalités.  
- **Documentation continue** : chaque étape enrichit la documentation interne (`docs-dev/`).  
- **Approche architecture‑first** : la structure est définie avant l’implémentation complète.  
- **Intégration progressive** : les fonctionnalités sont ajoutées par phases successives (issues 2 à 8).  

---

### 1.2. Structure technique du projet

L’arborescence du projet suit les bonnes pratiques Express/Mongoose :

```text
src/                        ← Dossier principal du code de l'API
  ├── app.js                    ← Configuration Express (middlewares, routes, erreurs)
  ├── server.js                 ← Lancement du serveur
  │
  ├── db/                       ← Base de données
  │   └── mongo.js                  ← Module de connexion MongoDB (issue‑20B)
  │
  ├── models/                   ← Modèles Mongoose
  │   ├── user.js                   ← Modèle User (issue‑11)
  │   ├── catway.js                 ← Modèle Catway (issue‑18)
  │   └── reservation.js            ← Modèle Reservation (issue‑19)
  │
  ├── controllers/              ← Contrôleurs Express (logique métier)
  │   └── authController.js         ← Contrôleur d’authentification (register, login, deleteUser)
  ├── middlewares/              ← Middlewares (auth, validation, sécurité)
  │   └── authMiddleware.js         ← Middleware JWT (issue‑16), vérification du token et protection des routes
  ├── services/                 ← Logique métier réutilisable
  └── routes/                   ← Définition des routes Express
      ├── accueilRoutes.js          ← Route d’accueil (GET /)
      └── authRoutes.js             ← Routes d’authentification (POST /register, /login, DELETE /delete/:id)

scripts/
  └── import-data.js               ← Script d’import JSON → MongoDB (issue‑20B)

data/                           ← Données du projet
  ├── users.json                   ← Données initiales des Utilisateurs
  ├── catways.json                 ← Données initiales des Catways (données fournies)
  └── reservations.json            ← Données initiales des Réservations (données fournies)

config/                     ← Configuration globale (JWT, paramètres transversaux)
  ├── jwt.js                    ← Configuration JWT
  └── dev/                      ← Configuration locale de développement
      └── nodemon.json              ← Configuration nodemon (issue‑17)

public/                         ← Front-end minimal

tests/                      ← Tests Mocha/Chai/Supertest
  ├── test-app.js               ← Serveur Express dédié aux tests E2E simulés (issue‑17)
  │
  ├── controllers/              ← Tests unitaires (niveau‑1) des contrôleurs via Mocha + Chai + Sinon
  ├── middlewares/              ← Tests unitaires (niveau‑1) des middlewares (issue‑16)
  ├── integration/              ← Tests d’intégration (niveau‑2) via Supertest + MongoMemoryServer
  ├── e2e/                      ← Tests E2E (niveau‑3) réalisés via Postman (issue‑17)
  ├── mocks/                    ← Mocks/stubs isolant les dépendances (ex : modèle User)
  │   ├── tests.mock.js             ← Helpers transverses (mockResponse, mockNext, afterEachRestore)
  │   ├── jwt.mock.js               ← Stubs JWT (verify, sign)
  │   └── user.mock.js              ← Mocks/stubs du modèle User
  └── modeles/                  ← Tests des modèles (Catway, Reference, User) 
      ├── catway.unitaires.test.js          ← Tests unitaires (niveau-1) de Catway
      ├── catway.integration.test.js        ← Tests d'intégration (niveau-2) de Catway
      ├── reservation.unitaires.test.js     ← tests unitaires (niveau-1) de Reservation 
      ├── reservation.integration.test.js   ← tests d'intégration (niveau-2) de Reservation 
      ├── user.unitaires.test.js            ← tests unitaires (niveau-1) de User 
      └── user.integration.test.js          ← tests d'intégration (niveau-2) de User 

docs/                       ← Documentation JSDoc générée

docs-dev/                   ← Documentation interne versionnée
  │
  ├── architecture.md          ← Description complète de l’architecture logicielle et technique
  ├── conventions.md           ← Conventions de développement (code, dossiers, nommage, JSDoc)
  ├── workflow-git.md          ← Workflow Git détaillé (branches, PR, milestones, bonnes pratiques)
  ├── securite.md              ← Politique de sécurité de l’API (JWT, bcrypt, Helmet, CORS, MongoDB)
  ├── tests-strategy.md        ← Stratégie de tests (unitaires, intégration, E2E) et organisation du dossier tests/
  ├── decisions-techniques.md  ← Journal des décisions techniques (ADR simplifié)
  │
  ├── hebergement/             ← Documentation Alwaysdata, configuration serveur, MongoDB Atlas
  │   └── import-donnees.md           ← Documentation import JSON (issue‑20B)
  │
  ├── deploiement/             ← Procédures de déploiement, validation, scripts associés
  │
  └── tests/                   ← Documentation des tests
      │
      ├── README_tests.md                      ← Vue d’ensemble des tests (Catégories et Niveaux)
      │
      ├── assets/                              ← Compléments pour les tests (images, collections Postman)
      │   └── collection-e2e-local.json             ← Collection Postman (issue‑17)
      ├── auth/                                ← Catégorie Authentification
      │   ├── auth-niveau-1-unitaires.md            ← Tests de niveau 1 - tests unitaires
      │   ├── auth-niveau-2-integration.md          ← Tests de niveau 2 - tests d'intégration
      │   └── auth-niveau-3-e2e.md                  ← Tests de niveau 1 - tests E2E
      └── modeles/                             ← Catégorie Modélisation
          ├── modeles-niveau-1-unitaires.md         ← Tests de niveau 1 - tests unitaires
          └── modeles-niveau-2-integration.md       ← Tests de niveau 2 - tests d'intégration

```

Les dossiers `models/`, `controllers/`, `middlewares/`, `services/` et `routes/` sont créés dès l’initialisation pour refléter l’architecture prévue.  
Les autres dossiers apparaissent au fur et à mesure des phases fonctionnelles.
  
Les mécanismes de sécurité (JWT, hashage, bonnes pratiques Express/MongoDB) sont détaillés dans  
[docs-dev/securite.md](./securite.md).

la stratégie complète des tests est détaillée dans [docs-dev/tests-strategy.md](./tests-strategy.md) et [docs-dev/tests/README_tests.md](./tests/README_tests.md).

---

### 1.3. Organisation fonctionnelle (Phases 2 à 8)

L’architecture est construite progressivement selon les phases fonctionnelles du projet :

#### 1.3.1 Phase 2 — Authentification

- Issue 11 : Modèle User  
- Issue 12 : Contrôleur d’authentification (sans sécurité)  
- Issue 13 : Routes d’authentification  
- Issue 14 : Hashage du mot de passe (bcrypt)  
- Issue 15 : Génération du JWT  
- Issue 16 : Middleware JWT + routes protégées  
- Issue 17 : Tests Postman & validation  

#### 1.3.2 Phase 3 — Modèles & données

- Issue 18 : Modèle catway
- Issue 19 : Modèle réservation
- Issue 20 : Cohérence des modèles et import des données JSON dans MongoDB
- Issue 21 : Configuration de MongoDB
- Issue 22 : Gestion des erreurs de connexion MongoDB

#### 1.3.3 Phase 4 — Catways

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.4 Phase 5 — Reservations

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.5 Phase 6 — Front-end minimal

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.6 Phase 7 — Tests unitaires

(sera complété avec les issues lors de l'engagement de la phase)

#### 1.3.7 Phase 8 — Documentation API

(sera complété avec les issues lors de l'engagement de la phase)

---

## 2. Architecture fonctionnelle (Phases 2 à 8)

Cette section décrit l’architecture technique selon les phases fonctionnelles du projet.  
Les phases 1, 9 et 10 ne sont pas détaillées ici car elles concernent respectivement la préparation, le déploiement final et la validation, et ne modifient pas directement l’architecture interne.

---

### 2.1 Phase 2 — Authentification

#### 2.1.1 Issue 11 — Modèle User

Représente un utilisateur de la capitainerie.  
Utilisé pour l’inscription, la connexion, la gestion des comptes et la protection des routes.

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
- `email` : requis, **unique**, format valide, trim, lowercase  
- `password` : requis (validation de complexité dans le contrôleur)  
- timestamps automatiques

**Emplacement :** `src/models/user.js`

> **Note — évolution du modèle User (issue‑20A)**  
> Le modèle User a été mis à jour dans l’issue‑20A afin de supprimer la normalisation automatique `lowercase: true` sur le champ `email`.  
> Cette modification garantit que l’email est stocké tel que fourni par l’utilisateur, conformément aux exigences de cohérence des données et à l’unicité stricte.  
> Voir la section [2.2.3.1 — Issue‑20A : Cohérence des modèles](#2231-issue-20a---cohérence-des-modèles) pour la version finale du modèle.

---

#### 2.1.2 Issue 12 — Contrôleur d’authentification (évolutions issues 14 à 17)

Le contrôleur `authController.js` gère les opérations de base sur le modèle `User` :

- `register` : création d’un utilisateur  
- `login` : recherche d’un utilisateur par email  
- `deleteUser` : suppression d’un utilisateur par ID  

La version initiale est établit dans l'issue-12 et ne comportait aucune sécurité  :

- pas de hashage  
- pas de vérification du mot de passe  
- pas de jeton JWT  

les évolutions successives sont introduites dans les issues 14 à 17 :

- **Issue 14** : haschage du mot de passe dans la couche métier
- **Issue 15** : génération du token JWT via `jsonwebtoken`
- **Issue 16** : protection de la route DELETE via le middleware JWT
- **Issue 17** :
  - gestion explicite de l'erreur MongoDB `E11000` (email déjà utilisé)
  - ajout d'un contrôle `mongoose.Types.ObjectId.isValid()`pour éviter les CastError
  - mise à jour des tests unitaires et d'intégration

**Emplacement :** `src/controllers/authController.js`
**version actuelle :** 0.4.0

> **Description fonctionnelle actuelle :**
>
> Le contrôleur `authController.js` gère les opérations d’authentification :
>
> - `register` : création d’un utilisateur avec hashage bcrypt
> - `login` : vérification du mot de passe et génération d’un token JWT
> - `deleteUser` : suppression d’un utilisateur par ID avec vérification préalable de l’ObjectId

---

#### 2.1.3 Issue 13 — Routes d’authentification

La mise en place des routes conduit à établir un module dédié pour respecter la séparation des responsabilités.  
La route d'accueil fait l'objet d'une reprise pour établir un module spécifique à cette route (`accueilRoutes.js`).
  
##### 2.1.3.1 Route d’accueil (GET /)

La route d’accueil fournit une page HTML décrivant l’état de l’API (origine Phase 1).

Endpoint :

- `GET /`

**Emplacement :** `src/routes/accueilRoutes.js`

---

##### 2.1.3.2 Routes d’authentification

Définition des routes Express :

- `POST /auth/register`  
- `POST /auth/login`  
- `DELETE /auth/delete/:id`  

Ces routes appellent les fonctions du contrôleur (issue 12).  
Aucune sécurité appliquée à ce stade.

**Emplacement :** `src/routes/authRoutes.js`

---

##### 2.1.3.3 Tests de validation architecturale

Avant de poursuivre avec les issues 14 à 16 (sécurisation), une vérification technique minimale a été réalisée afin de valider le câblage Express et la cohérence de l’architecture.

Tests effectués via Postman :

- **GET /**  
  → statut 200, page HTML conforme, headers X‑API présents  
- **POST /auth/register**  
  → statut 500 attendu (absence de base), contrôleur correctement appelé  
- **POST /auth/login**  
  → statut 500 attendu, contrôleur correctement appelé  
- **DELETE /auth/delete/:id**  
  → erreur Mongoose “Cast to ObjectId failed” attendue, route fonctionnelle  

Ces tests confirment :

- la bonne intégration des modules `accueilRoutes.js` et `authRoutes.js`  
- la bonne réception du body JSON (middleware ajouté dans `app.js`)  
- l’absence d’erreurs de syntaxe ou de câblage  
- la stabilité du serveur avant l’ajout de la sécurité  

Cette validation clôture techniquement l’issue 13.

---

#### 2.1.4 — Issue 14 : Hashage du mot de passe (bcrypt)

Cette issue introduit la sécurisation du mot de passe en appliquant une séparation stricte des responsabilités entre :

- **la couche métier (contrôleur)**, responsable du hashage et de la logique d’authentification  
- **la couche donnée (modèle Mongoose)**, responsable de garantir la cohérence structurelle des données stockées  

L’objectif est d’empêcher qu’un mot de passe en clair puisse être enregistré dans la base, même en cas d’erreur humaine dans un contrôleur.  
Cette étape s’appuie sur l’architecture validée lors de l’issue 13 et prépare l’intégration du JWT (issue 15).

À l’issue de cette issue 14 :

- le hashage est effectué explicitement dans la couche métier  
- la couche donnée impose une validation structurelle empêchant tout mot de passe non hashé  
- la comparaison du mot de passe est factorisée via une méthode d’instance du modèle  
- l’architecture reste claire, robuste, testable et évolutive

---

##### 2.1.4.1 Hashage du mot de passe dans la couche métier

Le hashage est effectué **dans le contrôleur**, car il s’agit d’une **règle métier** :

- un utilisateur ne peut être créé qu’avec un mot de passe sécurisé  
- la logique métier doit rester explicite et contrôlée  
- le contrôleur reste responsable des statuts HTTP et des messages d’erreur  

Extrait du contrôleur :

```js
const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    name,
    email,
    password: hashedPassword
});
```

En cas d’erreur de validation (mot de passe non hashé), le contrôleur renvoie un **400 Bad Request** :

```js
if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
}
```

---

##### 2.1.4.2 Validation structurelle dans la couche donnée

Le modèle impose une règle structurelle :

> **Le champ `password` doit obligatoirement contenir un hash bcrypt valide.**

Cette validation empêche toute insertion d’un mot de passe en clair dans la base, même si un développeur oublie de hasher dans un contrôleur.

```js
userSchema.path('password').validate(function (value) {
    return typeof value === 'string' && value.startsWith('$2b$');
}, 'Le mot de passe doit être un hash bcrypt.');
```

Cette validation :

- protège la cohérence de la donnée  
- ne mélange pas logique métier et logique donnée  
- constitue une barrière de sécurité structurelle  
- renvoie une `ValidationError` capturable dans le contrôleur  

---

##### 2.1.4.3 Méthode d’instance : comparaison du mot de passe

Pour factoriser la comparaison du mot de passe sans introduire de logique métier dans le modèle, une **méthode d’instance** est ajoutée :

```js
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
```

Utilisée dans le contrôleur `login` :

```js
const isValid = await user.comparePassword(password);
```

Cette approche :

- garde le contrôleur lisible  
- évite la duplication  
- ne mélange pas les responsabilités  

---

##### 2.1.4.4 Tests Postman (sans base de données)

Même sans MongoDB, les tests permettent de valider :

###### ✔ `POST /auth/register`

- bcrypt est exécuté  
- la validation structurelle fonctionne  
- aucune erreur interne  

###### ✔ `POST /auth/login`

- la méthode `comparePassword` est appelée  
- la logique métier est correcte  

###### ✔ `DELETE /auth/delete/:id`

- inchangé par rapport à l’issue‑13  

---

##### 2.1.4.5 Mise à jour du modèle (JSDoc)

Le modèle `User` évolue en version **1.1.0** afin de refléter les nouvelles responsabilités introduites dans cette issue.

Évolutions documentées dans la JSDoc du modèle :

- ajout d’une **validation structurelle** garantissant que le champ `password` contient un hash bcrypt valide  
- ajout d’une **méthode d’instance** `comparePassword(password)` permettant de comparer un mot de passe en clair avec le hash stocké  
- clarification du rôle du modèle dans la **protection de la cohérence des données**, sans prise en charge de la logique métier  

Cette mise à jour documentaire assure la traçabilité des évolutions du modèle et renforce la lisibilité de l’architecture pour les futurs développements.

---

#### 2.1.5 Issue 15 — Génération du JWT

Cette issue introduit la génération d’un **JSON Web Token (JWT)** lors de la connexion d’un utilisateur.  
Elle constitue la première étape de la mise en place d’une authentification basée sur un jeton signé, permettant au client d’accéder ultérieurement à des routes protégées (issue‑16).

L’objectif est de fournir un mécanisme d’identification **stateless**, indépendant de la session serveur.

Cette issue :

- se concentre sur la **production** du token, afin de maintenir une séparation claire des responsabilités et une progression maîtrisée de l’architecture.
- prépare l’introduction :
  - d’un **middleware d’authentification** chargé de vérifier le token  
  - de **routes protégées** nécessitant un token valide  
  - de la propagation de l’identité utilisateur via `req.userId`
- introduit les tests unitaires de **niveau-1** du contrôleur d'authentification `authController.js` qui :
  - utilisent **Mocha**, **Chai** et **Sinon**
  - ne nécessitent aucune base de données
  - valident les scénario métier

---

##### 2.1.5.1 Décision architecturale

- Le token JWT est **généré dans la couche métier**, au sein du contrôleur `login`.  
- Le modèle `User` **n’est pas modifié** : aucune logique JWT n’est introduite dans la couche donnée.  
- La configuration JWT (clé secrète, durée d’expiration) est **centralisée** dans un module dédié.  
- Le token contient uniquement l’identifiant utilisateur (`userId`), conformément au principe de **minimisation des données**.  
- Le token n’est **pas encore vérifié** dans cette issue : la vérification et la protection des routes seront traitées dans l’issue‑16.

---

##### 2.1.5.2 Responsabilités des couches

###### Couche métier (contrôleur `login`)

- Vérifie les identifiants (email + mot de passe).  
- Génère un JWT signé en cas de succès.  
- Retourne le token au client dans la réponse HTTP.  
- Ne stocke pas le token : l’API reste stateless.

###### Couche donnée (modèle Mongoose)

- Inchangée par rapport à l’issue‑14.  
- Continue d’assurer la cohérence structurelle (mot de passe hashé).  
- Ne participe pas à la génération du token.

###### Couche configuration

- Centralise la clé secrète et la durée d’expiration.  
- Permet une modification simple et sécurisée des paramètres JWT.

---

##### 2.1.5.3 Flux d’authentification (issue‑15)

1. Le client envoie email + mot de passe au point d’entrée `/auth/login`.  
2. Le contrôleur vérifie l’existence de l’utilisateur.  
3. Le contrôleur vérifie le mot de passe via la méthode d’instance `comparePassword`.  
4. Si les identifiants sont valides, le contrôleur génère un JWT signé.  
5. Le token est renvoyé au client dans la réponse HTTP.  
6. Le client pourra utiliser ce token dans les futures requêtes protégées (issue‑16).

Ce flux reste **stateless** : aucune session n’est conservée côté serveur.

---

##### 2.1.5.4 Contraintes et règles de sécurité

- Le secret JWT doit être stocké **hors du code source**, dans une variable d’environnement.  
- Le token doit avoir une **durée d’expiration** définie (ex. 24h).  
- Le contenu du token doit être **minimal** : uniquement l’identifiant utilisateur.  
- Aucun mot de passe, rôle, email ou donnée sensible ne doit être inclus dans le token.  
- Le token doit être signé avec un algorithme standard (HS256).

---

##### 2.1.5.5 Impacts sur l’architecture

- Le contrôleur `login` devient la **seule source de tokens valides**.  
- L’API est désormais capable de fournir une identité portable au client.  
- La base de données reste indépendante du mécanisme JWT.  
- L’issue‑15 prépare directement l’issue‑16, qui introduira un middleware de vérification du token.

---

##### 2.1.5.6 Tests unitaires (niveau-1) - Génération JWT - Issue 15

Les tests unitaires du contrôleur d’authentification (authController.js) :

- utilisent **Mocha**, **Chai** et **Sinon**
- isolent totalement la logique métier
- remplacent les dépendances (ex : `User.findOne`, `comparePassword`, `jwt.sign`) par des **stubs**
- ne nécessitent **aucune base de données**
- valident les scénarios métier :
  - champs manquants
  - utilisateur inexistant
  - mot de passe incorrect
  - génération du token JWT
  - gestion des erreurs internes

Ces tests d'authentification constituent le [niveau‑1 (unitaire)](./tests/auth/auth-niveau-1-unitaires.md) de la [stratégie globale de tests](./tests-strategy.md).

---

#### 2.1.6 Issue 16 — Middleware JWT et routes protégées

##### 2.1.6.1 Intégration du Middleware JWT et de la protection des routes

Cette issue introduit le middleware d’authentification JWT, chargé de vérifier la validité du token transmis par le client.  
Il constitue la première étape de la sécurisation des routes sensibles de l’API.

**Responsabilités du middleware :**

- extraction du token depuis l’en-tête `Authorization: Bearer <token>`
- vérification du token via `jwt.verify`
- gestion des erreurs (token manquant, invalide, expiré)
- ajout de `req.userId` pour les routes protégées
- transmission au contrôleur via `next()` si le token est valide

**Routes protégées :**

À ce stade du projet, seule la route suivante est protégée :

- `DELETE /auth/delete/:id`

Les autres routes sensibles (Catways, Reservations) seront protégées lors des phases ultérieures.

**Emplacement :** `src/middlewares/authMiddleware.js`

**Références sécurité :**

Les principes de sécurité liés à l’authentification, au JWT, à la gestion des erreurs et aux bonnes pratiques Express/MongoDB sont détaillés dans  
[`docs-dev/securite.md`](../securite.md).

---

##### 2.1.6.2 Tests unitaires (niveau-1) - Middleware JWT - Issue 16

Le middleware `authMiddleware.js` est testé de manière isolée.  
Les dépendances externes (`jwt.verify`) sont stubées via Sinon.

Cas testés :

- token manquant → 401  
- token invalide → 401  
- token expiré → 401  
- token valide → next() et `req.userId` défini  
- erreur interne → 500  

Ces tests garantissent la robustesse du mécanisme d’authentification avant l’intégration des routes protégées (issues Phase 4 et 5).

---

#### 2.1.7 Issue 17 — Tests E2E (niveau‑3 simulé, environnement local)

Cette issue introduit les tests E2E simulés, réalisés en environnement local via Postman.  
Ils permettent de valider le cycle complet d’un utilisateur sans mocks ni stubs, en utilisant la base MongoDB en mémoire (MongoMemoryServer).

##### 2.1.7.1 Logique des tests E2E simulés

Les [tests d'authentification E2E locaux](./tests/auth/auth-niveau-3-e2e.md#issue17--validation-initiale-de-lapi---tests-e2e-simulés) complètent :

- les tests unitaires (niveau‑1)  
- les tests d’intégration (niveau‑2)  

Scénarios testés :

- inscription  
- connexion  
- suppression  
- gestion du token JWT (routes protégées)
- cohérence des statuts HTTP  

Les tests E2E réels (API déployée + MongoDB Atlas) seront réalisés dans l’issue‑22.

##### 2.1.7.2 Environnement de tests E2E simulés (issue‑17)

Un serveur Express dédié aux tests (`tests/test-app.js`) est introduit pour exécuter les tests E2E simulés via Postman.

Les documents [tests-strategy](./tests-strategy.md#niveau3--tests-e2e) et [auth-niveau-3-e2e](./tests/auth/auth-niveau-3-e2e.md#1-tests-e2e-simulés-issue17) fournissent les précisions sur les modalités et le fonctionnement de ces tests E2E simulés.

Le document [decisions-techniques](./decisions-techniques.md#tests-e2e-simulés) introduit la décision prise lors de l'issue-17 pour faciliter les tests E2E en conditions simulées.

Cet environnement utilise :

- une base MongoDB en mémoire (MongoMemoryServer)
- un cycle de vie contrôlé (start/stop)
- un serveur isolé de `src/server.js`
- des scripts CLI dédiés (`npm run test:app`, `npm run test:app:watch`)

Cet environnement permet de valider l’API sans dépendre de MongoDB Atlas ni du serveur déployé.

---

### 2.2 Phase 3 — Modèles & données

#### 2.2.1 Issue‑18 — Modèle Catway

##### 2.2.1.1 Description technique

Cette issue introduit le modèle `Catway`, représentant les catways du port de plaisance Russell.
Le schéma définit trois champs : `catwayNumber` (unique), `type` (enum short/long) et `catwayState`.

> **Note :**
> La propriété `unique: true` sur `catwayNumber` génère automatiquement un index unique dans MongoDB.  
> Aucun `schema.index()` supplémentaire n’est nécessaire.

**Structure du document :**

```json
{
  "catwayNumber": "Number",
  "type": "String",
  "catwayState": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Règles principales :**

- `catwayNumber` : requis, **unique**, min[1]  
- `type` : requis, trim, enum['short','long'], lowercase  
- `catwayState` : requis, trim  
- timestamps automatiques

**Emplacement :** `src/models/catway.js`

---

##### 2.2.1.2 Tests associés

Ces tests garantissent que le modèle Catway est **structurellement correct**, **fonctionnel en base**, et prêt pour les routes Catways de la Phase 4.

###### 2.2.1.2.1 Niveau‑1 — Tests unitaires (validation du schéma)

- Aucun accès à MongoDB  
- Utilisation de `validate()`  
- Vérification des règles : required, enum, min, trim, lowercase  
- Tests rapides et isolés

Documentation : [docs-dev/tests/modeles/modeles-niveau-1-unitaires.md](./tests/modeles/modeles-niveau-1-unitaires.md)

---

###### 2.2.1.2.2 Niveau‑2 — Tests d’intégration (MongoMemoryServer)

- Base MongoDB en mémoire  
- Tests réels : `save()`, `find()`, `delete()`  
- Vérification de l’unicité (`E11000`)  
- Vérification des timestamps  
- Validation complète en conditions réelles

Documentation : [docs-dev/tests/modeles/modeles-niveau-2-integration.md](./tests/modeles/modeles-niveau-2-integration.md)

---

#### 2.2.2 Issue‑19 — Modèle Reservation

##### 2.2.2.1 Description technique

Cette issue introduit le modèle `Reservation`, représentant les réservations effectuées sur les catways du port de plaisance Russell.

Le schéma définit cinq champs :  
`catwayNumber`, `clientName`, `boatName`, `checkIn`, `checkOut`.

> **Note - contraintes de date de `checkIn` :**  
>> Le modèle Reservation ne contient volontairement aucune contrainte métier sur les dates (ex : checkIn ≥ aujourd’hui).  
>> Ces règles seront gérées dans les contrôleurs lors de la Phase 5 (fonctionnalités Reservations).
>
> **Note - relation Catway ↔ Reservation** :
>> Le modèle Reservation ne contient pas de référence Mongoose (`ref`) vers le modèle Catway.
>> Cette décision respecte strictement les fichiers de données fournis dans le sujet du devoir, qui utilisent un champ numérique `catwayNumber` plutôt qu’un identifiant MongoDB.
>> La cohérence entre les deux modèles sera assurée dans les contrôleurs lors de la Phase 5 (vérification que le catway existe avant de créer une réservation).

**Structure du document :**

```json
{
  "catwayNumber": "Number",
  "clientName": "String",
  "boatName": "String",
  "checkIn": "Date",
  "checkOut": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Règles principales :**

- `catwayNumber` : requis, min[1]  
- `clientName` : requis, trim  
- `boatName` : requis, trim  
- `checkIn` : requis, type Date  
- `checkOut` : requis, type Date  
- timestamps automatiques

**Emplacement :** `src/models/reservation.js`

---

##### 2.2.2.2 Tests associés

Les tests garantissent que le modèle Reservation est **structurellement correct**, **fonctionnel en base**, et prêt pour les routes de réservation de la Phase 5.

###### Niveau‑1 — Tests unitaires (validation du schéma)

- aucun accès à MongoDB  
- utilisation de `validate()`  
- vérification des règles : required, min, trim, type Date  
- tests rapides et isolés

Documentation : [docs-dev/tests/modeles/modeles-niveau-1-unitaires.md](./tests/modeles/modeles-niveau-1-unitaires.md)

---

###### Niveau‑2 — Tests d’intégration (MongoMemoryServer)

- base MongoDB en mémoire
- tests réels : `save()`, `find()`, `delete()`
- validation complète du schéma en conditions réelles
- cohérence des dates (`checkOut > checkIn`)
- vérification des timestamps

Documentation : [ocs-dev/tests/modeles/modeles-niveau-2-integration.md](./tests/modeles/modeles-niveau-2-integration.md)

---

#### 2.2.3 Issue-20 - Modèles cohérents et import des données dans MongoDB

L'issue-20 se compose de 2 sous-issues qui permettent :

- Issue-20A : cohérence des modèles User, Catway et Reservation
- Issue-20B : import des données JSON dans MongoDB

##### 2.2.3.1 Issue-20A - Cohérence des modèles

Cette issue assure la cohérence complète des modèles User, Catway et Reservation.

**Modifications du modèle User :**

- suppression de la normalisation `lowercase: true` sur le champ `email`
- mise à jour de la JSDoc (version 1.2.0)
- harmonisation des validations structurelles
- mise à jour des tests unitaires et d’intégration associés

Ces modifications garantissent que l’email est stocké tel que fourni par l’utilisateur, sans transformation automatique, tout en conservant l’unicité stricte et la validation du format.

---

##### 2.2.3.2 Issue‑20B — Import des données JSON & connexion MongoDB

Cette issue complète la Phase 3 en introduisant :

- un **script d’import des données JSON** dans MongoDB  
- un **module centralisé de connexion MongoDB**  
- une **documentation dédiée au processus d’import**  
- une **commande CLI** pour exécuter l’import  
- la mise en place de la base de données dans MongoDB Atlas

---

###### 2.2.3.2.1 Script d’import des données (`scripts/import-data.js`)**

Un script dédié permet d’importer les données initiales du projet :

- `data/users.json`  
- `data/catways.json`  
- `data/reservations.json`

Fonctionnalités :

- chargement des variables d’environnement  
- connexion MongoDB via le module `src/db/mongo.js`  
- suppression des collections existantes  
- insertion des données JSON  
- déconnexion propre  
- logs structurés

Ce script est utilisé pour initialiser ou réinitialiser la base de données du projet.

---

###### 2.2.3.2.2 Module de connexion MongoDB (`src/db/mongo.js`)

Un module dédié centralise la gestion de la connexion MongoDB.

Fonctionnalités :

- `initClientDBConnection()` : connexion à MongoDB via Mongoose  
- `disconnectClientDB()` : déconnexion propre  
- gestion des erreurs  
- chargement du nom de base via `DBNAME`  
- utilisé par :
  - `src/server.js` (API)
  - `scripts/import-data.js` (import JSON)
  - les tests d’intégration réels (issue‑22)

Ce module garantit une architecture propre, maintenable et prête pour Alwaysdata.

---

###### 2.2.3.2.3 Documentation associée (`docs-dev/deploiement/import-donnees.md`)

Une documentation dédiée décrit :

- la création de la base dans MongoDB Atlas  
- la structure des fichiers JSON  
- l’utilisation du script d’import  
- les prérequis (`MONGODB_URI`, `DBNAME`)  
- les effets du script (réinitialisation complète des collections)

---

###### 2.2.3.2.4 Commande CLI

Une commande NPM permet d’exécuter l’import :

```json
"scripts": {
  "import:data": "node scripts/import-data.js"
}
```

---

###### 2.2.3.2.5 Notes importantes**

- Le script **réinitialise entièrement la base de données** (suppression + réinsertion).  
- La base MongoDB Atlas doit être créée au préalable avec une collection placeholder.  
- Les collections réelles (`users`, `catways`, `reservations`) sont créées automatiquement par Mongoose.

---

#### 2.2.4 — Issue‑21 : Configuration MongoDB

Cette issue stabilise la configuration MongoDB de l’API et prépare la gestion des erreurs (issue‑22).  
Elle introduit un module dédié à la connexion (`src/db/mongo.js`) et met à jour le serveur (`src/server.js`) pour garantir que la base est connectée avant le lancement de l’API.

##### 2.2.4.1 Éléments introduits

- Module `src/db/mongo.js` :
  - connexion centralisée via `mongoose.connect()`
  - options Mongoose recommandées (Mongoose 7+ / 8+ / 9+)
  - gestion des événements : `connected`, `disconnected`, `error`
  - mode verbose activable via `DB_VERBOSE=true`
  - préparation de la gestion d’erreurs (issue‑22)

- Mise à jour de `src/server.js` :
  - introduction de la fonction `startServer()`
  - connexion MongoDB **avant** `expressApp.listen()`
  - JSDoc complète du point d’entrée API

- Mise à jour de `.env.example` :
  - `DBNAME="port-plaisance-russell"`
  - `DB_VERBOSE=false`

##### 2.2.4.2 Validation

La validation a été réalisée via Postman (collection `tests/assets/collection-e2e-local.json`) et MongoDB Atlas :

1. **Register** → création d’un utilisateur (statut 201)  
2. **Login** → génération d’un token JWT valide  
3. **Delete** → suppression de l’utilisateur (statut 200)  
4. Vérification dans MongoDB Atlas : documents créés puis supprimés

L’ensemble confirme l’intégration correcte du module `mongo.js` dans le serveur Express.

---

### 2.2.5 — Issue‑22 : Gestion des erreurs MongoDB (résilience)

Cette issue renforce la robustesse de l’API en introduisant une gestion complète des erreurs liées à MongoDB et au serveur Express.  
Elle s’appuie sur le module `mongo.js` introduit dans les issues 20B et 21, et ajoute une couche de résilience indispensable pour la Phase 4.

#### 🔧 Évolutions techniques

- **Normalisation des erreurs MongoDB**  
  Le module `mongo.js` analyse les messages d’erreur renvoyés par Mongoose/MongoDB et les convertit en codes internes cohérents :  
  - `MONGO_DNS_ERROR`  
  - `MONGO_CONNECTION_REFUSED`  
  - `MONGO_TIMEOUT`  
  - `MONGO_AUTH_FAILED`  
  - `MONGO_AUTH_NOT_ALLOWED`  
  - `MONGO_IP_NOT_WHITELISTED`  
  - `MONGO_CONNECTION_FAILED`  
  - `MONGO_URI_MISSING`

- **Gestion des erreurs critiques dans `server.js`**  
  Le serveur ne démarre plus si la connexion MongoDB échoue.  
  Les erreurs serveur (port déjà utilisé, permission refusée) sont également capturées.

- **Arrêt propre du serveur**  
  Gestion des signaux système :  
  - `SIGINT` (CTRL+C)  
  - `SIGTERM` (Alwaysdata, Docker, OS)  
  → Fermeture propre de la connexion MongoDB avant extinction du processus.

- **Événements Mongoose**  
  - `connected`  
  - `disconnected`  
  - `error`  
  Ces événements facilitent le debug et la surveillance.

#### 🔍 Résultats

- Le serveur démarre uniquement si MongoDB est accessible.  
- Les erreurs critiques sont normalisées et lisibles.  
- Le serveur s’arrête proprement dans tous les scénarios.  
- Le système est prêt pour les tests d’intégration réels (Atlas).

Cette issue clôture la Phase 3 en garantissant une base technique stable et résiliente pour les phases suivantes.

---

### 2.3 Phase 4 — Catways

(sera complété avec les issues correspondantes)

---

### 2.4 Phase 5 — Reservations

(sera complété avec les issues correspondantes)

---

### 2.5 Phase 6 — Front-end minimal

(sera complété avec les issues correspondantes)

---

### 2.6 Phase 7 — Tests unitaires

(sera complété avec les issues correspondantes)

---

### 2.7 Phase 8 — Documentation API

(sera complété avec les issues correspondantes)

---
