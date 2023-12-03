import express from "express";
import articleController from "../controllers/articleController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import authorize from "../middlewares/authorize.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import optionalAuth from "../middlewares/optionalAuth.js";

const router = express.Router();

router.post("/", requiredAuth, fetchMe, articleController.createArticle);

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
  "/following",
  requiredAuth,
  fetchMe,
  articleController.getFollowedProfilesArticles
);

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.getAllArticles
);

router.get(
  "/:username/all",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  articleController.getProfileArticles
);

router.get(
  "/topic/:slug",
  requiredAuth,
  fetchMe,
  articleController.getFollowedTopicArticles
);

router.patch("/:id", requiredAuth, fetchMe, articleController.updateArticle);

router.delete("/:id", requiredAuth, fetchMe, articleController.deleteArticle);

router.get("/:slug", optionalAuth, fetchMe, articleController.getAnArticle);

export default router;
