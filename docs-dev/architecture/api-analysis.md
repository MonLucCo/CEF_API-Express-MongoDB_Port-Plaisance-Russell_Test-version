# Analyse technique — Version v0.2.0‑dev  

Ce document présente l’analyse technique réalisée après la validation pré‑déploiement de la version **v0.2.0‑dev**.  
Il constitue la base des corrections apportées dans la version corrective **v0.2.1‑dev**.

---

## 1. Contexte

La version `v0.2.0‑dev` a été soumise au pipeline de validation pré‑déploiement (étape 5).  
Les tests ont révélé une faille de sécurité majeure et plusieurs incohérences architecturales.

---

## 2. Faille de sécurité identifiée

### 2.1 Route non protégée

La route suivante est accessible sans authentification :

```js
POST /api/auth/register
```

Conséquences :

- création d’utilisateurs non contrôlée  
- incohérence avec la politique de sécurité (API privée)  
- incohérence avec les routes Catways/Reservations (toutes protégées)

---

## 3. Analyse des routes existantes

### 3.1 Routes Auth

```js
POST /api/auth/register
POST /api/auth/login
DELETE /api/auth/delete/:id
```

Problèmes :

- mélange entre authentification et gestion des utilisateurs  
- non‑respect des principes REST  
- non‑conformité au sujet (création/modification/suppression utilisateur)

### 3.2 Absence de ressource User

Le sujet impose :

- création utilisateur  
- modification utilisateur  
- suppression utilisateur  

Mais aucune route n’est définie.

---

## 4. Décision architecturale

### 4.1 Séparation Auth / Users

- `/api/auth/` → authentification uniquement  
- `/api/users/` → gestion des utilisateurs

### 4.2 Privatisation stricte

Toutes les routes User doivent être protégées par JWT.

### 4.3 Ajout de la route de modification

```js
PUT /api/users/:id
```

### 4.4 Déplacement des routes existantes

- `POST /api/auth/register` → `POST /api/users`  
- `DELETE /api/auth/delete/:id` → `DELETE /api/users/:id`

---

## 5. Impacts techniques

### 5.1 Routes

- création d’un fichier `userRoutes.js`  
- mise à jour de `authRoutes.js`

### 5.2 Contrôleurs

- création de `userController.js`  
- déplacement de register (renommé createUser) et deleteUser  
- ajout de :
  - getUsers (liste des utilisateurs)
  - patchUser (mise à jour partielle)

---

## 5.3 Séparation stricte Middleware / Contrôleur (Users)

La version corrective **v0.2.1‑dev** introduit une architecture Users alignée avec celle des Catways et Reservations (issue‑26), fondée sur une séparation stricte entre :

- **les middlewares** : validation syntaxique, validation métier, résolution d’identifiant  
- **les contrôleurs** : logique métier pure, sans validation ni accès direct aux paramètres bruts

### 5.3.1 Motivations

- éviter la duplication de logique dans les contrôleurs  
- garantir une architecture cohérente avec les modules Catways/Reservations  
- centraliser la validation des identifiants et des payloads  
- renforcer la sécurité (aucune fuite d’information sur l’existence d’un utilisateur)  
- simplifier les tests unitaires et d’intégration  
- préparer la documentation API (Phase 8)

### 5.3.2 Middlewares introduits

- **validateUserId**  
  Vérifie la validité syntaxique de l’identifiant (`ObjectId`).  
  Ne réalise aucune opération en base.

- **resolveUserIdentifier**  
  Résout l’identifiant, récupère l’utilisateur et l’attache à `req.user`.  
  Retourne 404 si l’utilisateur n’existe pas.

- **validateUserPayload**  
  Valide les champs obligatoires pour la création (`POST /api/users`).

- **validateUserPayloadPartial**  
  Valide les champs optionnels pour la mise à jour partielle (`PATCH /api/users/:id`).  
  Exige au moins un champ valide.

### 5.3.3 Impacts sur les contrôleurs

Grâce à cette séparation stricte :

- les contrôleurs Users deviennent minimalistes  
- aucune validation n’est dupliquée  
- aucune logique de résolution n’est présente dans les contrôleurs  
- la logique métier est isolée et testable  
- les réponses sont sécurisées (pas de fuite du hash bcrypt)

### 5.3.4 Résultat

L’architecture Users est désormais :

- cohérente avec Catways/Reservations  
- sécurisée  
- testable  
- conforme aux bonnes pratiques REST  
- prête pour les tests de l’étape 6‑c (niveaux 1 → 3)

---

### 5.4 Tests

- mise à jour des tests unitaires  
- mise à jour des tests d’intégration  
- mise à jour des tests E2E simulés  
- mise à jour de la collection Postman

---

## 6. Conclusion

Cette analyse constitue la base de la version corrective **v0.2.1‑dev**, dont les corrections sont décrites dans la section [2.5.1.6.2 de `architecture.md`](../architecture.md#25161--analyse-technique-de-la-version-v020dev).

---
