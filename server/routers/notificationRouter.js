const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const requiredAuth = require("../middlewares/requiredAuth");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

// get all notifications
router.get(
  "/me",
  requiredAuth,
  fetchMe,
  notificationController.getNotifications
);

router.get(
  "/me/unread/amount",
  requiredAuth,
  fetchMe,
  notificationController.countUnRead
);

module.exports = router;
