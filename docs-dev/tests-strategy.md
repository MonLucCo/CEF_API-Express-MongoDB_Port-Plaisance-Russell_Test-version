# Stratégie de tests

**En préambule** : cette version initiale du document présente la situation des tests prévus pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

## 1. Organisation des tests

Les tests concernent des éléments techniques du développement :

- l'authentification d'un utilisateur
- les modèles du projet (User, Catway et Reservation)
- les fonctionnalités du projet.

Chaque catégorie (authentification, modèle, fonctionnalité) fait l'objet de différents niveaux de tests et d'une organisation adaptée.

👉 Détails complets : [docs-dev/tests/README_tests.md](./tests/README_tests.md)

---

## 2. Tests de la catégorie Authentification

### 2.1 Organisation technique

La stratégie de tests repose sur trois niveaux complémentaires, introduits progressivement dans les issues 15 à 17.

#### 2.1.1 Niveau‑1 : Tests unitaires

- Outils : **Mocha**, **Chai**, **Sinon**  
- Objectif : tester la logique métier de manière isolée  
- Aucune base de données  
- Les dépendances (Mongoose, bcrypt, JWT) sont remplacées par des stubs  
- Les tests couvrent désormais :
  - contrôleur `authController` (register, login, deleteUser)
  - middleware JWT (issue‑16)
- Les stubs Mongoose incluent maintenant :
  - `User.findOne`
  - `User.create`
  - `User.findByIdAndDelete`
- Les tests de `deleteUser` utilisent désormais des **ObjectId valides** pour refléter le contrôle ajouté dans l’issue‑17.

### 2.1.2 Niveau‑2 : Tests d’intégration

- Outils : **Supertest**, **MongoMemoryServer**  
- Objectif : tester les routes Express et leur interaction réelle avec Mongoose  
- Base MongoDB en mémoire  
- bcrypt et JWT réels  
- Les tests couvrent :
  - `/auth/register` (champs manquants, email déjà utilisé, création valide)
  - `/auth/login` (champs manquants, identifiants invalides, token valide)
  - `/auth/delete/:id` (401, 404, 200)
- Le secret JWT est défini dans les tests via `process.env.JWT_SECRET = 'testsecret'`  
  afin de permettre la génération réelle du token.

#### 2.1.3 Niveau‑3 : Tests E2E

- Outils : **Postman**  
- Objectif : valider l’API complète en conditions réelles (déployées) ou simulées (locales)  
- Base MongoDB réelle ou en mémoire (locale)
- Scénarios complets : inscription, connexion, suppression, accès protégé  
- Exemples :
  - **Tests simulés (issue-17)**
    - Les tests E2E simulés (issue‑17) s’exécutent via Postman sur un serveur Express dédié (`tests/test-app.js`). Ce serveur utilise MongoMemoryServer et ne doit pas être confondu avec `src/server.js`.
    - Deux scripts permettent de lancer cet environnement :
      - `npm run test:app` → exécution simple, base stable
      - `npm run test:app:watch` → exécution avec nodemon (config dev), utile pour le développement
    - Cet environnement est strictement local et n’est pas utilisé pour les tests E2E réels (issue‑22).
  - **Tests réels (issue-22)**
    - Les tests Postman (serveur local + MongoDB Atlas) servent de validation finale pour les fonctionnalités critiques des données (Phase 3).
  - **Tests réels (Phase-4 - Clôture)**
    - Les tests Postman (serveur local + MongoDB Atlas) servent de validation finale pour les fonctionnalités critiques du CRUD Catways (Phase 4).
  - **Tests réels (Phase-5 - Clôture)**
    - Les tests Postman (serveur local + MongoDB Atlas) servent de validation finale pour les fonctionnalités critiques du CRUD Reservations (Phase 5).

---

#### 2.1.4 Organisation du code - Dossier `tests/auth`

```txt
tests/
  controllers/      ← Tests unitaires des contrôleurs (auth-niveau‑1)
  middlewares/      ← Tests unitaires du middleware JWT (auth-niveau‑1)
  integration/      ← Tests d’intégration (auth-niveau‑2)
  e2e/              ← Tests E2E Postman (auth-niveau‑3)
  mocks/            ← Mocks/stubs pour isoler les dépendances
```

Cette organisation garantit une séparation claire entre les niveaux de tests et facilite la maintenance.

---

### 2.2 Organisation documentatire

Le contenu documentaire par niveau de l'authentification se trouve dans `docs-dev/tests/auth/`.

**Liens :**

- [auth-niveau-1-unitaires](./tests/auth/auth-niveau-1-unitaires.md)
- [auth-niveau-2-integration](./tests/auth/auth-niveau-2-integration.md)
- [auth-niveau-3-e2e](./tests/auth/auth-niveau-3-e2e.md)

---

## 3. Tests de la catégorie Modélisation

Les tests de modélisation valident la cohérence structurelle des modèles Mongoose du projet :  
**User**, **Catway**, **Reservation**.  
Ils garantissent que les règles de validation, les contraintes, les index et les comportements internes des schémas sont corrects avant leur utilisation dans les contrôleurs et les routes.

Les tests de modélisation suivent les trois niveaux de la stratégie globale.

---

### 3.1 Organisation technique

La stratégie de tests repose sur trois niveaux complémentaires, introduits progressivement dans les issues 18 à 20.

#### 3.1.1 Niveau‑1 — Tests unitaires des modèles

**Objectif :** tester la validation interne des schémas Mongoose, sans base de données.

**Outils :**

- Mocha  
- Chai  

**Caractéristiques :**

- Aucun accès à MongoDB  
- Aucune insertion (`save()`)  
- Aucune utilisation de MongoMemoryServer  
- Utilisation de `MongoDB` en mode permissif (strictQuery = false) car aucun accès à la base de données
- Tests rapides, isolés, purement structurels  

**Éléments testés :**

- champs requis (`required`)  
- formats (`trim`, `lowercase`)  
- contraintes (`min`, `enum`)  
- validation structurelle (ex : hash bcrypt pour User)  
- cohérence du document  

**Modèles concernés :**

- `Catway` (issue‑18)  
- `Reservation` (issue‑19)  
- `User` (issue‑20)  

> **Note :**
> Le modèle `User` a fait l'objet de tests dans l'issue-17 pour évaluer l'authentification.

---

#### 3.1.2 Niveau‑2 — Tests d’intégration des modèles

**Objectif :** tester les modèles avec une base MongoDB réelle en mémoire.

**Outils :**

- MongoMemoryServer  
- Mongoose  
- Mocha / Chai  

**Caractéristiques :**

- Base MongoDB en mémoire (isolée, jetable)  
- Tests réels : `save()`, `find()`, `delete()`  
- Vérification des index et des erreurs MongoDB  

**Éléments testés :**

- unicité (`unique`) → erreur `E11000`  
- indexation automatique  
- insertion valide  
- insertion invalide  
- cohérence des types  
- comportement des dates (`timestamps`)  

**Modèles concernés :**

- `User`  
- `Catway`  
- `Reservation`  

---

#### 3.1.3 Niveau‑3 — Tests E2E (modélisation indirecte)

**Objectif :** valider les modèles dans le cadre d’un scénario complet via les routes Express.

**Outils :**

- Postman (ou équivalent)  
- Serveur Express dédié (`tests/test-app.js`)  
- MongoMemoryServer  

**Caractéristiques :**

- Les modèles sont testés indirectement via les routes  
- Les validations Mongoose sont déclenchées par les contrôleurs  
- Les erreurs MongoDB sont observées dans les réponses HTTP  

**Éléments testés :**

- création d’un utilisateur → validation User  
- création d’un catway → validation Catway  
- création d’une réservation → validation Reservation  
- erreurs de validation → statuts HTTP 400  
- erreurs MongoDB → statuts HTTP 500 ou 409  

**Modèles concernés :**

- Tous les modèles, via les routes correspondantes  

---

#### 3.1.4 Organisation du code - Dossier `tests/modeles`

```txt
tests/
  modeles/          ← Tests de la catégorie Modélisation
  mocks/            ← Mocks/stubs pour isoler les dépendances
```

Cette organisation garantit une séparation claire entre les niveaux de tests et facilite la maintenance.

---

### 3.2 Organisation documentatire

Le contenu documentaire par niveau de l'authentification se trouve dans `docs-dev/tests/modeles/`.

**Liens :**

- [modeles-niveau-1-unitaires](./tests/modeles/modeles-niveau-1-unitaires.md)
- [modeles-niveau-2-integration](./tests/modeles/modeles-niveau-2-integration.md)
- [modeles-niveau-3-e2e](./tests/modeles/modeles-niveau-3-e2e.md)

---

### 3.3 Tests des modélisations

#### 3.3.1 Tests du modèle Catway (issue‑18)

Les tests du modèle Catway ont été réalisés dans l’issue‑18 et constituent la première étape de la validation des modèles de la Phase 3.

##### 3.3.1.1 Niveau‑1 — Tests unitaires

Objectif : valider la cohérence structurelle du schéma Catway **sans base MongoDB**.

Éléments testés :

- champs requis (`required`)
- contraintes (`min`, `enum`)
- normalisation (`trim`, `lowercase`)
- cohérence du document via `validate()`
- absence de `catwayState`
- type invalide (`medium`)
- `catwayNumber < 1`

Fichier associé : [tests/modeles/catway.test.js](../tests/models/catway.test.js)

Documentation : [docs-dev/tests/modeles/modeles-niveau-1-unitaires.md](./tests/modeles/modeles-niveau-1-unitaires.md)

---

##### 3.3.1.2 Niveau‑2 — Tests d’intégration

Objectif : valider le comportement réel du modèle Catway avec **MongoMemoryServer**.

Éléments testés :

- insertion valide (`save()`)
- unicité (`unique`) → erreur MongoDB `E11000`
- type invalide (`enum`)
- `catwayNumber < 1`
- champ requis manquant (`catwayState`)
- présence des timestamps (`createdAt`, `updatedAt`)

Fichier associé : [tests/modeles/catway.integration.test.js](../tests/models/catway.integration.test.js)

Documentation : [docs-dev/tests/modeles/modeles-niveau-2-integration.md](./tests/modeles/modeles-niveau-2-integration.md)

---

##### 3.3.1.3 Résultats

Les tests Catway niveaux 1 et 2 passent avec succès :

- validation structurelle correcte  
- comportement conforme aux attentes du schéma  
- unicité fonctionnelle (`E11000`)  
- timestamps générés automatiquement  

Les captures des résultats sont disponibles dans :  
`docs-dev/tests/assets/img_issue-18_resultats-tests-niveau-1.png`  
`docs-dev/tests/assets/img_issue-18_resultats-tests-niveau-2.png`

---

#### 3.3.2 Tests du modèle Reservation (issue-19)

Les tests unitaires du modèle Reservation suivent la même logique que ceux du modèle Catway :  
validation via `validate()`, gestion des erreurs via try/catch, aucune dépendance à MongoDB.

##### 3.3.2.1 Niveau‑1 — Tests unitaires

Objectif : valider la cohérence structurelle du schéma sans base MongoDB.

Éléments testés :

- champs requis (`required`)
- types (`String`, `Date`)
- normalisation (`trim`)
- cohérence des dates (structure uniquement)

Fichier associé : [tests/modeles/reservation.test.js](../tests/models/reservation.test.js)

Documentation : [docs-dev/tests/modeles/modeles-niveau-1-unitaires.md](./tests/modeles/modeles-niveau-1-unitaires.md)

---

##### 3.3.2.2 Niveau‑2 — Tests d’intégration

Objectif : valider le comportement réel du modèle Reservation avec MongoMemoryServer.

Éléments testés :

- insertion valide
- validations Mongoose (required, min, type Date)
- cohérence des dates (`checkOut > checkIn`)
- recherche (`findOne`)
- suppression (`findByIdAndDelete`)
- timestamps automatiques

Fichier associé : [tests/modeles/reservation.integration.test.js](../tests/models/reservation.integration.test.js)

Documentation : [docs-dev/tests/modeles/modeles-niveau-2-integration.md](./tests/modeles/modeles-niveau-2-integration.md)

---

## 4. Tests de la catégorie Fonctionnalité

### 4.1 Objectif

Garantir la stabilité du projet et éviter les régressions.

### 4.2 Emplacement des tests

Les tests fonctionnels seront introduits en Phase 5 (Reservations) et 6 (Front-end).

Pour la Phase 4 (Catways), les tests ne sont pas encore fonctionnels :  
ils sont répartis dans les dossiers existants selon leur niveau :

- **niveau‑1 (unitaires)** : tests unitaires du contrôleur catways  
  → `tests/controllers/catwayController.test.js`
- **niveau‑2 (intégration)** : tests d'intégration des routes Catways  
  → `tests/integration/catways.routes.test.js`

Les tests fonctionnels Catways (niveau‑3) seront ajoutés ultérieurement (Phase 6 - front minimal).

### 4.3 Tests fonctionnels à couvrir

1. Création catway
2. Suppression catway
3. Liste catways
4. Création réservation
5. Suppression réservation
6. Liste réservations
7. Création utilisateur
8. Suppression utilisateur
9. Connexion utilisateur

> Les tests seront implémentés progressivement au fil des milestones.

### 4.4 Outils

- **Mocha** : moteur de tests
- **Chai** : assertions
- **Sinon** : stubs, spies, mocks
- **MongoMemoryServer** : base MongoDB en mémoire
- **Supertest** : tests d’intégration des routes Express
