import express from 'express';
import { register, login, dashboard, logOut, forgotPassword,resetPasswordPage, resetPassword } from '../controllers/authControllers';  
import authenticate from '../middleware/authenticate';

const router = express.Router();

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});
router.post('/register', register);

// Login route
router.get('/login', (req, res) => {
const message = req.query.message || null
res.render('login', { message });
});
router.post('/login', login);

// Dashboard route (protected route)
router.get('/dashboard', authenticate, dashboard);

//LogOut
router.get('/logout',logOut);

//forgot password
router.get('/forgot-password',(req, res) =>{
  res.render('forgot-password');
});
router.post('/forgot-password',forgotPassword);

//reset password route
router.get('/reset-password/:token', resetPasswordPage);
router.post('/reset-password/:token', resetPassword);

export default router;
