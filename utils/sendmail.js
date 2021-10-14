const nodemailer = require('nodemailer')
const smtp = require('nodemailer-smtp-transport')
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path')


const readHTMLFile = function(path, callback) {
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


// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.GMAIL_USER, // generated ethereal user
//       pass: process.env.GMAIL_PASS, // generated ethereal password
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
//   });

let transporter = nodemailer.createTransport(
  smtp({
    host: 'in-v3.mailjet.com',
    port: 587,
    auth: {
      user: process.env.MAILJET_USER,
      pass: process.env.MAILJET_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })
)

function sendConfirmationMail(email, name, token) {
  
    readHTMLFile(path.join(__dirname, '..' ,'/views/emailConfirm.html'), function(err, html) {
      var template = handlebars.compile(html);
      var replacements = {
           first_name: name,
           token: token
      };
      var htmlToSend = template(replacements)
      

    let mailTransport = {
        from: '"noreply" <modelsnestnigeria@gmail.com>',
        to: email, // list of receivers
        subject: "Account Activation", // Subject line
        html: htmlToSend
      };

      transporter.sendMail(mailTransport, (error, info) => {
          if(error) console.log(error)
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
          from: '"noreply" <modelsnestnigeria@gmail.com>', // sender address
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


module.exports = { sendConfirmationMail, sendPasswordResetMail }