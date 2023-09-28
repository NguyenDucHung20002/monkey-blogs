const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const { env } = require("../config/env");

const storage = new GridFsStorage({
  url: env.MONGO_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const { fieldname, originalname } = file;
        let filename;
        let ext;
        if (fieldname === "default-avatar") {
          removeFile(originalname);
          ext = ".png";
          filename = originalname.replace(/\.[^/.]+$/, "") + ext;
        } else {
          ext = path.extname(originalname);
          filename = fieldname + "-" + buf.toString("hex") + ext;
        }

        const fileInfo = {
          filename: filename,
          bucketName: env.MONGO_BUCKET,
        };

        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, cb) => {
  const { originalname } = file;
  if (!originalname.match(/\.(jpg|png|jpeg)$/i)) {
    return cb(new Error(`Not support ${path.extname(originalname)}`), false);
  }
  cb(null, true);
};

const mongoUpload = multer({ storage, fileFilter });

module.exports = mongoUpload;
