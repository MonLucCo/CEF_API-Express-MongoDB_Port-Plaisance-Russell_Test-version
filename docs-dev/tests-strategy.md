# Stratégie de tests

**En préambule** : cette version initiale du document présente la situation des tests prévus pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

## Organisation des tests

### Organisation technique

La stratégie de tests repose sur trois niveaux complémentaires, introduits progressivement dans les issues 15 à 17.

#### Niveau‑1 : Tests unitaires

- Outils : **Mocha**, **Chai**, **Sinon**  
- Objectif : tester la logique métier de manière isolée  
- Aucune base de données  
- Les dépendances (Mongoose, bcrypt, JWT) sont remplacées par des stubs  
- Les tests couvrent désormais :
  - contrôleur `authController` (register, login, deleteUser)
  - middleware JWT (issue‑16)
- Les stubs Mongoose incluent maintenant :
  - `User.findOne`
  - `User.create`
  - `User.findByIdAndDelete`
- Les tests de `deleteUser` utilisent désormais des **ObjectId valides** pour refléter le contrôle ajouté dans l’issue‑17.

### Niveau‑2 : Tests d’intégration

- Outils : **Supertest**, **MongoMemoryServer**  
- Objectif : tester les routes Express et leur interaction réelle avec Mongoose  
- Base MongoDB en mémoire  
- bcrypt et JWT réels  
- Les tests couvrent :
  - `/auth/register` (champs manquants, email déjà utilisé, création valide)
  - `/auth/login` (champs manquants, identifiants invalides, token valide)
  - `/auth/delete/:id` (401, 404, 200)
- Le secret JWT est défini dans les tests via `process.env.JWT_SECRET = 'testsecret'`  
  afin de permettre la génération réelle du token.

#### Niveau‑3 : Tests E2E

- Outils : **Postman**  
- Objectif : valider l’API complète en conditions réelles (déployées) ou simulées (locales)  
- Base MongoDB réelle ou en mémoire (locale)
- Scénarios complets : inscription, connexion, suppression, accès protégé  
- Exemples :
  - **Tests simulés (issue-17)**
    - Les tests E2E simulés (issue‑17) s’exécutent via Postman sur un serveur Express dédié (`tests/test-app.js`). Ce serveur utilise MongoMemoryServer et ne doit pas être confondu avec `src/server.js`.
    - Deux scripts permettent de lancer cet environnement :
      - `npm run test:app` → exécution simple, base stable
      - `npm run test:app:watch` → exécution avec nodemon (config dev), utile pour le développement
    - Cet environnement est strictement local et n’est pas utilisé pour les tests E2E réels (issue‑22).
  - **Tests réels (issue-22)**

---

#### Organisation du code - Dossier `tests/`

```txt
tests/
  controllers/      ← Tests unitaires des contrôleurs (niveau‑1)
  middlewares/      ← Tests unitaires du middleware JWT (niveau‑1)
  integration/      ← Tests d’intégration (niveau‑2)
  e2e/              ← Tests E2E Postman (niveau‑3)
  mocks/            ← Mocks/stubs pour isoler les dépendances
```

Cette organisation garantit une séparation claire entre les niveaux de tests et facilite la maintenance.

---

### Organisation documentatire

Le contenu documentaire par niveau se trouve dans `docs-dev/tests/`.

**Liens :**

- [01-niveau-1-unitaires](./tests/01-niveau-1-unitaires.md)
- [02-niveau-2-integration](./tests/02-niveau-2-integration.md)
- [03-niveau-3-e2e](./tests/03-niveau-3-e2e.md)

---

## Présentation des principaux tests du projet

### Objectif

Garantir la stabilité du projet et éviter les régressions.

### Emplacement des tests

Tous les tests unitaires et d’intégration sont regroupés dans le dossier `tests/`.  
Chaque fichier de test correspond à une fonctionnalité ou un groupe de routes.

### Tests fonctionnels à couvrir

1. Création catway
2. Suppression catway
3. Liste catways
4. Création réservation
5. Suppression réservation
6. Liste réservations
7. Création utilisateur
8. Suppression utilisateur
9. Connexion utilisateur

> Les tests seront implémentés progressivement au fil des milestones.

### Outils

- **Mocha** : moteur de tests
- **Chai** : assertions
- **Sinon** : stubs, spies, mocks
- **MongoMemoryServer** : base MongoDB en mémoire
- **Supertest** : tests d’intégration des routes Express
