# 📖 Glossaire

**API REST**  
Interface de programmation permettant d’accéder à des ressources via des requêtes HTTP standardisées (GET, POST, PATCH, DELETE).  
L’API est *stateless* : aucune session n’est conservée côté serveur.

**Catway**  
Petit appontement permettant d’amarrer un bateau. Ressource principale de l’API.

**Réservation**  
Blocage d’un catway pour une période donnée (check‑in / check‑out).

**Utilisateur (User)**  
Personne disposant d’un compte permettant d’accéder aux fonctionnalités protégées de l’API.

**JWT (JSON Web Token)**  
Jeton signé permettant d’authentifier un utilisateur.  
Transmis dans l’en‑tête HTTP :  

```js
Authorization: Bearer <token>
```

**Stateless**  
Principe selon lequel le serveur ne conserve aucune session.  
L’authentification repose uniquement sur le JWT envoyé à chaque requête.

**Endpoint**  
URL représentant une ressource de l’API (ex : `/catways`, `/users/:id`).

**Payload**  
Contenu JSON envoyé dans une requête POST ou PATCH.

**Middleware**  
Fonction exécutée avant un contrôleur pour valider, filtrer ou enrichir la requête (ex : validation d’ID, vérification JWT).

**MongoMemoryServer**  
Base MongoDB en mémoire utilisée pour les tests (rapide, isolée, sans persistance).

**Token**  
Synonyme de JWT dans le contexte de l’API.

**Dashboard**  
Interface utilisateur (pages EJS) consommant l’API REST.

**Déprécié**  
Fonctionnalité encore présente mais destinée à disparaître.  
Les routes dépréciées ne sont **pas** documentées dans la v1.0.0.

---
