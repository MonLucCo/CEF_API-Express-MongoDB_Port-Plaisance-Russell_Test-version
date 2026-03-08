/**
 * Route d'accueil de l'API (version dynamique EJS).
 *
 * Endpoint :
 * - GET /  → rend la page d'accueil (views/accueil.ejs) avec les informations de statut de l'API.
 *
 * @module routes/accueilRoutes
 * @requires express
 * @version 0.1.1
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Contenu du statut pour la page d'accueil de l'API
  const status = {
    title: "API Port de Plaisance Russell",
    phase: "Version initiale en construction",
    notes: [
      "Les fonctionnalités seront activées progressivement au fil du développement.",
      "Le projet évolue progressivement selon la roadmap accessible dans le dépôt GitHub.",
      "N'hésitez pas à consulter le code source, mais aucune contribution n'est souhaitée pour le moment !"
    ],
    github: "https://github.com/MonLucCo/CEF_API-Express-MongoDB_Port-Plaisance-Russell_Test-version",
    environment: process.env.NODE_ENV || "development",
    version: "0.1.1-dev (EJS)"
  };

  // Header système (version Node en dev, identifiant neutre en prod)
  const systemInfo = process.env.NODE_ENV === 'production'
    ? "runtime-1"
    : process.version;

  // Headers HTTP
  res.setHeader("X-API-Status", status.environment);
  res.setHeader("X-API-Version", status.version);
  res.setHeader("X-API-SYSTEM", systemInfo);

  // Réponse HTML - page d'accueil de l'API
  res.render("accueil", { status });
});

module.exports = router;
