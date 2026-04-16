# Checklist pré-déploiement — v0.3.0-dev

## Tests automatisés

- [x] Tests modèles OK
- [x] Tests unitaires OK
- [x] Tests intégration OK
- [x] Tests E2E simulés OK

## Frontend

- [x] Page d’accueil OK
- [x] Login OK
- [x] Dashboard OK
- [x] Protection JWT OK

## API

- [x] Routes Users OK
- [x] Routes Catways OK
- [x] Routes Reservations OK
- [x] Authentification OK
- [x] JWT cohérent (jwtConfig.secret)

## Préparation au déploiement

- [x] Fichier `.env` local cohérent avec `.env.example`
- [x] Connexion MongoDB Atlas locale fonctionnelle
- [x] Démarrage application locale (`npm run start` ou `npm run dev` ) OK

## Documentation

- [x] architecture.md mis à jour
- [x] decisions-techniques.md mis à jour
- [x] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## Conclusion

- Version vérifiée : v0.3.0-dev

### Décision

- [x] Accord de déploiement
- [ ] Refus de déploiement

### Motif

- Fonctionnalités et protection conformes.

### Actions à mener

- Revoir le contenu de la JSDoc dans le code pour améliorer la lecture.
