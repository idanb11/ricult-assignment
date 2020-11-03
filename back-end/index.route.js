const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap
const locationRoutes = require('./server/location/location.route');

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount search locations at /locations
router.use('/locations', locationRoutes);

module.exports = router;
