import express from "express";
import reportUserController from "../controllers/reportUserController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMe from "../middlewares/fetchMe.js";
import reportProfileSchema from "../validations/reportProfileSchema.js";
import validator from "../middlewares/validator.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("user"),
  fetchUser,
  checkUserBanned,
  validator(reportProfileSchema.reportAProfileSchema),
  reportUserController.reportAUser
);

router.get(
  "/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getPendingReportedUsers
);

router.get(
  "/resolved",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getResolvedReports
);

router.get(
  "/:id/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getPendingReportsOfUser
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  reportUserController.markAllResolved
);

router.patch(
  "/report/:id/resolve",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.markAReportAsResolved
);

export default router;
