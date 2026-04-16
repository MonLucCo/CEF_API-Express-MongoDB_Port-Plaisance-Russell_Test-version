# Checklist Déploiement — v0.3.0-dev

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
- [ ] Démarrage application site OK

## 4. Vérifications post-déploiement

- [x] API en ligne (collection Postman) OK
- [ ] Routes principales OK
- [x] Logs serveur OK
- [x] Version affichée : v0.3.0-dev

## 5. Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## 6. Conclusion

- Version publiée : v0.3.0-dev

### 7. Décision

- [ ] Version publiée
- [x] Version publiée avec patch
- [ ] Retour à la version antérieure publiée

#### 7.1 Motif

- Les fonctions d'authentification et d'accès au Dashboard fonctionnent. La solution est sécurisée.
- L'accès à la documentation de l'API fonctionne.
- Les routes de l'API dans le Dasboard **ne fonctionnent pas** pour Users, Catways et Reservations.

#### 7.2 Actions à mener

- L'analyse met en évidence une mauvaise mise en place de la connexion du serveur Express.
- Le patch doit lancer le serveur Express d'Alwaysdata avec les valeurs IP et PORT fournis par défaut dans l'environnement d'Always data.
- La modification consister à modifier `server.js`pour lancer le serveur Express avec les valeurs par défaut de l'environnement d'Alwaysdata.
