import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import readingListController from "../controllers/readingListController.js";

const router = express.Router();

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  readingListController.getMyReadingList
);

router.get(
  "/me/recently-saved",
  requiredAuth,
  fetchMe,
  readingListController.getMyRecentlySaved
);

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  readingListController.addToReadingList
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  readingListController.removeFromReadingList
);

export default router;
