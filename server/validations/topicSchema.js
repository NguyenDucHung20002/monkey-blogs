const Joi = require("./joi");

const createSchema = Joi.object({
  name: Joi.string().min(2).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2),
});

module.exports = { createSchema, updateSchema };
