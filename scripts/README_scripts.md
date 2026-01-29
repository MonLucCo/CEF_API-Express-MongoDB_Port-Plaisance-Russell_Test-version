# 📚 README — Dossier `scripts/`

Ce dossier contient l’ensemble des scripts utilisés pour :

- la connexion SSH
- la navigation sur Alwaysdata
- le déploiement du projet
- la vérification des environnements local et distant

Chaque script est documenté dans un fichier dédié.

---

## 📌 Objectif du dossier

Ce dossier centralise tous les outils nécessaires au workflow :

- connexion au serveur
- inspection du site
- déploiement sécurisé
- vérification des environnements

Il constitue la base opérationnelle du projet.

---

## 📌 Documentation des scripts

### 🔐 SSH

- `ssh_README.md`  
  Documentation des scripts :
  - `ssh-connect.sh`
  - `ssh-site-path.sh`
  - configuration sensible (`ssh-config.json`)

---

### 🚀 Déploiement

- `deploy_README.md`  
  Documentation du script :
  - `deploy.sh`
  - configuration sensible (`deploy-config.json`)
  - règles rsync

---

### 🧪 Vérification des environnements

- `deploy-checklist-README.md`  
  Documentation des scripts :
  - `deploy-checklist-local.sh`
  - `deploy-checklist-site.sh`

---

## 📌 Scripts présents dans ce dossier

- `ssh-connect.sh`
- `ssh-site-path.sh`
- `deploy.sh`
- `deploy-checklist-local.sh`
- `deploy-checklist-site.sh`

---

## 📌 Fichiers de configuration

- `ssh-config.json` (pointeur vers la configuration sensible)
- `deploy-config.json` (pointeur vers la configuration sensible)

Les fichiers sensibles se trouvent dans :

```txt
scratches/scripts-setup/
```

---
