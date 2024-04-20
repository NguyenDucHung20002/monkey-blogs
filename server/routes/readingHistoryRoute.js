import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import readingHistoryController from "../controllers/readingHistoryController.js";

const router = express.Router();

// -------------------- delete an article in reading history -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  readingHistoryController.deleteAnArticleInReadingHistory
);

// -------------------- clear reading history -------------------- //

router.delete(
  "/me/clear",
  requiredAuth,
  fetchMe,
  readingHistoryController.clearReadingHistory
);

// -------------------- get reading history -------------------- //

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  readingHistoryController.getReadingHistory
);

export default router;
