import express from "express";
import reportUserController from "../controllers/reportUserController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
import reportProfileSchema from "../validations/reportProfileSchema.js";
import validator from "../middlewares/validator.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  authorize("user"),
  // validator(reportProfileSchema.reportAProfileSchema),
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
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getReportsOfUser
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.markAllResolved
);

export default router;
