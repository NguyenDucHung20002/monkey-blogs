const Joi = require("./joi");

const createSchema = Joi.object({
  title: Joi.string().min(5).required(),
  content: Joi.string().min(5).required(),
  topics: Joi.array().max(5).unique(),
  preview: Joi.string().min(5).required(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(5),
  content: Joi.string().min(5),
  topics: Joi.array().max(5).unique(),
  preview: Joi.string().min(5).required(),
});

module.exports = { createSchema, updateSchema };
