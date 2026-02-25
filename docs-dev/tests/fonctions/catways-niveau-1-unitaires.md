# Tests Catways de niveau‑1 : Tests unitaires

Les tests unitaires valident la logique métier du contrôleur Catways de manière isolée.  
Ils ne dépendent d’aucune base de données ni d’aucun service externe.

---

## 1. Objectifs

- Vérifier le comportement métier de `catwayController`
- Tester les branches conditionnelles
- Garantir la robustesse des contrôleurs avant l’intégration
- Empêcher les régressions lors des évolutions (issues 26 → 30)

---

## 2. Outils

- **Mocha** : moteur de tests  
- **Chai** : assertions  
- **Sinon** : stubs, spies, mocks

---

## 3. Principes

- Le modèle Mongoose `Catway` est entièrement stubé via `catway.mock.js`
- Les tests utilisent les helpers centralisés dans `tests.mock.js` :
  - `mockResponse()` : simule `res.status().json()`
  - `afterEachRestore()` : restaure automatiquement les stubs Sinon
- Aucun accès à MongoDB
- Chaque test est isolé

---

## 4. Scénarios testés

### 4.1 `getAllCatways()` (issue‑25)

- 200 + liste des catways si `Catway.find()` réussit  
- 500 si `Catway.find()` lance une erreur

---

### 4.2 `getCatwayById()` (issue‑26)

Cette issue‑26 introduit les tests unitaires de la route :

```txt
GET /catways/:id
```

#### 4.2.1 étape 1 - version initiale

La version initiale repose **exclusivement** sur l’identifiant interne MongoDB (`_id`).  

Cette version ne prend pas encore en charge l’identifiant métier `catwayNumber`.

##### 4.2.1.1 Scénarios testés

- **400** si l’identifiant n’est pas un ObjectId valide  
- **404** si aucun catway ne correspond à l’identifiant  
- **200** si un catway est trouvé  
- **500** si `Catway.findById()` lance une erreur interne  

##### 4.2.1.2 Mocks utilisés

- `mockFindById()`  
- `mockFindByIdError()`  

Ces stubs permettent d’isoler totalement la logique métier du contrôleur.

---

#### 4.2.2 Étape 2 — Logique hybride (_id + catwayNumber)

Cette étape introduit la prise en charge de l’identifiant métier `catwayNumber` dans la fonction :

```txt
GET /catways/:id
```

##### 4.2.2.1 Scénarios testés

- **200** si catway trouvé via `catwayNumber`  
- **404** si `catwayNumber` valide mais introuvable  
- **400** si `id` n’est ni un ObjectId ni un nombre  

##### 4.2.2.2 Notes

- Les tests du commit‑1 (ObjectId uniquement) restent valides  
- Les nouveaux tests utilisent `sinon.stub(Catway, 'findOne')`  
- Le contrôleur reste rétro‑compatible grâce à la priorité ObjectId

> Les tests hybrides utilisent `sinon.stub(Catway, 'findOne')` car la logique métier repose désormais sur `findOne` pour les identifiants métier.

---

#### 4.2.3 Étape 3 — Middlewares Catways

L’étape 3 introduit les tests unitaires des middlewares Catways, qui remplacent la logique de validation et de résolution précédemment présente dans le contrôleur.

##### 4.2.3.1 `validateCatwayId`

Ce middleware vérifie la validité syntaxique de l’identifiant `/:id`.

###### 4.2.3.1.1 Scénarios testés

- **400** si identifiant invalide (ni ObjectId, ni nombre)  
- **next()** si ObjectId valide  
- **next()** si catwayNumber valide  

###### 4.2.3.1.2 Notes

- Aucun accès à MongoDB  
- Aucun stub nécessaire  
- Test purement fonctionnel

---

##### 4.2.3.2 `resolveCatwayIdentifier`

Ce middleware résout l’identifiant hybride et attache le catway trouvé à `req.catway`.

###### 4.2.3.2.1 Scénarios testés

- **200** + attachement `req.catway` si ObjectId valide  
- **200** + attachement `req.catway` si catwayNumber valide  
- **404** si catway introuvable  
- **500** si erreur interne (stub Mongoose)  
- Vérification que `findOne` n’est pas appelé si ObjectId valide (priorité respectée)

###### 4.2.3.2.2 Notes

- Les dépendances Mongoose (`findById`, `findOne`) sont stubées via Sinon  
- Le middleware est testé isolément, sans Express réel  
- Le contrôleur ne contient plus aucune logique de validation ou de recherche

---

##### 4.2.3.3 Mise à jour des tests du contrôleur

Le contrôleur `getCatwayById` étant désormais minimaliste, les tests associés sont simplifiés :

- **200** si `req.catway` est présent  
- Aucun test de validation ou de recherche (gérés par les middlewares)

---

### 4.3 Création d'un Catway - Payload Catways (Issue‑27)

L’issue‑27 introduit la création d’un catway via :

```txt
POST /catways
```

Elle ajoute deux middlewares métier et met à jour le contrôleur Catways.

---

#### 4.3.1 `validateCatwayPayload`

Ce middleware valide les données métiers nécessaires à la création ou à la mise à jour complète d’un catway.

##### 4.3.1.1 Scénarios testés

- **400** si un champ requis est manquant (`catwayNumber`, `type`, `catwayState`)  
- **400** si `catwayNumber` n’est pas un entier positif  
- **400** si `type` n’est pas `short` ou `long`  
- **400** si `catwayState` est vide ou invalide  
- **next()** si le payload est valide  

##### 4.3.1.2 Notes

- aucun accès à MongoDB  
- test purement fonctionnel  
- isolation totale du middleware  

---

#### 4.3.2 `validateCatwayPartialPayload` (placeholder)

Ce middleware est introduit dans l’issue‑27 mais sera implémenté dans l’issue‑29.

Même s’il ne contient aucune logique, **il doit être testé**.

##### 4.3.2.1 Scénario testé

- `next()` doit être appelé une fois  
- aucune réponse HTTP ne doit être envoyée  
- aucun contrôle métier n’est effectué  

##### 4.3.2.2 Motivations

- garantir la continuité du pipeline middleware → contrôleur  
- éviter les régressions lors de l’implémentation future  
- maintenir la cohérence des tests de niveau‑1  

---

#### 4.3.3 `createCatway`

Le contrôleur `createCatway` est désormais minimaliste grâce au middleware `validateCatwayPayload`.

##### 4.3.3.1 Scénarios testés

- **201** si le catway est créé (stub `Catway.create`)  
- **409** si `catwayNumber` existe déjà (`E11000`)  
- **500** si une erreur interne survient  

##### 4.3.3.2 Notes

- le contrôleur ne valide plus le payload  
- les tests utilisent `afterEachRestore()` pour nettoyer les stubs  
- isolation totale du contrôleur  

---

### 4.4 Mise à jour (complète) d'un Catway - updateCatway (issue‑28)

L’issue‑28 introduit les tests unitaires du contrôleur `updateCatway`, responsable de la mise à jour complète d’un catway.

#### 4.4.1 Scénarios testés

- **200** si la mise à jour réussit  
  Le contrôleur applique les modifications et renvoie l’objet mis à jour.

- **409** si `catwayNumber` existe déjà (`E11000`)  
  Le contrôleur renvoie un conflit métier cohérent avec la création (issue‑27).

- **500** si une erreur interne survient  
  Ce test est distinct de celui de `resolveCatwayIdentifier` (issue‑26) car il concerne une
  autre source d’erreur : l’échec de `save()`.

#### 4.4.2 Notes

- `req.catway` est simulé (aucun middleware exécuté).
- `catway.save()` est stubé via Sinon.
- Aucun accès à MongoDB.
- Tests isolés et cohérents avec la stratégie de tests de la Phase 4.

---

### 4.5 Mise à jour (partielle) d'un Catway - patchCatway (issue‑29)

L’issue‑29 introduit les tests unitaires du middleware validateCatwayPartialPayload et du contrôleur patchCatway.

#### 4.5.1 validateCatwayPartialPayload

Scénarios testés :

- 400 si aucun champ n’est fourni
- 400 si catwayNumber est invalide
- 400 si type est invalide
- 400 si catwayState est vide
- next() si payload partiel valide

Notes :

- Le middleware ne modifie pas req.catway.
- Aucun accès à la base.
- Tests isolés via mocks.

#### 4.5.2 patchCatway

Scénarios testés :

- 200 si mise à jour partielle réussie
- 409 si duplication catwayNumber (E11000)
- 500 si erreur interne (save())

Notes :

- req.catway est simulé.
- save() est stubé via Sinon.
- Le contrôleur ne valide pas les données (délégué au middleware).

---

### 4.6 Suppression d'un Catway - deleteCatway (issue‑30)

L’issue‑30 introduit les tests unitaires du contrôleur deleteCatway.

#### 4.5.1 Scénarios testés

- 204 si suppression réussie
  - deleteOne() résout correctement
  - res.status(204).send() est appelé

- 500 si erreur interne
  - deleteOne() lance une exception
  - le contrôleur renvoie un JSON d’erreur

#### 4.5.2 Notes

- req.catway est simulé via un objet contenant deleteOne().
- deleteOne() est stubé via Sinon.
- Le mockResponse() inclut désormais `send()`, nécessaire pour DELETE.
- Le contrôleur ne valide rien : les middlewares garantissent l’existence du catway.

---

## 5. Fichiers associés

- Tests : `tests/controllers/catwayController.test.js`
- Mocks : `tests/mocks/catway.mock.js`
- Contrôleur : `src/controllers/catwayController.js`

---

## 6. Résultats

### 6.1 issue-25 : liste des Catways

**Résultats des tests (issue-25) :**

![alt text](../assets/img_issue-25_resultats-tests-niveau-1.png)

### 6.2 issue-26 : détail d'un catway

**Résultats des tests (issue-26 - version initiale) et non régression :**

![alt text](../assets/img_issue-26_resultats-tests-niveau-1_initial.png)

**Résultats des tests (issue-26 - version hybride) et non régression :**

![alt text](../assets/img_issue-26_resultats-tests-niveau-1_hybride.png)

**Résultats des tests (issue-26 - version middlewares) et non régression :**

![alt text](../assets/img_issue-26_resultats-tests-niveau-1_middlewares.png)

### 6.3 issue-27 : création d'un catway

**Résultats des tests (issue-27) et non régression :**

![alt text](../assets/img_issue-27_resultats-tests-niveau-1.png)

### 6.4 issue-28 : mise à jour (complète) d'un catway

**Résultats des tests (issue-28) et non régression :**

![alt text](../assets/img_issue-28_resultats-tests-niveau-1.png)

### 6.5 issue-29 : mise à jour (partielle) d'un catway

**Résultats des tests (issue-29) et non régression :**

![alt text](../assets/img_issue-29_resultats-tests-niveau-1.png)

### 6.6 issue-30 : suppression d'un catway

**Résultats des tests (issue-30) et non régression :**

![alt text](../assets/img_issue-30_resultats-tests-niveau-1.png)
