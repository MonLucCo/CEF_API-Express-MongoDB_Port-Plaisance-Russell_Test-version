# Checklist pré-déploiement — {{version}}

## Tests automatisés

- [ ] Tests modèles OK
- [ ] Tests unitaires OK
- [ ] Tests intégration OK
- [ ] Tests E2E simulés OK

## Frontend

- [ ] Page d’accueil OK
- [ ] Login OK
- [ ] Dashboard OK
- [ ] Protection JWT OK

## API

- [ ] Routes Users OK
- [ ] Routes Catways OK
- [ ] Routes Reservations OK
- [ ] Authentification OK
- [ ] JWT cohérent (jwtConfig.secret)

## Préparation au déploiement

- [ ] Fichier `.env` local cohérent avec `.env.example`
- [ ] Connexion MongoDB Atlas locale fonctionnelle
- [ ] Démarrage application locale (`npm run start` ou `npm run dev` ) OK

## Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [ ] Dossier de déploiement archivé

## Conclusion

- Version vérifiée : {{version}}

### Décision

- [ ] Accord de déploiement
- [ ] Refus de déploiement

### Motif

- *(expliquer clairement la raison : sécurité, tests KO, incohérence, etc.)*

### Actions à mener

- *(liste des corrections nécessaires avant déploiement)*
