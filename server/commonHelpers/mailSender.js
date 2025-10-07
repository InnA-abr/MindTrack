import nodemailer from "nodemailer";
import keys from "../config/keys.js";
import getConfigs from "../config/getConfigs.js";

export default async function sendEmail(
  subscriberMail,
  letterSubject,
  letterHtml,
  res
) {
  const configs = await getConfigs();

  // Authorization for sending email
  const transporter = nodemailer.createTransport({
    service:
      process.env.NODE_ENV === "production"
        ? configs.production.email.mailService
        : configs.development.email.mailService,
    auth: {
      user:
        process.env.NODE_ENV === "production"
          ? configs.production.email.mailUser
          : configs.development.email.mailUser,
      pass:
        process.env.NODE_ENV === "production"
          ? configs.production.email.mailPassword
          : configs.development.email.mailPassword,
    },
  });

  const mailOptions = {
    from:
      process.env.NODE_ENV === "production"
        ? configs.production.email.mailUser
        : configs.development.email.mailUser,
    to: subscriberMail,
    subject: letterSubject,
    html: letterHtml,
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
}
