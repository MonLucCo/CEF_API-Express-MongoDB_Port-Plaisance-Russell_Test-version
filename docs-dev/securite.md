# Sécurité du projet

**En préambule** : cette version initiale du document présente la situation de sécurité envisagée pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

Ce document présente les mesures de sécurité mises en place dans l’API REST du Port de Plaisance Russell.  
L’objectif est de protéger les données, limiter les attaques courantes et garantir un comportement robuste en production.

---

## 🔐 Helmet

La librairie **Helmet** est utilisée pour renforcer les headers HTTP et réduire l’exposition de l’API à plusieurs attaques :

- XSS (Cross‑Site Scripting)
- Clickjacking
- MIME sniffing
- Exposition d’informations sensibles dans les headers
- Mauvaises configurations de cache

Helmet est activé globalement dans `app.js`.

---

## 🌍 CORS

La librairie **cors** est utilisée pour contrôler les accès cross‑origin.

- En développement : accès ouvert pour faciliter les tests.
- En production : restriction possible à un domaine spécifique (ex. : front-end officiel).

Cela permet d’éviter les requêtes non autorisées provenant d’autres origines.

---

## 🔑 Authentification

L’API utilise un système d’authentification sécurisé basé sur :

- **bcrypt** pour le hashage des mots de passe  
- **JWT** pour la gestion des sessions  
- un **middleware d’authentification** pour protéger les routes sensibles  

Les tokens JWT sont transmis via le header `Authorization: Bearer <token>`.

---

## 🛡️ Bonnes pratiques appliquées

### ✔️ Protection des données sensibles

- Aucun mot de passe n’est stocké en clair.
- Les variables sensibles sont placées dans `.env`.
- Le fichier `.env` n’est jamais versionné.

### ✔️ Validation des données

- Les entrées utilisateur sont validées côté serveur.
- Les erreurs sont gérées proprement pour éviter les fuites d’informations.

### ✔️ Gestion des erreurs

- Les erreurs serveur ne renvoient jamais de détails techniques.
- Un middleware global gère les réponses d’erreur.

### ✔️ Sécurisation des routes

- Les routes critiques sont protégées par le middleware JWT.
- Les opérations CRUD sensibles nécessitent une authentification.

### ✔️ Sécurité MongoDB

- Connexion via URI sécurisé (MongoDB Atlas).
- Utilisation d’un utilisateur dédié avec permissions limitées.
- Pas de droits administrateur dans l’application.

---

## 🚧 Améliorations possibles (non obligatoires pour ce projet)

Ces éléments peuvent être ajoutés ultérieurement :

- **Rate limiting** (limiter le nombre de requêtes par minute)
- **Brute-force protection** sur les routes d’authentification
- **Audit des logs** (tentatives de connexion, erreurs critiques)
- **CSP personnalisée** via Helmet pour le front minimal

---

## 🎯 Objectif

Garantir une API robuste, sécurisée et conforme aux bonnes pratiques Express/MongoDB, tout en restant simple et adaptée au cadre pédagogique du projet.
