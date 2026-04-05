# 📄 Développement continu (CI/CD)

Ce document présente les **principes généraux** du développement continu mis en place pour le projet *API Port de Plaisance Russell*.  
Il sert d’introduction et d’orientation : les détails techniques sont fournis dans les documents spécialisés du dossier `docs-dev/`.

---

## 🎯 1. Objectifs du développement continu

Le développement continu vise à :

- garantir la **cohérence** entre l’environnement local et l’environnement déployé ;
- sécuriser les **mises en production** grâce à une procédure de validation systématique ;
- assurer une **traçabilité complète** via des logs versionnés ;
- faciliter l’**intégration continue** (tests, vérifications, cohérence des versions) ;
- préparer l’automatisation future via **GitHub Actions**.

---

## 🧩 2. Principes généraux

Le workflow repose sur trois piliers :

### 2.1 Validation locale

Avant tout déploiement, l’environnement local est vérifié :

- versions de Node/npm  
- modules installés  
- cohérence des fichiers à déployer  
- simulation du transfert (`dry-run`)

→ Détails : [docs-dev/deploiement/README_procedure-validation.md](docs-dev/deploiement/README_procedure-validation.md)

---

### 2.2 Déploiement contrôlé

Le déploiement utilise un script dédié (`npm run deploy`) basé sur `rsync`.  
Il est suivi d’un redémarrage manuel du site Alwaysdata.

→ Détails : [docs-dev/deploiement/README_deploiement.md](docs-dev/deploiement/README_deploiement.md)

---

### 2.3 Vérification distante

Une fois le site redémarré :

- vérification de la version Node réellement utilisée (`X-API-SYSTEM`)  
- vérification de l’API via `curl`  
- inspection du dossier distant  
- comparaison local ↔ distant

→ Détails : [docs-dev/deploiement/README_procedure-validation.md](docs-dev/deploiement/README_procedure-validation.md)

---

## 🗂️ 3. Organisation documentaire

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

## 🔍 4. Pipelines de validation du projet

Le projet utilise trois pipelines de validation qui permettent de vérifier la qualité de séquences dliées au déploiement et à l'hébergement de l'API.  

Ces pipelines concernent :

- le pré-déploiement d'une version
- le déploiement sur Alwaysdata de la version
- le post-déploiement de la version

### 🔍 4.1 Pipeline de validation pré‑déploiement (validate‑predeploy)

La phase 6 (issue‑37) introduit un pipeline de validation pré‑déploiement permettant de garantir qu’aucune version ne peut être déployée sans avoir été testée, vérifiée et archivée.  
Ce pipeline constitue désormais une étape obligatoire du développement continu.

#### 🎯 4.1.1 Objectifs

- détecter les régressions avant déploiement  
- valider la sécurité (JWT, routes protégées, cohérence API)  
- vérifier la conformité fonctionnelle minimale  
- garantir que la version déployée correspond exactement à la version testée  
- archiver systématiquement les résultats pour assurer la traçabilité

---

#### 🧪 4.1.2 Contenu du pipeline validate‑predeploy

Le pipeline repose sur trois éléments :

##### 4.1.2.1 Tests automatisés

- tests unitaires (niveau 1)  
- tests d’intégration (niveau 2)  
- tests E2E simulés (niveau 3)  
- exécution via `npm run test`

##### 4.1.2.2 Tests opérationnels via Postman

- collection dédiée :  
  **`collection-predeploy-v0.2.0-dev.json`**  
- vérification de :
  - login  
  - protection des routes Auth  
  - protection des routes Catways  
  - protection des routes Reservations  
  - cohérence du JWT  
  - création/suppression contrôlée (Catways, Reservations, Users)  
  - nettoyage automatique de la base après test

##### 4.1.2.3 Checklist pré‑déploiement

- fichier : `checklist-validation.md`  
- décision finale : **Accord** ou **Refus**  
- justification obligatoire  
- actions à mener en cas d’échec

---

#### 📁 4.1.3 Archivage systématique

Chaque validation pré‑déploiement est archivée dans :

```txt
docs-dev/deploiements/<version>/
```

Contenu du dossier :

- `checklist-validation.md`  
- `resume-validate.md`  
- logs des tests  
- collection Postman utilisée  
- captures éventuelles  
- notes techniques

Exemple :  
`docs-dev/deploiements/v0.2.0-dev/`

---

#### 🔄 4.1.4 Logique des versions correctives

Le pipeline peut conclure à :

##### ✔ Accord de déploiement

→ la version est déployée sur Alwaysdata  
→ les artefacts sont archivés  
→ la version devient la version déployée officielle

##### ❌ Refus de déploiement

→ une version corrective est créée  
→ exemple :

- v0.2.0-dev → échec
- v0.2.1-dev → corrections  
- nouvelle validation pré‑déploiement obligatoire

##### 📌 Règle fondamentale

> **Aucune version ne peut être déployée sans validation pré‑déploiement réussie.**

Cette règle garantit la stabilité du projet et la cohérence entre code, documentation et version déployée.

---

#### 🧭 4.1.5 Intégration dans le workflow Git

Le pipeline validate‑predeploy s’insère dans le workflow Git existant :

1. développement sur `dev`  
2. tests automatisés  
3. validate‑predeploy  
4. archivage  
5. merge vers `main`  
6. déploiement Alwaysdata  
7. validation post‑déploiement  
8. archivage final

Ce processus prépare l’automatisation future via GitHub Actions.

---

### 🔍 4.2 Pipeline de validation du déploiement

La phase 6 (issue‑37) met en oeuvre le pipeline de validation du déploiement introduit lors de l'issue-10 (Phase 1 - release v0.1).  

(Cette section sera mise à jour lors de l'étape 6 de l'issue-37)

---

### 🔍 4.3 Pipeline de validation du post-déploiement

La phase 6 (issue‑37) introduit le pipeline de validation post-déploiement.  

(Cette section sera mise à jour lors de l'étape 8 de l'issue-37)

---

## 🛡️ 5. Sécurité et bonnes pratiques

- Les scripts sensibles et les notes internes sont conservés dans `scratches/` (non versionné).  
- Les variables d’environnement sont gérées via `.env` (non versionné).  
- Le header `X-API-SYSTEM` masque la version Node en production.  
- Les logs de validation sont archivés manuellement après chaque déploiement.

---

## 🚀 6. Automatisation future

Une intégration GitHub Actions est prévue pour :

- exécuter les tests à chaque push sur `dev`  
- valider automatiquement les PR vers `main`  
- archiver les logs de validation  
- préparer un déploiement semi-automatisé

→ Le document sera mis à jour lors de la mise en place de cette automatisation.

---

## 🧭 7. Vue d’ensemble

Le développement continu du projet repose sur :

- un **workflow Git clair**  
- une **procédure de validation stricte**  
- un **déploiement maîtrisé**  
- une **documentation versionnée**  
- une **séparation nette** entre local, distant et scripts privés  

Ce document sert de **porte d’entrée** vers l’ensemble du dispositif.

---
