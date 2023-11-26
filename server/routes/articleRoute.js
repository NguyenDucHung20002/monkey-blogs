import express from "express";
import articleController from "../controllers/articleController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  articleController.createArticle
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  articleController.updateArticle
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  articleController.deleteArticle
);

router.get(
  "/me/pending",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  articleController.getMyPendingArticles
);

router.get(
  "/me/approved",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  articleController.getMyApprovedArticles
);

export default router;
