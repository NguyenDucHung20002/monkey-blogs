const Joi = require("./joi");

const createSchema = Joi.object({
  title: Joi.string().min(5).required(),
  preview: Joi.string().min(5).required(),
  content: Joi.string().min(5).required(),
  topics: Joi.array().max(5).unique(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(5),
  preview: Joi.string().min(5),
  content: Joi.string().min(5),
  topics: Joi.array().max(5).unique(),
});

module.exports = { createSchema, updateSchema };
