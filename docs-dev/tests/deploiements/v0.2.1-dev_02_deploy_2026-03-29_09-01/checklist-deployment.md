# Checklist Déploiement — v0.2.1-dev

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
- [x] Version affichée : v0.2.1-dev

## 5. Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [x] Dossier de déploiement archivé

## 6. Conclusion

- Version publiée : v0.2.1-dev

### 7. Décision

- [ ] Version publiée
- [x] Version publiée partielle : correction frontend (liens et feuille des styles)
- [ ] Retour à la version antérieure publiée

#### 7.1 Motif

- L'API est fonctionnel et les routes sont privatisées
- Le FrontEnd ne gère pas correctement le préfixe de l'URL (liens et feuilles de styles à corriger)

#### 7.2 Actions à mener

- Faire un correctif pour prendre en compte le préfixe de l'API dans le frontend.
- Tester et déployer le correctif.
