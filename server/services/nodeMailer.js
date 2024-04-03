// import generateOAuthAccessToken from "../utils/generateOAuthAccessToken.js";
import nodemailer from "nodemailer";
import env from "../config/env.js";
import hbs from "handlebars";
import path from "path";
import fs from "fs";

const emailService = async (options) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: env.NODEMAILER_GOOGLE_EMAIL,
      pass: env.NODEMAILER_APP_PASSWORD,
    },
  });

  // const { token } = await generateOAuthAccessToken();

  // if (!token) {
  //   throw new Error("Unable to generate OAuth token");
  // }

  const templatePath = path.join("views", `${options.template}.hbs`);

  const templateHtml = fs.readFileSync(templatePath, "utf8");
  const template = hbs.compile(templateHtml);
  const html = template(options.context);

  const MailOptions = {
    from: `Monkey Blogs <${env.GOOGLE_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: html,
  };

  transport.sendMail(MailOptions);
};

export default emailService;
