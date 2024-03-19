import dotenv from "dotenv";
dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV || "development",

  CLIENT_DOMAIN: process.env.CLIENT_DOMAIN || "localhost:3000",

  SERVER_HOST: process.env.SERVER_HOST || "localhost",
  SERVER_PORT: process.env.SERVER_PORT || 8080,

  JWT_SECRET: process.env.JWT_SECRET || "123456",
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME || "7d",

  MYSQL_USERNAME: process.env.MYSQL_USERNAME || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "root",
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "monkey-blogs",
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_PORT: process.env.MYSQL_PORT || 3306,

  MONGODB_USERNAME: process.env.MONGODB_USERNAME || "root",
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || "root",
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || "monkey-blogs",
  MONGODB_HOST: process.env.MONGODB_HOST || "localhost",
  MONGODB_PORT: process.env.MONGODB_PORT || 27017,
  MONGODB_BUCKET: process.env.MONGODB_BUCKET || "uploads",

  OAUTH_GOOGLE_CLIENT_ID:
    process.env.OAUTH_GOOGLE_CLIENT_ID || "your google client id",
  OAUTH_GOOGLE_CLIENT_SECRET:
    process.env.OAUTH_GOOGLE_CLIENT_SECRET || "your google client secret",

  NODEMAILER_GOOGLE_CLIENT_ID:
    process.env.NODEMAILER_GOOGLE_CLIENT_ID || "your google client id",

  NODEMAILER_GOOGLE_CLIENT_SECRET:
    process.env.NODEMAILER_GOOGLE_CLIENT_SECRET || "your google client secret",

  NODEMAILER_GOOGLE_REFRESH_TOKEN:
    process.env.NODEMAILER_GOOGLE_REFRESH_TOKEN || "your refresh token",
  NODEMAILER_GOOGLE_EMAIL:
    process.env.NODEMAILER_GOOGLE_EMAIL || "your google email",

  CLARIFAI_API_KEY: process.env.CLARIFAI_API_KEY || "your clarifai api key",
  CLARIFAI_MODEL_ID: process.env.CLARIFAI_MODEL_ID || "your clarifai model id",

  SOCKET_LISTENING_EVENT: process.env.SOCKET_LISTENING_EVENT || "notification",

  IMAGE_FILE_SIZE_LIMIT: process.env.IMAGE_SIZE_LIMIT || 15,

  AVATAR_FILE_SIZE_LIMIT: process.env.AVATAR_FILE_SIZE_LIMIT || 5,

  getMongodbUri() {
    return `mongodb://${this.MONGODB_HOST}:${this.MONGODB_PORT}/${this.MONGODB_DATABASE}`;
  },
};
