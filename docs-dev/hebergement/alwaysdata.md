# Hébergement Alwaysdata

**En préambule** : cette version initiale du document présente la configuration prévue sur Alwaysdata pour héberger l’API. Elle sera ajustée lors du premier déploiement effectif.  
La version finale lors de la livraison du projet fera l’objet d’une actualisation en ne conservant que les éléments réellement mis en place.

---

## Objectif

Configurer l’espace d’hébergement Alwaysdata pour exécuter l’API Node.js du Port de Plaisance Russell.

---

## Création du site Node.js

1. Accéder au tableau de bord Alwaysdata
2. Menu **Sites web → Ajouter un site**
3. Choisir :
   - **Type** : Node.js
   - **Version Node** : version LTS recommandée
   - **Point d’entrée** : `server.js` (ou autre fichier selon l’architecture)
   - **Domaine** : sous-domaine Alwaysdata ou domaine personnalisé

---

## Configuration du point d’entrée

Le fichier défini comme point d’entrée doit :

- démarrer le serveur Express
- écouter sur le port fourni par Alwaysdata via `process.env.PORT`
- ne pas utiliser de port fixe

Exemple minimal :

```js
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

---

## Accès SSH / FTP

Alwaysdata fournit :

- un accès SSH
- un accès SFTP
- un espace de fichiers dédié au site

Ces accès permettent :

- le déploiement manuel
- la consultation des logs
- la gestion des fichiers distants

---

## Logs

Alwaysdata met à disposition :

- logs d’accès
- logs d’erreurs
- logs Node.js

Ils sont essentiels pour le débogage lors du premier déploiement.

---

## Variables d’environnement

Les variables nécessaires seront définies dans :

- fichier d'environnement `.env` (un fichier d'example est fourni et doit être complété et renommé)

Exemples :

- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

---

## Étapes suivantes

- Préparer le déploiement (issue future)
- Tester la connexion à MongoDB depuis Alwaysdata
- Déployer la première version fonctionnelle de l’API

---
