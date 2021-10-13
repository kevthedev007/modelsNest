const nodemailer = require('nodemailer')
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path')

//testing 1
var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};
//test 1 ends here

let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER, // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
  });

function sendConfirmationMail(email, name, token, res) {
    //test 2
    readHTMLFile(path.join(__dirname, '..' ,'/views/emailConfirm.html'), function(err, html) {
      var template = handlebars.compile(html);
      var replacements = {
           first_name: name,
           token: token
      };
      var htmlToSend = template(replacements)
      //test 2 ends here

    let mailTransport = {
        from: '"noreply" <ModelsNest@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Account Activation", // Subject line
        html: htmlToSend
      };

      transporter.sendMail(mailTransport, (error, info) => {
          if(error) return res.json('an error occured, could not send mail')
          console.log("mail sent")
      });
    })
    }



    function sendPasswordResetMail(email, name, id, token, res) {
      //test 2
      readHTMLFile(path.join(__dirname, '..' ,'/views/passwordreset.html'), function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
             first_name: name,
             user_id: id,
             token: token
        };
        var htmlToSend = template(replacements)
        //test 2 ends here
  
      let mailTransport = {
          from: '"noreply" <ModelsNest@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Password Reset", // Subject line
          html: htmlToSend
        };
  
        transporter.sendMail(mailTransport, (error, info) => {
            if(error) return res.json('an error occured, could not send mail')
            console.log("mail sent")
        });
      })
      }

















    //sendgrid
// const sendMail = (options) => {
//   const transporter = nodemailer.transporter({
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.EMAIL_USERNAME,
//       pass: process.EMAIL_PASSWORD

//     }
//   })
  
//   let mailOptions = {
//             from: '"noreply" <ModelsNest@gmail.com>', // sender address
//             to: options.to, // senderlist of receivers
//             subject:options.subject, // Subject line
//             html: options.text, //html text
//           };

//   transporter.sendMail(mailOptions, function(err, info) {
//     if(err) console.log(err);
//     console.log('mail sent successfully')
//   })

// }

module.exports = { sendConfirmationMail, sendPasswordResetMail }