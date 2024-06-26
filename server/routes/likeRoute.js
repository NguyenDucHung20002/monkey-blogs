import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import likeController from "../controllers/likeController.js";
import fetchMe from "../middlewares/fetchMe.js";
import optionalAuth from "../middlewares/optionalAuth.js";

const router = express.Router();

// -------------------- like an article -------------------- //

router.post("/:id", requiredAuth, fetchMe, likeController.likeAnArticle);

// -------------------- unlike an article -------------------- //

router.delete("/:id", requiredAuth, fetchMe, likeController.unLikeAnArticle);

// -------------------- get likers of an article -------------------- //

router.get("/:id", requiredAuth, fetchMe, likeController.getLikersOfAnArticle);

export default router;
