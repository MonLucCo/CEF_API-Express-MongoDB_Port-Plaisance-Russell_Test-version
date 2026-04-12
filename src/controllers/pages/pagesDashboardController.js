const appData = require('../../../config/appData');

/**
 * Nettoie une chaîne de caractères pour l'utiliser comme identifiant (ex: nom d'utilisateur, email).
 * @function cleanIdentifier
 * @memberof module:controllers/pagesDashboardController
 * @param {string} value - La chaîne à nettoyer.
 * @return {string|null} La chaîne nettoyée, ou null si la valeur est vide ou nulle.
 * 
 * @description Cette fonction prend une chaîne de caractères en entrée et effectue les opérations suivantes :
 * - Si la valeur est vide ou nulle, elle retourne null.
 * - Sinon, elle supprime les espaces au début et à la fin de la chaîne, ainsi que les espaces multiples à l'intérieur de la chaîne.
 * 
 * En version 0.1.0, cette fonction implémente la logique de nettoyage décrite ci-dessus, pour garantir que les identifiants
 * utilisés dans le dashboard sont correctement formatés et ne contiennent pas d'espaces indésirables.
 * 
 * @version 0.1.0
 **/
function cleanIdentifier(value) {
    if (!value) return null;

    // Supprime espaces début/fin
    let v = value.trim();

    // Supprime espaces multiples internes
    v = v.replace(/\s+/g, "");

    return v;
}

/**
 * Rendu du dashboard utilisateur.
 * @function renderDashboard
 * @memberof module:controllers/pagesDashboardController
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Affiche la page du dashboard pour les utilisateurs authentifiés. Cette page est protégée par le 
 * middleware `requireAuthPage`.
 * Le dashboard affiche des informations personnalisées basées sur `req.userId`, qui est défini par le middleware 
 * d'authentification.
 * En version 0.2.0, le dashboard affiche les fonctions de gestion des utilisateurs, des catways et des réservations, 
 * ainsi que la documentation de l'API.
 * Un système de messages flash est utilisé pour afficher des notifications de succès ou d'erreur après les actions 
 * effectuées depuis le dashboard.
 * 
 * @version 0.2.0
 */
exports.renderDashboard = (req, res) => {
    const catwayTypes = ['short', 'long'];

    res.render('dashboard', {
        BASE_URL: req.app.locals.BASE_URL,
        catwayTypes,
        currentPage: 'dashboard',
        version_tag: appData.APP_VERSION_TAG,
        success: req.flash('success'),
        error: req.flash('error')
    });    // Rendu de la vue EJS avec les données de l'utilisateur connecté, de la page courante, de la version et des messages flash pour les notifications de succès ou d'erreur.
};

/**
 * @function createUserFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la création d'un utilisateur à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de création d'utilisateur dans le dashboard. La logique de création 
 * d'utilisateur doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la création, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la création 
 * d'utilisateur n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de création d'utilisateur à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour créer un nouvel utilisateur dans la base de données. 
 * Après la création, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.createUserFromDashboard = async (req, res) => {
    try {
        const apiUrl = `${req.app.locals.APP_URL}/api/users`;

        const response = await fetch(
            apiUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include",
                body: JSON.stringify({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            req.flash('error', data.error || "Erreur lors de la création");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash('success', "Utilisateur créé avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (error) {
        req.flash('error', "Erreur interne lors de la création");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function updateUserFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la mise à jour d'un utilisateur à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de mise à jour d'utilisateur dans le dashboard. La logique de mise à jour 
 * d'utilisateur doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la mise à jour, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la mise à jour 
 * d'utilisateur n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de mise à jour d'un utilisateur à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour modifier l'utilisateur dans la base de données. 
 * Après la mise à jour, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.updateUserFromDashboard = async (req, res) => {
    try {
        const id = cleanIdentifier(req.body.id);
        const apiUrl = `${req.app.locals.APP_URL}/api/users/${id}`;

        const response = await fetch(
            apiUrl,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include",
                body: JSON.stringify({
                    name: req.body.name || undefined,
                    email: req.body.email || undefined,
                    password: req.body.password || undefined
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            req.flash('error', data.error || "Erreur lors de la mise à jour");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash('success', "Utilisateur mis à jour avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (error) {
        req.flash('error', "Erreur interne lors de la mise à jour");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function deleteUserFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la suppression d'un utilisateur à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de suppression d'utilisateur dans le dashboard. La logique de suppression 
 * d'utilisateur doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la suppression, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la suppression 
 * d'utilisateur n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de suppression d'un utilisateur à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour supprimer l'utilisateur dans la base de données. 
 * Après la suppression, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.deleteUserFromDashboard = async (req, res) => {
    try {
        const id = cleanIdentifier(req.body.id);
        const apiUrl = `${req.app.locals.APP_URL}/api/users/${id}`;

        const response = await fetch(
            apiUrl,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            req.flash('error', data.error || "Erreur lors de la suppression");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash('success', "Utilisateur supprimé avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (error) {
        req.flash('error', "Erreur interne lors de la suppression");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function listUsersFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la liste des utilisateurs à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de liste d'utilisateurs dans le dashboard. La logique de liste 
 * d'utilisateurs doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la liste des utilisateurs, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la liste 
 * des utilisateurs n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de la liste des utilisateurs à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour visualiser les détails de l'utilisateur dans la base de données. 
 * Après la visualisation, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers 
 * le dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.listUsersFromDashboard = async (req, res) => {
    try {
        const apiUrl = `${req.app.locals.APP_URL}/api/users`;

        const response = await fetch(
            apiUrl,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include"
            }
        );

        const users = await response.json();

        if (!response.ok) {
            req.flash('error', users.error || "Erreur lors du chargement de la liste");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        res.render('users-list', {
            BASE_URL: req.app.locals.BASE_URL,
            users,
            currentPage: 'users',
            version_tag: appData.APP_VERSION_TAG
        });

    } catch (error) {
        req.flash('error', "Erreur interne lors du chargement de la liste");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function createCatwayFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la création d'un catway à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de création de catway dans le dashboard. La logique de création 
 * de catway doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la création, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la création 
 * de catway n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de création d'un catway à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour créer un nouvel utilisateur dans la base de données. 
 * Après la création, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.createCatwayFromDashboard = async (req, res) => {
    try {
        const response = await fetch(
            `${req.app.locals.APP_URL}/api/catways`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include",
                body: JSON.stringify({
                    catwayNumber: parseInt(req.body.catwayNumber, 10),
                    type: req.body.type,
                    catwayState: req.body.catwayState
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            req.flash('error', data.error || "Erreur lors de la création du catway");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash('success', "Catway créé avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (error) {
        req.flash('error', "Erreur interne lors de la création du catway");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function updateCatwayFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la mise à jour d'un catway à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de mise à jour de catway dans le dashboard. La logique de mise à jour 
 * de catway doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la mise à jour, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la mise à jour 
 * de catway n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de mise à jour de l'état d'un catway à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour modifier le catway dans la base de données. 
 * Après la mise à jour, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.updateCatwayFromDashboard = async (req, res) => {
    try {
        const id = cleanIdentifier(req.body.id);
        const apiUrl = `${req.app.locals.APP_URL}/api/catways/${id}`;

        const response = await fetch(
            apiUrl,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include",
                body: JSON.stringify({
                    catwayState: req.body.catwayState
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            req.flash('error', data.error || "Erreur lors de la mise à jour du catway");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash('success', "Catway mis à jour avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (error) {
        req.flash('error', "Erreur interne lors de la mise à jour du catway");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function deleteCatwayFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la suppression d'un catway à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de suppression de catway dans le dashboard. La logique de suppression 
 * de catway doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la suppression, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la suppression 
 * de catway n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de suppression d'un catway à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour supprimer le catway dans la base de données. 
 * Après la suppression, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.deleteCatwayFromDashboard = async (req, res) => {
    try {
        const id = cleanIdentifier(req.body.id);
        const apiUrl = `${req.app.locals.APP_URL}/api/catways/${id}`;

        const response = await fetch(
            apiUrl,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include",
                body: JSON.stringify({})
            }
        );

        if (!response.ok) {
            req.flash('error', data.error || "Erreur lors de la suppression du catway");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash('success', "Catway supprimé avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (error) {
        req.flash('error', "Erreur interne lors de la suppression du catway (test)");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function detailCatwayFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la visualisation des détails d'un catway à partir du dashboard. Cette fonction est appelée 
 * lorsque l'administrateur soumet le formulaire de détail de catway dans le dashboard. La logique de détail 
 * de catway doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la suppression, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la visualisation 
 * des détails d'un catway n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de détail d'un catway à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour visualiser les détails du catway dans la base de données. 
 * Après la visualisation, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers 
 * le dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.detailCatwayFromDashboard = async (req, res) => {
    try {
        const id = cleanIdentifier(req.query.id);

        if (!id) {
            req.flash('error', "ID catway manquant");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        const apiUrl = `${req.app.locals.APP_URL}/api/catways/${id}`;

        const response = await fetch(
            apiUrl,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include"
            }
        );

        const catway = await response.json();

        if (!response.ok) {
            req.flash('error', catway.error || "Catway introuvable");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        res.render('catway-details', {
            BASE_URL: req.app.locals.BASE_URL,
            catway,
            currentPage: 'catways',
            version_tag: appData.APP_VERSION_TAG
        });

    } catch (error) {
        req.flash('error', "Erreur interne lors du chargement du catway");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function listCatwaysFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la liste des catways à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de liste de catways dans le dashboard. La logique de liste 
 * de catways doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la liste des catways, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la liste 
 * des catways n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de la liste des catways à partir du dashboard, en 
 * utilisant les données envoyées dans `req.body` pour récupérer la liste des catways depuis la base de données. 
 * Après la récupération, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers 
 * le dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.listCatwaysFromDashboard = async (req, res) => {
    try {
        const apiUrl = `${req.app.locals.APP_URL}/api/catways`;

        const response = await fetch(
            apiUrl,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include"
            }
        );

        const catways = await response.json();

        if (!response.ok) {
            req.flash('error', catways.error || "Erreur lors du chargement de la liste des catways");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        res.render('catways-list', {
            BASE_URL: req.app.locals.BASE_URL,
            catways,
            currentPage: 'catways',
            version_tag: appData.APP_VERSION_TAG
        });

    } catch (error) {
        req.flash('error', "Erreur interne lors du chargement de la liste des catways");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function createReservationFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la création d'une réservation à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de création de réservation dans le dashboard. La logique de création 
 * de réservation doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la création, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la création 
 * de réservation n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de création d'une réservation d'un catway à partir du dashboard, 
 * en utilisant les données envoyées dans `req.body` pour créer un nouvel utilisateur dans la base de données. 
 * Après la création, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.createReservationFromDashboard = async (req, res) => {
    try {
        const catwayId = cleanIdentifier(req.body.catwayId);

        const apiUrl = `${req.app.locals.APP_URL}/api/catways/${catwayId}/reservations`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie ?? ""
            },
            credentials: "include",
            body: JSON.stringify({
                clientName: req.body.clientName,
                boatName: req.body.boatName,
                checkIn: req.body.checkIn,
                checkOut: req.body.checkOut
            })
        });

        const data = await response.json();

        if (!response.ok) {
            req.flash("error", data.error || "Erreur lors de la création de la réservation");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash("success", "Réservation créée avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (err) {
        req.flash("error", "Erreur interne lors de la création de la réservation");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function deleteReservationFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la suppression d'une réservation à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de suppression de réservation dans le dashboard. La logique de suppression 
 * de réservation doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la suppression, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la suppression 
 * de réservation n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de suppression d'une réservation d'un catway à partir du dashboard, 
 * en utilisant les données envoyées dans `req.body` pour supprimer le catway dans la base de données. 
 * Après la suppression, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers le 
 * dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.deleteReservationFromDashboard = async (req, res) => {
    try {
        const catwayId = cleanIdentifier(req.body.catwayId);
        const reservationId = cleanIdentifier(req.body.reservationId);

        const apiUrl = `${req.app.locals.APP_URL}/api/catways/${catwayId}/reservations/${reservationId}`;

        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie ?? ""
            },
            credentials: "include"
        });

        if (!response.ok) {
            req.flash("error", data.error || "Erreur lors de la suppression de la réservation");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        req.flash("success", "Réservation supprimée avec succès");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);

    } catch (err) {
        req.flash("error", "Erreur interne lors de la suppression de la réservation");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function detailReservationFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la visualisation des détails d'une réservation à partir du dashboard. Cette fonction est appelée 
 * lorsque l'administrateur soumet le formulaire de détail de réservation dans le dashboard. La logique de détail 
 * de réservation doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la suppression, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la visualisation 
 * des détails d'une réservation n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de détail d'une réservation d'un catway à partir du dashboard, 
 * en utilisant les données envoyées dans `req.body` pour visualiser les détails du catway dans la base de données. 
 * Après la visualisation, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers 
 * le dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.detailReservationFromDashboard = async (req, res) => {
    try {
        const catwayId = cleanIdentifier(req.query.catwayId);
        const reservationId = cleanIdentifier(req.query.reservationId);

        if (!catwayId || !reservationId) {
            req.flash("error", "Paramètres manquants");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        const apiUrl = `${req.app.locals.APP_URL}/api/catways/${catwayId}/reservations/${reservationId}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie ?? ""
            },
            credentials: "include"
        });

        const reservation = await response.json();

        if (!response.ok) {
            req.flash("error", reservation.error || "Réservation introuvable");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        res.render("reservation-details", {
            BASE_URL: req.app.locals.BASE_URL,
            reservation,
            currentPage: "reservations",
            version_tag: appData.APP_VERSION_TAG
        });

    } catch (err) {
        req.flash("error", "Erreur interne lors du chargement de la réservation");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function listReservationsFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la liste des réservations d'un catwayà partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de liste de réservations dans le dashboard. La logique de liste 
 * de réservations doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la liste des réservations, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la liste 
 * des réservations d'un catwayn'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de liste des réservations d'un catway à partir du dashboard, 
 * en utilisant les données envoyées dans `req.body` pour visualiser les détails du catway dans la base de données. 
 * Après la visualisation, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers 
 * le dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.listReservationsFromDashboard = async (req, res) => {
    try {
        const catwayId = cleanIdentifier(req.query.catwayId);

        if (!catwayId) {
            req.flash("error", "ID catway manquant");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        const apiUrl = `${req.app.locals.APP_URL}/api/catways/${catwayId}/reservations`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie ?? ""
            },
            credentials: "include"
        });

        const reservations = await response.json();

        if (!response.ok) {
            req.flash("error", reservations.error || "Erreur lors du chargement des réservations");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        res.render("reservations-list", {
            BASE_URL: req.app.locals.BASE_URL,
            reservations,
            currentPage: "reservations",
            version_tag: appData.APP_VERSION_TAG
        });

    } catch (err) {
        req.flash("error", "Erreur interne lors du chargement des réservations");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function listAllReservationsFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @async
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Gère la liste des réservations à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur soumet le formulaire de liste des réservations dans le dashboard. La logique de liste 
 * de réservations doit être implémentée dans cette fonction, en utilisant les données envoyées dans `req.body`. 
 * Après la liste des réservations, un message flash est ajouté pour informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la liste 
 * des réservations n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * En version 0.2.0, cette fonction implémente la logique de liste des réservations des catways du port à partir du dashboard, 
 * en utilisant les données envoyées dans `req.body` pour visualiser les détails du catway dans la base de données. 
 * Après la visualisation, un message flash de succès est ajouté pour informer l'utilisateur, et une redirection vers 
 * le dashboard est effectuée.
 * 
 * @version 0.2.0
 */
exports.listAllReservationsFromDashboard = async (req, res) => {
    try {
        const base = req.app.locals.APP_URL;

        // 1. Récupérer tous les catways
        const catwaysResponse = await fetch(`${base}/api/catways`, {
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie ?? ""
            },
            credentials: "include"
        });

        const catways = await catwaysResponse.json();

        if (!catwaysResponse.ok) {
            req.flash("error", catways.error || "Erreur lors du chargement des catways");
            return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
        }

        let allReservations = [];

        // 2. Récupérer les réservations de chaque catway
        for (const c of catways) {
            const resvResponse = await fetch(`${base}/api/catways/${c._id}/reservations`, {
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie ?? ""
                },
                credentials: "include"
            });

            const reservations = await resvResponse.json();

            if (resvResponse.ok) {
                reservations.forEach(r => r.catwayNumber = c.catwayNumber);
                allReservations.push(...reservations);
            }
        }

        // 3. Affichage
        res.render("reservations-list", {
            BASE_URL: req.app.locals.BASE_URL,
            reservations: allReservations,
            currentPage: "reservations",
            version_tag: appData.APP_VERSION_TAG
        });

    } catch (err) {
        req.flash("error", "Erreur interne lors du chargement des réservations");
        return res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
    }
}

/**
 * @function detailReservationFromDashboard
 * @memberof module:controllers/pagesDashboardController
 * @param {*} req 
 * @param {*} res
 * @return {void}
 * 
 * @description Affiche la documentation de l'API à partir du dashboard. Cette fonction est appelée lorsque 
 * l'administrateur clique sur le lien de documentation de l'API dans le dashboard. La logique de rendu de la 
 * documentation de l'API doit être implémentée dans cette fonction, en utilisant les données nécessaires pour
 * afficher la documentation de manière claire et informative. Après le rendu, un message flash est ajouté pour 
 * informer l'utilisateur.
 * 
 * En version 0.1.0, cette fonction est un placeholder qui affiche un message d'erreur indiquant que la documentation
 * de l'API n'est pas encore implémentée, et redirige vers le dashboard.
 * 
 * @version 0.1.0
 **/
exports.renderApiDocsFromDashboard = (req, res) => {
    // TODO : implémenter la logique de rendu de la documentation API à partir du dashboard
    req.flash('error', "API docs not implemented");
    res.redirect(`${req.app.locals.BASE_URL}/dashboard`);
}