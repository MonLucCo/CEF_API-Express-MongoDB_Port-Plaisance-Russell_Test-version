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
src/
  ├── app.js                ← Configuration Express (middlewares, routes, erreurs)
  ├── server.js             ← Lancement du serveur
  │
  ├── models/               ← Modèles Mongoose
  ├── controllers/          ← Contrôleurs Express (logique métier)
  │   └── authController.js ← Contrôleur d’authentification (register, login, deleteUser)
  ├── middlewares/          ← Middlewares (auth, validation, sécurité)
  ├── services/             ← Logique métier réutilisable
  └── routes/               ← Définition des routes Express
      ├── accueilRoutes.js  ← Route d’accueil (GET /)
      └── authRoutes.js     ← Routes d’authentification (POST /register, /login, DELETE /delete/:id)

public/                     ← Front-end minimal
tests/                      ← Tests Mocha/Chai/Supertest
docs/                       ← Documentation JSDoc générée
docs-dev/                   ← Documentation interne versionnée
```

Les dossiers `models/`, `controllers/`, `middlewares/`, `services/` et `routes/` sont créés dès l’initialisation pour refléter l’architecture prévue.  
Les autres dossiers apparaissent au fur et à mesure des phases fonctionnelles.

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

#### 2.1.2 Issue 12 — Contrôleur d’authentification (sans sécurité)

Le contrôleur `authController.js` gère les opérations de base sur le modèle `User` :

- `register` : création d’un utilisateur  
- `login` : recherche d’un utilisateur par email  
- `deleteUser` : suppression d’un utilisateur par ID  

Aucune sécurité dans cette version :

- pas de hashage  
- pas de vérification du mot de passe  
- pas de jeton JWT  

**Emplacement :** `src/controllers/authController.js`

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

Intégration de **jsonwebtoken** :

- génération du token lors du login  
- signature avec `JWT_SECRET`  
- durée de validité  
- retour du token dans la réponse  

Mise à jour du contrôleur et de la documentation.

---

#### 2.1.6 Issue 16 — Middleware JWT et routes protégées

Création du middleware d’authentification :

- extraction du token  
- vérification du token  
- ajout de `req.userId`  
- protection des routes sensibles  

Mise à jour des routes Catways et Reservations.

**Emplacement :** `src/middlewares/authMiddleware.js`

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
