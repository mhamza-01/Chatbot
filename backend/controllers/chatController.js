import chatService from "../services/geminiService.js";
import Chat from '../models/Chat.js';

export const handleChat = async (req, res) => {
  try {
    const { query, conversationId = "default" } = req.body;
     const userId = req.userId;
    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }
    console.log("💬 Chat request from user:", userId);

    // Save user message to database
    const userMessage = new Chat({
      userId,
      conversationId,
      role: "user",
      text: query,
    });
    await userMessage.save();
    const answer = await chatService(query);

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
    console.error(err);
    res.status(500).json({ error: "Failed to fetch response from Gemini" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { conversationId = 'default' } = req.params;
    const userId = req.userId;

    const history = await Chat.find({ userId, conversationId })
      .sort({ timestamp: 1 });

    console.log(`📜 Fetched ${history.length} messages for user ${userId}`);

    res.json({ history });
  } catch (error) {
    console.error('❌ Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Chat.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $sort: { timestamp: -1 } },
      { 
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$text' },
          lastMessageTime: { $first: '$timestamp' },
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);

    res.json({ conversations });
  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Clear specific conversation
export const clearHistory = async (req, res) => {
  try {
    const { conversationId = 'default' } = req.params;
    const userId = req.userId;

    const result = await Chat.deleteMany({ userId, conversationId });

    console.log(`🗑️ Deleted ${result.deletedCount} messages`);

    res.json({ 
      message: 'Conversation cleared successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('❌ Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
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


