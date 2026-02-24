# Décisions techniques

**En préambule** : cette version initiale du document présente la situation des décisions retenues pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

> Les décisions non retenues seront retirées lors de la finalisation.

---

## 1. Express 5.x

Choix motivé par la stabilité et les améliorations de la version 5.

---

## 2. MongoDB Atlas

Base de données cloud simple à configurer.

### 2.1 Décision — Module de connexion MongoDB & script d’import (issue‑20B)

Pour garantir une architecture propre et centralisée, un module dédié à la connexion MongoDB a été introduit :

- `src/db/mongo.js` : connexion + déconnexion + gestion des erreurs + accès variables d'environnement

Un script d’import des données JSON a également été ajouté :

- `scripts/import-data.js`
- CLI : `npm run import:data`

**Motivations :**

- éviter la duplication de `mongoose.connect()` et les accès associés aux variables d'environnement
- préparer le déploiement Alwaysdata
- faciliter l’initialisation de la base MongoDB Atlas
- garantir la cohérence des données du projet

**Variables d'environnement :**

- **MONGO_URI** : accès au cluster de MongoDB avec ses données de compte (username, password, cluster)
- **DBNAME** : nom de la base de données

**Fonctions et limites du script d'import :**

- Limite : la base de données doit exister dans MongoDB avec une collection vide (nom de la collection : `placeholder`)
- Fonctions :
  - création (initialisation) ou réinitialisation des collections `users`, `catways` et `reservations`
  - import des données json pour chaque collection
  - suppression automatique de la collection `placeholder` si elle existe

---

### 2.2 Décision — Configuration MongoDB (issue‑21)

Afin de garantir une architecture stable, maintenable et testable, la connexion MongoDB a été extraite dans un module dédié : `src/db/mongo.js`.

#### 2.2.1 Motivations

- éviter la duplication de logique entre le serveur et les scripts (ex : import-data)
- centraliser la configuration Mongoose
- préparer la gestion d’erreurs MongoDB (issue‑22)
- garantir que l’API ne démarre pas sans base de données
- améliorer la lisibilité et la testabilité

#### 2.2.2 Choix techniques

- utilisation de `mongoose.connect()` (connexion globale)
- options recommandées :
  - `dbName`
  - `autoIndex`
  - `maxPoolSize`
  - `serverSelectionTimeoutMS`
  - `socketTimeoutMS`
- ajout d’un mode verbose (`DB_VERBOSE=true`)
- ajout des événements Mongoose : `connected`, `disconnected`, `error`
- mise à jour de `server.js` pour connecter MongoDB **avant** `listen()`

#### 2.2.3 Résultats attendus

Le serveur démarre uniquement si la connexion MongoDB est établie.  
Le module est utilisé aussi bien par l’API que par les scripts (import JSON).  
La base est prête pour la gestion d’erreurs avancée (issue‑22).

---

## 2.3 Décision — Gestion des erreurs MongoDB & résilience serveur (issue‑22)

Cette décision introduit une couche de résilience essentielle pour garantir la stabilité de l’API en conditions réelles.

### 2.3.1 Motivations

- éviter que le serveur démarre sans base de données fonctionnelle  
- fournir des erreurs cohérentes et normalisées  
- améliorer la lisibilité des logs  
- préparer les tests d’intégration réels (Atlas)  
- garantir un arrêt propre du serveur dans tous les scénarios

### 2.3.2 Choix techniques

- ajout d’une fonction `normalizeMongoError()` dans `mongo.js`  
- classification des erreurs MongoDB (DNS, timeout, auth, whitelist…)  
- propagation des erreurs normalisées vers `server.js`  
- gestion des erreurs serveur (`EADDRINUSE`, `EACCES`)  
- gestion des signaux système (`SIGINT`, `SIGTERM`)  
- arrêt propre via `disconnectClientDBConnection()`  
- logs structurés et explicites

### 2.3.3 Résultats attendus

- le serveur ne démarre plus si MongoDB est inaccessible  
- les erreurs sont compréhensibles et homogènes  
- la connexion MongoDB est toujours fermée proprement  
- le système est résilient face aux erreurs réseau, DNS, auth, timeout  
- la Phase 4 peut démarrer sur une base technique stable

---

## 3. Helmet

Sécurisation des headers HTTP.

---

## 4. Organisation du code

Séparation stricte modèles / contrôleurs / routes.

---

## 5. Environnement de développement

### 5.1 Tests E2E simulés

Décision : introduire un serveur Express dédié (`tests/test-app.js`) pour exécuter les tests E2E simulés via Postman.

Motivations :

- isoler l’environnement de test de l’environnement de production
- utiliser MongoMemoryServer pour éviter toute dépendance externe
- permettre un cycle complet register → login → delete
- garantir un environnement reproductible pour les tests manuels

### 5.2 Serveur local - Activation Nodemon

Décision : ajouter une configuration nodemon locale (`config/dev/nodemon.json`) pour faciliter le développement, sans impacter le déploiement.

---

## 6. Modélisation

### 6.1 Modèle Catway

- Le champ `catwayNumber` est unique et indexé car il constitue la clé fonctionnelle principale.
- Le champ `type` utilise une validation `enum` pour garantir la cohérence des données.
- Le champ `catwayState` est trimé pour éviter les espaces parasites.
- Le champ `__v` est supprimé (`versionKey: false`) pour garder des documents propres.
- Les timestamps sont activés pour assurer la traçabilité.

---

### 6.2 Identifiant `/:id` des URLs

Afin d’offrir une API plus naturelle pour les utilisateurs humains tout en conservant la robustesse de MongoDB, l’API adopte un mécanisme d’identification hybride pour les routes Catways.  

L'identifiant de l'URL de l'API est construit à partir de l'identifiant MongoDB (`Catway._id`), ainsi qu'à partir de l'identifiant métier des Catways (`Catway.catwayNumber`).  

La mise en place de cet identifiant est progressive et se réalise dans l'issue-26 par étape.
Cette démarche permettra à l'API de disposer d'une identification hybride avec une logique priorisée (identifiant MongoDB, puis identifiant métier).

#### 6.2.1 GET /catways/:id basé uniquement sur l’identifiant MongoDB (issue‑26, étape 1)

Cette première étape de l’issue‑26 introduit la récupération d’un catway via l’URL :

```txt
GET /catways/:id
```

Elle repose exclusivement sur l’identifiant interne MongoDB (`_id`).

##### 6.2.1.1 Objectif (identifiant MongoDB standard)

Mettre en place une version minimale, stable et testée de la route, en utilisant **exclusivement l’identifiant interne MongoDB (`_id`)** :

- fournir une base fonctionnelle simple
- valider le contrôleur, les routes et les tests
- éviter toute complexité prématurée
- préparer l'introduction de l'identifiant hybride dans l'étape suivante

##### 6.2.1.2 Choix techniques (identifiant MongoDB standard)

- validation de l’identifiant via `mongoose.Types.ObjectId.isValid()`  
- recherche du document via `Catway.findById()`  
- gestion des statuts HTTP :
  - **400** : identifiant invalide  
  - **404** : catway introuvable  
  - **500** : erreur interne  

##### 6.2.1.3 Motivations (identifiant MongoDB standard)

- établir une base fonctionnelle simple avant l’introduction de la logique hybride (ObjectId + catwayNumber)  
- garantir la stabilité des tests unitaires et d’intégration  
- éviter toute complexité prématurée dans le contrôleur  
- préparer l’évolution progressive de l’issue‑26 (étapes 2 et 3)

##### 6.2.1.4 Impacts (identifiant MongoDB standard)

- mise à jour du contrôleur `catwayController.js` (v0.2.0)  
- ajout des tests niveau‑1 et niveau‑2  
- aucune modification des middlewares à ce stade  
- aucune logique métier supplémentaire  

---

#### 6.2.2 GET /catways/:id basé sur l’identifiant hybride (_id + catwayNumber) (issue-26 - étape 2)

Cette étape introduit un mécanisme d’identification hybride pour les routes Catways, permettant d’utiliser :

- l’identifiant interne MongoDB (`_id`)  
- l’identifiant métier (`catwayNumber`)

##### 6.2.2.1 Motivations (identifiant hybride : MongoDB standard et métier catwayNumber)

- offrir une API plus intuitive pour les agents du port  
- conserver la compatibilité avec les systèmes internes  
- éviter la duplication de routes  
- permettre une évolution progressive et testée  
- maintenir la compatibilité avec les tests du commit‑1

##### 6.2.2.2 Choix techniques (identifiant hybride : MongoDB standard et métier catwayNumber)

- priorité stricte : **ObjectId > catwayNumber**  
- `findById()` utilisé pour les ObjectId  
- `findOne({ catwayNumber })` utilisé pour les identifiants métier  
- gestion des erreurs homogène (400 / 404 / 500)

##### 6.2.2.3 Impacts (identifiant hybride : MongoDB standard et métier catwayNumber)

- mise à jour du contrôleur (v0.3.0)  
- mise à jour des tests niveau‑1 et niveau‑2  
- aucune modification des routes  
- aucune modification des middlewares (introduits en étape 3)

> Le choix d’utiliser `findById` pour les `ObjectId` et `findOne` pour les **identifiants métier** permet d’éviter toute duplication de logique et garantit une évolution progressive du contrôleur.

---

#### 6.2.3 Décision — Middlewares Catways (issue‑26, étape 3)

##### 6.2.3.1 Motivations (architecture middlewares-controller)

L’introduction de l’identifiant hybride (_id + catwayNumber_) dans l’étape 2 a mis en évidence la nécessité de :

- centraliser la validation de l’identifiant `/:id`  
- éviter la duplication de logique dans les contrôleurs  
- préparer les futures opérations CRUD (issues 27 → 30)  
- simplifier la logique métier du contrôleur  
- renforcer la robustesse et la testabilité de l’API  

##### 6.2.3.2 Choix techniques (architecture middlewares-controller)

Deux middlewares dédiés sont introduits :

###### 6.2.3.2.1 `validateCatwayId`

- Vérifie que l’identifiant est soit un ObjectId valide, soit un nombre entier positif.  
- Retourne **400** si l’identifiant est invalide.  
- Ne réalise aucune opération en base.

###### 6.2.3.2.2 `resolveCatwayIdentifier`

- Résout l’identifiant hybride :  
  - ObjectId → `findById`  
  - catwayNumber → `findOne({ catwayNumber })`  
- Retourne **404** si aucun catway n’est trouvé.  
- Attache le catway trouvé à `req.catway`.  
- Retourne **500** en cas d’erreur interne.

##### 6.2.3.3 Impacts (architecture middlewares-controller)

- Le contrôleur `getCatwayById` devient minimaliste (v0.4.0).  
- Les middlewares sont testés isolément (niveau‑1).  
- Les routes Catways sont mises à jour pour intégrer les middlewares.  
- Les tests d’intégration (niveau‑2) valident désormais le pipeline complet :  
  `validateCatwayId → resolveCatwayIdentifier → getCatwayById`.

##### 6.2.3.4 Résultat (architecture middlewares-controller)

- Architecture plus claire et modulaire.  
- Contrôleurs allégés et centrés sur la logique métier.  
- Tests plus simples et plus robustes.  
- Préparation optimale pour les issues 27 → 30.

---

### 6.3 Validation métier du payload Catways (issue‑27)

#### 6.3.1 Motivations

L’introduction de la création d’un catway (POST /catways) nécessite une validation stricte des données métiers.  
Afin d’éviter la duplication de logique dans les contrôleurs et de préparer les futures opérations PUT et PATCH, la validation est centralisée dans un middleware dédié.

---

#### 6.3.2 Choix techniques

Deux middlewares sont introduits :

##### 6.3.2.1 validateCatwayPayload

- utilisé pour **POST** et **PUT**  
- valide les champs requis :
  - `catwayNumber` : entier positif  
  - `type` : enum `short` / `long`  
  - `catwayState` : string non vide  
- renvoie **400** en cas de données invalides  

##### 6.3.2.2 validateCatwayPartialPayload

- placeholder pour PATCH (issue‑29)  
- validera uniquement les champs présents dans le payload  
- permet une architecture évolutive et cohérente  

---

#### 6.3.3 Impacts

- Le contrôleur `createCatway` devient minimaliste (v0.5.0).  
- La logique métier est centralisée dans les middlewares.  
- Les routes PUT et PATCH sont préparées pour les issues suivantes.  
- L’architecture middleware → controller reste cohérente avec l’issue‑26.  

---

#### 6.3.4 Résultat

- Architecture plus modulaire et testable  
- Contrôleurs allégés  
- Préparation optimale pour les issues 28 (PUT) et 29 (PATCH)  
- Cohérence renforcée dans la gestion des erreurs et des validations  

---

### 6.4 Mise à jour complète Catways (issue‑28)

La mise à jour complète d’un catway (`PUT /catways/:id`) suit les principes établis dans les issues précédentes :

- La validation des données reste dans les middlewares (`validateCatwayPayload`).
- La résolution de l’identifiant reste dans `resolveCatwayIdentifier`.
- Le contrôleur `updateCatway` ne contient que la logique métier minimale :
  - remplacement des champs
  - sauvegarde en base
  - gestion des erreurs MongoDB (`E11000`)
  - gestion des erreurs internes (500)

Cette séparation garantit :

- une architecture cohérente et prévisible,
- une testabilité maximale (unitaires + intégration),
- une absence de duplication de logique entre contrôleur et middlewares.

Le test 500 est volontairement répété en niveau‑1 et niveau‑2 :

- niveau‑1 : validation de la branche métier interne (`save()`),
- niveau‑2 : validation du comportement observable dans le pipeline Express complet.

Aucune modification structurelle des routes n’est introduite. Seule la JSDoc de `catwayRoutes.js` est mise à jour (version 0.4.1).

---
