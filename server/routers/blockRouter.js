const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const requiredAuth = require("../middlewares/requiredAuth");
const blockController = require("../controllers/blockController");

const router = express.Router();

// block or unblock a user
router.post(
  "/:username/block-unblock",
  requiredAuth,
  fetchMe,
  blockController.BlockOrUnBlockAUser
);

module.exports = router;
