import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import toSlug from "../utils/toSlug.js";
import Topic from "../models/mysql/Topic.js";
import { Op } from "sequelize";
import ErrorResponse from "../responses/ErrorResponse.js";
import Follow_Topic from "../models/mysql/Follow_Topic.js";

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

// ==================== get a topic ==================== //
const getATopic = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
  const { slug } = req.params;

  let topic = await Topic.findOne({
    where: { slug, status: "approved" },
    attributes: ["id", "name", "followersCount", "articlesCount"],
  });

  if (!topic) throw new ErrorResponse(404, "Topic not found");

  if (me) {
    const isFollowed = !!(await Follow_Topic.findOne({
      where: { topicId: topic.id, profileId: me.profileInfo.id },
      attributes: ["id"],
    }));
    topic = { ...topic.toJSON(), isFollowed };
  }

  res.json({ success: true, data: topic });
});

// ==================== get all topics ==================== //
const getAllTopics = asyncMiddleware(async (req, res, next) => {
  const { skipId, skipStatus, limit = 5, search, sort = "ASC" } = req.query;

  let whereQuery = {};

  if (search) {
    whereQuery.slug = { [Op.substring]: search };
  }

  if (skipId && skipStatus) {
    whereQuery[Op.or] = [
      { status: { [Op.lt]: skipStatus } },
      { [Op.and]: [{ status: skipStatus }, { id: { [Op.gt]: skipId } }] },
    ];
  }

  if (skipId && skipStatus && sort === "DESC") {
    whereQuery[Op.or] = [
      { status: { [Op.gt]: skipStatus } },
      { [Op.and]: [{ status: skipStatus }, { id: { [Op.gt]: skipId } }] },
    ];
  }

  const topics = await Topic.findAll({
    where: whereQuery,
    order: [["status", sort]],
    limit: Number(limit) && Number.isInteger(limit) ? limit : 15,
  });

  const newSkipId = topics.length > 0 ? topics[topics.length - 1].id : null;
  const newSkipStatus =
    topics.length > 0 ? topics[topics.length - 1].status : null;

  res.json({ success: true, data: topics, newSkipId, newSkipStatus });
});

export default {
  createTopic,
  updateTopic,
  deleteTopic,
  getATopic,
  getAllTopics,
};
