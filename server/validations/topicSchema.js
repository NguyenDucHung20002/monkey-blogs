const Joi = require("./joi");

const createSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3),
});

module.exports = { createSchema, updateSchema };
