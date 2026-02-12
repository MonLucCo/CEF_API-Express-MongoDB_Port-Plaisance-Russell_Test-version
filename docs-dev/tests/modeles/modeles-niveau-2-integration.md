# Tests de Modélisation — Niveau 2 (Tests d’intégration)

Les tests d’intégration valident le comportement réel des modèles Mongoose en interaction avec une base MongoDB en mémoire.  
Ils constituent le **niveau 2** de la stratégie globale de tests.

---

## Objectif

Tester les modèles en conditions réelles :

- connexion Mongoose réelle  
- base MongoDB isolée (MongoMemoryServer)  
- insertion (`save()`), recherche (`find()`), suppression (`delete()`)  
- gestion des erreurs MongoDB (`E11000`, `CastError`)  
- vérification des timestamps  
- validation complète du schéma en situation réelle  

Ces tests garantissent que les modèles sont prêts à être utilisés dans les routes Express (niveau‑2 fonctionnel).

---

## Outils utilisés

- **Mocha** : moteur de tests  
- **Chai** : assertions  
- **Mongoose** : ODM  
- **MongoMemoryServer** : base MongoDB en mémoire, jetable et isolée  

---

## Modèle testé : Catway (issue‑18)

### Tests réalisés

- insertion valide (`save()`)  
- unicité (`unique`) → erreur MongoDB `E11000`  
- type invalide (`enum`)  
- `catwayNumber < 1`  
- champ requis manquant (`catwayState`)  
- vérification des timestamps (`createdAt`, `updatedAt`)  

### Fichier associé

`tests/modeles/catway.integration.test.js`

---

## Scénarios testés

### ✔ Insertion valide

- un catway complet est inséré  
- un `_id` est généré  
- les timestamps sont présents  

### ✔ Unicité (`unique`)

- insertion d’un premier catway `catwayNumber = 1`  
- tentative d’insertion d’un second catway avec le même numéro  
- MongoDB renvoie `error.code = 11000`  

### ✔ Enum invalide

- `type = "medium"` → rejeté  

### ✔ Min invalide

- `catwayNumber = 0` → rejeté  

### ✔ Champ requis manquant

- absence de `catwayState` → rejeté  

---

## 🚫 Ce qui n’est **pas** testé au niveau 2

- logique métier (contrôleurs)  
- routes Express (tests d’intégration fonctionnels)  
- scénarios complets (tests E2E)  

Ces éléments sont testés dans les niveaux supérieurs.

---

## 📎 Références

- Stratégie globale des tests : [docs-dev/tests-strategy.md](../../tests-strategy.md)  
- Tests unitaires des modèles : [docs-dev/tests/modeles/modeles-niveau-1-unitaires.md](./modeles-niveau-1-unitaires.md)  
- Tests E2E : `docs-dev/tests/modeles/modeles-niveau-3-e2e.md` (sera ajouté lors de l'issue-22)

---

## 📸 Résultats (issue‑18)

![Résultats des tests Catway niveau‑2](../assets/img_issue-18_resultats-tests-niveau-2.png)

---
