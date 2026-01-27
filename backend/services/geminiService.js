import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);


const chatService=async(query)=>{

 const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
      });

const answer =response.text || 'No response';

  return answer

}

export default chatService;