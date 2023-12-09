import express from "express";
import notificationController from "../controllers/notificationController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  notificationController.getNotifications
);

router.patch(
  "/mark-all-as-readed",
  requiredAuth,
  fetchMe,
  notificationController.martAllAsReaded
);

router.patch(
  "/mark-as-readed/:id",
  requiredAuth,
  fetchMe,
  notificationController.markAsReaded
);

export default router;
