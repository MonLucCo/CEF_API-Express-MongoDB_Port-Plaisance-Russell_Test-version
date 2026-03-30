# Checklist Déploiement — v0.2.1-dev.a

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
- [ ] Routes principales OK
- [x] Logs serveur OK
- [x] Version affichée : v0.2.1-dev.a

## 5. Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## 6. Conclusion

- Version publiée : v0.2.1-dev.a

### 7. Décision

- [ ] Version publiée
- [x] Version publiée partielle : correction frontend (liens Login/Logout et Dashboard non fonctionnels)
- [ ] Retour à la version antérieure publiée

#### 7.1 Motif

- L'API est fonctionnel et les routes sont privatisées
- Le FrontEnd ne gère pas correctement pour le Login (donc pas de tests pour Logout et Dashboard)

#### 7.2 Actions à mener

- Faire un correctif pour prendre établir la connexion (Login).
- Tester et déployer le correctif.
