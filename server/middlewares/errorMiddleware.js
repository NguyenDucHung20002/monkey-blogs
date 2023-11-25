const { removeFile } = require("../utils/removeFile");

const errorMiddleware = (err, req, res, next) => {
  // console.log(JSON.stringify(err, null, 2));
  const { code, message, details } = err;

  console.log("==> Error middleware ", err);

  if (details) {
    const path = details[0].path;

    res.status(422).json({
      success: false,
      error: {
        message,
        path,
      },
    });
  } else {
    res.status(typeof code === "number" ? code : 500).json({
      success: false,
      message: message || "Internal Error.",
    });
  }

  removeFile(req.file?.filename);
};

module.exports = {
  errorMiddleware,
};
