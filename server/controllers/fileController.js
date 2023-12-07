import MongoDB from "../databases/mongodb/connect.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

// ==================== upload an image ==================== //
const upLoadAnImg = asyncMiddleware(async (req, res, next) => {
  const size = req.file?.size;

  const FILE_LIMIT = 15 * 1024 * 1024;
  if (size && size > FILE_LIMIT) {
    throw new ErrorResponse(400, "File too large");
  }

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

// ==================== upload an avatar ==================== //
const upLoadAnAvatar = asyncMiddleware(async (req, res, next) => {
  const filename = req.file?.filename;
  const size = req.file?.size;

  const FILE_LIMIT = 15 * 1024 * 1024;
  if (size && size > FILE_LIMIT) {
    throw new ErrorResponse(400, "File too large");
  }

  const gfs = MongoDB.gfs;

  const readStream = gfs.openDownloadStreamByName(filename);
  let chunks = [];

  readStream.on("data", (chunk) => {
    chunks.push(chunk);
  });

  readStream.on("end", () => {
    const imgData = Buffer.concat(chunks).toString("base64");
    clarifai(imgData, (err, results) => {
      if (err) return res.status(500).json(err);

      if (results[0].nsfw > 0.55) {
        fileController.autoRemoveImg(filename);

        throw ErrorResponse(
          404,
          "Sorry, but your image contains explicit content and is not allowed"
        );
      }
    });
  });

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

// ==================== get an image ==================== //
const getAnImg = asyncMiddleware(async (req, res, next) => {
  const { filename } = req.params;

  const gfs = MongoDB.gfs;

  const files = await gfs.find({ filename }).toArray();

  if (!files || !files.length) {
    throw ErrorResponse(404, "File not found");
  }

  MongoDB.gfs.openDownloadStreamByName(filename).pipe(res);
});

// ==================== detete an image ==================== //
const deleteAnImg = asyncMiddleware(async (req, res, next) => {
  const { filename } = req.params;

  const gfs = MongoDB.gfs;

  const files = await gfs.find({ filename }).toArray();
  if (!files || !files.length) {
    throw ErrorResponse(404, "File not found");
  }

  const fileId = files[0]._id;
  await gfs.delete(fileId);

  res.json({ success: true, message: "File deleted successfully" });
});

// ==================== auto remove image ==================== //
const autoRemoveImg = async (filename) => {
  const gfs = MongoDB.gfs;

  const files = await gfs.find({ filename }).toArray();
  if (!files || !files.length) {
    console.log("file not found");
    return;
  }

  const fileId = files[0]._id;
  await gfs.delete(fileId);

  console.log(`file ${filename} removed successfully`);
};

export default {
  upLoadAnImg,
  upLoadAnAvatar,
  getAnImg,
  deleteAnImg,
  autoRemoveImg,
};
