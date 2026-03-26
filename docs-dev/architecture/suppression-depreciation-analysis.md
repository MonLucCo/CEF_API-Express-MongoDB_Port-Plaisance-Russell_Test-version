# Gestion des fonctionnalités obsolètes : suppression, redirection ou dépréciation

Ce document traite de la gestion des fonctionnalités obsolètes. L'analyse architecturale est menée à pour les fonctionnalités **Auth/register** et **Auth/delete** qui ont été identifiées en erreur de conception lors des tests de vérification pré-déploiement de la version v0.2.0-dev, puis obsolètes lors des analyses qui ont suivi.

Cette analyse concerne la **Version : v0.2.1-dev — Issue‑37 — Étape 6‑c**.

---

## 1. Contexte

Dans la version `v0.2.1-dev`, le module **Users** remplace définitivement les anciennes routes d’authentification :

- `POST /auth/register`
- `DELETE /auth/delete/:id`

Ces routes ont été introduites en Phase 2 (issues 12–17) pour permettre l’inscription et la suppression d’un utilisateur.  
Elles sont désormais **obsolètes**, car :

- la création d’utilisateur est assurée par `POST /api/users`
- la suppression d’utilisateur est assurée par `DELETE /api/users/:id`
- la logique métier est centralisée dans le module Users
- la cohérence de l’API impose de ne conserver qu’un seul point d’entrée par fonctionnalité

La question architecturale est donc :  
**comment gérer proprement ces routes obsolètes dans une version déployée, sans casser la documentation, les tests historiques, ni l’architecture ?**

---

## 2. Trois options possibles

### 2.1 Option A — Suppression complète des routes

**Principe :** retirer totalement les routes, le code et les tests.

**Avantages :**

- API plus propre  
- aucune ambiguïté fonctionnelle  

**Inconvénients :**

- rupture fonctionnelle dans une version corrective  
- incohérence documentaire (chapitres devenus obsolètes)  
- perte de traçabilité historique  
- nécessité de supprimer ou archiver des tests  
- risque de confusion pour les futures évolutions  

**Conclusion :**  
❌ **Option rejetée** — trop destructrice (traçabilité documentaire), non adaptée à une version corrective.

---

### 2.2 Option B — Redirection vers Users

**Principe :** conserver les routes, mais les faire appeler les fonctions Users.

**Avantages :**

- aucune rupture fonctionnelle  
- documentation conservée  

**Inconvénients :**

- dette technique (deux chemins pour la même fonctionnalité)  
- confusion dans la logique métier  
- complexité inutile dans une version corrective  
- tests à réécrire  

**Conclusion :**  
❌ **Option rejetée** — solution fonctionnelle mais non souhaitable pour l’architecture.

---

### 2.3 Option C — Privatisation + Dépréciation

**Principe :**

- conserver les routes  
- les protéger par JWT  
- les marquer comme **dépréciées**  
- les laisser **fonctionnelles**  
- ajouter un mécanisme standard de dépréciation

**Avantages :**

- aucune rupture fonctionnelle  
- documentation historique conservée  
- tests existants facilement adaptables  
- cohérence API maintenue  
- mécanisme réutilisable pour d’autres dépréciations  
- transition douce vers une future suppression (v0.3.0 ou v1.0.0)

**Conclusion :**  
✅ **Option retenue** — la plus simple, la plus propre, la plus professionnelle.

---

## 3. Comportement d’une route dépréciée

Deux comportements sont possibles :

### 3.1 Option 1 — Dépréciée et arrêtée (410 Gone)

- renvoie systématiquement `410 Gone`
- indique que la ressource n’existe plus

**Inconvénients :**  
→ rupture fonctionnelle  
→ tests à réécrire  
→ incohérence avec une version corrective

### 3.2 Option 2 — Dépréciée mais fonctionnelle

- la route fonctionne encore  
- mais renvoie un **warning** dans les headers et/ou le JSON  
- permet une transition douce  
- permet de tracer l’utilisation

**Conclusion :**  
👉 **Option retenue : dépréciée mais fonctionnelle**

---

## 4. Mise en place architecturale

### 4.1 Middleware `deprecated.js`

```js
module.exports = (req, res, next) => {
    res.setHeader("X-Deprecated", "true");
    res.locals.deprecated = true;
    next();
};
```

### 4.2 Intégration dans `authRoutes.js`

```js
const deprecated = require('../../middlewares/deprecated');
const authMiddleware = require('../../middlewares/authMiddleware');
const { register, deleteUser } = require('../../controllers/api/authController');

router.post('/register', authMiddleware, deprecated, register);
router.delete('/delete/:id', authMiddleware, deprecated, deleteUser);
```

### 4.3 Ajout du warning dans les réponses JSON

Dans `authController.js` :

```js
if (res.locals.deprecated) {
    response.deprecated = {
        since: "v0.2.1-dev",
        alternative: "/api/users"
    };
}
```

---

## 5. Impact sur les tests

### 5.1 Tests unitaires et intégration

- conserver les tests existants  
- adapter uniquement l’intitulé :

```txt
"POST /auth/register — fonction dépréciée mais fonctionnelle"
```

- ajouter un test :

```js
expect(res.headers['x-deprecated']).to.equal('true');
```

### 5.2 Tests Postman

- aucune modification majeure  
- ajouter un test simple :

```js
pm.test("Route dépréciée", function () {
    pm.expect(pm.response.headers.get("X-Deprecated")).to.eql("true");
});
```

---

## 6. Impact sur la documentation

### 6.1 architecture.md

Ajouter un encart :

```txt
> 🛈 Note — Routes Auth/register et Auth/delete
> Ces routes sont conservées dans la version v0.2.1-dev pour assurer la
> cohérence documentaire et historique du projet. Elles sont désormais
> privatisées et dépréciées via un middleware dédié. Elles restent
> fonctionnelles mais ne doivent plus être utilisées.
```

### 6.2 api-analysis.md

- marquer les routes comme dépréciées  
- indiquer l’alternative `/api/users`

### 6.3 tests-strategy.md

- préciser que les tests sont maintenus pour cohérence historique  
- indiquer la présence du middleware de dépréciation

### 6.4 Nouveau document dans `docs-dev/architecte/`

- intégrer la démarche dans le document `docs-dev/architecture.md`
- création d'un document spécifique `docs-dev/architecture/suppression-depreciation-analysis.md`  

---

## 7. Conclusion

La stratégie retenue pour la version `v0.2.1-dev` est :

- ✔ conserver les routes Auth/register et Auth/delete  
- ✔ les privatiser (JWT obligatoire)  
- ✔ les déprécier (middleware dédié)  
- ✔ les laisser fonctionnelles  
- ✔ adapter légèrement les tests  
- ✔ documenter clairement la dépréciation  
- ✔ préparer leur suppression future (v0.3.0 ou v1.0.0)

Cette approche :

- respecte la cohérence historique  
- évite toute rupture fonctionnelle  
- maintient la documentation  
- prépare proprement l’évolution de l’API  
- introduit un mécanisme réutilisable de gestion de dépréciation

---
