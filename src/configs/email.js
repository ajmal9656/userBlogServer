import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, 
  },
});

const sendOtpEmail = async(email, otp ,subject) => {
  console.log("email",email)
  console.log("email",otp)
  console.log("email",subject)
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `${subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #4CAF50;
            margin-top: 20px;
            align-items : center;
            text-align : center;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
          }
          .footer {
            font-size: 12px;
            color: #aaa;
            text-align: center;
            margin-top: 30px;
          }
          .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            font-size: 16px;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Welcome to UrlShortner</h1>
            <p>Use the following OTP to complete your verification.</p>
          </div>
          <div class="otp-code">
            ${otp}
          </div>
          <div class="message">
            <p>Your OTP code is valid for 1 minute. Please use it promptly to complete your action.</p>
            <p>If you didn't request this, please ignore this email or contact support.</p>
          </div>
          <div class="footer">
            <p>Thank you for using our service!</p>
            <p>If you have any questions, feel free to contact us at support@example.com.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export default sendOtpEmail


