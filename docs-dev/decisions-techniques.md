# Décisions techniques

**En préambule** : cette version initiale du document présente la situation des décisions retenues pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

> Les décisions non retenues seront retirées lors de la finalisation.

---

## Express 5.x

Choix motivé par la stabilité et les améliorations de la version 5.

## MongoDB Atlas

Base de données cloud simple à configurer.

## Helmet

Sécurisation des headers HTTP.

## Organisation du code

Séparation stricte modèles / contrôleurs / routes.

## Environnement de développement

### Tests E2E simulés

Décision : introduire un serveur Express dédié (`tests/test-app.js`) pour exécuter les tests E2E simulés via Postman.

Motivations :

- isoler l’environnement de test de l’environnement de production
- utiliser MongoMemoryServer pour éviter toute dépendance externe
- permettre un cycle complet register → login → delete
- garantir un environnement reproductible pour les tests manuels

### Serveur local - Activation Nodemon

Décision : ajouter une configuration nodemon locale (`config/dev/nodemon.json`) pour faciliter le développement, sans impacter le déploiement.
