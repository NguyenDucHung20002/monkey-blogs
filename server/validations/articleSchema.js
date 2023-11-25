const Joi = require("./joi");

const createSchema = Joi.object({
  title: Joi.string().min(15).required(),
  preview: Joi.string().min(15).required(),
  content: Joi.string().min(15).required(),
  topics: Joi.array().max(5).unique(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(15),
  preview: Joi.string().min(15),
  content: Joi.string().min(15),
  topics: Joi.array().max(5).unique(),
});

const searchSchema = Joi.object({
  search: Joi.string().allow(""),
});

module.exports = { createSchema, updateSchema, searchSchema };
