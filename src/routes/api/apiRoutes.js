const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/catways', require('./catwayRoutes'));
router.use('/catways', require('./reservationRoutes'));

module.exports = router;
