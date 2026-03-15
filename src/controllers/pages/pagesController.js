/**
 * Contrôleur pour les pages de l'interface utilisateur.
 * Gère le rendu de la page d'accueil et d'autres pages statiques.
 * Ne contient pas de logique métier complexe ni de middleware.
 * @module controllers/pagesController
 * @requires axios
 * @requires ms
 * @requires appData
 * @version 0.2.0
 */
const axios = require('axios');
const ms = require('ms');
const appData = require('../../../config/appData');

/**
 * Rendu de la page d'accueil de l'API.
 * @function renderHome
 * @memberof module:controllers/pagesController
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Affiche la page d'accueil de l'API avec des informations de statut et un message de bienvenue.
 * Cette page est accessible à tous les utilisateurs, qu'ils soient authentifiés ou non.
 * En version 0.2.0, la page d'accueil est une interface utilisateur simple qui présente les informations de statut de l'API et 
 * un message de bienvenue. Les fonctionnalités de l'API seront progressivement activées au fil du développement, et cette page
 * servira de point d'entrée pour les utilisateurs.
 * 
 * @version 0.2.0
 * 
 * @see views/accueil.ejs
 * @see routes/pagesRoutes
 * @see middlewares/requireAuthPages
 */
exports.renderHome = (req, res) => {
    // Contenu du statut pour la page d'accueil de l'API
    const status = {
        title: appData.APP_TITLE,
        subtitle: appData.APP_SUBTITLE,
        introduction: appData.APP_INTRODUCTION,
        phase: appData.APP_PHASE,
        notes: appData.APP_NOTES,
        github: appData.APP_GITHUB,
        environment: appData.APP_ENVIRONMENT,
        version: `${appData.APP_VERSION_TAG} - ${appData.APP_VERSION_CONTENT}`,

        authenticated: Boolean(req.cookies.token) // Indique si l'utilisateur est authentifié (présence d'un token dans les cookies)
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
    res.render("home", {
        status,
        currentPage: 'home',
        version_tag: appData.APP_VERSION_TAG
    });    // Rendu de la vue EJS avec les données de statut, de la page courante et de la version
};

/**
 * Rendu de la page de connexion.
 * @function renderLogin
 * @memberof module:controllers/pagesController
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Affiche la page de connexion avec un formulaire pour l'email et le mot de passe.
 * En cas d'erreur de connexion, affiche un message d'erreur sur la même page.
 * 
 * @version 0.1.0
 * 
 * Note : la logique de connexion est gérée dans handleLogin, qui communique avec l'API pour obtenir un token JWT.
 * En cas de succès, le token est stocké dans un cookie et l'utilisateur est redirigé vers le dashboard.
 * En cas d'échec, la page de connexion est rendue à nouveau avec un message d'erreur.
 * @see handleLogin
 * @see handleLogout
 * @see renderDashboard
 * @see middlewares/requireAuthPages
 * @see routes/pagesRoutes
 * @see views/login.ejs
 * @see views/dashboard.ejs
 * @see config/jwt
 */
exports.renderLogin = (req, res) => {
    res.render('login', {
        error: null,
        currentPage: 'login',
        version_tag: appData.APP_VERSION_TAG
    });    // Rendu de la vue EJS sans erreur, de la page courante et de la version
};

/**
 * Gestion de la connexion d'un utilisateur.
 * @function handleLogin
 * @memberof module:controllers/pagesController
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Traite les données du formulaire de connexion, communique avec l'API pour vérifier les identifiants,
 * et gère la création du token JWT en cas de succès. En cas d'échec, rend la page de connexion avec un message d'erreur.
 * Cette méthode utilise axios pour envoyer une requête POST à l'endpoint de connexion de l'API.
 * En cas de succès, le token JWT est stocké dans un cookie sécurisé et l'utilisateur est redirigé vers le dashboard.
 * En cas d'échec (identifiants invalides ou erreur de communication), la page de connexion est rendue à nouveau avec un 
 * message d'erreur.
 * 
 * @requires axios
 * @requires ms
 * @version 0.1.0
 * 
 * @see renderLogin
 * @see handleLogout
 * @see middlewares/requireAuthPages
 * @see routes/pagesRoutes
 * @see views/login.ejs
 * @see config/jwt
 */
exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    try {
        const response = await axios.post(`${baseUrl}/api/auth/login`, {
            email,
            password
        });

        const token = response.data.token;

        res.cookie('token', token, {
            httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: process.env.COOKIE_SAME_SITE || 'lax',
            maxAge: ms(process.env.COOKIE_MAX_AGE || '12h')
        });

        res.redirect('/dashboard');

    } catch (error) {
        return res.render('login', {
            error: "Identifiants invalides"
        });
    }
};

/**
 * Rendu du dashboard utilisateur.
 * @function renderDashboard
 * @memberof module:controllers/pagesController
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Affiche la page du dashboard pour les utilisateurs authentifiés. Cette page est protégée par le middleware `
 * requireAuthPage`.
 * Le dashboard affiche des informations personnalisées basées sur `req.userId`, qui est défini par le middleware 
 * d'authentification.
 * En version 0.1.0, le dashboard est un placeholder qui affiche simplement l'identifiant utilisateur extrait du token JWT.
 * Les fonctionnalités spécifiques du dashboard seront développées dans les versions ultérieures.
 * 
 * @version 0.1.0
 * 
 * @see renderLogin
 * @see handleLogin
 * @see handleLogout
 * @see middlewares/requireAuthPages
 * @see routes/pagesRoutes
 * @see views/dashboard.ejs
 * @see config/jwt
 */
exports.renderDashboard = (req, res) => {
    res.render('dashboard', {
        userId: req.userId,
        currentPage: 'dashboard',
        version_tag: appData.APP_VERSION_TAG
    });    // Rendu de la vue EJS avec les données de l'utilisateur connecté, de la page courante et de la version
};

/**
 * Gestion de la déconnexion d'un utilisateur.
 * @function handleLogout
 * @memberof module:controllers/pagesController
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Traite la déconnexion en supprimant le cookie contenant le token JWT et en redirigeant l'utilisateur vers la page 
 * de connexion.
 * Cette méthode est appelée lorsque l'utilisateur clique sur le bouton de déconnexion dans le dashboard.
 * En supprimant le cookie du token, l'utilisateur perd son accès aux pages protégées et doit se reconnecter pour obtenir un 
 * nouveau token.
 * 
 * @version 0.1.0
 * 
 * @see renderLogin
 * @see handleLogin
 * @see routes/pagesRoutes
 * @see views/login.ejs
 * @see views/dashboard.ejs
 */
exports.handleLogout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE || 'lax'
    });

    res.redirect('/');
};
