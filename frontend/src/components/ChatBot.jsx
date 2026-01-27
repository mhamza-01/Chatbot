import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, clearMessages } from '../store/chatSlice';
import ReactMarkdown from 'react-markdown';


export default function Chatbot() {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);

  const disabled = input.trim().length === 0;

  const sendMessage = async () => {
    if (disabled) return;

    const text = input.trim();
    dispatch(addMessage({ role: "user", text }));
    setInput("");

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await res.json();
      dispatch(addMessage({ role: "bot", text: data.answer }));
    } catch (err) {
      dispatch(addMessage({ role: "bot", text: "Error talking to server" }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Clear all messages?")) {
      dispatch(clearMessages());
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">AI Chatbot</h1>
              <p className="text-xs text-gray-500">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </header>

      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Start a Conversation
              </h2>
              <p className="text-gray-500 text-sm">
                Ask me anything and I'll do my best to help!
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm
                    ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                    }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={{ maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={disabled}
              className={`px-6 py-3 rounded-xl text-sm font-medium text-white transition-all
                ${
                  disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg"
                }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

     
      <footer className="bg-gray-50 border-t border-gray-200 py-3">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs text-gray-500">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </footer>
    </div>
  );
}