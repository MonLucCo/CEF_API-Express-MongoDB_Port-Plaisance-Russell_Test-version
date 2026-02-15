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
