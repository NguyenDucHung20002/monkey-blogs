const express = require("express");
const mongoose = require("mongoose");
const { env } = require("../config/env");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

const router = express.Router();

router.get(
  "/:filename",
  asyncMiddleware(async (req, res, next) => {
    const { filename } = req.params;

    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: env.MONGO_BUCKET,
    });

    const file = await gfs
      .find({ filename })
      .toArray()
      .catch((err) => {
        return next(new ErrorResponse(500, "Internal Server Error"));
      });

    if (!file || file.length === 0) {
      return next(new ErrorResponse(404, "File is not found"));
    }

    const readStream = gfs.openDownloadStreamByName(filename);
    readStream.pipe(res);
  })
);

module.exports = router;
