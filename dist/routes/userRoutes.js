"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const inputValidation_1 = require("../validators/inputValidation");
const router = express_1.default.Router();
// Register route
router.post('/register', inputValidation_1.registerValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, username, isAdmin } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const newUser = new User_1.default({
            email,
            password: hashedPassword,
            username,
            isAdmin: isAdmin || false
        });
        await newUser.save();
        res.json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Login route
router.post('/login', inputValidation_1.loginValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Check if user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Validate password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin
        }, process.env.SECRET || '', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
