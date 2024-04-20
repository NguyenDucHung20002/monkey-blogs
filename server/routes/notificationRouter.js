import express from "express";
import notificationController from "../controllers/notificationController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

// -------------------- get notifications -------------------- //

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  notificationController.getNotifications
);

// -------------------- mark all notifications as read -------------------- //

router.patch(
  "/mark-all-as-read",
  requiredAuth,
  fetchMe,
  notificationController.martAllNotificationsAsRead
);

// -------------------- clear read notifications -------------------- //

router.delete(
  "/clear",
  requiredAuth,
  fetchMe,
  notificationController.clearReadNotifications
);

export default router;
