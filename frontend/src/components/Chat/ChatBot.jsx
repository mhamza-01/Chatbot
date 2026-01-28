import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setMessages, clearMessages } from '../../store/chatSlice';
import { sendMessage, getChatHistory } from '../../utils/api';
import Navbar from '../Layout/Navbar';
import Sidebar from './Sidebar';

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);

  const disabled = input.trim().length === 0;

  // Initialize with new conversation
  useEffect(() => {
    handleNewChat();
  }, []);

  const handleNewChat = () => {
    const newConvId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentConversationId(newConvId);
    dispatch(clearMessages());
  };

  const handleSelectConversation = async (conversationId) => {
    setCurrentConversationId(conversationId);
    dispatch(clearMessages());

    try {
      const data = await getChatHistory(conversationId);
      if (data.history && data.history.length > 0) {
        dispatch(setMessages(data.history));
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (disabled || !currentConversationId) return;

    const text = input.trim();
    dispatch(addMessage({ role: "user", text }));
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(text, currentConversationId);
      dispatch(addMessage({ role: "bot", text: data.answer }));
    } catch (error) {
      dispatch(addMessage({ role: "bot", text: "Error: " + error.message }));
    } finally {
      setLoading(false);
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
    <div className="h-screen flex">
      {/* Sidebar */}
      <Sidebar
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Start a New Conversation</h2>
                <p className="text-gray-500 text-sm">Ask me anything!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm
                    ${msg.role === "user" 
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl text-sm text-gray-500 border border-gray-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={disabled || loading}
                className={`px-6 py-3 rounded-xl text-sm font-medium text-white transition-all
                  ${disabled || loading 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}