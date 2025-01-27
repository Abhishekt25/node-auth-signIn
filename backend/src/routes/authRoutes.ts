import express from 'express';
import { register, login, dashboard, logOut } from '../controllers/authControllers';  
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

export default router;
