# Tests de niveau‑2 : Tests d’intégration

Les tests d’intégration valident le fonctionnement complet des routes Express, en interaction avec Mongoose.

## Objectifs

- Vérifier le comportement réel des routes  
- Tester la logique Express + Mongoose  
- Valider les middlewares (ex : JWT)  
- Détecter les erreurs de câblage ou de configuration

## Outils

- **Supertest** : requêtes HTTP simulées  
- **MongoMemoryServer** : base MongoDB en mémoire

---

## Principes

- Le serveur Express est lancé dans un environnement de test  
- Une base MongoDB temporaire est créée en mémoire  
- Les modèles Mongoose sont réellement utilisés  
- Les contrôleurs et middlewares sont testés en conditions réelles

- Le secret JWT est défini dans les tests via `process.env.JWT_SECRET = 'testsecret'` afin de permettre la génération réelle du token.
- Les tests utilisent désormais des `ObjectId` valides pour éviter les CastError Mongoose.

---

## Scénarios testés

### 1. `POST /auth/register`

- 400 si champs manquants  
- 400 si email déjà utilisé (erreur MongoDB `E11000`)  
- 201 si création valide  

### 2. `POST /auth/login`

- 400 si champs manquants  
- 401 si identifiants invalides  
- 200 + token si identifiants valides  

### 3. `DELETE /auth/delete/:id` (route protégée)

- 401 si token manquant  
- 401 si token invalide  
- 404 si utilisateur introuvable (ObjectId valide mais non trouvé)  
- 200 si suppression valide  

---

## Exemples

### Issue 17 : tests du middleware JWT et des routes protégées

**Résultats des tests :**

![alt text](./assets/img_issue-17_resultats-tests-niveau-2.png)

---
