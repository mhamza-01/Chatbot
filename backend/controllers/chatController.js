import chatService from "../services/geminiService.js";

const handleChat=async(req,res)=>{

    try {
      const { query } = req.body;
  
      if (!query) {
        return res.status(400).json({ error: 'query is required' });
      }
      const answer=await chatService(query);
      
      res.json({answer});

    }

    catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch response from Gemini' });
    }

}
export default handleChat;