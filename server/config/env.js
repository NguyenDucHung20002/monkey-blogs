require("dotenv").config();

exports.env = {
  CLIENT_PORT: process.env.CLIENT_PORT,
  SERVER_PORT: process.env.SERVER_PORT,
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  EXPIRED_IN: process.env.EXPIRED_IN,
  MONGO_BUCKET: process.env.MONGO_BUCKET,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CLIENT_HOST: process.env.CLIENT_HOST,
  SERVER_HOST: process.env.SERVER_HOST,
};
