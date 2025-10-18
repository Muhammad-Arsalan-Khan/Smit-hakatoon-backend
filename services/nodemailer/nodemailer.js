import EmailOTP from "../../models/EmailOTPSchema.js"
import nodemailer from "nodemailer"

export async function verifyEmail(userEmail, otp) {
  try {
    await EmailOTP.deleteMany({ email : userEmail })
    const otpEntry = new EmailOTP({
      email: userEmail,
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), //10
    });

    await otpEntry.save()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NodeMailer_Email,
        pass: process.env.NodeMailer_PassKey,
      },
    });

    const mailOptions = {
      from: process.env.NodeMailer_Email,
      to: userEmail,
      subject: "Micro Finance OTP",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Email - Microfinance</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #FFFFFF;
      border: 1px solid #005EB8;
      border-radius: 8px;
      padding: 30px;
    }
    .header {
      background-color: #005EB8;
      color: #FFFFFF;
      padding: 15px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .otp-box {
      background-color: #8BC441;
      color: #FFFFFF;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      letter-spacing: 5px;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome from Microfinance</h2>
    </div>

    <p>Dear Customer,</p>
    <p>We are sending you a One-Time Password (OTP) to verify your identity. Please find it below</p>

    <div class="otp-box">
      <strong>${otp}</strong>
    </div>

    <p>This code is valid for only 10 minutes. Please do not share it with anyone.</p>

    <p>Thank you,<br>
    Microfinance Team</p>  

    <div class="footer">
      &copy; ${new Date().getFullYear()} Microfinance. All rights reserved.
    </div>
  </div>
</body>
</html>`,
    };

    await transporter.sendMail(mailOptions)
    console.log("OTP email sent successfully")

  } catch (error) {
    console.error("OTP email sending error", error)
    throw new Error("Unable to send OTP")
  }
}
