const Joi = require("./joi");

const createSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  topics: Joi.array().max(5).unique().required(),
});

module.exports = { createSchema };
