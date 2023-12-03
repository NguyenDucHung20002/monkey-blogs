import Joi from "joi";

const createArticleSchema = Joi.object({
  title: Joi.string().max(250).required(),
  preview: Joi.string().max(200).required(),
  content: Joi.string().required(),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

const updateArticleSchema = Joi.object({
  title: Joi.string().max(250),
  preview: Joi.string().max(200),
  content: Joi.string(),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

export default { createArticleSchema, updateArticleSchema };
