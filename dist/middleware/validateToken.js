"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET || 'default_secret_key');
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.validateToken = validateToken;
const validateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET || 'default_secret_key');
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.validateAdmin = validateAdmin;
