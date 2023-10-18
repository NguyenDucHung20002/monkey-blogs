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
  notificationController.getAllNotifications
);

// delete all notifications
router.delete(
  "/me/delete",
  requiredAuth,
  fetchMe,
  notificationController.deleteAllNotifications
);

// delete  notification
router.delete(
  "/me/:id/delete",
  requiredAuth,
  fetchMe,
  notificationController.deleteNotification
);

// mart notification as read
router.delete(
  "/me/:id/read",
  requiredAuth,
  fetchMe,
  notificationController.MarkAsRead
);

// mart all notifications as read
router.delete(
  "/me/read",
  requiredAuth,
  fetchMe,
  notificationController.markAllNotificationsAsRead
);

module.exports = router;
