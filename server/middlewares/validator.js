const validator = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (!error) {
      next();
    } else {
      // remove uploaded file if error
      if (req.file?.filename) {
        MongoDB.removeFileByName(req.file.filename);
      }

      // console.log(JSON.stringify(error, null, 2))
      const { details } = error;
      const message = details[0].message;
      const path = details[0].path;
      res.status(422).json({
        success: false,
        error: {
          message,
          path,
        },
      });
    }
  };
};

module.exports = validator;
