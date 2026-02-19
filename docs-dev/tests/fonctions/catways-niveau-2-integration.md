# Tests Catways de niveau‑2 : Tests d’intégration

Les tests d’intégration valident le fonctionnement réel des routes Catways, en interaction avec Express, Mongoose et MongoDB.

---

## 1. Objectifs

- Vérifier le comportement réel de la route `GET /catways`
- Tester l’intégration Express + Mongoose
- Détecter les erreurs de câblage ou de configuration
- Garantir la cohérence entre contrôleur, modèle et route

---

## 2. Outils

- **Supertest** : requêtes HTTP simulées  
- **MongoMemoryServer** : base MongoDB en mémoire  
- **Mocha / Chai** : assertions

---

## 3. Principes

- Le serveur Express (`src/app.js`) est utilisé tel quel
- Une base MongoDB temporaire est créée en mémoire
- Le modèle `Catway` est réellement utilisé
- Aucun mock → vrai test d’intégration
- Nettoyage de la base avant chaque test

---

## 4. Scénarios testés

### 4.1 `GET /catways` (issue‑25)

- 200 + tableau vide si aucun catway  
- 200 + liste des catways si des documents existent  
- Vérification des champs (`catwayNumber`, `type`, `catwayState`)  

---

### 4.2 `GET /catways/:id` (issue‑26)

Cette issue-26 introduit les tests d’intégration de la route :

```txt
GET /catways/:id
```

#### 4.2.1 étape 1 - version initiale

La version initiale utilise **uniquement** l’identifiant MongoDB (`_id`).  

Cette version ne prend pas encore en charge l’identifiant métier `catwayNumber`.

##### 4.2.1.1 Scénarios testés

- **400** si l’identifiant n’est pas un ObjectId valide  
- **404** si aucun catway ne correspond à l’identifiant  
- **200** si un catway valide est trouvé en base mémoire  
- Vérification du contenu retourné (`catwayNumber`, `type`, `catwayState`)  

##### 4.2.1.2 Principes

- utilisation réelle du modèle `Catway`  
- base MongoDB en mémoire via `MongoMemoryServer`  
- aucune logique hybride à ce stade  
- aucune validation métier via middleware (introduite en étape 3)  

---

## 5. Fichiers associés

- Tests : `tests/integration/catways.routes.test.js`
- Modèle : `src/models/catway.js`
- Routes : `src/routes/catwayRoutes.js`

---

## 6. Résultats

### 6.1 issue-25 : route de la liste des Catways

**Résultats des tests (issue-25) :**

![alt text](../assets/img_issue-25_resultats-tests-niveau-2.png)
