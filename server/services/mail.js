const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: true,
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
});

module.exports = {};
