"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.resetPasswordPage = exports.forgotPassword = exports.logOut = exports.dashboard = exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const dotenv = __importStar(require("dotenv"));
const { Op } = require('sequelize');
const express_1 = __importDefault(require("express"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Parse JSON request bodies
const JWT_SECRET = 'abt1234554321';
// Register
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fname, lname, email, password } = req.body;
    try {
        if (!email || !password || !fname || !lname) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield user_1.default.create({ email, password: hashedPassword, fname, lname });
        // Respond with JSON only
        res.status(201).json({ message: 'Registered successfully. Please log in.' });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
exports.signUp = signUp;
// signin
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        // Respond with JSON and let frontend redirect
        res.status(200).json({ message: 'SignIn successful.', token });
    }
    catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
exports.signIn = signIn;
//Dashboard
const dashboard = (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    }
    else {
        res.redirect('/signin');
    }
};
exports.dashboard = dashboard;
// logOut
const logOut = (req, res) => {
    // clear the auth_token cookies
    res.clearCookie('auth_token', {
        httponly: true,
        secure: true,
        sameSite: "strict",
    });
    res.redirect("/signin");
};
exports.logOut = logOut;
//forgot password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_1.default.findOne({ where: { email } });
        let message = ''; // Default message
        if (!user) {
            message = 'Email not found';
            return res.status(400).json({ message });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpires = new Date(Date.now() + 3600000).toISOString(); // Convert Date to string
        yield user.save();
        const resetLink = `http://localhost:2507/reset-password/${resetToken}`;
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // For TLS
            secure: false, // Use TLS
            auth: {
                user: 'abhishek.tiwari@ascuretech.com', // Gmail email
                pass: 'xfvj mbgv edrg tjrc' // Use App Password if 2FA is enabled  'vcgn fkfj ghvu dwt'
            }
        });
        yield transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`
        });
        message = 'Reset link sent to your email';
        res.json({ message });
    }
    catch (error) {
        console.error('Error in forgot password', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
exports.forgotPassword = forgotPassword;
//Reset password page
const resetPasswordPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    console.log("Reset Password Token:", token);
    // Check if token is valid
    if (!token) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    // Pass the token to the view
    res.json({ token, message: req.query.message || null });
});
exports.resetPasswordPage = resetPasswordPage;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    try {
        // Check if the reset token is valid and not expired
        const user = yield user_1.default.findOne({
            where: {
                resetToken: token,
                resetTokenExpires: { [Op.gt]: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Hash the new password and update the user record
        user.password = yield bcryptjs_1.default.hash(password, 10);
        user.resetToken = '';
        user.resetTokenExpires = '';
        yield user.save();
        res.redirect('/signin?message=Password reset successful. Please log in');
    }
    catch (error) {
        console.error('Error in reset password', error);
        res.status(500).json({ message: 'Server error. Please try again later' });
    }
});
exports.resetPassword = resetPassword;
