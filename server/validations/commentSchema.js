const Joi = require("./joi");

const createSchema = Joi.object({
  content: Joi.string().required(),
  parentCommentId: Joi.string(),
});

const idSchema = Joi.object({
  id: Joi.objectId(),
});

const updateSchema = Joi.object({
  content: Joi.string(),
});

module.exports = { createSchema, idSchema, updateSchema };
