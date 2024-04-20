import Joi from "joi";

const createATopicSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

const updateATopicSchema = Joi.object({
  name: Joi.string().min(1),
});

export default {
  createATopicSchema,
  updateATopicSchema,
};
