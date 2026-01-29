# 📄 Développement continu (CI/CD)

Ce document présente les **principes généraux** du développement continu mis en place pour le projet *API Port de Plaisance Russell*.  
Il sert d’introduction et d’orientation : les détails techniques sont fournis dans les documents spécialisés du dossier `docs-dev/`.

---

## 🎯 Objectifs du développement continu

Le développement continu vise à :

- garantir la **cohérence** entre l’environnement local et l’environnement déployé ;
- sécuriser les **mises en production** grâce à une procédure de validation systématique ;
- assurer une **traçabilité complète** via des logs versionnés ;
- faciliter l’**intégration continue** (tests, vérifications, cohérence des versions) ;
- préparer l’automatisation future via **GitHub Actions**.

---

## 🧩 Principes généraux

Le workflow repose sur trois piliers :

### 1. Validation locale

Avant tout déploiement, l’environnement local est vérifié :

- versions de Node/npm  
- modules installés  
- cohérence des fichiers à déployer  
- simulation du transfert (`dry-run`)

→ Détails : [docs-dev/deploiement/README_procedure-validation.md](docs-dev/deploiement/README_procedure-validation.md)

---

### 2. Déploiement contrôlé

Le déploiement utilise un script dédié (`npm run deploy`) basé sur `rsync`.  
Il est suivi d’un redémarrage manuel du site Alwaysdata.

→ Détails : [docs-dev/deploiement/README_deploiement.md](docs-dev/deploiement/README_deploiement.md)

---

### 3. Vérification distante

Une fois le site redémarré :

- vérification de la version Node réellement utilisée (`X-API-SYSTEM`)  
- vérification de l’API via `curl`  
- inspection du dossier distant  
- comparaison local ↔ distant

→ Détails : [docs-dev/deploiement/README_procedure-validation.md](docs-dev/deploiement/README_procedure-validation.md)

---

## 🗂️ Organisation documentaire

Les documents détaillés sont regroupés dans :

- **Déploiement**  
  > [docs-dev/deploiement/README_deploiement.md](docs-dev/deploiement/README_deploiement.md)
  > [docs-dev/deploiement/README_procedure-validation.md](docs-dev/deploiement/README_procedure-validation.md)

- **Hébergement**  
  > [docs-dev/hebergement/alwaysdata.md](docs-dev/hebergement/alwaysdata.md)  
  > [docs-dev/hebergement/mongodb.md](docs-dev/hebergement/mongodb.md)
  > [docs-dev/hebergement/hebergement-initialisation.md](docs-dev/hebergement/hebergement-initialisation.md)

- **Workflow Git**  
  > [docs-dev/workflow-git.md](docs-dev/workflow-git.md)

- **Sécurité**  
  > [docs-dev/securite.md](docs-dev/securite.md)

---

## 🛡️ Sécurité et bonnes pratiques

- Les scripts sensibles et les notes internes sont conservés dans `scratches/` (non versionné).  
- Les variables d’environnement sont gérées via `.env` (non versionné).  
- Le header `X-API-SYSTEM` masque la version Node en production.  
- Les logs de validation sont archivés manuellement après chaque déploiement.

---

## 🚀 Automatisation future

Une intégration GitHub Actions est prévue pour :

- exécuter les tests à chaque push sur `dev`  
- valider automatiquement les PR vers `main`  
- archiver les logs de validation  
- préparer un déploiement semi-automatisé

→ Le document sera mis à jour lors de la mise en place de cette automatisation.

---

## 🧭 Vue d’ensemble

Le développement continu du projet repose sur :

- un **workflow Git clair**  
- une **procédure de validation stricte**  
- un **déploiement maîtrisé**  
- une **documentation versionnée**  
- une **séparation nette** entre local, distant et scripts privés  

Ce document sert de **porte d’entrée** vers l’ensemble du dispositif.

---
