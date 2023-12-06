import Joi from "joi";

const createArticleSchema = Joi.object({
  banner: Joi.string(),
  title: Joi.string().max(250).required(),
  preview: Joi.string().max(200).required(),
  content: Joi.string()
    .required()
    .custom((value, helpers) => {
      const imgTagCount = (value.match(/<img/g) || []).length;

      if (imgTagCount > 20) {
        return helpers.message(
          "The max number of images allowed to insert into the article is 20"
        );
      }

      return value;
    }),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

const updateArticleSchema = Joi.object({
  banner: Joi.string(),
  title: Joi.string().max(250),
  preview: Joi.string().max(200),
  content: Joi.string(),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

export default { createArticleSchema, updateArticleSchema };
