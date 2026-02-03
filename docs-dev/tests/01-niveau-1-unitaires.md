# Tests de niveau‑1 : Tests unitaires

Les tests unitaires valident la logique métier de manière isolée.  
Ils ne dépendent d’aucune base de données ni d’aucun service externe.

## Objectifs

- Vérifier les comportements métier  
- Tester les branches conditionnelles  
- Garantir la robustesse des contrôleurs et middlewares  
- Empêcher les régressions lors des évolutions

## Outils

- **Mocha** : moteur de tests  
- **Chai** : assertions  
- **Sinon** : stubs, spies, mocks

## Principes

- Chaque dépendance externe est stubée :  
  - `User.findOne`, `User.create`, `User.findByIdAndDelete`  
  - `user.comparePassword`  
  - `jwt.sign`  
- Aucun accès à MongoDB  
- Chaque test est isolé via `afterEach(() => sinon.restore())`

## Exemple

Issue‑15 : tests unitaires du contrôleur `authController.js`.
