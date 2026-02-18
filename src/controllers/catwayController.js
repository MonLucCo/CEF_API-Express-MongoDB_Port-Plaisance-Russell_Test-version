/**
 * @file catwayController.js
 * @description Contrôleur Catways — version initiale (placeholder).
 * 
 * Cette version définit la structure des fonctions du contrôleur Catways,
 * sans implémentation métier. Les méthodes seront complétées dans les
 * issues 25 à 30.
 * 
 * @module controllers/catwayController
 * @version 0.0.1
 */

/**
 * GET /catways
 * @description Récupère la liste des catways (non implémenté)
 */
exports.getAllCatways = (req, res) => {
    res.status(501).json({ message: 'Récupère la liste des catways - Non implémenté (issue‑25)' });
};

/**
 * GET /catways/:id
 * @description Récupère un catway par ID (non implémenté)
 */
exports.getCatwayById = (req, res) => {
    res.status(501).json({ message: 'Récupère un catway par ID - Non implémenté (issue‑26)' });
};

/**
 * POST /catways
 * @description Crée un nouveau catway (non implémenté)
 */
exports.createCatway = (req, res) => {
    res.status(501).json({ message: 'Crée un nouveau catway - Non implémenté (issue‑27)' });
};

/**
 * PUT /catways/:id
 * @description Met à jour un catway (non implémenté)
 */
exports.updateCatway = (req, res) => {
    res.status(501).json({ message: 'Mise à jour d’un catway - Non implémenté (issue‑28)' });
};

/**
 * PATCH /catways/:id
 * @description Actualise un catway (non implémenté)
 */
exports.patchCatway = (req, res) => {
    res.status(501).json({ message: 'Actualise un catway - Non implémenté (issue‑29)' });
};

/**
 * DELETE /catways/:id
 * @description Supprime un catway (non implémenté)
 */
exports.deleteCatway = (req, res) => {
    res.status(501).json({ message: 'Supprime un catway - Non implémenté (issue‑30)' });
};
