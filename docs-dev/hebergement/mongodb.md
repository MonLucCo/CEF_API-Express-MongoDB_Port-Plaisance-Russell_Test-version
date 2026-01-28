
# Base de données MongoDB (MongoDB Atlas)

**En préambule** : cette version initiale du document présente la configuration prévue pour la base de données MongoDB du projet. Elle sera ajustée lors de la mise en œuvre réelle.  
La version finale lors de la livraison du projet fera l’objet d’une actualisation en ne conservant que les éléments réellement mis en place.

---

## Objectif

Créer et configurer la base MongoDB utilisée par l’API REST du Port de Plaisance Russell.

---

## Création du cluster

1. Accéder à MongoDB Atlas
2. Créer un cluster (Shared ou Serverless selon les besoins)
3. Choisir la région la plus proche (ex. : Europe)

---

## Création de la base

Dans le cluster :

- créer une base dédiée (ex. : `port-plaisance`)
- créer les collections lors du développement (catways, reservations, users…)

---

## Création de l’utilisateur

Créer un utilisateur MongoDB avec :

- un nom dédié au projet
- un mot de passe sécurisé
- des permissions limitées à la base du projet

---

## URI de connexion

L’URI est fournie par MongoDB Atlas :

```txt
mongodb+srv://<user>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

Elle doit être stockée dans :

- `.env` en local  
- variables d’environnement Alwaysdata en production  

---

## Sécurité

- ne jamais versionner les identifiants  
- utiliser un utilisateur dédié  
- limiter les permissions  
- activer les IP autorisées (whitelist)  
- ajouter l’IP d’Alwaysdata lors du déploiement

---

## Tests de connexion

Un test minimal peut être réalisé via un script Node.js ou directement dans l’API :

```js
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
```

---

## Étapes suivantes

- Intégrer Mongoose dans l’API
- Créer les modèles
- Tester les opérations CRUD
- Vérifier la connexion depuis Alwaysdata lors du premier déploiement

---
