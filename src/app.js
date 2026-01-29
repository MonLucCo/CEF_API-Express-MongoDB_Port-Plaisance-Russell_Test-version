const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // Contenu du statut pour la page d'accueil de l'API
  const status = {
    title: "API Port de Plaisance Russell",
    phase: "Version initiale en construction",
    notes: [
      "Les fonctionnalités seront activées progressivement au fil du développement.",
      "Le projet évolue progressivement selon la roadmap accessible dans le dépôt GitHub."
    ],
    github: "https://github.com/MonLucCo/CEF_API-Express-MongoDB_Port-Plaisance-Russell_Test-version",
    environment: "development",
    version: "0.1-dev"
  };

  // Header système (version Node en dev, identifiant neutre en prod)
  const systemInfo = process.env.NODE_ENV === 'production'
    ? "runtime-1"
    : process.version;

  // Headers HTTP
  res.setHeader("X-API-Status", status.environment);
  res.setHeader("X-API-Version", status.version);
  res.setHeader("X-API-SYSTEM", systemInfo);

  res.send(`
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="API Port de Plaisance Russell — version initiale en construction.">
        <meta name="robots" content="noindex, nofollow">
        <meta name="author" content="Luc PERARD">
        <meta name="theme-color" content="#005580">
        <link rel="icon" href="data:image/svg+xml,
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
            <rect width='100' height='100' fill='%23005580'/>
            <text x='50' y='60' font-size='55' text-anchor='middle' fill='white' font-family='sans-serif'>PR</text>
            <text x='50' y='88' font-size='32' text-anchor='middle' fill='white'>⚓</text>
        </svg>">
        <title>${status.title}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; color: #333; }
          h1 { color: #005580; }
          ul { margin-top: 1rem; }
          .meta { margin-top: 2rem; font-size: 0.9rem; color: #666; }
        </style>
      </head>
      <body>
        <h1>${status.title}</h1>
        <p><strong>${status.phase}</strong></p>
        <ul>
          ${status.notes.map(note => `<li>${note}</li>`).join('')}
        </ul>
        <div class="meta">
          <p>Source disponible sur <a href="${status.github}" target="_blank">${status.github}</a></p>
          <p>Environnement : ${status.environment}</p>
          <p>Version : ${status.version}</p>
        </div>
      </body>
    </html>
  `);
});

module.exports = app;
