import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Users from '../models/user';
import * as dotenv  from 'dotenv';
const { Op } = require('sequelize');
import express from 'express';

dotenv.config();
const app = express();

app.use(express.json()); // Parse JSON request bodies
const JWT_SECRET = 'abt1234554321'; 


// Register
export const signUp = async (req: any, res: any) => {
    const { fname, lname, email, password } = req.body;
  
    try {
        if (!email || !password || !fname || !lname) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.create({ email, password: hashedPassword, fname, lname });

        // Respond with JSON only
        res.status(201).json({ message: 'Registered successfully. Please log in.' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

    
  

// signin
export const signIn = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
      const user = await Users.findOne({ where: { email } });
      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

      // Respond with JSON and let frontend redirect
      res.status(200).json({ message: 'SignIn successful.', token });

  } catch (error) {
      console.error('Error during signin:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


//Dashboard

export const dashboard = (req:any, res:any) =>{
  if(req.user){
    res.json({user:req.user});
  }
  else{
    res.redirect('/signin');
  }
}

// logOut
 export const logOut = (req:any, res:any) =>{
  // clear the auth_token cookies
  res.clearCookie('auth_token',{
    httponly:true,
    secure:true,
    sameSite:"strict",
  });
  res.redirect("/signin");
 }


 //forgot password

 export const forgotPassword = async (req: any, res: any) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });

    let message = ''; // Default message

    if (!user) {
      message = 'Email not found';
      return res.status(400).json({ message });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 3600000).toISOString(); // Convert Date to string
    await user.save();

    const resetLink = `http://localhost:2507/reset-password/${resetToken}`;

  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,  // For TLS
      secure: false, // Use TLS
      auth: {
        user: 'abhishek.tiwari@ascuretech.com', // Gmail email
        pass: 'xfvj mbgv edrg tjrc' // Use App Password if 2FA is enabled  'vcgn fkfj ghvu dwt'
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`
    });

    message = 'Reset link sent to your email';
    res.json({ message });

  } catch (error) {
    console.error('Error in forgot password', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


//Reset password page

export const resetPasswordPage = async (req: any, res: any) => {
  const { token } = req.params; 
  console.log("Reset Password Token:", token);

  // Check if token is valid
  if (!token) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  // Pass the token to the view
  res.json({ token, message: req.query.message || null });
};

export const resetPassword = async (req: any, res: any) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Check if the reset token is valid and not expired
    const user = await Users.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and update the user record
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = ''; 
    user.resetTokenExpires = '';

    await user.save();

    res.redirect('/signin?message=Password reset successful. Please log in');
  } catch (error) {
    console.error('Error in reset password', error);
    res.status(500).json({ message: 'Server error. Please try again later' });
  }
};
