import express from "express";
import reportUserController from "../controllers/reportUserController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";
import reportProfileSchema from "../validations/reportProfileSchema.js";
import validator from "../middlewares/validator.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  authorize("user"),
  validator(reportProfileSchema.reportAProfileSchema),
  reportUserController.reportAUser
);

router.get(
  "/pending",
  requiredAuth,
  fetchMyUser,
  authorize("staff", "admin"),
  reportUserController.getPendingReportedUsers
);

router.get(
  "/:id",
  requiredAuth,
  fetchMyUser,
  authorize("staff", "admin"),
  reportUserController.getReportsOfUser
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMyUser,
  authorize("staff", "admin"),
  reportUserController.markAllResolved
);

export default router;
