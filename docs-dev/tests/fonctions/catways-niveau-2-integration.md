# Tests Catways de niveau‑2 : Tests d’intégration

Les tests d’intégration valident le fonctionnement réel des routes Catways, en interaction avec Express, Mongoose et MongoDB.

## 1. Objectifs

- Vérifier le comportement réel de la route `GET /catways`
- Tester l’intégration Express + Mongoose
- Détecter les erreurs de câblage ou de configuration
- Garantir la cohérence entre contrôleur, modèle et route

## 2. Outils

- **Supertest** : requêtes HTTP simulées  
- **MongoMemoryServer** : base MongoDB en mémoire  
- **Mocha / Chai** : assertions

## 3. Principes

- Le serveur Express (`src/app.js`) est utilisé tel quel
- Une base MongoDB temporaire est créée en mémoire
- Le modèle `Catway` est réellement utilisé
- Aucun mock → vrai test d’intégration
- Nettoyage de la base avant chaque test

## 4. Scénarios testés

### 4.1 `GET /catways` (issue‑25)

- 200 + tableau vide si aucun catway  
- 200 + liste des catways si des documents existent  
- Vérification des champs (`catwayNumber`, `type`, `catwayState`)  

## 5. Fichiers associés

- Tests : `tests/integration/catways.routes.test.js`
- Modèle : `src/models/catway.js`
- Routes : `src/routes/catwayRoutes.js`

## 6. Résultats

### 6.1 issue-25 : route de la liste des Catways

**Résultats des tests (issue-25) :**

![alt text](../assets/img_issue-25_resultats-tests-niveau-2.png)
