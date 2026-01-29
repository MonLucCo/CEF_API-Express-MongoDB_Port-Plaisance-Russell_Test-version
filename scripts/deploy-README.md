# 🚀 Déploiement — Documentation

Ce dossier contient les scripts liés au déploiement du projet sur Alwaysdata.  
Ils permettent d’automatiser l’envoi des fichiers, de contrôler le contenu transféré et de garantir un déploiement propre et reproductible.

---

## 📄 Scripts disponibles

### `deploy.sh`

Script principal de déploiement.  
Il utilise `rsync` et les règles définies dans `.rsync-filter.rules` pour transférer uniquement les fichiers nécessaires.

Usage :

```bash
npm run deploy
```

---

### `deploy:dry` (simulation)

Permet de simuler le déploiement sans transférer de fichiers.

```bash
npm run deploy:dry
```

Affiche les fichiers qui **seraient** envoyés.

---

### `deploy:preview`

Affiche un aperçu détaillé des fichiers qui seront transférés.

```bash
npm run deploy:preview
```

---

## 📁 Fichiers associés

### `.rsync-filter.rules`

Fichier contenant les règles de filtrage pour le déploiement :

- fichiers ignorés  
- dossiers exclus  
- fichiers explicitement inclus  

### `.rsync-filter.example`

Modèle de configuration pour documenter les règles de filtrage.

---

## 🔧 Prérequis

- `rsync` installé sur la machine locale  
- accès SSH fonctionnel vers Alwaysdata  
- configuration sensible définie dans :  
  `scratches/scripts-setup/ssh-config.json`

---

## 🛠 Fonctionnement du déploiement

1. Le script lit les règles de `.rsync-filter.rules`
2. Il synchronise les fichiers locaux vers le serveur Alwaysdata
3. Il met à jour uniquement les fichiers modifiés
4. Il ne supprime jamais les fichiers distants non listés (sécurité)
5. Un log est généré dans :

    ```txt
    logs/deploy.log
    ```

---

## 🔄 Redémarrage du site

Le redémarrage doit être effectué depuis l’interface Alwaysdata :

1. Se connecter à : [`https://admin.alwaysdata.com`](https://admin.alwaysdata.com)
2. Aller dans **Sites web → [Nom du site]**  
3. Cliquer sur **Redémarrer le site**

---

## 📚 Références

- [Documentation Alwaysdata](https://help.alwaysdata.com)
- [Guide de vérification des environnements](../docs-dev/hebergement/guide_verification-configurations-locale-hebergement.md)

---
