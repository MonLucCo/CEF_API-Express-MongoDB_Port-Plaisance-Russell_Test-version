# Initialisation de l’hébergement du projet

**En préambule** : cette version initiale du document présente la démarche d’initialisation de l’hébergement du projet. Elle décrit les étapes nécessaires avant le début du développement fonctionnel.  
La version finale lors de la livraison du projet fera l’objet d’une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

## Objectif

Préparer l’environnement d’hébergement complet du projet avant le développement :

- un espace Node.js sur Alwaysdata pour accueillir l’API
- une base MongoDB dédiée sur MongoDB Atlas
- la configuration des accès et des variables d’environnement
- la documentation des paramètres techniques nécessaires au futur déploiement.

Cette initialisation garantit que l’environnement est prêt dès que la première version fonctionnelle de l’API sera disponible.

---

## Étapes principales

1. **Création du site Node.js sur Alwaysdata**
   - choix de la version Node
   - configuration du point d’entrée
   - préparation du domaine ou sous-domaine
   - vérification des accès SSH/FTP

2. **Création de la base MongoDB**
   - création du cluster
   - création de la base dédiée
   - création d’un utilisateur avec permissions limitées
   - récupération de l’URI de connexion

3. **Préparation du projet Node.js**
   - serveur Express minimal
   - script `start` dans `package.json`
   - fichier `.env.example` adapté à Alwaysdata
   - tests de démarrage local

4. **Documentation**
   - `alwaysdata.md` : [configuration de l’hébergement](./alwaysdata.md)
   - `mongodb.md` : [configuration de la base de données](./mongodb.md)

---

## Résultat attendu

À l’issue de cette initialisation :

- l’hébergement est prêt à recevoir l’API
- la base MongoDB est opérationnelle
- les paramètres techniques sont documentés
- le projet peut être déployé dès qu’une version fonctionnelle est disponible.

---
