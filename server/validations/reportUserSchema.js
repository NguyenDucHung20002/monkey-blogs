import Joi from "joi";

const reportAUserSchema = Joi.object({
  reason: Joi.string().min(3).max(80).required(),
  description: Joi.string().max(250).allow(""),
});

export default {
  reportAUserSchema,
};
