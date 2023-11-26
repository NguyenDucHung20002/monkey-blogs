import mongoose from "mongoose";
import env from "../../config/env.js";

class MongoDB {
  static connect() {
    mongoose.connect(env.getMongodbUri()).then(() => {
      console.log("connect to mongodb successfully");
    });
    const conn = mongoose.connection;

    conn.once("open", () => {
      this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: env.MONGODB_BUCKET,
      });
    });
  }
}

export default MongoDB;
