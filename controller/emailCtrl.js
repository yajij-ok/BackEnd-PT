const nodemailer = require("nodemailer")
const asyncHandler =  require("express-async-handler")

const sentEmail = asyncHandler(async(data, req, res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "riazarafat85@gmail.com",
          pass: "yqwrzorqkqqlydgc",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Hey👻" <abc@gmail.com>', // sender address
          to: data.to, // list of receivers
          text:data.text,
          subject: data.subject, // Subject line
          html: data.htm, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      main().catch(console.error);
})
module.exports = sentEmail