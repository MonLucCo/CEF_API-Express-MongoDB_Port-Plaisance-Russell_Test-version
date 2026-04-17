# Stratégie globale des tests

Le projet distingue deux grandes familles de tests, complémentaires et clairement séparées :

---

## 1. Tests développeurs

Tests techniques destinés à garantir la stabilité interne du code, la non‑régression et la qualité logicielle.  
Ils couvrent quatre niveaux :

- **Niveau 1 : tests unitaires**
- **Niveau 2 : tests d’intégration**
- **Niveau 3 : tests E2E simulés**
- **Niveau 4 : tests de pré‑déploiement / déploiement / post‑déploiement**

Ces tests sont utilisés par les développeurs pour valider la robustesse du code et la stabilité des versions déployées.

👉 Détails complets :  `tests-developers.md`

---

## 2. Tests opérationnels Client

Tests orientés métier, destinés à valider les **9 fonctionnalités demandées par la capitainerie**.  
Ils sont exécutés automatiquement **au lancement local de l’application** et affichent les résultats dans la console.

Ces tests constituent la validation fonctionnelle attendue par le sujet du devoir.

👉 Détails complets :  `tests-client.md`

---

## 3. Objectifs de la séparation

Cette séparation garantit :

- une lecture claire pour le correcteur,
- une distinction nette entre tests techniques et tests métier,
- une maintenance facilitée,
- une intégration cohérente dans le workflow du projet,
- une préparation propre pour la Phase 7 (tests Client).

---
