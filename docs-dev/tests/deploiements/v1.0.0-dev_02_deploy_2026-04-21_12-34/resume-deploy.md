# Résumé Déploiement — v1.0.0-dev

**📅 Date :** 4/21/2026, 12:36:25 PM  
**🧩 Pipeline :** 1.0.0  
**🌐 URL de publication :** <https://perlucco.alwaysdata.net/api/port-plaisance-russell>

---

## 🧭 Contexte

Ce document résume l’exécution complète du pipeline de déploiement pour la version **v1.0.0-dev**.  
Il inclut les traces du pipeline, les résultats, ainsi que les éléments nécessaires à l’archivage et à la traçabilité.

---

## 🔧 trace du pipeline

=== Pipeline Deploy ===

🛠️ Version pipeline : 1.0.0

Réponse (Version à déployer (ex : v0.2.0-dev) :) : v1.0.0-dev
📁 Dossier créé : docs-dev/tests/deploiements/v1.0.0-dev_02_deploy_2026-04-21_12-34
▶ npm run deploy:check
✔ Log enregistré : 01_deploy-check.log
▶ npm run deploy:preview
✔ Log enregistré : 02_deploy-preview.log
▶ npm run deploy:dry
✔ Log enregistré : 03_deploy-dry.log
Réponse (Lancer le déploiement réel : (o/N) ?) : o
▶ npm run deploy -- --deploy
✔ Log enregistré : 04_deploy.log
Réponse (Le serveur Alwaysdata a-t-il été redémarré manuellement ? (o/N) :) : o
🔍 Test d'accès à l'API en production...
✔ API accessible — log : 05_api-test.log

=== Pipeline Deploy terminé ! ===

---

## 📦 Synthèse des résultats

- **Version déployée :** v1.0.0-dev
- **Dossier d’archive généré**
- **Logs enregistrés**
- **Checklist de déploiement générée**
- **Publication Alwaysdata effectuée**
- **API vérifiée après déploiement**

- **Conclusion de la validation** :

    Voir le document : [checklist-deployment.md](./checklist-deployment.md)

---

## 🏁 Statut final

- **Succès :** Oui / Non  
- **Version publiée :** v1.0.0-dev  
- **Rollback nécessaire :** Oui / Non  

---

## 📝 Notes complémentaires

*Ajouter ici toute remarque utile : anomalies, décisions, points à revoir, etc.*.

---

Fin du rapport.
