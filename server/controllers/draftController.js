import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Draft from "../models/mysql/Draft.js";
import { Op } from "sequelize";
import extracImg from "../utils/extractImg.js";
import fileController from "../controllers/fileController.js";

// ==================== create draft ==================== //
const createADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { title, content } = req.body;

  const draft = await Draft.create({
    authorId: me.profileInfo.id,
    title,
    content,
  });

  res.status(201).json({
    success: true,
    message: "Draft created successfully",
    draftId: draft.id,
  });
});

// ==================== update draft ==================== //
const updateADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { title, content } = req.body;

  const draft = await Draft.findOne({
    where: { id, authorId: me.profileInfo.id },
  });

  if (!draft) throw ErrorResponse(404, "Draft not found");

  await draft.update({ title, content });

  res.json({ success: true, message: "Draft updated successfully" });
});

// ==================== delete draft ==================== //
const deleteADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const draft = await Draft.findByPk(id);

  if (!draft) throw ErrorResponse(404, "Draft not found");

  const imgList = extracImg(draft.content);

  imgList.forEach((img) => {
    fileController.autoRemoveImg(img);
  });

  await Draft.destroy({ where: { id, authorId: me.profileInfo.id } });

  res.json({ success: true, message: "Draft deleted successfully" });
});

// ==================== get a draft ==================== //
const getADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const draft = await Draft.findOne({
    where: { id, authorId: me.profileInfo.id },
    attributes: { exclude: ["authorId"] },
  });

  if (!draft) throw ErrorResponse(404, "Draft not found");

  res.json({ success: true, data: draft });
});

// ==================== get my draft ==================== //
const getMyDrafts = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  const whereQuery = { authorId: me.profileInfo.id };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const drafts = await Draft.findAll({
    where: { authorId: me.profileInfo.id },
    attributes: ["id", "title", "createdAt", "updatedAt"],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = drafts.length > 0 ? drafts[drafts.length - 1].id : null;

  res.json({ success: true, data: drafts, newSkip });
});

export default {
  createADraft,
  updateADraft,
  deleteADraft,
  getADraft,
  getMyDrafts,
};
