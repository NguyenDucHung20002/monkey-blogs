const mongoose = require("mongoose");
const { env } = require("../config/env");

const removeFile = async (filename) => {
  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: env.MONGO_BUCKET,
    });

    if (!gfs) {
      throw new Error("GridFS Bucket not initialized");
    }

    const files = await gfs.find({ filename }).toArray();

    if (!files || files.length === 0) {
      console.log("File not found");
      return;
    }

    const fileId = files[0]._id;
    await gfs.delete(fileId);

    console.log(`File ${filename} removed successfully`);
  } catch (error) {
    console.error("Error removing file:", error.message);
  }
};

module.exports = { removeFile };
