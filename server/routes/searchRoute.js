import express from "express";
import searchController from "../controllers/searchController.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

// -------------------- search -------------------- //

router.get("/", optionalAuth, fetchMe, searchController.search);

export default router;
