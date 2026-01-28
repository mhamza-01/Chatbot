import { useState, useEffect } from 'react';
import { getConversations, deleteConversation, renameConversation } from '../../utils/api';

export default function Sidebar({ 
  currentConversationId, 
  onSelectConversation, 
  onNewChat 
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Delete this conversation?')) return;

    try {
      await deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.conversationId !== conversationId));
      
      // If deleting current conversation, start new chat
      if (conversationId === currentConversationId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleRename = async (conversationId, e) => {
    e.stopPropagation();
    
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await renameConversation(conversationId, editTitle.trim());
      setConversations(prev => prev.map(c => 
        c.conversationId === conversationId 
          ? { ...c, title: editTitle.trim() }
          : c
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
  };

  const startEdit = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv.conversationId);
    setEditTitle(conv.title);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* New Chat Button */}
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-4">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-4">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.conversationId}
                onClick={() => onSelectConversation(conv.conversationId)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                  currentConversationId === conv.conversationId
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800'
                }`}
              >
                {editingId === conv.conversationId ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={(e) => handleRename(conv.conversationId, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(conv.conversationId, e);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{conv.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(conv.updatedAt)} · {conv.messageCount} msgs
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startEdit(conv, e)}
                          className="p-1 hover:bg-gray-700 rounded"
                          title="Rename"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDelete(conv.conversationId, e)}
                          className="p-1 hover:bg-red-600 rounded"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}