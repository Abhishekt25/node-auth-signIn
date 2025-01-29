"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const router = express_1.default.Router();
// Register route
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', authControllers_1.register);
// Login route
router.get('/login', (req, res) => {
    const message = req.query.message || null;
    res.render('login', { message });
});
router.post('/login', authControllers_1.login);
// Dashboard route (protected route)
router.get('/dashboard', authenticate_1.default, authControllers_1.dashboard);
//LogOut
router.get('/logout', authControllers_1.logOut);
//forgot password
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});
router.post('/forgot-password', authControllers_1.forgotPassword);
//reset password route
router.get('/reset-password/:token', authControllers_1.resetPasswordPage);
router.post('/reset-password/:token', authControllers_1.resetPassword);
exports.default = router;
