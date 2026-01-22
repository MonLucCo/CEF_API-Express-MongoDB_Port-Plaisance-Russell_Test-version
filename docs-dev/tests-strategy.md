# Stratégie de tests

**En préambule** : cette version initiale du document présente la situation des tests prévus pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

## Outils

- Mocha
- Chai
- Supertest

## Tests à couvrir

1. Création catway
2. Suppression catway
3. Liste catways
4. Création réservation
5. Suppression réservation
6. Liste réservations
7. Création utilisateur
8. Suppression utilisateur
9. Connexion utilisateur

> Les tests seront implémentés progressivement au fil des milestones.

## Objectif

Garantir la stabilité du projet et éviter les régressions.

## Emplacement des tests

Tous les tests unitaires et d’intégration sont regroupés dans le dossier `tests/`.  
Chaque fichier de test correspond à une fonctionnalité ou un groupe de routes.
