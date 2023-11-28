import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import roleController from "../controllers/roleController.js";
import fetchMe from "../middlewares/fetchMe.js";
import fetchUser from "../middlewares/fetchUser.js";
import authorize from "../middlewares/authorize.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";

const router = express.Router();

router.get(
  "/staffs",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  roleController.getAllStaffs
);

router.patch(
  "/make-staff/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  fetchUser,
  checkUserBanned,
  roleController.makeUserStaff
);

router.patch(
  "/make-user/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  fetchUser,
  checkUserBanned,
  roleController.makeUserUser
);

export default router;
