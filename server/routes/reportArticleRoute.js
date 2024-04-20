import express from "express";
import reportArticleController from "../controllers/reportArticleController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMe from "../middlewares/fetchMe.js";
import reportArticleSchema from "../validations/reportArticleSchema.js";
import validator from "../middlewares/validator.js";

const router = express.Router();

// -------------------- get pending reported articles -------------------- //

router.get(
  "/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.getPendingReportedArticles
);

// -------------------- Get resolved article reports -------------------- //

router.get(
  "/resolved",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  reportArticleController.getResolvedArticleReports
);

// -------------------- Get pending reports of an article -------------------- //

router.get(
  "/:id/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.getPendingReportsOfAnArticle
);

// -------------------- report an article -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("user"),
  validator(reportArticleSchema.reportAnArticleSchema),
  reportArticleController.reportAnArticle
);

// -------------------- Mark all reports of an article as resolved -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.markAllReportsOfAnArticleAsResolved
);

// -------------------- Mark a report of an article as resolved -------------------- //

router.patch(
  "/report/:id/resolve",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportArticleController.markAReportOfAnArticleAsResolved
);

export default router;
