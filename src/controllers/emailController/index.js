const nodemailer = require("nodemailer");
const asynchandler = require("express-async-handler");

const sendMail = asynchandler(async(data,req, res)=>{
    const transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT || 587,
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });
let info = await transporter.sendMail({
    from: "Sunkanmi oguns", // sender address,
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html
})
console.log("Message sent: %s", info.messageId);
console.log("Message sent: %s", nodemailer.getTestMessageUrl(info));
})

module.exports = sendMail