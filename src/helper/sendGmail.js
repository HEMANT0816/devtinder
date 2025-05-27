const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER || "preashhemant@gmail.com",
    pass: process.env.MAIL_PASS || "ywaxqdkzjichabhz",
  },
});
const sendGmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"Hemant" <${process.env.MAIL_USER}>`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.sendGmail = sendGmail;
