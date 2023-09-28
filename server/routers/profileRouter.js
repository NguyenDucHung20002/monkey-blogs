const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/:username", profileController.getAProfile);

module.exports = router;
