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
  ├── app.js                ← Configuration Express (middlewares, routes, erreurs)
  ├── server.js             ← Lancement du serveur
  │
  ├── models/               ← Modèles Mongoose
  ├── controllers/          ← Contrôleurs Express (logique métier)
  │   └── authController.js ← Contrôleur d’authentification (register, login, deleteUser)
  ├── middlewares/          ← Middlewares (auth, validation, sécurité)
  │     └── authMiddleware.js ← Middleware JWT (issue‑16), vérification du token et protection des routes
  ├── services/             ← Logique métier réutilisable
  └── routes/               ← Définition des routes Express
      ├── accueilRoutes.js  ← Route d’accueil (GET /)
      └── authRoutes.js     ← Routes d’authentification (POST /register, /login, DELETE /delete/:id)

config/                     ← Configuration globale (JWT, paramètres transversaux)

public/                     ← Front-end minimal

tests/                      ← Tests Mocha/Chai/Supertest
  │
  ├── controllers/          ← Tests unitaires (niveau‑1) des contrôleurs via Mocha + Chai + Sinon
  ├── middlewares/          ← Tests unitaires (niveau‑1) des middlewares (issue‑16)
  ├── integration/          ← Tests d’intégration (niveau‑2) via Supertest + MongoMemoryServer
  ├── e2e/                  ← Tests E2E (niveau‑3) réalisés via Postman (issue‑17)
  └── mocks/                ← Mocks/stubs isolant les dépendances (ex : modèle User)
      ├── tests.mock.js     ← Helpers transverses (mockResponse, mockNext, afterEachRestore)
      ├── jwt.mock.js       ← Stubs JWT (verify, sign)
      └── user.mock.js      ← Mocks/stubs du modèle User

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
  ├── deploiement/             ← Procédures de déploiement, validation, scripts associés
  └── tests/                   ← Documentation par niveau : unitaires (01), intégration (02), E2E (03)

```

Les dossiers `models/`, `controllers/`, `middlewares/`, `services/` et `routes/` sont créés dès l’initialisation pour refléter l’architecture prévue.  
Les autres dossiers apparaissent au fur et à mesure des phases fonctionnelles.
  
Les mécanismes de sécurité (JWT, hashage, bonnes pratiques Express/MongoDB) sont détaillés dans  
[`docs-dev/securite.md`](./securite.md).

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

(sera complété avec les issues lors de l'engagement de la phase)

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
- `email` : requis, unique, format valide, trim, lowercase  
- `password` : requis (validation de complexité dans le contrôleur)  
- timestamps automatiques

**Emplacement :** `src/models/user.js`

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

Ces tests constituent le [niveau‑1 (unitaire)](./tests/01-niveau-1-unitaires.md) de la [stratégie globale de tests](./tests-strategy.md).

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

#### 2.1.7 Issue 17 — Tests Postman & validation

- tests manuels via Postman  
- scénarios d’inscription, connexion, suppression  
- tests des routes protégées  
- captures d’écran  
- mise à jour de la documentation  
- vérification sur Alwaysdata  

---

### 2.2 Phase 3 — Modèles & données

(sera complété avec les issues correspondantes)

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
