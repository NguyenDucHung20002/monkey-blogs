const validator = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    console.log("error:", error);
    if (!error) {
      next();
    } else {
      next(error);
    }
  };
};

module.exports = validator;
