# Tests Reservations de niveau‑2 : Tests d’intégration

Les tests d’intégration valident le fonctionnement réel des routes Reservations, en interaction avec Express, Mongoose et MongoDB.

---

## 1. Objectifs

- Vérifier le comportement réel de la route `GET /catways/:id/...`
- Tester l’intégration Express + Mongoose
- Détecter les erreurs de câblage ou de configuration
- Garantir la cohérence entre contrôleur, modèle et route

---

## 2. Outils

- **Supertest** : requêtes HTTP simulées  
- **MongoMemoryServer** : base MongoDB en mémoire  
- **Mocha / Chai** : assertions

---

## 3. Principes

- Le serveur Express (`src/app.js`) est utilisé tel quel
- Une base MongoDB temporaire est créée en mémoire
- Le modèle `Reservation` est réellement utilisé
- Aucun mock → vrai test d’intégration
- Nettoyage de la base avant chaque test

---

## 4. Scénarios testés

### 4.1 `GET /catways/:id/reservation` (issue‑33)

- 200 — tableau vide si aucune réservation  
- 200 — liste des réservations si des documents existent  
- Vérification des champs (boatName, clientName, checkIn, checkOut, catwayNumber)

---

## 5. Fichiers associés

- Tests : `tests/integration/reservations.routes.test.js`
- Modèle : `src/models/reservation.js`
- Routes : `src/routes/reservationRoutes.js`

---

## 6. Résultats

### 6.1 issue-33 : route de la liste des reservations d'un catway

**Résultats des tests (issue-33) :**

![alt text](../assets/img_issue-33_resultats-tests-niveau-2.png)
