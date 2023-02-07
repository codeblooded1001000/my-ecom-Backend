const nodemailer = require('nodemailer');

const sendMail = async(email)=>{
  // create a transporter object using a service of your choice
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'myecom931@gmail.com',
    pass: 'lwacxrcqmskljlsv'
  }
});

// setup email data with unicode symbols
let mailOptions = {
  from: 'myecom931@gmail.com', // sender address
  to: email, // list of receivers
  subject: 'Yor order has been successfully placed ✔', // Subject line
  text: 'Order has been placed', // plain text body
  html: '<b>Thanks for Ordering from us</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
}


module.exports = sendMail