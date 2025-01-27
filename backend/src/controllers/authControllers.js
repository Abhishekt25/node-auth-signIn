"use strict";
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
exports.logOut = exports.dashboard = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const JWT_SECRET = 'your_jwt_secret';
// Register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fname, lname, email, password } = req.body;
    // console.log('Request Body:', req.body); // Add this line
    try {
        if (!email || !password) {
            return res.status(400).render('register', { message: 'Please provide both email and password.' });
        }
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).render('register', { message: 'Email already exists.' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield user_1.default.create({ email, password: hashedPassword, fname, lname });
        res.status(201).render('login', { message: 'Registered successfully. Please log in.' });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).render('register', { message: 'Server error. Please try again later.' });
    }
});
exports.register = register;
// Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).render('login', { message: 'Invalid credentials.' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('login', { message: 'Invalid credentials.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.redirect('/dashboard');
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('login', { message: 'Server error. Please try again later.' });
    }
});
exports.login = login;
//Dashboard
const dashboard = (req, res) => {
    if (req.user) {
        res.render('dashboard', { user: req.user });
    }
    else {
        res.redirect('/login');
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
    res.redirect("/login");
};
exports.logOut = logOut;
