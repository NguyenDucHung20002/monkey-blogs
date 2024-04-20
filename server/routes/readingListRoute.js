import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import readingListController from "../controllers/readingListController.js";

const router = express.Router();

// -------------------- get reading list -------------------- //

router.get("/me", requiredAuth, fetchMe, readingListController.getReadingList);

// -------------------- add an article to reading list -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  readingListController.addAnArticleToReadingList
);

// -------------------- remove an article in reading list -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  readingListController.removeAnArticleInReadingList
);

export default router;
