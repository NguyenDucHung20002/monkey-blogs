import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import toSlug from "../utils/toSlug.js";
import Topic from "../models/mysql/Topic.js";
import { Op } from "sequelize";
import ErrorResponse from "../responses/ErrorResponse.js";
import Follow_Topic from "../models/mysql/Follow_Topic.js";
import User from "../models/mysql/User.js";

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
  const { skip = 0, limit = 15, search } = req.query;
  const me = req.me ? req.me : null;

  let query = { id: { [Op.gt]: skip }, attributes: ["id", "name", "slug"] };

  if (me && (me.role.slug === "admin" || me.role.slug === "staff")) {
    query = {
      order: [["id", "DESC"]],
      include: {
        model: User,
        as: "approvedBy",
        attributes: ["email", "username"],
      },
      attributes: { exclude: ["approvedById"] },
    };

    if (skip) query.where = { id: { [Op.lt]: skip } };

    if (search) query.where[Op.and] = { slug: { [Op.substring]: search } };
  }

  query.limit = Number(limit) && Number.isInteger(limit) ? limit : 15;

  const topics = await Topic.findAll(query);

  const newSkip = topics.length > 0 ? topics[topics.length - 1].id : null;

  res.json({ success: true, data: topics, newSkip });
});

// ==================== mark topic as approved ==================== //
const martTopicAsApproved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const topic = await Topic.findByPk(id);

  if (!topic) throw ErrorResponse(404, "Topic not found ");

  if (topic.status === "approved") {
    throw ErrorResponse(400, "Topic already arrpoved");
  }

  await topic.update({ status: "approved", approvedById: me.id });

  res.json({ success: true, message: `${topic.name} approved successfully` });
});

export default {
  createTopic,
  updateTopic,
  deleteTopic,
  getATopic,
  getAllTopics,
  martTopicAsApproved,
};
