import Joi from "joi";

const createDraftSchema = Joi.object({
  title: Joi.string().max(250),
  content: Joi.string().allow(""),
});

const updateDraftSchema = Joi.object({
  title: Joi.string().max(250),
  content: Joi.string().allow(""),
});

export default { createDraftSchema, updateDraftSchema };
