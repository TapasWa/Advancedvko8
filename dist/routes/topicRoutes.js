"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Topic_1 = __importDefault(require("../models/Topic"));
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
// GET all topics
router.get('/topics', async (req, res) => {
    try {
        const topics = await Topic_1.default.find().sort({ createdAt: -1 });
        res.json(topics);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// POST new topic (authenticated users only)
router.post('/topic', validateToken_1.validateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const username = req.user?.username;
        const newTopic = new Topic_1.default({
            title,
            content,
            username,
            createdAt: new Date()
        });
        await newTopic.save();
        res.json(newTopic);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// DELETE topic (admin only)
router.delete('/topic/:id', validateToken_1.validateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Topic_1.default.findByIdAndDelete(id);
        res.json({ message: 'Topic deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
