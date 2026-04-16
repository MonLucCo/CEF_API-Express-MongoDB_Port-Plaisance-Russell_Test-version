const express = require('express');
const router = express.Router();
const pagesDashboardController = require('../../controllers/pages/pagesDashboardController');

// Dashboard principal
router.get('/', pagesDashboardController.renderDashboard);

// Actions utilisateur
router.post('/users/create', pagesDashboardController.createUserFromDashboard);
router.post('/users/update', pagesDashboardController.updateUserFromDashboard);
router.post('/users/delete', pagesDashboardController.deleteUserFromDashboard);
router.get('/users/list', pagesDashboardController.listUsersFromDashboard);

// Actions catways
router.post('/catways/create', pagesDashboardController.createCatwayFromDashboard);
router.post('/catways/update', pagesDashboardController.updateCatwayFromDashboard);
router.post('/catways/delete', pagesDashboardController.deleteCatwayFromDashboard);
router.get('/catways/details', pagesDashboardController.detailCatwayFromDashboard);
router.get('/catways/list', pagesDashboardController.listCatwaysFromDashboard);

// Actions réservations
router.post('/reservations/create', pagesDashboardController.createReservationFromDashboard);
router.post('/reservations/delete', pagesDashboardController.deleteReservationFromDashboard);
router.get('/reservations/details', pagesDashboardController.detailReservationFromDashboard);
router.get('/reservations/catway', pagesDashboardController.listReservationsFromDashboard);
router.get('/reservations/list', pagesDashboardController.listAllReservationsFromDashboard);

// Documentation API
router.get('/docs/api', pagesDashboardController.renderApiDocsFromDashboard);

module.exports = router;
