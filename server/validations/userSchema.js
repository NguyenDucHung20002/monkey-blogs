const Joi = require("./joi");

const updateSchema = Joi.object({
  fullname: Joi.string().min(3).max(50),
  bio: Joi.string().max(160),
  about: Joi.string().max(200),
});

module.exports = { updateSchema };
