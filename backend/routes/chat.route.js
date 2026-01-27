import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
router.post("/chat",
    async (req, res) => {
    try {
      const { query } = req.body;
  
      if (!query) {
        return res.status(400).json({ error: 'query is required' });
      }
  
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
      });
  
      
  
      const answer =response.text || 'No response';
  
      res.json({ answer });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch response from Gemini' });
    }
  }
)
export default router;