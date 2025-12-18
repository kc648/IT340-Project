const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendCode = (to, code) =>
  transporter.sendMail({
    to,
    from: '"Tune In Daily" <no-reply@tuneindaily.com>',
    subject: 'Tune In Daily MFA',
    text: `Your verfication code is: ${code}`
  });


