# ❗ Gestion des erreurs — API REST

Toutes les erreurs de l’API REST suivent un format JSON standardisé :

```json
{
  "error": "Message explicite décrivant l’erreur"
}
```

L’API utilise des codes HTTP cohérents avec les bonnes pratiques REST.

---

## 🔸 400 — Bad Request

La requête est invalide.

Causes possibles :

- ID mal formé (`ObjectId` invalide)
- Payload JSON incorrect ou incomplet
- Données non conformes au schéma attendu

Exemple :

```json
{ "error": "Invalid ID format" }
```

---

## 🔸 401 — Unauthorized

Le token JWT est :

- manquant  
- invalide  
- expiré  

Exemple :

```json
{ "error": "Authentication required" }
```

---

## 🔸 403 — Forbidden

L’utilisateur authentifié n’a pas les droits nécessaires.  
*(Actuellement non utilisé dans la v1.0.0, mais réservé pour évolutions futures.)*

---

## 🔸 404 — Not Found

La ressource demandée n’existe pas.

Causes possibles :

- Catway introuvable
- Réservation introuvable
- Utilisateur introuvable

Exemple :

```json
{ "error": "Catway not found" }
```

---

## 🔸 409 — Conflict

Conflit avec une ressource existante.

Causes possibles :

- Email déjà utilisé
- Catway déjà existant (catwayNumber dupliqué)

Exemple :

```json
{ "error": "Email already exists" }
```

---

## 🔸 500 — Internal Server Error

Erreur interne inattendue.

Exemple :

```json
{ "error": "Internal server error" }
```

---

## 📌 Résumé des codes utilisés

| Code | Signification         | Exemple de cas                     |
|------|-----------------------|------------------------------------|
| 400  | Requête invalide      | ID incorrect, payload invalide     |
| 401  | Non authentifié       | Token manquant ou invalide         |
| 403  | Accès interdit        | (réservé pour évolutions)          |
| 404  | Ressource introuvable | Catway / réservation / user absent |
| 409  | Conflit               | Email ou catwayNumber dupliqué     |
| 500  | Erreur interne        | Exception non gérée                |

---

Cette gestion d’erreurs garantit une API REST **prévisible** et **cohérente**, conforme aux bonnes pratiques et à la v1.0.0.

---
