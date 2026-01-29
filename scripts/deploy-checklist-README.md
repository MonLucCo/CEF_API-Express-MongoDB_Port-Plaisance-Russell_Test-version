# 📝 README — Scripts de vérification (deploy-checklist)

Ce dossier contient les scripts permettant de vérifier la cohérence entre
l’environnement local et l’environnement Alwaysdata déployé.

Les scripts ne modifient rien : ils collectent uniquement des informations
et génèrent des logs exploitables pour comparaison.

---

## 📌 Scripts disponibles

### 1. `deploy-checklist-local.sh`

Vérifie l’environnement **local** :

- Version de Node (`node -v`)
- Version de npm (`npm -v`)
- Liste des modules installés (`npm list --depth=0`)
- Fonctionnement des scripts de déploiement :
  - `npm run deploy:help`
  - `npm run deploy:dry`

Génère un log :

```txt
logs/deploy-checklist-local.log
```

---

### 2. `deploy-checklist-site.sh`

Vérifie l’environnement **Alwaysdata** :

- Version de Node sur le serveur
- Version de npm sur le serveur
- Modules installés sur le serveur
- Santé de l’API (`/api/health`)
- Contenu du dossier du site

Génère un log :

```txt
logs/deploy-checklist-site.log
```

---

## 📌 Commandes npm associées

Dans `package.json` :

```json
"check:local": "bash ./scripts/deploy-checklist-local.sh",
"check:site": "bash ./scripts/deploy-checklist-site.sh"
```

---

## 📌 Objectif global

Ces deux scripts permettent :

- d’archiver l’état local et distant
- de comparer les environnements
- de détecter les incohérences avant un déploiement réel
- d’assurer la reproductibilité du workflow

Ils complètent les scripts de déploiement (`deploy.sh`) et les scripts SSH.

---
