import MongoDB from "../databases/mongodb/connect.js";
import clarifai from "../services/clarifai.js";

const checkUploadedAvatar = (req, res, next) => {
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
      req.checkResult = results;
      next();
    });
  });
};

export default checkUploadedAvatar;
