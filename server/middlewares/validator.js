const validator = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (!error) {
      next();
    } else {
      next(error);
    }
  };
};

module.exports = validator;
