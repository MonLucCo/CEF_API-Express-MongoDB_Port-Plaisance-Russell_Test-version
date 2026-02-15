# Import des données JSON dans MongoDB

Issue‑20B — Phase 3 : Modèles & données

Ce document décrit la procédure d’import des données initiales dans MongoDB.

---

## 1. Fichiers JSON

Les données sont stockées dans le dossier `data/` :

- `users.json`
- `catways.json`
- `reservations.json`

Le fichier `users.json` contient au moins un utilisateur administrateur avec un mot de passe déjà hashé.

---

## 2. Script d’import

Le script `scripts/import-data.js` :

- se connecte à la base de données de MongoDB
- supprime les collections existantes
- importe les données JSON
- affiche des logs détaillés
- ferme proprement la connexion

Le script utilise le module de connexion MongoDB `src/db/mongo.js` qui centralise :

- la connexion (`initClientDBConnection`)
- la déconnexion (`disconnectClientDBConnection`).

> ⚠️ **Attention** — Ce script réinitialise entièrement la base de données :
>
> - suppression des collections `users`, `catways`, `reservations`
> - réinsertion complète des données JSON
>
> **Ne pas exécuter ce script sur une base contenant des données réelles.**

---

## 3. Commande d’exécution

```bash
npm run import:data
```

---

## 4. Création de la base dans MongoDB Atlas

MongoDB Atlas impose qu’une base contienne au moins une collection lors de sa création.
Cette collection n’a aucune importance pour l’API.

### 4.1 Étapes dans MongoDB Atlas

1. Dans Atlas, cliquer sur “Create Database”.
2. Saisir :
   - **Database Name** : `port-plaisance-russell`
   - **Collection Name** : `placeholder`
3. Ne pas cocher “Time-series”.
4. Valider.

La collection `placeholder` peut être supprimée après l’import.
Les collections réelles (`users`, `catways`, `reservations`) seront créées automatiquement par Mongoose lors de l’exécution du script `import-data.js`.

### 4.2 Création de la base dans MongoDB Atlas

MongoDB Atlas impose qu’une base contienne au moins une collection lors de sa création.
Cette collection (ex : `placeholder`) n’a aucune utilité pour l’API.

Le script `import-data.js` :

- supprime automatiquement la collection `placeholder` si elle existe
- crée les collections réelles (`users`, `catways`, `reservations`)
- réinitialise entièrement la base

---
