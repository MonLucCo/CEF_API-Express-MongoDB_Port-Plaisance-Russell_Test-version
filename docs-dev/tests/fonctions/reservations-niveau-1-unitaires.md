# Tests Reservations de niveau‑1 : Tests unitaires

Les tests unitaires valident la logique métier du contrôleur Reservations de manière isolée.  
Ils ne dépendent d’aucune base de données ni d’aucun service externe.

---

## 1. Objectifs

- Vérifier le comportement métier de `reservationController`
- Tester les branches conditionnelles
- Garantir la robustesse des contrôleurs avant l’intégration
- Empêcher les régressions lors des évolutions (issues 33 → 36)

---

## 2. Outils

- **Mocha** : moteur de tests  
- **Chai** : assertions  
- **Sinon** : stubs, spies, mocks

---

## 3. Principes

- Le modèle Mongoose `Catway` est entièrement stubé via `catway.mock.js`
- Les tests utilisent les helpers centralisés dans `tests.mock.js` :
  - `mockResponse()` : simule `res.status().json()`
  - `afterEachRestore()` : restaure automatiquement les stubs Sinon
- Aucun accès à MongoDB
- Chaque test est isolé

---

## 4. Scénarios testés

### 4.1 `getReservationsByCatway()` (issue‑33)

- 200 + liste des réservations si `Reservation.find()` réussit  
- 500 si `Reservation.find()` lance une erreur

---

## 5. Fichiers associés

- Tests : `tests/controllers/reservationController.test.js`
- Mocks : `tests/mocks/reservation.mock.js`
- Contrôleur : `src/controllers/reservationController.js`

---

## 6. Résultats

### 6.1 issue-33 : liste des Reservations d'un Catway

**Résultats des tests (issue-33) :**

![alt text](../assets/img_issue-33_resultats-tests-niveau-1.png)
