const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// create topic
const createTopic = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;
  const filename = req.file?.filename;
  if (!filename) {
    throw new ErrorResponse(422, "banner required");
  }

  const isExistedTopic = await Topic.findOne({ name });
  if (isExistedTopic) {
    throw new ErrorResponse(409, "topic already exists");
  }

  const slug = toSlug(name);

  const topic = new Topic({
    banner: filename,
    name,
    slug,
  });

  await topic.save();

  res.status(201).json({
    success: true,
  });
});

// update topic
const updateTopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { name } = req.body;

  const filename = req.file?.filename;

  let existingTopic = await Topic.findOne({ slug });
  if (!existingTopic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const topicWithNewName = await Topic.findOne({ name });
  if (
    topicWithNewName &&
    topicWithNewName._id.toString() !== existingTopic._id.toString()
  ) {
    throw new ErrorResponse(404, "topic name already exist");
  }

  const updatedSlug = toSlug(name);

  await Topic.findOneAndUpdate(
    { slug },
    { name, slug: updatedSlug, banner: filename },
    { new: true }
  );

  if (filename) {
    removeFile(existingTopic.banner);
  }

  res.status(200).json({
    success: true,
  });
});

// delete topic
const deleteTopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const topic = await Topic.findOneAndDelete({ slug });
  if (topic) {
    removeFile(topic.banner);
  }

  await FollowTopic.deleteMany({ slug });

  res.status(200).json({
    success: true,
  });
});

// get a topic
const getATopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug }).select("-createdAt -updatedAt");
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const countFollowers = await FollowTopic.countDocuments({ topic: topic._id });

  res.status(200).json({
    success: true,
    data: { topic, countFollowers },
  });
});

// get all topics
const getAllTopics = asyncMiddleware(async (req, res, next) => {
  const searchQuery = req.query.search;

  let topics;

  if (searchQuery) {
    const regex = new RegExp(`^${searchQuery}`, "i");
    topics = Topic.find({ slug: regex });
  }

  if (!searchQuery) {
    topics = Topic.find();
  }

  if (searchQuery === "") {
    topics = [];
  }

  topics = await topics;

  res.status(200).json({
    success: true,
    data: topics,
  });
});

module.exports = {
  createTopic,
  updateTopic,
  deleteTopic,
  getATopic,
  getAllTopics,
};
