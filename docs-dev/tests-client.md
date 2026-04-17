# Tests opérationnels Client (Phase 7)

## 1. Objectif

Valider les **9 fonctionnalités demandées par la capitainerie**, à savoir :

1. Créer un catway  
2. Lister tous les catways  
3. Récupérer les détails d’un catway  
4. Modifier la description d’un catway  
5. Supprimer un catway  
6. Prendre une réservation  
7. Supprimer une réservation  
8. Lister toutes les réservations  
9. Afficher les détails d’une réservation  

Ces tests sont destinés au Client et constituent la validation fonctionnelle du projet.

---

## 2. Outils

- **Mocha** : moteur de tests  
- **Supertest** : tests d’intégration API  
- **MongoMemoryServer** : base MongoDB éphémère  
- **createTestUser()** : création automatique d’un utilisateur + token JWT  
- **root-hooks.js** : configuration globale des tests (chargement `.env`, MongoMemoryServer, nettoyage)

---

## 3. Organisation des fichiers

Les tests Client sont regroupés dans un dossier dédié :

```txt
tests/client/
 ├── catways.client.test.js
 └── reservations.client.test.js
```

- Chaque fichier couvre une partie des 9 fonctionnalités.

---

## 4. Préparation de l’environnement de test

Les tests Client utilisent automatiquement :

- **MongoMemoryServer** (base isolée, jamais la base réelle)
- **dotenv** (chargé avant tout via `root-hooks.js`)
- **nettoyage complet des collections avant chaque test**

Aucune configuration supplémentaire n’est nécessaire dans les fichiers de tests.

---

## 5. Exécution automatique

Les tests Client doivent s’exécuter automatiquement **au lancement local** de l’application.

### Script dédié

```json
"tests:client": "mocha --require tests/root-hooks.js tests/client/**/*.test.js --exit"
```

### Exécution automatique

```json
"start": "npm run tests:client && node src/server.js",
"dev": "npm run tests:client && nodemon src/server.js"
```

Ainsi :

- `npm start` → exécute les tests Client → lance l’API  
- `npm run dev` → exécute les tests Client → lance l’API en mode dev  
- **aucune exécution en production** (Alwaysdata)

---

## 6. Périmètre exact

Les tests Client couvrent **uniquement** les 9 fonctionnalités métier.  
Les tests techniques (auth, users, erreurs, contrôleurs, modèles…) restent dans :

```bash
docs-dev/tests-developers.md
```

Cette séparation garantit une validation claire et conforme au sujet du devoir.

---

## 7. Résultats attendus

Lors du lancement local :

- les 9 tests passent  
- la base réelle n’est jamais modifiée  
- les résultats s’affichent dans la console  
- l’application démarre ensuite normalement

---

## 8. Conclusion

Ce document décrit la structure, l’environnement et le périmètre des tests Client de la Phase 7.  
Il complète :

- `docs-dev/tests-strategy.md`  
- `docs-dev/tests/client/tests-fonctionnalites.md`  

et constitue la référence pour les tests des fonctions demandées par le Client.

---
