import nodemailer from 'nodemailer';

export const sendDeletionEmail = async (toEmail) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // secure port for Gmail
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Secure Deletion API" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your data has been deleted',
    text: 'Your account and personal data have been successfully deleted.',
  };

  await transporter.sendMail(mailOptions);
};
