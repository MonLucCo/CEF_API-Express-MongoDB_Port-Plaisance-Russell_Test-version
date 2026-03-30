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

### 2.3 Décision — Gestion des erreurs MongoDB & résilience serveur (issue‑22)

Cette décision introduit une couche de résilience essentielle pour garantir la stabilité de l’API en conditions réelles.

#### 2.3.1 Motivations

- éviter que le serveur démarre sans base de données fonctionnelle  
- fournir des erreurs cohérentes et normalisées  
- améliorer la lisibilité des logs  
- préparer les tests d’intégration réels (Atlas)  
- garantir un arrêt propre du serveur dans tous les scénarios

#### 2.3.2 Choix techniques

- ajout d’une fonction `normalizeMongoError()` dans `mongo.js`  
- classification des erreurs MongoDB (DNS, timeout, auth, whitelist…)  
- propagation des erreurs normalisées vers `server.js`  
- gestion des erreurs serveur (`EADDRINUSE`, `EACCES`)  
- gestion des signaux système (`SIGINT`, `SIGTERM`)  
- arrêt propre via `disconnectClientDBConnection()`  
- logs structurés et explicites

#### 2.3.3 Résultats attendus

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

### 4.1 Décision — Séparation du module Reservations (issue‑31)

Pour garantir une architecture modulaire et éviter de surcharger `catwayRoutes.js`, un routeur dédié aux réservations a été introduit :

- `reservationRoutes.js` : routes `/catways/:id/reservations`
- `reservationController.js` : logique métier des réservations
- `reservationMiddleware.js` : middlewares de validation et résolution

Motivations :

- éviter la duplication de logique dans les routes Catways  
- isoler la ressource imbriquée Reservations dans un module dédié  
- conserver une architecture REST claire et évolutive  
- faciliter les tests unitaires et d’intégration  
- maintenir la cohérence avec la Phase 4 (Catways)

Le routeur est monté dans `app.js` via :

```js
app.use('/catways', reservationRoutes);
```

---

### 4.2 Décision — Architecture Reservations (issue‑31 → 36)

La Phase 5 introduit la gestion des réservations associées aux catways.  
L’architecture retenue suit strictement les principes établis dans la Phase 4.

#### 4.2.1 Motivations

- éviter de surcharger `catwayRoutes.js`  
- isoler la ressource Reservations dans un module dédié  
- conserver une architecture REST claire (ressource imbriquée)  
- préparer les règles métier complexes (dates, chevauchements)  
- faciliter les tests unitaires et d’intégration  
- maintenir une documentation modulaire et versionnée

#### 4.2.2 Choix techniques

- création d’un routeur dédié : `reservationRoutes.js`  
- création d’un contrôleur dédié : `reservationController.js`  
- création d’un middleware dédié : `reservationMiddleware.js`  
- montage du routeur sur `/catways`  
- pipeline Express identique à celui des Catways :
  - validation → résolution → logique métier

#### 4.2.3 Impacts

- architecture plus claire et maintenable  
- contrôleurs allégés  
- middlewares spécialisés  
- tests plus simples et plus robustes  
- documentation enrichie dans `architecture.md` et `tests-strategy.md`

#### 4.2.4 Résultat

La Phase 5 dispose d’une architecture complète, modulaire et cohérente, prête pour l’implémentation progressive des fonctionnalités dans les issues 33 → 36.

---

### 4.3 Décision - Séparation stricte API REST / Frontend EJS

La phase 6 introduit un frontend qui vient compléter l'API du projet. Ces deux composantes du projet seront développées avec une séparation stricte (dossiers de développement et routes des URLs) dans le développement :

- l'API REST (src/routes/api/)
- les pages dynamiques EJS (src/routes/pages/)

Motivations :

- préparer le front minimal (Phase 6)
- éviter la confusion entre routes API et routes HTML
- permettre un déploiement propre sur Alwaysdata
- clarifier la documentation et les tests

Impacts :

- création de pagesRoutes.js et pagesController.js
- suppression de accueilRoutes.js
- mise à jour de app.js pour monter les deux familles de routes
- séparation des familles de tests (développeurs et opérationnels Client)
- passage en version v0.1.2-dev

---

### 4.4 Décision — Distinction des trois types de versions

La phase 6 (dès l'issue-37) fait évoluer la version déployée. Ceci augmente le nombre de versions du projet.
Afin de clarifier le cycle de développement et de déploiement, le projet adopte une distinction explicite entre :

- **Version en développement (`vX.Y.Z-dev`)**  
  Version locale active sur la branche `dev`.

- **Version déployée (`vX.Y.Z-dev`)**  
  Version réellement en ligne sur Alwaysdata.

- **Version Release (`vX.Y.Z`)**  
  Version stable publiée dans GitHub Releases.

Motivations :

- éviter la confusion entre version locale et version déployée  
- permettre un suivi clair des releases  
- préparer le déploiement du frontend (issue‑37 étape 4)  
- aligner le projet avec les bonnes pratiques CI/CD

Impacts :

- mise à jour du README  
- ajout de badges de version  
- clarification dans `architecture.md`  
- préparation des futures releases GitHub

---

### 4.5 Décision — Archivage des validations pré‑déploiement

Afin de garantir la traçabilité des versions déployées, chaque version fait l’objet d’un archivage des tests automatisés et de la checklist pré‑déploiement.

Les artefacts sont stockés dans :

```txt
docs-dev/tests/deploiements/<version>/
```

Contenu :

- checklist pré‑déploiement
- logs des tests unitaires
- logs des tests d’intégration
- logs des tests E2E simulés
- résumé de validation

Motivations :

- assurer la traçabilité des versions
- faciliter les audits internes
- préparer l’automatisation CI/CD
- garantir la cohérence entre version déployée et version testée

---

### 4.6 Décision — Faille de sécurité sur `/api/auth/register` (version v0.2.0-dev)

La validation pré‑déploiement **v0.2.0-dev** a révélé que la route `POST /api/auth/register` était accessible sans authentification.

Décision :

- refuser le déploiement de la v0.2.0-dev
- créer une version corrective v0.2.1-dev
- sécuriser la route /api/auth/register
- analyser les routes Auth/Users pour une API REST

Conséquences :

- mise à jour de l'architecture de l'API avec l'analyse d'une séparation stricte Auth et USERs
- mise à jour des tests unitaire et d’intégration Auth
- mise à jour de la collection Postman PreDeploy
- nouvelle validation pré‑déploiement obligatoire

> Notes :
>
> - Cette décision est tracée (ADR) car elle met en évidence que les démarches de validation de pré-déploiement sont une phase de vérification qui peut aussi bien conclure à un déploiement qu'à un refus de poursuivre.

---

### 4.7 Décision — Séparation Auth/Users et correction de la faille (version v0.2.1-dev)

#### 4.7.1 Présentation

La validation pré‑déploiement v0.2.0-dev a révélé une faille de sécurité critique :  
la route `POST /api/auth/register` était accessible sans authentification.

Cette situation résulte d’une incohérence structurelle : les opérations CRUD liées au modèle User (création, suppression, modification) étaient regroupées dans `/api/auth/`, alors qu’elles relèvent d’une ressource métier distincte.

##### 4.7.1.1 Décision

- refuser le déploiement de la v0.2.0-dev ;
- créer une version corrective v0.2.1-dev ;
- **séparer les routes Auth et Users** :
  - `/api/auth/login` (authentification uniquement)
  - `/api/users/` (création, modification, suppression)
- privatiser toutes les routes User ;
- ajouter la route `PUT /api/users/:id` conformément au sujet ;
- mettre à jour les tests unitaires/d’intégration et la collection Postman PreDeploy.

##### 4.7.1.2 Motivations

- corriger la faille de sécurité ;
- aligner l’API avec les standards REST ;
- respecter les fonctionnalités demandées dans le sujet (création, modification, suppression d’utilisateur) ;
- clarifier l’architecture pour les futures versions.

##### 4.7.1.3 Conséquences

- mise à jour des contrôleurs et routes ;
- mise à jour des tests ;
- mise à jour de la documentation ;
- nouvelle validation pré‑déploiement obligatoire (v0.2.1-dev).

---

#### 4.7.2 Gestion de l’obsolescence (v0.2.1‑dev)

Dans la continuité de la séparation Auth/Users et de la correction de la faille de sécurité, les routes historiques :

- `POST /api/auth/register`
- `DELETE /api/auth/delete/:id`

sont désormais **obsolètes**.  
Elles ont été introduites en Phase 2 (issues 12–17) avant la création du module Users, et ne correspondent plus à l’architecture REST finale.

##### 4.7.2.1 Décision

- **Les routes Auth/register et Auth/delete sont conservées dans la version v0.2.1‑dev**, afin de préserver :
  - la cohérence documentaire,
  - la traçabilité historique,
  - la stabilité des tests existants.
- Elles sont désormais :
  - **privatisées** (JWT obligatoire),
  - **dépréciées** via un middleware dédié,
  - **fonctionnelles**, mais accompagnées d’un avertissement explicite.

##### 4.7.2.2 Motivations

- éviter une rupture fonctionnelle dans une version corrective ;
- conserver la documentation et les tests historiques ;
- préparer une suppression propre dans une version ultérieure (v0.3.0 ou v1.0.0) ;
- introduire un mécanisme générique de gestion de dépréciation pour l’API.

##### 4.7.2.3 Choix techniques

- ajout d’un middleware `deprecatedRoute` appliqué aux routes Auth obsolètes ;
- ajout d’un header HTTP `X-Deprecated: true` ;
- ajout d’un bloc `deprecated` dans la réponse JSON ;
- maintien du comportement fonctionnel d’origine ;
- mise à jour légère des tests (intitulés + vérification du header).

##### 4.7.2.4 Conséquences

- l’API reste cohérente et stable en v0.2.1-dev ;
- la documentation reste lisible et fidèle à l’historique du projet ;
- les routes obsolètes sont clairement signalées comme telles ;
- la suppression future sera simple et propre ;
- un mécanisme de dépréciation réutilisable est désormais en place.

> **Voir :**  
> `docs-dev/architecture/suppression-depreciation-analysis.md`  
> pour l’analyse complète et la justification détaillée.

---

#### 4.7.3 Décision — Validation du pipeline PreDeploy de la version v0.2.1-dev et engagement du déploiement

La version **v0.2.1-dev** a fait l’objet d’une validation complète via le pipeline **PreDeploy** (tests automatisés niveaux 1 à 3, tests manuels niveau 4, vérification du frontend local et cohérence des métadonnées de version).

##### 4.7.3. Constats

- l’ensemble des tests automatisés (unitaires, intégration, E2E simulés) sont **validés** ;  
- les tests manuels API et frontend sont **conformes** ;  
- la collection Postman PreDeploy v0.2.1-dev est **stabilisée** ;  
- la gestion de l’obsolescence des routes Auth/register et Auth/delete est **fonctionnelle et documentée** ;  
- la séparation Auth/Users est **cohérente**, **sécurisée**, et **testée** ;  
- la documentation (architecture, tests, checklist) est **à jour** ;  
- la version locale est alignée avec `APP_VERSION_TAG = 'v0.2.1-dev'` et `package.json version = 0.2.1`.

##### 4.7.3.2 Décision

Compte tenu de la réussite complète du pipeline PreDeploy :

- **la version v0.2.1-dev est validée pour déploiement** ;  
- le projet engage la phase **Deploy** sur Alwaysdata afin de remplacer la version publiée `v0.1.0-dev` par `v0.2.1-dev` ;  
- les pipelines **Deploy** et **PostDeploy** seront exécutés conformément à la stratégie définie dans l’issue‑37.

##### 4.7.3.3 Motivations

- garantir la continuité du cycle CI/CD introduit en Phase 6 ;  
- assurer que la version déployée est strictement identique à la version testée ;  
- sécuriser la montée de version après correction de la faille Auth/register ;  
- préparer la stabilisation du frontend minimal et des routes Users.

##### 4.7.3.4 Conséquences

- déclenchement du pipeline Deploy (Alwaysdata) ;  
- mise à jour de la version publiée ;  
- archivage du dossier `docs-dev/tests/deploiements/v0.2.1-dev_*` ;  
- préparation du pipeline PostDeploy pour validation finale.

---

#### 4.7.4 Décision — Réalisation de correctifs réduits (patchs) pour rendre opérationnelle le v0.2.1-dev

La version **v0.2.1-dev** a fait l’objet d’une validation complète via le pipeline **Deploy** (tests automatisés niveaux 1 à 3, tests manuels niveau 4, vérification du frontend local et cohérence des métadonnées de version).

Les dysfonctionnement identifiés ont été identifiés et un correction réduit est mise en place. Ces corrections ne doivent pas remettre en cause les tests réalisés (niveaux 1 à 4) et ne doivent pas introduire de nouveauté dans d'architecture de l'application.

La notation de la version est : `<version>.<index>` correction (ie. `v0.2.1-dev.a` pour le premier patch de la version `v0.2.1-dev`).

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

### 5.3 Séparation des tests Développeurs et des tests Opérationnels Client

L’issue‑37 (Phase 6) introduit une séparation nette entre :

1) Tests développeurs (npm run test)
   - tests unitaires (niveau 1)
   - tests d’intégration (niveau 2)
   - tests E2E simulés

2) Tests opérationnels Client (npm run tests)
   - tests du modèle et de la base
   - tests du front-end
   - tests de l’API
   - tests des fonctions Client

Motivations :

- éviter les interférences entre tests techniques (développeurs) et opérationnels (Client)
- préparer la Phase 7 (tests opérationnels)
- clarifier le pipeline CI/CD

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

### 6.5 Mise à jour partielle Catways (issue‑29)

La mise à jour partielle d’un catway suit les principes établis dans les issues précédentes :

- La validation reste dans les middlewares.
- Le middleware validateCatwayPartialPayload devient une implémentation réelle :
  - au moins un champ doit être fourni,
  - chaque champ présent doit être valide,
  - aucune logique métier n’est dupliquée dans le contrôleur.

- Le contrôleur patchCatway applique uniquement la logique métier minimale :
  - mise à jour des champs présents,
  - sauvegarde en base,
  - gestion des erreurs MongoDB (E11000 → 409),
  - gestion des erreurs internes (500).

Le test 500 est volontairement présent en niveau‑1 et niveau‑2 :

- niveau‑1 : validation de la branche interne (save()),
- niveau‑2 : validation de la propagation réelle dans Express.

Aucune modification structurelle des routes. Mise à jour documentaire légère dans catwayRoutes.js (v0.4.2).
Le module catwayPayloadMiddleware passe en version 0.2.0 (nouvelle capacité fonctionnelle).

---

### 6.6 Suppression Catways (issue‑30)

La suppression d’un catway suit les principes établis dans les issues précédentes :

- La validation et la résolution de l’identifiant sont entièrement déléguées aux middlewares.
- Le contrôleur deleteCatway reste minimal :
  - suppression via deleteOne()
  - statut 204 sans corps de réponse
  - gestion des erreurs internes (500)

Le choix du statut 204 est cohérent avec les conventions REST :

- la ressource n’existe plus après l’opération,
- aucun contenu n’est renvoyé.

Les tests couvrent :

- la branche interne (niveau‑1),
- le pipeline complet Express + MongoMemoryServer (niveau‑2).

Aucune modification structurelle des routes. Mise à jour documentaire légère de catwayRoutes.js (v0.4.3).

---

### 6.7 Liste des réservation d'un catway (issue‑33)

Cette décision introduit la première opération fonctionnelle du module Reservations.  
Elle s’appuie sur les principes établis dans la Phase‑4 (Catways) : séparation middlewares / contrôleur, identifiant hybride, tests multi‑niveaux.

#### 6.7.1 Motivations

- fournir une liste fiable et cohérente des réservations d’un catway
- réutiliser l’identifiant hybride (_id ou catwayNumber_)
- éviter toute duplication de logique dans le contrôleur
- garantir une architecture modulaire et testable

#### 6.7.2 Choix techniques

- validation et résolution de l’identifiant entièrement déléguées aux middlewares Catways
- contrôleur réduit à la logique métier :
  - requête `Reservation.find({ catwayNumber })`
  - statut 200 ou 500
- aucun tri imposé (l’ordre n’est pas contractuel)
- gestion d’erreur interne générique :  
  `{ error: 'Erreur interne du serveur' }`

#### 6.7.3 Impacts

- cohérence totale avec les routes Catways
- contrôleur Reservation minimaliste et stable
- tests niveau‑1 et niveau‑2 complets
- architecture prête pour les issues 34 → 36

---

### 6.8 Détail d'une réservation d'un catway (issue-34)

#### 6.8.1 Identifiant de réservation = ObjectId

Contrairement aux catways, les réservations **n’ont pas d’identifiant métier**.  
Elles sont donc identifiées uniquement par leur `_id` MongoDB.

#### 6.8.2 Validation et résolution via middlewares

Comme pour Catways :

- la validation syntaxique (`validateReservationId`) est séparée,
- la résolution (`resolveReservationIdentifier`) est isolée,
- le contrôleur reste minimaliste.

#### 6.8.3 Vérification d’appartenance

Une réservation doit appartenir au catway demandé :

```js
reservation.catwayNumber === req.catway.catwayNumber
```

#### 6.8.4 Simulation d’erreur interne en niveau‑1

Pour tester le `catch` du contrôleur, on utilise un getter qui jette une erreur.  
Cela évite de re‑stubber `res.status()` ou `res.json()`.

---

### 6.9 — Création d’une réservation (issue‑35)

#### 6.9.1 Validation métier dans un middleware dédié

La validation du payload est centralisée dans `validateReservationPayload` pour :

- isoler la logique métier,  
- garder un contrôleur minimaliste,  
- faciliter les tests niveau‑1,  
- garantir la cohérence avec Catways (issue‑26).

#### 6.9.2 Injection automatique du catwayNumber

Le client **ne peut pas** fournir `catwayNumber`.  
Il est injecté depuis `req.catway.catwayNumber`.

Cela garantit :

- la cohérence métier,  
- l’intégrité des données,  
- l’absence de contournement côté client.

#### 6.9.3 Dates déterministes dans les tests

Les tests utilisent des dates ISO fixes :

```js
2025-05-01T10:00:00Z
2025-05-01T12:00:00Z
```

Cela évite les flakiness liés à `new Date()`.

#### 6.9.4 Simulation d’erreur interne

En niveau‑2, l’erreur interne est simulée via :

```js
sinon.stub(Reservation, 'create').throws(...)
```

C’est cohérent avec les issues 33 et 34.

---

### 6.10 — Suppression d’une réservation (issue‑36)

#### 6.10.1 Réutilisation complète du pipeline existant

Aucune validation supplémentaire n’est ajoutée :  
tout est géré par les middlewares déjà introduits dans les issues 33–34.

#### 6.10.2 Contrôleur minimaliste

Le contrôleur ne fait que :

- supprimer la réservation,  
- renvoyer un message de confirmation,  
- gérer les erreurs internes.

Cela garantit :

- une architecture claire,  
- une testabilité maximale,  
- une cohérence avec les autres opérations CRUD.

#### 6.10.3 Cohérence métier

La vérification d’appartenance (`reservation.catwayNumber === req.catway.catwayNumber`) reste dans `resolveReservationIdentifier`, évitant toute duplication.

#### 6.10.4 Simulation d’erreur interne

En niveau‑2, l’erreur interne est simulée via :

```js
sinon.stub(Reservation, 'findByIdAndDelete').throws(...)
```

C’est cohérent avec les issues 33–35.

---

## 7. Fonctionnalités applicatives (Frontend & API)

### 7.1 — Frontend dynamique (EJS) et séparation REST/EJS (issue‑37)

Le front-end minimal basé sur EJS, séparé de l’API REST, est développé à partir de la page statique initiale du projet.  

L'issue-37 et développée en 4 étapes qui conduisent à une page d'accueil permettant d'accéder à un dahboard des utilisateurs tout en protégeant du côté serveur les routes du frontend et l'API par un jeton (JWT) lié à une connexion (Login/logout).

Motivations :

- fournir une page d’accueil dynamique
- préparer le front-end complet (accueil, dahboard, documentation)
- éviter toute confusion entre API et pages HTML
- permettre un déploiement propre sur Alwaysdata

Choix techniques :

- pagesRoutes.js pour les routes HTML
- pagesController.js pour la logique métier
- views/accueil.ejs pour le rendu
- variable métier “status” transmise à la vue
- suppression de accueilRoutes.js

Résultat :

- architecture claire et modulaire
- API REST totalement indépendante du front
- Routes protégées par JWT
- compatibilité totale avec Alwaysdata

---
