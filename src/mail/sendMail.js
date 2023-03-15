const nodemailer = require('nodemailer');

const sendMail = async(email, param)=>{

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'myecom931@gmail.com',
    pass: 'lwacxrcqmskljlsv'
  }
});

let mailOptions = {
  from: '"My Ecom" <myecom931@gmail.com>',
  to: email,
  subject: 'Your order has been successfully placed ✔',
  text: 'Order has been placed',
  html: '<b>Thanks for Ordering from us</b>'
};

let otpMail = {
  from: '"My Ecom" <myecom931@gmail.com>',
  to: email,
  subject: 'OTP for My E-com',
  text: 'OTP for My E-com',
  html: `<b>Your OTP for my E-com is ${param}</b>`
}

transporter.sendMail(param ? otpMail : mailOptions, (error) => {
  if (error) {
    return console.log(error.message);
  }
});
}

module.exports = sendMail