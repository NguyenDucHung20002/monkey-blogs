import express from "express";
import reportArticleController from "../controllers/reportArticleController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMe from "../middlewares/fetchMe.js";
import reportArticleSchema from "../validations/reportArticleSchema.js";
import validator from "../middlewares/validator.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("user"),
  validator(reportArticleSchema.reportAnArticleSchema),
  reportArticleController.reportAnArticle
);

router.get(
  "/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.getPendingReportedArticles
);

router.get(
  "/:id/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.getPendingReportsOfArticle
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.markAllResolved
);

router.patch(
  "/report/:id/resolve",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.markAReportAsResolved
);

export default router;
