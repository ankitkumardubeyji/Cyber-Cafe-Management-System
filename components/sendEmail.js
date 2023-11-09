import nodemailer from "nodemailer";
import Mailgen from "mailgen";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message) {
    let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport

  let transporter = nodemailer.createTransport({
    service:'gmail',
    
    auth: {
        user: 'ankitdubey1570@gmail.com',
        pass: 'ahwkihttxxrvugfo',
    }
 
  });


  
let MailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:'https://mailgen.js/'
    }
})





let sandesh = {
    from: process.env.SMTP_FROM_EMAIL, // sender address
    to: email, // user email
    subject: subject, // Subject line
    html: message, // html body
}

await transporter.sendMail(sandesh);
  
};

export default sendEmail;
