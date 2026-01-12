import express, { Response } from 'express';
import Topic from '../models/Topic';
import { validateToken, validateAdmin, AuthRequest } from '../middleware/validateToken';

const router = express.Router();

// GET all topics
router.get('/topics', async (req: AuthRequest, res: Response) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new topic (authenticated users only)
router.post('/topic', validateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const username = req.user?.username;

    const newTopic = new Topic({
      title,
      content,
      username,
      createdAt: new Date()
    });

    await newTopic.save();
    res.json(newTopic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE topic (admin only)
router.delete('/topic/:id', validateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Topic.findByIdAndDelete(id);
    res.json({ message: 'Topic deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
