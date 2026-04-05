# Checklist Déploiement — v0.2.1-dev.c

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
- [x] Version affichée : v0.2.1-dev.c

## 5. Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## 6. Conclusion

- Version publiée : v0.2.1-dev.c

### 7. Décision

- [ ] Version publiée
- [x] Version publiée partielle : correction frontend (mise en place de traceur pour identifier le problème de Login)
- [ ] Retour à la version antérieure publiée

#### 7.1 Motif

- Le problème de Login nécessite des traces pour identifier le problème dans `pagesController.handleLogin()`

#### 7.2 Actions à mener

- Faire un correctif pour prendre établir la connexion (Login).
- Tester et déployer le correctif.
