const nodemailer = require('nodemailer');

// Create a transporter using SMTP or other transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send verification email
const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?code=${verificationCode}`;
    
    const mailOptions = {
      from: `\"Senior Assassin\" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
          <h2>Welcome to Senior Assassin!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <div style=\"text-align: center; margin: 30px 0;\">
            <a href=\"${verificationUrl}\" 
               style=\"background-color: #4CAF50; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;\">
              Verify Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: `\"Senior Assassin\" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <div style=\"text-align: center; margin: 30px 0;\">
            <a href=\"${resetUrl}\" 
               style=\"background-color: #2196F3; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;\">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send game invitation email
const sendGameInvitation = async (email, gameName, joinCode) => {
  try {
    const joinUrl = `${process.env.CLIENT_URL}/join?code=${joinCode}`;
    
    const mailOptions = {
      from: `\"Senior Assassin\" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `You've been invited to join ${gameName}`,
      html: `
        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
          <h2>You're Invited to ${gameName}!</h2>
          <p>You've been invited to join the Senior Assassin game: <strong>${gameName}</strong>.</p>
          <p>Your unique join code is: <strong>${joinCode}</strong></p>
          <div style=\"text-align: center; margin: 30px 0;\">
            <a href=\"${joinUrl}\" 
               style=\"background-color: #9C27B0; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;\">
              Join Game
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p>${joinUrl}</p>
          <p>See you in the game!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending game invitation:', error);
    throw new Error('Failed to send game invitation');
  }
};

// Send elimination notification
const sendEliminationNotification = async (playerEmail, eliminatedPlayerName, gameName) => {
  try {
    const mailOptions = {
      from: `\"Senior Assassin\" <${process.env.EMAIL_FROM}>`,
      to: playerEmail,
      subject: `New Target Assigned in ${gameName}`,
      html: `
        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
          <h2>Target Eliminated!</h2>
          <p>Your target, <strong>${eliminatedPlayerName}</strong>, has been eliminated in the game <strong>${gameName}</strong>.</p>
          <p>You have been assigned a new target. Log in to your account to see who it is!</p>
          <div style=\"text-align: center; margin: 30px 0;\">
            <a href=\"${process.env.CLIENT_URL}\" 
               style=\"background-color: #FF9800; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;\">
              View Your New Target
            </a>
          </div>
          <p>Good luck!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending elimination notification:', error);
    throw new Error('Failed to send elimination notification');
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendGameInvitation,
  sendEliminationNotification,
};
