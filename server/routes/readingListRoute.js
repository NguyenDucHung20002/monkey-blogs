import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import readingListController from "../controllers/readingListController.js";

const router = express.Router();

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

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  readingListController.getMyReadingList
);

export default router;
