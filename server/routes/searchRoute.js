import express from "express";
import searchController from "../controllers/searchController.js";
import fetchMe from "../middlewares/fetchMe.js";
import requiredAuth from "../middlewares/requiredAuth.js";

const router = express.Router();

// -------------------- search -------------------- //

router.get("/", requiredAuth, fetchMe, searchController.search);

export default router;
