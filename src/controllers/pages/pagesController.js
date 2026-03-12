exports.renderAccueil = (req, res) => {
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
        version: "0.1.2-dev (EJS & REST)"
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
    res.render("accueil", { status });    // Rendu de la vue EJS avec les données de statut
};
