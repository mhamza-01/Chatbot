import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setMessages, clearMessages } from '../../store/chatSlice';
import { sendMessage, getChatHistory, clearChatHistory } from '../../utils/api';
import Navbar from '../Layout/Navbar';

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);

  const disabled = input.trim().length === 0;

  // Load chat history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getChatHistory();
      if (data.history && data.history.length > 0) {
        dispatch(setMessages(data.history));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (disabled) return;

    const text = input.trim();
    dispatch(addMessage({ role: "user", text }));
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(text);
      dispatch(addMessage({ role: "bot", text: data.answer }));
    } catch (error) {
      dispatch(addMessage({ role: "bot", text: "Error: " + error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Clear all messages?")) return;

    try {
      await clearChatHistory();
      dispatch(clearMessages());
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h2>
              <p className="text-gray-500 text-sm">Your messages are saved automatically</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm
                  ${msg.role === "user" 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl text-sm text-gray-500">
                Typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-center justify-between mb-2">
            <p className="text-xs text-gray-500">{messages.length} messages</p>
            <button
              onClick={handleClearChat}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear History
            </button>
          </div>
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={disabled || loading}
              className={`px-6 py-3 rounded-xl text-sm font-medium text-white
                ${disabled || loading ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"}`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}