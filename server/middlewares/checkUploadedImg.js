import MongoDB from "../databases/mongodb/connect.js";
import clarifai from "../services/clarifai.js";
import fileController from "../controllers/fileController.js";

const checkUploadedImg = (req, res, next) => {
  const filename = req.file?.filename;

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

      if (results[0][0].nsfw > 0.55) {
        fileController.autoRemoveImg(filename);

        return res.status(400).json({
          success: false,
          message:
            "Sorry, but your image contains explicit content and is not allowed",
        });
      }

      next();
    });
  });
};

export default checkUploadedImg;
