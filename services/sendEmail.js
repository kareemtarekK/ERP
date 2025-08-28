const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  // 1- create transporter (send reset code via gmail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2- define the email options
  const mailOptions = {
    from: "EL-motakamel <EL-motakamel@team.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3- send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
