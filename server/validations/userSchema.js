import Joi from "joi";

const banAUserSchema = Joi.object({
  banType: Joi.string()
    .valid("1week", "1month", "1year", "permanent")
    .required(),
});

export default { banAUserSchema };
