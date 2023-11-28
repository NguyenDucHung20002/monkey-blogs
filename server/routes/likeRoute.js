import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import likeController from "../controllers/likeController.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  likeController.likeAnArticle
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  likeController.unLikeAnArticle
);

export default router;
