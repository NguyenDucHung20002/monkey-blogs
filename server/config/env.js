import dotenv from "dotenv";

dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV || "development",

  CLIENT_HOST: process.env.CLIENT_HOST || "http://localhost",
  CLIENT_PORT: process.env.CLIENT_PORT || 3000,

  SERVER_HOST: process.env.SERVER_HOST || "http://localhost",
  SERVER_PORT: process.env.SERVER_PORT || 8080,

  JWT_SECRET: process.env.JWT_SECRET || "123456789",
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME || "3d",

  MYSQL_USERNAME: process.env.MYSQL_USERNAME || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "root",
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "monkey-medium",
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_PORT: process.env.MYSQL_PORT || 3306,

  MONGODB_USERNAME: process.env.MONGDB_USERNAME || "root",
  MONGODB_PASSWORD: process.env.MONGDB_PASSWORD || "root",
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || "monkey-medium",
  MONGODB_HOST: process.env.MONGODB_HOST || "0.0.0.0",
  MONGODB_PORT: process.env.MONGODB_PORT || 27017,
  MONGODB_BUCKET: process.env.MONGODB_BUCKET || "uploads",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "your google client id",
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || "your google client secret",

  getMongodbUri() {
    return this.MONGODB_USERNAME && this.MONGODB_PASSWORD
      ? `mongodb://${this.MONGODB_USERNAME}:${this.MONGODB_PASSWORD}@${this.MONGODB_HOST}:${this.MONGODB_PORT}/${this.MONGODB_DATABASE}?authSource=admin`
      : `mongodb://${this.MONGODB_HOST}:${this.MONGODB_PORT}/${this.MONGODB_DATABASE}`;
  },
};
