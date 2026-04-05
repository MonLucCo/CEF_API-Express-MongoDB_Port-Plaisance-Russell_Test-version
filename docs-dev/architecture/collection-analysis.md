# Collection Postman - validation opérationnelle des fonctions de l'API

Ce document décrit la démarche et le contenu d'une collection Postman mise en oeuvre dans le cadre de la reprise de conception de la version v0.2 de l'API du Port de Plaisance Russell.

Cette démarche est détaillée dans le document d'[architecture](../architecture.md#2516-etape-6---analyse-technique-et-corrections-de-la-version-à-déployer-v021-dev) et se réalise en plusieurs [incréments techniques](../architecture.md#25163--tests-développeurs-niveaux-1-à-4-pour-v021dev-étape-6c).

Ce document se concentre sur l'incrément 2 qui concerne la mise en place d'une collection Postman pour tester l'ajout fonctionnel lié aux Utilisateurs afin de résoudre la faille de sécurité identifiée dans les tests de pré-déploiement de la version v0.2.0-dev.

---

## 1. Objectif de l’incrément 2

L’incrément 2 de l’étape 6‑c consiste à :

- produire une **collection Postman opérationnelle** pour la version corrective `v0.2.1-dev` (développée à l'incrément 1)  
- valider les nouvelles routes Users en conditions réelles (niveau‑4)  
- vérifier la cohérence des routes privatisées (Catways, Reservations)  
- maintenir temporairement les routes `auth/register` et `auth/delete`  
- préparer l’incrément 3 (suppression de ces routes et finalisation de la version)

Cet incrément constitue la **validation opérationnelle** de l’API avant nettoyage final.

---

## 2. Nommage des collections Postman (niveau‑4)

Un nouveau format de nommage est adopté pour les collections Postman :

```js
<objet>_<version>_<usage>.json
```

**Avec :**

- **`<objet>`** : `API-Port-Russell`
- **`<version>`** : version de l’API (ex. `v0.2.1-dev`)
- **`<usage>`** : usage de la collection  
  - `00-Tests-6c-inc1` → tests opérationnels de l’incrément 1  
  - `01-PreDeploy` → tests de pré‑déploiement de la version finale

**Collections créées :**

| Fichier                                             | Rôle                                                               |
|-----------------------------------------------------|--------------------------------------------------------------------|
| `API-Port-Russell_v0.2.0-dev_01-PreDeploy.json`     | Collection historique de pré‑déploiement v0.2.0-dev                |
| `API-Port-Russell_v0.2.1-dev_00-Tests-6c-inc1.json` | Collection opérationnelle pour tester l’incrément 1 de l’étape 6‑c |

---

## 3. Contenu de la collection `API-Port-Russell_v0.2.1-dev_00-Tests-6c-inc1.json`

Cette collection permet de tester **toutes les fonctionnalités introduites ou modifiées** dans l’incrément 1.

### 3.1. Auth (temporaire)

Les routes suivantes sont encore présentes pour permettre les tests :

- `POST /api/auth/login`  
- `POST /api/auth/register` *(temporaire)*  
- `DELETE /api/auth/delete/:id` *(temporaire)*  

Elles seront supprimées à l’incrément 3.

### 3.2. Users (nouveau module complet)

Toutes les routes Users sont testées :

- `GET /api/users`  
- `POST /api/users`  
- `PATCH /api/users/:id`  
- `DELETE /api/users/:id`  

Les tests couvrent :

- cas nominaux  
- erreurs de validation  
- erreurs MongoDB  
- erreurs de résolution d’identifiant  
- cohérence des statuts HTTP  
- privatisation JWT

### 3.3. Catways (vérification de la privatisation)

Seule la route suivante est testée :

- `GET /api/catways`

Objectif : vérifier que la privatisation JWT est correctement appliquée.

### 3.4. Reservations (vérification de la privatisation)

Seule la route suivante est testée :

- `GET /api/catways/:id/reservations`

Objectif : vérifier que la privatisation JWT est correctement appliquée.

---

## 4. Variables de collection

La collection utilise les variables suivantes :

| Variable               | Type       | Rôle                                    |
|------------------------|------------|-----------------------------------------|
| `base_url`             | collection | URL du serveur                          |
| `base_api`             | collection | préfixe `/api`                          |
| `token`                | collection | JWT généré par login                    |
| `user_id`              | collection | ID dynamique pour Users                 |
| `catway_id`            | collection | ID dynamique pour Catways               |
| `reservation_id`       | collection | ID dynamique pour Reservations          |
| `catwayForReservation` | collection | numéro de catway utilisé pour les tests |

Les variables dynamiques (`user_id`, `catway_id`, `reservation_id`) sont **réinitialisées** dans les scripts Postman après suppression.

---

## 5. Scripts Postman (Tests)

### 5.1. Script de login

```js
let json = pm.response.json();
if (json.token) pm.collectionVariables.set("token", json.token);
```

### 5.2. Script de création d’utilisateur

```js
let json = pm.response.json();
if (json.user) pm.collectionVariables.set("user_id", json.user.id);
```

### 5.3. Script de suppression d’utilisateur

```js
if (pm.response.code === 200) pm.collectionVariables.set("user_id", "");
```

---

## 6. Résultat de l’incrément 2

L’incrément 2 permet de :

- valider l’intégration complète du module Users  
- vérifier la cohérence des routes privatisées  
- stabiliser la version corrective `v0.2.1-dev`  
- préparer la suppression des routes Auth/register & Auth/delete  
- préparer la collection finale de pré‑déploiement

Cet incrément constitue la **validation opérationnelle** de l’API avant nettoyage final.

---

## 7. Prochaines étapes

### 7.1 Incrément 3

- suppression de `auth/register`  
- suppression de `auth/delete/:id`  
- suppression des tests associés  
- mise à jour de la collection Postman  
- création de `API-Port-Russell_v0.2.1-dev_01-PreDeploy.json`

### 7.2 Incrément 4

- mise à jour documentaire finale  
- finalisation de l’étape 6‑c  
- clôture de l’étape 6 de l’issue‑37

---
