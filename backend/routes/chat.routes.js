import express from 'express';
import authenticate from '../middlewares/auth.js';
import { 
  handleChat, 
  getHistory, 
  getConversations,
  clearHistory, 
  clearAllConversations 
} from '../controllers/chatController.js';

const router = express.Router();


router.post('/chat', authenticate, handleChat);
router.get('/history/:conversationId', authenticate, getHistory);
router.get('/conversations', authenticate, getConversations);
router.delete('/history/:conversationId', authenticate, clearHistory);
router.delete('/history', authenticate, clearAllConversations);

export default router;