import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import readingHistoryController from "../controllers/readingHistoryController.js";

const router = express.Router();

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  readingHistoryController.deleteAnArticleInHistory
);

router.delete(
  "/me/clear",
  requiredAuth,
  fetchMe,
  readingHistoryController.clearMyReadingHistory
);

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  readingHistoryController.getMyReadingHistory
);

export default router;
