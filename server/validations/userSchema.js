const Joi = require("./joi");

const updateSchema = Joi.object({
  fullname: Joi.string().min(3).max(50),
  bio: Joi.string().allow("").max(160),
  about: Joi.string().allow("").max(300),
});

const searchSchema = Joi.object({
  search: Joi.string().allow(""),
});

module.exports = { updateSchema, searchSchema };
