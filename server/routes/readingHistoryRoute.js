import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import historyReadingController from "../controllers/historyReadingController.js";

const router = express.Router();

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  historyReadingController.deleteAnArticleInHistory
);

router.delete(
  "/me/clear",
  requiredAuth,
  fetchMe,
  historyReadingController.clearMyHistoryReading
);

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  historyReadingController.getMyHistoryReading
);

export default router;
