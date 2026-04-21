# Checklist Déploiement — v1.0.0-dev

## 1. Préparation

- [x] Environnement WSL validé
- [x] Scripts .sh en LF
- [x] Clé SSH fonctionnelle
- [x] Connexion Alwaysdata OK

## 2. Pipeline

- [x] deploy:check OK
- [x] deploy:preview OK
- [x] deploy:dry OK
- [x] deploy OK

## 3. Alwaysdata

- [x] Fichier `.env` local cohérent avec les variables d'environnement du site
- [x] Connexion MongoDB Atlas fonctionnelle
- [x] Démarrage application site OK

## 4. Vérifications post-déploiement

- [x] API en ligne (collection Postman) OK
- [x] Routes principales OK
- [x] Logs serveur OK
- [x] Version affichée : v1.0.0-dev

## 5. Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## 6. Conclusion

- Version publiée : v1.0.0-dev

### 7. Décision

- [x] Version publiée
- [ ] Retour à la version antérieure publiée

#### 7.1 Motif

- Les fonctions d'authentification et d'accès au Dashboard fonctionnent. **La solution est sécurisée**.
- L'accès à la **documentation de l'API fonctionne** (v1.0.0-doc).
- Les **routes de l'API dans le Dasboard fonctionnent** pour Users, Catways et Reservations.

#### 7.2 Actions à mener

- néant
