import express from 'express';
import authenticate from '../middlewares/auth.js';
import { 
  handleChat, 
  getHistory,
  getConversations,
  clearConversation,
  renameConversation
} from '../controllers/chatController.js';

const router = express.Router();

// All routes require authentication
router.post('/chat', authenticate, handleChat);
router.get('/conversations', authenticate, getConversations);
router.get('/history/:conversationId', authenticate, getHistory);
router.delete('/conversation/:conversationId', authenticate, clearConversation);
router.put('/conversation/:conversationId/rename', authenticate, renameConversation);

export default router;