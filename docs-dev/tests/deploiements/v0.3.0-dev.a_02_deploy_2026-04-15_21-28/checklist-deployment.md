# Checklist Déploiement — v0.3.0-dev.a

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
- [x] Version affichée : v0.3.0-dev.a

## 5. Documentation

- [x] architecture.md mis à jour
- [x] decisions-techniques.md mis à jour
- [x] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## 6. Conclusion

- Version publiée : v0.3.0-dev.a

### 7. Décision

- [ ] Version publiée
- [x] Version publiée avec patch
- [ ] Retour à la version antérieure publiée

#### 7.1 Motif

- Les fonctions d'authentification et d'accès au Dashboard fonctionnent. La solution est sécurisée.
- L'accès à la documentation de l'API fonctionne.
- Les routes de l'API dans le Dasboard **ne fonctionnent pas** pour Users, Catways et Reservations.

#### 7.2 Actions à mener

- L'analyse met en évidence une mauvaise mise en place de la requête dans le contrôleur pour le site distant (Alwaysdata).
- Le patch doit adapter la route de la requête (base de l'URL définie dans APP_URL) qui ne doit pas utiliser le PORT.
- La modification consister à modifier `app.js`pour définir APP_URL selon la valeur de la variable d'environnement ENV_SERVEUR (local, distant).
