
# Base de données MongoDB (MongoDB Atlas)

**En préambule** : cette version initiale du document présente la configuration prévue pour la base de données MongoDB du projet. Elle sera ajustée lors de la mise en œuvre réelle.  
La version finale lors de la livraison du projet fera l’objet d’une actualisation en ne conservant que les éléments réellement mis en place.

---

## 1. Objectif

Créer et configurer la base MongoDB utilisée par l’API REST du Port de Plaisance Russell.

---

## 2. Initialisation MongoDB - Création de l'environnement

### 2.1 Création du cluster

1. Accéder à MongoDB Atlas
2. Créer un cluster (Shared ou Serverless selon les besoins)
3. Choisir la région la plus proche (ex. : Europe)

---

### 2.2 Création de la base

Dans le cluster :

- créer une base dédiée (ex. : `port-plaisance`)
- créer les collections lors du développement (catways, reservations, users…)

---

### 2.3 Création de l’utilisateur

Créer un utilisateur MongoDB avec :

- un nom dédié au projet
- un mot de passe sécurisé
- des permissions limitées à la base du projet

---

### 2.4 URI de connexion

L’URI est fournie par MongoDB Atlas :

```txt
mongodb+srv://<user>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

Elle doit être stockée dans :

- `.env` en local  
- variables d’environnement Alwaysdata en production  

---

### 2.5 Sécurité

- ne jamais versionner les identifiants  
- utiliser un utilisateur dédié  
- limiter les permissions  
- activer les IP autorisées (whitelist)  
- ajouter l’IP d’Alwaysdata lors du déploiement

---

### 2.6 Tests de connexion

Un test minimal peut être réalisé via un script Node.js ou directement dans l’API :

```js
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
```

---

## 3. Intégration - Vérification de la connexion MongoDB (issue‑21)

Cette section décrit les étapes permettant de valider la connexion MongoDB après l’intégration du module `mongo.js`.

### 3.1 ✔ Vérification locale

Lancer l’API :

```bash
npm run dev
```

Résultats attendus :

```bash
🔌 Connexion à MongoDB (port-plaisance-russell)…
✅ Connexion MongoDB établie
🚀 Serveur démarré sur http://0.0.0.0:3000/
```

Si `DB_VERBOSE=true`, les options Mongoose sont affichées.

### 3.2 ✔ Vérification via Postman

1. `POST /auth/register` → statut 201  
2. `POST /auth/login` → token JWT valide  
3. `DELETE /auth/delete/:id` → statut 200  

### 3.3 ✔ Vérification dans MongoDB Atlas

- l’utilisateur est créé dans la collection `users`
- l’utilisateur est supprimé après le test `delete`
- aucune collection parasite (`placeholder`) n’est présente

### 3.4 ✔ Whitelist IP

En cas d’erreur :

```txt
Could not connect to any servers in your MongoDB Atlas cluster
```

Vérifier dans Atlas → **Network Access** que l’IP actuelle (ou celle du VPN) est autorisée.

---

## 4. Tests d’intégration réels (issue‑22)

Ces tests valident la résilience du serveur en conditions réelles, en simulant les erreurs MongoDB les plus courantes.  
Ils complètent les tests E2E simulés de l’issue‑17.

L'objectif est de vérifier que :

- le serveur ne démarre pas si MongoDB échoue  
- les erreurs sont normalisées  
- l’arrêt du serveur est propre  
- les logs sont cohérents et lisibles  

---

### 4.1 Test de contrôle (configuration OK)

```bash
npm run dev
CTRL + C
```

Résultats attendus :

- connexion MongoDB OK  
- serveur démarré  
- arrêt propre (SIGINT)  
- déconnexion MongoDB  

---

### 4.2 Mauvaise URI

Modifier `MONGODB_URI` dans `.env`.

Résultat attendu :

- serveur non démarré  
- erreur normalisée : `MONGO_DNS_ERROR` ou `MONGO_CONNECTION_FAILED`

---

### 4.3 Mauvais mot de passe

Modifier uniquement le mot de passe dans l’URI.

Résultat attendu :

- serveur non démarré  
- erreur normalisée : `MONGO_AUTH_FAILED` ou `MONGO_CONNECTION_FAILED`

---

### 4.4 Mauvais utilisateur

Modifier uniquement le nom d’utilisateur dans l’URI.

Résultat attendu :

- serveur non démarré  
- erreur normalisée : `MONGO_AUTH_FAILED` ou `MONGO_AUTH_NOT_ALLOWED`

---

### 4.5 Base inexistante (DBNAME incorrect)

MongoDB crée automatiquement la base.  
Résultat attendu :

- connexion établie  
- nouvelle base visible dans Atlas  
→ comportement normal de MongoDB

---

### 4.6 Timeout volontaire

Modifier dans `mongo.js` :

```js
serverSelectionTimeoutMS: 50
```

Résultat attendu :

- serveur non démarré  
- erreur normalisée : `MONGO_TIMEOUT` ou `MONGO_IP_NOT_WHITELISTED`

---

### 4.7 IP non whitelistée

Supprimer l’IP locale dans Atlas → Network Access.

Résultat attendu :

- serveur non démarré  
- erreur normalisée : `MONGO_IP_NOT_WHITELISTED`

---

### 4.8 Cluster inaccessible (simulation)

Méthodes possibles :

- couper le Wi‑Fi  
- supprimer toutes les IP autorisées  
- pauser le cluster (si disponible)

Résultat attendu :

- serveur non démarré  
- erreur normalisée : `MONGO_TIMEOUT` ou `MONGO_CONNECTION_FAILED`

---

### 4.9 Arrêt propre du serveur

```bash
npm run dev
CTRL + C
```

Résultat attendu :

- log SIGINT  
- déconnexion MongoDB  
- exit code 0  

---

### 4.10 Conclusion

Les tests confirment que :

- la gestion des erreurs MongoDB est fonctionnelle  
- les erreurs sont normalisées  
- le serveur est résilient  
- l’arrêt est propre  
- l’API est prête pour la Phase 4

---

## Étapes suivantes

- Tester les opérations CRUD
- Vérifier la connexion depuis Alwaysdata lors du premier déploiement

---
