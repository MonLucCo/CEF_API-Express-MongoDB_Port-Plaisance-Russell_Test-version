# Checklist Déploiement — {{version}}

## 1. Préparation

- [ ] Environnement WSL validé
- [ ] Scripts .sh en LF
- [ ] Clé SSH fonctionnelle
- [ ] Connexion Alwaysdata OK

## 2. Pipeline

- [ ] deploy:check OK
- [ ] deploy:preview OK
- [ ] deploy:dry OK
- [ ] deploy OK

## 3. Alwaysdata

- [ ] Fichier `.env` local cohérent avec les variables d'environnement du site
- [ ] Connexion MongoDB Atlas fonctionnelle
- [ ] Démarrage application site OK

## 4. Vérifications post-déploiement

- [ ] API en ligne (collection Postman) OK
- [ ] Routes principales OK
- [ ] Logs serveur OK
- [ ] Version affichée : {{version}}

## 5. Documentation

- [ ] architecture.md mis à jour
- [ ] decisions-techniques.md mis à jour
- [ ] README_tests.md mis à jour
- [ ] Dossier de déploiement archivé

## 6. Conclusion

- Version publiée : {{version}}

### 7. Décision

- [ ] Version publiée
- [ ] Retour à la version antérieure publiée

#### 7.1 Motif

- *(expliquer clairement la raison : sécurité, tests KO, incohérence, etc.)*

#### 7.2 Actions à mener

- *(liste des corrections nécessaires avant publication)*
