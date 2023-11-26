import MongoDB from "../databases/mongodb/connect.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const getFile = asyncMiddleware(async (req, res, next) => {
  const { filename } = req.params;

  const gfs = MongoDB.gfs;

  const file = await gfs.find({ filename }).toArray();

  if (!file || !file.length) {
    throw ErrorResponse(404, "File not found");
  }

  MongoDB.gfs.openDownloadStreamByName(filename).pipe(res);
});

const removeFile = async (filename) => {
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

export default { getFile, removeFile };
