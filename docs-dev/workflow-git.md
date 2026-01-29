# Workflow Git du projet

**En préambule** : cette version initiale du document présente la situation du workflow Git pour ce projet. Il fait des hypothèses quant à la mise en oeuvre technique avec des options possibles.  
La version finale lors de la livraison du projet fera l'objet d'une actualisation en ne conservant que les éléments réellement mis en place. Le préambule sera retiré pour cette finalisation.

---

## Objectifs du workflow

- Garantir un développement propre, structuré et traçable  
- Séparer clairement les environnements : développement (`dev`) et production (`main`)  
- Assurer la stabilité de la branche `main` grâce à des règles de protection  
- Faciliter la gestion des issues, des PR et du Kanban GitHub Projects  
- Préparer des releases versionnées (`vX.Y.Z`) à partir de `main`

---

## Branches

La logique des branches suit ce déroulement :

1. Développement sur `feature/...`, voire `fix/...` ou `docs/...`
2. Pull Request vers `dev`
3. Tests automatiques (si possible)
4. Merge vers `main` après validation

### `main`

- Branche stable et protégée  
- Aucun commit direct autorisé  
- Merge uniquement via Pull Request  
- Source des releases (`vX.Y.Z`)  
- Représente l’état officiel du projet

### `dev`

- Branche d’intégration  
- Reçoit les PR issues des branches `feature/...`  
- Doit être régulièrement synchronisée avec `main`  
- Sert de base pour les PR majeures vers `main`

### `feature/...`

- Une branche par issue  
- Nommage recommandé :  
  `feature/issue-XX-description-courte`  
- Contient le développement d’une fonctionnalité ou d’un document  
- Merge vers `dev` via PR

### `fix/...`

- Pour les corrections de bugs  
- Merge vers `dev` (ou exceptionnellement vers `main` si hotfix)

### `docs/...`

- Pour les travaux documentaires isolés  
- Merge vers `dev`

---

## Cycle de développement

1. **Création d’une issue**  
   - Description claire  
   - Ajout au Kanban (colonne *Todo*)

2. **Création de la branche de travail**  
   - Depuis `dev`  
   - Passage de la carte en *In Progress*

3. **Développement dans la branche `feature/...`**  
   - Commits conformes aux conventions  
   - Documentation et tests si nécessaire

   > Les conflits éventuels doivent être résolus dans la branche `feature/...` avant la Pull Request vers `dev`.

4. **Pull Request vers `dev`**  
   - Passage de la carte en *In Dev*  
   - Description complète (issues, contexte, contenu)

5. **Merge dans `dev`**  
   - Après validation  
   - Passage de la carte en *Ready for Main*

6. **Pull Request `dev → main`**  
   - PR regroupant un ensemble cohérent (milestone, bloc de Phase)  
   - Fermeture automatique des issues via `Fixes #XX`

7. **Merge dans `main`**  
   - Passage de la carte en *Done*  
   - Mise à jour du Kanban  
   - Préparation d’une release si nécessaire

> Les branches `feature/...`, `fix/...` et `docs/...` sont supprimées après merge pour garder le dépôt propre.

---

## Règles de protection de la branche `main`

- Pull Request obligatoire  
- Aucun commit direct  
- Merge manuel uniquement  
- Possibilité d’exiger des approbations (si plusieurs contributeurs)  
- Synchronisation régulière de `dev` avec `main`

---

## Pull Requests

### Contenu attendu

- Titre clair  
- Description détaillée  
- Références aux issues (`Fixes #XX`)  
- Liste des modifications  
- Contexte si nécessaire
- Tests passants si nécessaire  
- Ajout au Kanban dans la colonne appropriée

> Les tests automatiques seront intégrés dans une future phase via GitHub Actions.

### Bonnes pratiques

- Une PR = un objectif clair  
- Commits propres et cohérents  
- Relecture avant merge  
- Nettoyage des branches après merge
- Synchronisation de la branche `dev` avec `main` après chaque merge dans `main`

> Le workflow sera appliqué dès la première Pull Request.

---

## Releases

- Créées à partir de `main`  
- Nommage : `vX.Y.Z`  
- Changements documentés dans la release GitHub  
- Alignées avec les milestones du projet

---

## Synchronisation des branches

La branche `dev` doit être synchronisée avec `main` après chaque merge dans `main`.

### Mettre `dev` à jour avec `main`

```pwsh
git checkout dev
git pull
git merge main
```

### Mettre une branche `feature/...` à jour avec `dev`

```pwsh
git checkout feature/issue-XX
git pull
git merge dev
```

---

## Kanban GitHub Projects

Le Kanban reflète l’état réel des issues :

- **Todo** : issue créée  
- **In Progress** : branche `feature/...` en cours  
- **In Dev** : PR vers `dev` ouverte ou mergée  
- **Ready for Main** : PR vers `main` ouverte  
- **Done** : merge dans `main` + issue fermée

---

## Conclusion

Mis en place en amont des travaux du projet, ce workflow garantit :

- une gestion claire des branches  
- une traçabilité complète des issues  
- une stabilité de la branche `main`  
- une intégration progressive via `dev`  
- une documentation et des tests intégrés au cycle de développement  

Il constitue la base organisationnelle du projet et sera ajusté au fil des phases.

---
