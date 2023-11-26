import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import toSlug from "../utils/toSlug.js";
import Topic from "../models/mysql/Topic.js";
import { Op } from "sequelize";
import ErrorResponse from "../responses/ErrorResponse.js";
import Profile from "../models/mysql/Profile.js";
// import Follow_Topic from "./Follow_Topic.js";

// ==================== create topic ==================== //
const createTopic = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;

  const slug = toSlug(name);

  const existingTopic = await Topic.findOne({
    where: { [Op.or]: [{ name }, { slug }] },
    attributes: ["id"],
  });

  if (existingTopic) throw ErrorResponse(409, "Topic already exists");

  await Topic.create({ name, slug });

  res.status(201).json({
    success: true,
    message: "Topic created successfully",
  });
});

// ==================== update topic ==================== //
const updateTopic = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const existingTopic = await Topic.findByPk(id);

  if (!existingTopic) throw ErrorResponse(404, "Topic not found");

  const updatedSlug = toSlug(name);

  const newNameTopic = await Topic.findOne({
    where: { [Op.or]: [{ name }, { slug: updatedSlug }] },
    attributes: ["id"],
  });

  if (newNameTopic && newNameTopic.id !== existingTopic.id) {
    throw ErrorResponse(409, "Topic name already exist");
  }

  await existingTopic.update({ name, slug: updatedSlug });

  res.json({ success: true, message: "Topic updated successfully" });
});

// ==================== delete topic ==================== //
const deleteTopic = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;

  await Topic.destroy({ where: { id } });

  res.json({ success: true, message: "Topic deleted successfully" });
});

// // ==================== get a topic ==================== //
// const getATopic = asyncMiddleware(async (req, res, next) => {
//   const { slug } = req.params;

//   const myUserId =
//     req.jwtPayLoad && req.jwtPayLoad.id ? req.jwtPayLoad.id : null;

//   const topic = await Topic.findOne({ where: { slug } });

//   if (!topic) throw new ErrorResponse(404, "Topic not found");

//   if (myUserId) {
//     const myProfile = await Profile.findOne({ where: { userId: myUserId } });
//     if (myProfile) {
//       const isFollowed = !!(await Follow_Topic.findOne({
//         where: { topicId: topic.id, profileId: myProfile.id },
//         attributes: ["id"],
//       }));
//       return res.json({
//         success: true,
//         data: { ...topic.toJSON(), isFollowed },
//       });
//     }
//   }

//   res.json({ success: true, data: topic });
// });

// // ==================== get all topics ==================== //
// const getAllTopics = asyncMiddleware(async (req, res, next) => {
//   const { skip = 0, limit = 15, search } = req.query;

//   const whereQuery = { id: { [Op.gt]: skip } };

//   if (search) {
//     whereQuery.slug = { [Op.substring]: search };
//   }

//   let topics = await Topic.findAll({
//     where: whereQuery,
//     limit: parseInt(limit, 10),
//     attributes: ["id", "name", "slug"],
//   });

//   const skipID = topics.length > 0 ? topics[topics.length - 1].id : null;

//   res.json({ success: true, data: topics, skipID });
// });

export default {
  createTopic,
  updateTopic,
  deleteTopic,
  // getATopic,
  // getAllTopics,
};
