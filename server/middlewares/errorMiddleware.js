import fileController from "../controllers/fileController.js";

const errorMiddleware = (err, req, res, next) => {
  let code = 500;
  let message = "Something went wrong";

  if (typeof err === "string") {
    message = err;
  }

  if (err instanceof Error) {
    message = err.message;
  }

  if (err && typeof err === "object" && "message" in err && "code" in err) {
    code =
      Number(err.code) > 599 ||
      Number(err.code) < 100 ||
      !Number.isInteger(err.code)
        ? 500
        : Number(err.code);
    message = err.message;
  }

  fileController.removeFile(req.file?.filename);

  console.log("ERROR MIDDLEWARE =>", err);

  res.status(code).json({ success: false, message });
};

export default errorMiddleware;
