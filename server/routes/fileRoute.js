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
  fileController.upLoadFile
);

router.get("/:filename", fileController.getFile);

router.delete("/:filename", requiredAuth, fetchMe, fileController.deleteFile);

export default router;
