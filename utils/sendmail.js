const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
  });

function sendMail(email, body) {
    let mailTransport = {
        from: '"noreply" <ModelsNest@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Account Activation", // Subject line
        html: body
      };

      transporter.sendMail(mailTransport, (error, info) => {
          if(error) return res.json('an error occured, could not send mail')
          console.log("mail sent")
      });
    }


module.exports = sendMail