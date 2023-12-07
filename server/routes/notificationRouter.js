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

export default router;
