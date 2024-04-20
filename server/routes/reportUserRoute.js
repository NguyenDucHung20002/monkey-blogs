import express from "express";
import reportUserController from "../controllers/reportUserController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMe from "../middlewares/fetchMe.js";
import reportProfileSchema from "../validations/reportUserSchema.js";
import validator from "../middlewares/validator.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";

const router = express.Router();

// -------------------- get pending reported users -------------------- //

router.get(
  "/user/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getPendingReportedUsers
);

// -------------------- get pending reported staffs -------------------- //

router.get(
  "/staff/pending",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  reportUserController.getPendingReportedStaffs
);

// -------------------- get resolved user reports -------------------- //

router.get(
  "/resolved",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  reportUserController.getResolvedUserReports
);

// -------------------- report a user -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("user"),
  fetchUser,
  checkUserBanned,
  validator(reportProfileSchema.reportAUserSchema),
  reportUserController.reportAUser
);

// -------------------- get pending reports of user -------------------- //

router.get(
  "/:id/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getPendingReportsOfAUser
);

// -------------------- mark all reports of a user as resolved -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  reportUserController.markAllReportsOfAUserAsResolved
);

// -------------------- mark a report of a user as resolved -------------------- //

router.patch(
  "/report/:id/resolve",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.markAReportOfAUserAsResolved
);

export default router;
