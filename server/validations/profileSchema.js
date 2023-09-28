const Joi = require("./joi");

const updateSchema = Joi.object({
  fullname: Joi.string().min(3).max(45),
  bio: Joi.string().max(100).optional(),
  about: Joi.string().max(500).optional(),
});

module.exports = { updateSchema };
