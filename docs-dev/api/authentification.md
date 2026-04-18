# 🔐 Authentification — API REST

Cette section décrit **uniquement les routes d’authentification de l’API REST**.  
Les routes de connexion/déconnexion du dashboard (pages EJS) ne font **pas** partie de l’API REST et sont documentées séparément.

L’API utilise un mécanisme **stateless** basé sur des **JSON Web Tokens (JWT)**.  
Aucune session n’est conservée côté serveur.

---

## ▶️ POST /auth/login

Authentifie un utilisateur et retourne un **token JWT** permettant d’accéder aux routes protégées de l’API.

### 🔸 Body

```json
{
  "email": "string",
  "password": "string"
}
```

### 🔸 Réponse 200

```json
{
  "token": "jwt-token"
}
```

### 🔸 Erreurs possibles

| Code | Description                    |
|------|--------------------------------|
| 400  | Email ou mot de passe manquant |
| 401  | Identifiants invalides         |

---

## 🚫 Pas de route /auth/logout dans l’API REST

L’API REST est **stateless** :  
➡️ elle ne maintient **aucune session** côté serveur  
➡️ elle ne peut donc **pas “déconnecter”** un utilisateur

La “déconnexion” consiste simplement à **supprimer le token JWT** côté client.

### Comment se déconnecter ?

- supprimer le cookie contenant le JWT (dashboard EJS)  
- ou supprimer le token stocké côté client (application externe)  
- ou attendre l’expiration naturelle du token  

> ❗ L’expiration du token n’est pas une action utilisateur :  
> elle assure uniquement la sécurité.

---

## 🧭 Authentification des pages (non API)

Les routes suivantes appartiennent au **frontend EJS** et ne font pas partie de l’API REST :

- `GET /login`  
- `POST /login`  
- `GET /logout`  

Elles gèrent la session utilisateur du dashboard via un cookie JWT.

---

## 🗑️ Routes dépréciées (non documentées)

Les routes suivantes ont existé durant les versions de développement mais sont **supprimées en v1.0.0** :

- `POST /auth/register`  
- `DELETE /auth/delete/:id`  

Elles ne doivent plus être utilisées et ne font pas partie de l’API stable.

---

## 📌 Résumé

| Fonction         | API REST           | Pages EJS      |
|------------------|--------------------|----------------|
| Connexion        | ✔ POST /auth/login | ✔ POST /login  |
| Déconnexion      | ❌ (stateless)     | ✔ GET /logout  |
| Token JWT        | ✔ Oui              | ✔ Oui (cookie) |
| Sessions serveur | ❌ Non             | ❌ Non         |

Cette séparation garantit une API REST **propre** et **stateless**, conforme aux bonnes pratiques et à la v1.0.0 de l'application.
