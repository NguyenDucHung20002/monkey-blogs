import express from "express";
import fileController from "../controllers/fileController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import mongoUpload from "../middlewares/mongoUpload.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMe,
  mongoUpload.single("img"),
  fileController.upLoadAnImg
);

router.get("/:filename", fileController.getAnImg);

router.delete("/:filename", requiredAuth, fetchMe, fileController.deleteAnImg);

export default router;
