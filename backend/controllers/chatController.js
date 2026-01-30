import Chat from '../models/Chat.js';
import Conversation from '../models/Conversation.js';
import chatService from '../services/geminiService.js';

// Handle chat message
export const handleChat = async (req, res) => {
  try {
    const { query, conversationId } = req.body;
    const userId = req.userId;

    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    console.log('💬 Chat request - User:', userId, 'Conversation:', conversationId);

    // Check if conversation exists, if not create it
    let conversation = await Conversation.findOne({ userId, conversationId });
    
    if (!conversation) {
      // Generate title from first message (first 50 chars)
      const title = query.length > 50 ? query.substring(0, 50) + '...' : query;
      
      conversation = new Conversation({
        userId,
        conversationId,
        title
      });
      await conversation.save();
    } else {
      // Update conversation timestamp
      conversation.updatedAt = new Date();
      await conversation.save();
    }

    // Save user message
    const userMessage = new Chat({
      userId,
      conversationId,
      role: 'user',
      text: query
    });
    await userMessage.save();

    // Get conversation history
    const history = await Chat.find({ userId, conversationId })
      .sort({ timestamp: 1 })
      .limit(20);

    // Generate AI response
    const answer = await chatService(query, history);

    // Save bot response
    const botMessage = new Chat({
      userId,
      conversationId,
      role: 'bot',
      text: answer
    });
    await botMessage.save();

    console.log('✅ Response generated and saved');

    res.json({ answer });
  } catch (err) {
    console.error('❌ Chat error:', err);
    res.status(500).json({ error: 'Failed to fetch response from AI' });
  }
};

// Get all conversations for user
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select('conversationId title createdAt updatedAt');

    // Get message count for each conversation
    const conversationsWithCount = await Promise.all(
      conversations.map(async (conv) => {
        const messageCount = await Chat.countDocuments({
          userId,
          conversationId: conv.conversationId
        });

        return {
          conversationId: conv.conversationId,
          title: conv.title,
          messageCount,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt
        };
      })
    );

    console.log(`📜 Fetched ${conversationsWithCount.length} conversations for user ${userId}`);

    res.json({ conversations: conversationsWithCount });
  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Get specific conversation history
export const getHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const history = await Chat.find({ userId, conversationId })
      .sort({ timestamp: 1 });

    console.log(`📜 Fetched ${history.length} messages for conversation ${conversationId}`);

    res.json({ history });
  } catch (error) {
    console.error('❌ Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Clear specific conversation
export const clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    // Delete all messages
    const result = await Chat.deleteMany({ userId, conversationId });

    // Delete conversation metadata
    await Conversation.deleteOne({ userId, conversationId });

    console.log(`🗑️ Deleted conversation ${conversationId} with ${result.deletedCount} messages`);

    res.json({ 
      message: 'Conversation deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('❌ Clear conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

// Rename conversation
export const renameConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.userId;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { userId, conversationId },
      { title: title.trim() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ 
      message: 'Conversation renamed successfully',
      conversation 
    });
  } catch (error) {
    console.error('❌ Rename conversation error:', error);
    res.status(500).json({ error: 'Failed to rename conversation' });
  }
};

// Clear all conversations
export const clearAllConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await Chat.deleteMany({ userId });

    console.log(`🗑️ Deleted all ${result.deletedCount} messages for user`);

    res.json({ 
      message: 'All conversations cleared successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('❌ Clear all error:', error);
    res.status(500).json({ error: 'Failed to clear all conversations' });
  }
};


