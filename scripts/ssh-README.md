# 🔐 Scripts SSH — Documentation

Ce dossier contient les scripts SSH versionnés du projet.  
Ils permettent de se connecter rapidement au serveur Alwaysdata et d’inspecter le site déployé, **sans exposer d’informations sensibles**.

Les données sensibles sont stockées dans le fichier défini par `ssh-config.json`.

---

## 📄 Fichiers présents

### `ssh-connect.sh`

Ouvre une connexion SSH vers Alwaysdata en utilisant la configuration sensible.

Usage :

```bash
./ssh-connect.sh
```

---

### `ssh-site-path.sh`

Affiche le chemin du site configuré dans `ssh-config.json` et liste son contenu.

Usage :

```bash
./ssh-site-path.sh
```

---

### `ssh-config.json`

Fichier de configuration **versionné**, contenant uniquement un pointeur vers la configuration sensible.

Exemple :

```json
{
  "sensitiveConfigPath": "../scratches/scripts-setup-ssh-config.json"
}
```

---

## 🛠 Prérequis

- `jq` doit être installé (utilisé pour lire les fichiers JSON)
- une clé SSH valide doit être configurée dans le fichier défini par `sensitiveConfigPath`
- les scripts doivent être exécutables :

    ```bash
    chmod +x ssh-connect.sh
    chmod +x ssh-site-path.sh
    ```

---

## 🔒 Sécurité

- Aucun secret n’est stocké dans ce dossier
- Les scripts ne doivent jamais être modifiés pour inclure des données sensibles
- Toute modification de configuration doit se faire dans le champ `sensitiveConfigPath` du fichier `ssh-config.json`.

---

## 📚 Références

Documentation Alwaysdata :  

- [Utiliser des clés SSH](https://help.alwaysdata.com/fr/acces-distant/ssh/utiliser-des-cles-ssh)

Documentation du projet :  

- [Guide de vérification des configurations](docs-dev/hebergement/guide_verification-configurations-locale-hebergement.md)

---
