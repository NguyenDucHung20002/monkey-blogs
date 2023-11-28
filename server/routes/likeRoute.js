import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import likeController from "../controllers/likeController.js";
import fetchMe from "../middlewares/fetchMe.js";
import optionalAuth from "../middlewares/optionalAuth.js";

const router = express.Router();

router.post("/:id", requiredAuth, fetchMe, likeController.likeAnArticle);

router.delete("/:id", requiredAuth, fetchMe, likeController.unLikeAnArticle);

router.get("/:id", optionalAuth, fetchMe, likeController.getArticleLiker);

export default router;
