
// import generateOAuthAccessToken from "../utils/generateOAuthAccessToken.js";
import nodemailer from "nodemailer";
import env from "../config/env.js";

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


  const MailOptions = {
    from: `Monkey Blogs <${env.GOOGLE_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  transport.sendMail(MailOptions);
};

export default emailService;
