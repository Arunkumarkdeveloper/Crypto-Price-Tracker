const nodemailer = require("nodemailer");

const transporterOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const mailOptions = (data, emailType) => {
  let subject;
  let html;
  if (emailType === "subscribe") {
    subject = "🛍️ Welcome to Trenzkit – Exclusive Deals Await!";
    html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px; text-align: center; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      
      <div style="background: linear-gradient(135deg, #FFCE12, #FFCE12); padding: 30px;">
        <h1 style="margin: 0; font-size: 28px; color: #333;">Welcome to Trenzkit!</h1>
      </div>

      <div style="padding: 20px;">
        <img src="${process.env.NEXT_PUBLIC_API_URL}/images/logo.png" style="width:100px; height:28px;" alt="Trenzkit Shopping"/>
      </div>

      <div style="padding: 30px; text-align: left;">
        <p style="font-size: 16px; margin: 0 0 15px;">Hi Shopper,</p>
        <p style="font-size: 16px; margin: 0 0 15px;">
          Thanks for subscribing to <strong style="color: #FFCE12;">Trenzkit</strong>! 🎉  
          You’re now part of our community of style-savvy shoppers.
        </p>
        <p style="font-size: 16px; margin: 0 0 15px;">
          From today, you’ll get first access to <strong>exclusive discounts</strong>, 
          <strong>new arrivals</strong>, and <strong>special shopping events</strong>.
        </p>
        <p style="font-size: 16px; margin: 0 0 20px;">
          Get ready to shop smarter and discover the latest trends curated just for you. 🛒
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_API_URL}" target="_blank" 
            style="background-color: #FFCE12; color: #333; padding: 14px 28px; text-decoration: none; 
                   font-size: 16px; border-radius: 6px; display: inline-block; font-weight: bold;">
            Start Shopping Now
          </a>
        </div>

        <p style="font-size: 16px; margin-top: 30px; color: #555;">
          Stay stylish, stay smart.  
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 10px;">
          Best Regards, <br><strong>The Trenzkit Team</strong>
        </p>
      </div>
    </div>
  </div>`;
  } else if (emailType === "forgot-password") {
    const resetLink = `${process.env.NEXT_PUBLIC_API_URL}?id=${data?.id}&token=${data?.token}&authType=reset-password`;
    subject = "Reset Your Password | Trenzkit";
    html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2a9d8f;">Password Reset Request</h2>
      <p>Dear ${data?.name},</p>
      <p>We received a request to reset your password for your Trenzkit account. If you did not request this, please ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="background-color: #2a9d8f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </p>
      <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #555;">${resetLink}</p>
      <p>This link is valid for only a limited time.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p style="color: #555;">Best Regards, <br><strong>Trenzkit Team</strong></p>
    </div>`;
  }

  const options = {
    from: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    to: data?.email,
    subject: subject,
    html: html,
  };
  return options;
};

export const sendEmail = async (data, emailType) => {
  const transporter = nodemailer.createTransport(transporterOptions);
  await transporter.sendMail(mailOptions(data, emailType));
};
