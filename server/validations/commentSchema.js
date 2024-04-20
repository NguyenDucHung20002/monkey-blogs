import Joi from "joi";

const createACommentSchema = Joi.object({
  parentCommentId: Joi.number().optional().allow(null).allow(""),
  content: Joi.string().min(3).max(150).required(),
});

const updateACommentSchema = Joi.object({
  content: Joi.string().min(3).max(150).required(),
});

export default {
  createACommentSchema,
  updateACommentSchema,
};
