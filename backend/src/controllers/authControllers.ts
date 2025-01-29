import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Users from '../models/user';
import * as dotenv  from 'dotenv';
const { Op } = require('sequelize');

dotenv.config();

const JWT_SECRET = 'abt1234554321'; 


// Register
export const register = async (req: any, res: any) => {
    const {fname,lname, email, password } = req.body;
    // console.log('Request Body:', req.body); // Add this line
  
    try {
      if (!email || !password) {
        return res.status(400).render('register', { message: 'Please provide both email and password.' });
      }
  
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).render('register', { message: 'Email already exists.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({ email, password: hashedPassword,fname, lname });
  
      res.status(201).render('login', { message: 'Registered successfully. Please log in.' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).render('register', { message: 'Server error. Please try again later.' });
    }
  };
    
  

// Login
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).render('login', { message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', { message: 'Invalid credentials.' });
    }

 
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.redirect('/dashboard');
  } 
  catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('login', { message: 'Server error. Please try again later.' });
  }
};

//Dashboard

export const dashboard = (req:any, res:any) =>{
  if(req.user){
    res.render('dashboard',{user:req.user});
  }
  else{
    res.redirect('/login');
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
  res.redirect("/login");
 }


 //forgot password

 export const forgotPassword = async (req: any, res: any) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });

    let message = ''; // Default message

    if (!user) {
      message = 'Email not found';
      return res.status(400).render('forgot-password', { message });
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
    res.render('forgot-password', { message });

  } catch (error) {
    console.error('Error in forgot password', error);
    res.status(500).render('forgot-password', { message: 'Server error. Please try again later.' });
  }
};


//Reset password page

export const resetPasswordPage = async (req: any, res: any) => {
  const { token } = req.params; // Ensure the token is in the params
  console.log("Reset Password Token:", token);

  // Check if token is valid
  if (!token) {
    return res.status(400).render('reset-password', { message: 'Invalid or expired token' });
  }

  // Pass the token to the view
  res.render('reset-password', { token, message: req.query.message || null });
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
      return res.status(400).render('reset-password', { message: 'Invalid or expired token' });
    }

    // Hash the new password and update the user record
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = ''; // Clear the reset token once used
    user.resetTokenExpires = ''; // Clear the reset token expiration

    await user.save();

    res.redirect('/login?message=Password reset successful. Please log in');
  } catch (error) {
    console.error('Error in reset password', error);
    res.status(500).render('reset-password', { message: 'Server error. Please try again later' });
  }
};
