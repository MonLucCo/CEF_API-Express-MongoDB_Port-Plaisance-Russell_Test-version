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
- déplacement de register et deleteUser  
- ajout de updateUser

### 5.3 Tests

- mise à jour des tests unitaires  
- mise à jour des tests d’intégration  
- mise à jour des tests E2E simulés  
- mise à jour de la collection Postman

---

## 6. Conclusion

Cette analyse constitue la base de la version corrective **v0.2.1‑dev**, dont les corrections sont décrites dans la section [2.5.1.6.2 de `architecture.md`](../architecture.md#25161--analyse-technique-de-la-version-v020dev).

---
