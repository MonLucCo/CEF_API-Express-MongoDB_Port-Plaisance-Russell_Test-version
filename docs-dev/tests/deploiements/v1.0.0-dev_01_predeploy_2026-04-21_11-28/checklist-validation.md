# Checklist pré-déploiement — v1.0.0-dev

## Tests automatisés

- [x] Tests modèles OK
- [x] Tests unitaires OK
- [x] Tests intégration OK
- [x] Tests E2E simulés OK

## Frontend

- [X] Page d’accueil OK
- [X] Login OK
- [X] Dashboard OK
- [X] Protection JWT OK

## API

- [X] Routes Users OK
- [X] Routes Catways OK
- [X] Routes Reservations OK
- [X] Authentification OK
- [X] JWT cohérent (jwtConfig.secret)

## Préparation au déploiement

- [x] Fichier `.env` local cohérent avec `.env.example`
- [x] Connexion MongoDB Atlas locale fonctionnelle
- [x] Démarrage application locale (`npm run start` ou `npm run dev` ) OK

## Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## Conclusion

- Version vérifiée : v1.0.0-dev

### Décision

- [x] Accord de déploiement
- [ ] Refus de déploiement

### Motif

- Fonctionnalités et protection conformes.
- Documentation API conforme.

### Actions à mener

- Revoir le contenu de la JSDoc dans le code pour améliorer la lecture.
