# Tests Authentification de niveau‑1 : Tests unitaires

Les tests unitaires valident la logique métier de manière isolée.  
Ils ne dépendent d’aucune base de données ni d’aucun service externe.

## 1. Objectifs

- Vérifier les comportements métier  
- Tester les branches conditionnelles  
- Garantir la robustesse des contrôleurs et middlewares  
- Empêcher les régressions lors des évolutions

## 2. Outils

- **Mocha** : moteur de tests  
- **Chai** : assertions  
- **Sinon** : stubs, spies, mocks

## 3. Principes

- Chaque dépendance externe est stubée :  
  - `User.findOne`, `User.create`, `User.findByIdAndDelete`  
  - `user.comparePassword`  
  - `jwt.sign`, `jwt.verify`
- Centralisation dans le fichier `tests.mock.js` des fonctions communes aux tests unitaires :
  - `mockResponse()` : simule la réponse Express `res.status().json()`
  - `mockNext()` : spy pour les middlewares
  - `afterEachRestore()` : restaure automatiquement les stubs/spies Sinon après chaque test
- Centralisation des stubs JWT dans `jwt.mock.js` :
  - `mockJwtVerify()` : simule un token valide
  - `mockJwtVerifyError()` : simule les erreurs JWT (invalide, expiré…)
  - `mockJwtSign()` : simule la génération d’un token
- Aucun accès à MongoDB  
- Chaque test est isolé

- Les tests unitaires du contrôleur `authController` ont été mis à jour suite à l’issue‑17 :
  - utilisation d’`ObjectId` valides pour tester `deleteUser`
  - gestion du cas `ID invalide → 400`
  - gestion du cas `email déjà utilisé → 400`
  - simulation d’erreurs internes via `mockDeleteError()`
- Les stubs sont restaurés automatiquement via `afterEachRestore()`, sauf pour les stubs créés dans les helpers qui nécessitent un `restore()` explicite.

---

## 4. Scénarios testés

### 4.1 `register()` (issue‑15 → issue‑17)

#### 4.1.1 Scénarios testés

- **201** si création valide
- **400** si champs manquants
- **400** si email déjà utilisé (`E11000`)
- **500** si erreur interne

#### 4.1.2 Notes

- Le hashage bcrypt est stubé
- La validation structurelle du modèle User est testée indirectement

---

### 4.2 `login()` (issue‑15 → issue‑17)

#### 4.2.1 Scénarios testés

- **400** si champs manquants
- **401** si identifiants invalides
- **200** + token si identifiants valides

#### 4.2.2 Notes

- `comparePassword()` est stubé
- `jwt.sign()` est stubé

---

### 4.3 `deleteUser()` (issue‑17)

#### 4.3.1 Scénarios testés

- **400** si ObjectId invalide
- **404** si utilisateur introuvable
- **200** si suppression valide
- **500** si erreur interne

#### 4.3.2 Notes

- Utilisation d’ObjectId valides pour éviter les CastError
- Cohérence avec les tests d’intégration

---

### 4.4 `authMiddleware` (issue‑16)

#### 4.4.1 Scénarios testés

- **401** si token manquant
- **401** si token invalide
- **next()** si token valide

#### 4.4.2 Notes

- `jwt.verify()` est stubé
- Le middleware est testé isolément

---

## 5. Résultats

### 5.1 Issue‑15 : tests unitaires du contrôleur `authController.js`

**Résultats des tests (issue-15) :**

![alt text](../assets/img_issue-15_resultats-tests-niveau-1.png)

---

### 5.2 Issue‑16 : tests unitaires du middleware `authMiddleware.js`

**Résultats des tests (issue 15 : non-regression) et (issue 16 : consommation):**

![alt text](../assets/img_issue-16_resultats-tests-niveau-1.png)

---

### 5.3 Issue‑17 : mise à jour des tests unitaires du contrôleur `authController.js`

Les tests unitaires ont été adaptés pour refléter les évolutions du contrôleur :

- ajout du contrôle `mongoose.Types.ObjectId.isValid()`  
- gestion de l’erreur MongoDB `E11000`  
- mise à jour des tests de `deleteUser` :
  - 400 si ID invalide  
  - 404 si utilisateur introuvable  
  - 200 si suppression valide  
  - 500 en cas d’erreur interne  

Ces tests garantissent la cohérence entre la logique métier et les tests d’intégration.

**Résultats des tests (issues 15 et 16 : non-régression) et (issue 17 : intégration):**

![alt text](../assets/img_issue-17_resultats-tests-niveau-1.png)

---
