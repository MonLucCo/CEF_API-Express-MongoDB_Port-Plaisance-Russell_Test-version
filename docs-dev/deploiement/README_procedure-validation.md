# ✅ Procédure de validation avant déploiement

Ce document décrit la procédure complète de validation avant déploiement sur Alwaysdata.  
Elle garantit la cohérence entre l’environnement local et distant, la stabilité du code, et la traçabilité des opérations.

---

## 🧭 Objectif

Cette procédure garantit :

- la cohérence entre local et distant  
- la reproductibilité du déploiement  
- la sécurité du site en production  
- la traçabilité des opérations

---

## 📦 Étapes de validation

La démarche de validation est composée de 9 étapes majeures :

1. Stabilisation du code  
2. Vérification locale  
3. Analyse du log local  
4. Déploiement  
5. Redémarrage du site  
6. Vérification distante  
7. Analyse du log distant  
8. Archivage des logs  
9. Validation finale en production (NODE_ENV + Postman).

Chaque étape fait l'objet d'une description pour une réalisation partiellement automatisée et reproductible.

### 1. Stabilisation du code dans VS Code

- Vérifier que tous les fichiers sont à jour.
- Effectuer un commit ou une sauvegarde équivalente.
- S’assurer que le projet est dans un état reproductible.

---

### 2. Vérification locale

```bash
npm run check:local
```

- Vérifie les versions locales de Node et npm.
- Vérifie les modules installés.
- Vérifie les scripts de déploiement (`deploy:help`, `deploy:dry`).

---

### 3. Analyse du log local

Fichier généré :

```txt
logs/deploy-checklist-local.log
```

- Vérifier la section `dry-run` :
  - Liste des fichiers à déployer.
  - Fichiers réellement transférés.
- Confirmer que le filtrage `.rsync-filter.rules` est correct.

---

### 4. Déploiement vers Alwaysdata

```bash
npm run deploy
```

- Transfert des fichiers via `rsync`.
- Aucun redémarrage automatique du site.

---

### 5. Redémarrage manuel du site

- Accéder à l’interface Alwaysdata : [admin.alwaysdata.com](https://admin.alwaysdata.com)
- Onglet **Configuration** :
  - Modifier la variable `NODE_ENV` si nécessaire (déclenche un redémarrage).
  - Vérifier la commande de démarrage (`server.js`).
- Onglet **SSL** :
  - Activer “Forcer le HTTPS” si ce n’est pas déjà fait.

---

### 6. Vérification distante

```bash
npm run check:site
```

- Vérifie les versions serveur de Node et npm.
- Vérifie les modules installés dans le dossier du site.
- Vérifie la santé de l’API (`curl -k`).
- Vérifie le contenu du dossier du site.

---

### 7. Analyse du log distant

Fichier généré :

```txt
logs/deploy-checklist-site.log
```

- Vérifier :
  - Version réelle de Node utilisée par le site (`X-API-SYSTEM`)
  - Modules installés
  - Réponse de l’API
  - Structure du dossier distant

---

### 8. Archivage manuel des logs

Renommer les fichiers de log avec un suffixe de version :

```bash
mv logs/deploy-checklist-local.log logs/deploy-checklist-local_vXX.log
mv logs/deploy-checklist-site.log logs/deploy-checklist-site_vXX.log
```

> Exemple : `v04` pour la version 0.4 du projet

---

### 9. Validation finale en production

#### 9.1 Reconfiguration du serveur en mode production

- Accéder à l’interface du [compte Alwaysdata](https://admin.alwaysdata.com)
- Ouvrir l’onglet **Configuration** du site
- Modifier la variable d’environnement :

```txt
NODE_ENV=production
```

- Valider la modification (Alwaysdata redémarre automatiquement le site)

#### 9.2 Vérification de l’exposition des headers en production

- Ouvrir Postman (ou Thunder Client)
- Envoyer une requête :

```txt
GET <url-du-site>
```

- Vérifier dans les **Response Headers** :

  - `X-API-Status` → doit afficher `production`
  - `X-API-Version` → doit afficher la version déployée (ex : `0.1-dev`)
  - `X-API-SYSTEM` → doit afficher la valeur neutre (ex : `runtime-1`)
    - et **ne plus afficher la version réelle de Node.js**

- Confirmer que la page HTML s’affiche correctement en mode production

---

## 📁 Structure recommandée

```txt
docs-dev/
└── deploiement/
    └── README_procedure-validation.md
logs/
└── deploy-checklist-local_vXX.log
└── deploy-checklist-site_vXX.log
```

---

## 🛡️ Bonnes pratiques

- Ne jamais déployer sans avoir validé les deux logs.
- Ne jamais exposer les versions techniques en production (voir `X-API-SYSTEM`).
- Toujours archiver les logs pour traçabilité.
- Toujours redémarrer manuellement le site après déploiement.

---
