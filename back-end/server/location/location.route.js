const express = require("express");

const router = express.Router();
const locationCtrl = require("./location.controller");

/** GET /api/v1/locations - return locations search results. */
router.route("/").get(locationCtrl.getLocations);

module.exports = router;
