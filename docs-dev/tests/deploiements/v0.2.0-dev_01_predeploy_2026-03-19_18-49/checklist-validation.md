# Checklist pré-déploiement — v0.2.0-dev

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

- [x] Routes Catways OK
- [x] Routes Reservations OK
- [ ] Authentification OK
  - [x] **test Ko : faille de sécurité**
- [x] JWT cohérent (jwtConfig.secret)

## Alwaysdata

- [ ] Variables d’environnement vérifiées
- [ ] Connexion MongoDB Atlas OK
- [ ] Déploiement Git OK
- [ ] Redémarrage application OK

## Documentation

- [x] architecture.md mis à jour
- [x] decisions-techniques.md mis à jour
- [x] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## Conclusion

- Version vérifiée : v0.2.0-dev
- Décision :
  - [ ] Accord de déploiement
  - [x] Refus de déploiement

### Motif du refus

Une faille de sécurité a été identifiée :

- la route `POST /api/auth/register` est accessible sans authentification
- cela permet la création non contrôlée d’utilisateurs
- la version v0.2.0-dev ne peut pas être déployée en l’état.

### Actions à mener

- sécuriser la route `POST /api/auth/register`
- mettre à jour les tests d’intégration Auth
- mettre à jour la collection Postman
- produire la version corrective v0.2.1-dev.
