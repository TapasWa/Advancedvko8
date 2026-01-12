"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('username')
        .trim()
        .escape()
        .isLength({ min: 3, max: 25 })
        .withMessage('Username must be between 3 and 25 characters'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[#!&?@$%^*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
