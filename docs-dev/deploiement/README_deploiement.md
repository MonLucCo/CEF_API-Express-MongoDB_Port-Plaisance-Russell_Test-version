# 📘 Déploiement — Documentation technique complète

*(Script `deploy.sh` v5 + filtrage rsync)*

## 1. Objectifs du système de déploiement

Le système de déploiement vise à :

- transférer uniquement les fichiers nécessaires à l’exécution de l’API  
- garantir un déploiement reproductible et sécurisé  
- éviter les erreurs humaines (fichiers oubliés, fichiers sensibles transférés)  
- permettre un aperçu du déploiement avant exécution  
- installer automatiquement les dépendances sur Alwaysdata  
- laisser le redémarrage manuel (choix pédagogique)

Le script est conçu pour être **simple**, **robuste** et **adapté à un devoir**, tout en restant évolutif pour un futur projet professionnel.

---

## 2. Structure générale du déploiement

```txt
scripts/
│
├── deploy.sh                ← Script principal (v5)
├── .rsync-filter.rules      ← Règles de filtrage utilisées par rsync
└── .rsync-filter.example    ← Documentation complète des règles possibles
```

---

## 3. Script `deploy.sh` — Fonctionnement détaillé

### 3.1. Pré-requis

- une clé SSH valide : `~/.ssh/id_ed25519`
- un accès Alwaysdata configuré : clé publique (.pub) sur le serveur `$HOME/.ssh/authorized_keys`
- un dossier distant : `~/www/api-port-plaisance-russell`
- Node.js installé côté Alwaysdata

**Création des clés (privée et publique)** :

```bash
ssh-keygen -t ed25519 -C "un message pour reconnaître ta clé"
```

> Création des clés `id_ed25519` (privée) et `id_25519.pub` (publique) dans le dossier de la machine `~/.ssh`.

**Installation de la clé publique sur le serveur** :

```bash
ssh-copy-id -i $HOME/.ssh/id_ed25519.pub [utilisateur]@ssh-[compte].alwaysdata.net
```
  
> Notes : documentation **Alwaysdata** [utiliser-des-cles-ssh](https://help.alwaysdata.com/fr/acces-distant/ssh/utiliser-des-cles-ssh/)
>
> - nécessite une connexion avec mot de passe
> - remplacer `[utilisateur]` et `[compte]` par le nom d'utilisateur et du compte SSH fournis par l'hébergeur **Alwaysdata**.
> - 🔐 la **clé privée** ne doit jamais être copiée sur le serveur. Seule la clé publique doit être installée.

---

### 3.2. Variables principales

| Variable            | Rôle                                |
|---------------------|-------------------------------------|
| `SSH_KEY`           | Chemin de la clé SSH                |
| `SSH_HOST`          | Identifiant Alwaysdata              |
| `REMOTE_DIR`        | Dossier distant                     |
| `TARGET`            | Cible rsync complète                |
| `RSYNC_FILTER_FILE` | Fichier de filtrage utilisé         |
| `PREVIEW_DIR`       | Dossier local pour `--sync-preview` |

---

### 3.3. Options disponibles

| Option           | Description                                         |
|------------------|-----------------------------------------------------|
| `--help`         | Affiche l’aide                                      |
| `--check`        | Teste la connexion SSH                              |
| `--dry-run`      | Simule un déploiement complet                       |
| `--sync-preview` | Affiche les fichiers sélectionnés par le filtrage   |
| `--restart`      | Affiche un message (pas de redémarrage automatique) |
| *(sans option)*  | Déploiement réel                                    |

---

### 3.4. Déroulement d’un déploiement réel

1. Confirmation utilisateur  
2. Synchronisation rsync (avec filtrage strict)  
3. Installation des dépendances (`npm install --omit=dev`)  
4. Message final :  
   **« Déploiement complet — redémarrage manuel nécessaire »**

---

## 4. Filtrage rsync — `.rsync-filter.rules`

Le filtrage repose sur une **liste blanche stricte** :

- seuls les fichiers explicitement inclus sont transférés  
- tout le reste est exclu  

### 4.1. Contenu minimal utilisé en production

```txt
+ package.json
+ package-lock.json
+ src/
+ src/***
- *
```

### 4.2. Pourquoi une liste blanche ?

- évite d’envoyer des fichiers sensibles (`.env`, `tests/`, `docs/`, etc.)  
- garantit un déploiement minimal et propre  
- facilite la maintenance  
- évite les erreurs humaines

---

## 5. Fichier `.rsync-filter.example`

Ce fichier sert de **documentation interne**.  
Il contient :

- toutes les règles possibles  
- des exemples d’inclusions avancées  
- des exclusions recommandées  
- des commentaires pédagogiques  
- des variantes pour projets futurs (public/, dist/, config, etc.)

Il n’est **pas utilisé** par le script.

---

## 6. Commandes npm associées

Dans `package.json` :

```json
{
  "scripts": {
    "deploy": "bash ./scripts/deploy.sh",
    "deploy:dry": "bash ./scripts/deploy.sh --dry-run",
    "deploy:preview": "bash ./scripts/deploy.sh --sync-preview",
    "deploy:check": "bash ./scripts/deploy.sh --check",
    "deploy:help": "bash ./scripts/deploy.sh --help"
  }
}
```

---

## 7. Bonnes pratiques

### ✔ Toujours tester avant un vrai déploiement

```bash
npm run deploy:preview
npm run deploy:dry
```

### ✔ Ne jamais inclure `.env` dans le filtrage

Toujours gérer les variables d’environnement via l’interface Alwaysdata.

### ✔ Garder `.rsync-filter.rules` minimal

Plus il est simple, moins il y a de risques.

### ✔ Documenter les évolutions

Si un dossier est ajouté au projet, penser à :

- mettre à jour `.rsync-filter.rules`
- mettre à jour `.rsync-filter.example`
- mettre à jour `docs-dev/deploiement/`

---

## 8. Évolutions possibles (pour un futur projet)

- redémarrage automatique via API Alwaysdata  
- gestion d’un build (TypeScript → dist/)  
- déploiement CI/CD GitHub Actions  
- rollback automatique  
- logs distants  
- vérification de version avant déploiement  

---
