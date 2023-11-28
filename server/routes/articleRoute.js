import express from "express";
import articleController from "../controllers/articleController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/", requiredAuth, fetchMe, articleController.createArticle);

router.patch("/:id", requiredAuth, fetchMe, articleController.updateArticle);

router.delete("/:id", requiredAuth, fetchMe, articleController.deleteArticle);

router.get(
  "/me/pending",
  requiredAuth,
  fetchMe,
  articleController.getMyPendingArticles
);

router.get(
  "/me/approved",
  requiredAuth,
  fetchMe,
  articleController.getMyApprovedArticles
);

router.get(
  "/:username/all",
  optionalAuth,
  fetchMe,
  articleController.getProfileArticles
);

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.getAllArticles
);

export default router;
