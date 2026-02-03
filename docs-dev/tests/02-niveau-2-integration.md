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

## **Principes**

- Le serveur Express est lancé dans un environnement de test  
- Une base MongoDB temporaire est créée en mémoire  
- Les modèles Mongoose sont réellement utilisés  
- Les contrôleurs et middlewares sont testés en conditions réelles

## **Exemple**

Issue‑16 : tests du middleware JWT et des routes protégées.
