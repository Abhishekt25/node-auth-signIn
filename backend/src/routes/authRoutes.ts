import express from 'express';
import { signUp, signIn, dashboard, logOut, forgotPassword,resetPasswordPage, resetPassword } from '../controllers/authControllers';  
import authenticate from '../middleware/authenticate';
import { Router } from 'express';

const router = Router();
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/dashboard', dashboard);
router.post('/logout',logOut)

export default router;
