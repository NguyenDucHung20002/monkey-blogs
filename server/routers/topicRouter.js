const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const topicSchema = require("../validations/topicSchema");
const { authorize } = require("../middlewares/authorize");
const topicController = require("../controllers/topicController");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  authorize("admin"),
  mongoUpload.single("banner"),
  validator(topicSchema.createSchema),
  topicController.createTopic
);

router.put(
  "/:slug",
  jwtAuth,
  authorize("admin"),
  mongoUpload.single("banner"),
  validator(topicSchema.updateSchema),
  topicController.updateTopic
);

router.delete(
  "/:slug",
  jwtAuth,
  authorize("admin"),
  topicController.deleteTopic
);

router.get("/", topicController.getAllTopics);

module.exports = router;
