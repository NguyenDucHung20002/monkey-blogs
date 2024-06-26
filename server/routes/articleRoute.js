import express from "express";
import articleController from "../controllers/articleController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import authorize from "../middlewares/authorize.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import articleSchema from "../validations/articleSchema.js";
import validator from "../middlewares/validator.js";

const router = express.Router();

// -------------------- create a draft -------------------- //

router.post(
  "/draft/create-draft",
  requiredAuth,
  fetchMe,
  validator(articleSchema.createADraftSchema, "body"),
  articleController.createADraft
);

// -------------------- get all drafts -------------------- //

router.get("/draft/me", requiredAuth, fetchMe, articleController.getAllDrafts);

// -------------------- get followed profiles articles -------------------- //

router.get(
  "/following",
  requiredAuth,
  fetchMe,
  articleController.getFollowedProfilesArticles
);

// -------------------- explore new articles -------------------- //

router.get(
  "/explore-new-articles",
  requiredAuth,
  fetchMe,
  articleController.exploreNewArticles
);

// -------------------- admin pick -------------------- //

router.get(
  "/admin-pick-full-list",
  requiredAuth,
  fetchMe,
  articleController.adminPick
);

// -------------------- get all articles -------------------- //

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.getAllArticles
);

// -------------------- get profile articles -------------------- //

router.get(
  "/:username/all",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  articleController.getProfileArticles
);

// -------------------- update a draft -------------------- //

router.patch(
  "/draft/update-draft/:id",
  requiredAuth,
  fetchMe,
  validator(articleSchema.updateADraftSchema, "body"),
  articleController.updateADraft
);

// -------------------- delete a draft -------------------- //

router.delete(
  "/draft/delete-draft/:id",
  requiredAuth,
  fetchMe,
  articleController.deleteADraft
);

// -------------------- get removed articles -------------------- //

router.get(
  "/removed-articles",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  articleController.getRemovedArticles
);

// -------------------- get an article or a draft to edit -------------------- //

router.get(
  "/get/:id",
  requiredAuth,
  fetchMe,
  articleController.getAnArticleOrADraftToEdit
);

// -------------------- create an article -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  validator(articleSchema.createAnArticleSchema, "body"),
  articleController.createAnArticle
);

// -------------------- update an article -------------------- //

router.patch(
  "/update/:id",
  requiredAuth,
  fetchMe,
  validator(articleSchema.updateAnArticleSchema, "body"),
  articleController.updateAnArticle
);

// -------------------- delete an article -------------------- //

router.delete("/:id", requiredAuth, fetchMe, articleController.deleteAnArticle);

// -------------------- get an article -------------------- //

router.get("/:slug", requiredAuth, fetchMe, articleController.getAnArticle);

// -------------------- get followed topic articles -------------------- //

router.get(
  "/followed/topic/:slug",
  requiredAuth,
  fetchMe,
  articleController.getFollowedTopicArticles
);

// -------------------- get topic articles -------------------- //

router.get(
  "/topic/:slug",
  requiredAuth,
  fetchMe,
  articleController.getTopicArticles
);

// -------------------- set an article back to draft -------------------- //

router.patch(
  "/set-article-back-to-draft/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.setAnArticleBackToDraft
);

// -------------------- approve an article -------------------- //

router.patch(
  "/approve/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.approveAnArticle
);

// -------------------- remove an article -------------------- //

router.delete(
  "/remove/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.removeAnArticle
);

// -------------------- restore an article -------------------- //

router.patch(
  "/restore/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  articleController.restoreAnArticle
);

// -------------------- get an article detail -------------------- //

router.get(
  "/detail/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.getAnArticleDetail
);

// -------------------- get more articles from author -------------------- //

router.get(
  "/more-articles-from-profile/:id",
  requiredAuth,
  fetchMe,
  articleController.getMoreArticlesFromAuthor
);

export default router;
