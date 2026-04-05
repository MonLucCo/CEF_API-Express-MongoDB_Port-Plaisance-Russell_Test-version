# Résumé Déploiement — v0.2.1-dev.a

**📅 Date :** 3/30/2026, 10:04:34 AM  
**🧩 Pipeline :** 1.0.0  
**🌐 URL de publication :** <https://perlucco.alwaysdata.net/api/port-plaisance-russell>

---

## 🧭 Contexte

Ce document résume l’exécution complète du pipeline de déploiement pour la version **v0.2.1-dev.a**.  
Il inclut les traces du pipeline, les résultats, ainsi que les éléments nécessaires à l’archivage et à la traçabilité.

---

## 🔧 trace du pipeline

=== Pipeline Deploy ===
Version pipeline : 1.0.0
📁 Dossier créé : docs-dev/tests/deploiements/v0.2.1-dev.a_02_deploy_2026-03-30_10-03
▶ npm run deploy:check
✔ Log enregistré : 01_deploy-check.log
▶ npm run deploy:preview
✔ Log enregistré : 02_deploy-preview.log
▶ npm run deploy:dry
✔ Log enregistré : 03_deploy-dry.log
▶ npm run deploy -- --deploy
✔ Log enregistré : 04_deploy.log
🔍 Test d'accès à l'API en production...
✔ API accessible — log : 05_api-test.log

---

## 📦 Synthèse des résultats

- **Version déployée :** v0.2.1-dev.a
- **Dossier d’archive généré**
- **Logs enregistrés**
- **Checklist de déploiement générée**
- **Publication Alwaysdata effectuée**
- **API vérifiée après déploiement**

- **Conclusion de la validation** :

    Voir le document : [checklist-deployment.md](./checklist-deployment.md)

---

## 🏁 Statut final

- **Succès :** Oui (patch nécessaire)
- **Version publiée :** v0.2.1-dev.a  
- **Rollback nécessaire :** Non  

---

## 📝 Notes complémentaires

Cette version fonctionne partiellement et nécessite un correctif (patch) pour rendre fonctionnel le Login.

---

Fin du rapport.
