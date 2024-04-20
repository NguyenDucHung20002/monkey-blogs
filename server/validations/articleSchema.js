import Joi from "joi";

const createADraftSchema = Joi.object({
  title: Joi.string().max(250),
  content: Joi.string()
    .allow("")
    .custom((value, helpers) => {
      const imgTagCount = (value.match(/<img/g) || []).length;
      if (imgTagCount > 20) {
        return helpers.message(
          "The max number of images allowed to insert into the article is 20"
        );
      }
      return value;
    }),
});

const updateADraftSchema = Joi.object({
  title: Joi.string().max(250),
  content: Joi.string()
    .allow("")
    .custom((value, helpers) => {
      const imgTagCount = (value.match(/<img/g) || []).length;
      if (imgTagCount > 20) {
        return helpers.message(
          "The max number of images allowed to insert into the article is 20"
        );
      }
      return value;
    }),
});

const createAnArticleSchema = Joi.object({
  banner: Joi.string(),
  preview: Joi.string().max(150),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

const updateAnArticleSchema = Joi.object({
  banner: Joi.string(),
  title: Joi.string().max(250),
  preview: Joi.string().max(150),
  content: Joi.string(),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

const setAnArticleBackToDraftSchema = Joi.object({
  reason: Joi.string().min(4).max(150).allow("").allow(null),
});

export default {
  createADraftSchema,
  updateADraftSchema,
  createAnArticleSchema,
  updateAnArticleSchema,
  setAnArticleBackToDraftSchema,
};
