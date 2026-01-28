const API_URL = 'http://localhost:3000/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Helper to create headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Register user
export const registerUser = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  
  return await response.json();
};

// Login user
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return await response.json();
};

// Logout user
export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getHeaders()
  });
  
  return await response.json();
};

// Send chat message
export const sendMessage = async (query, conversationId = 'default') => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ query, conversationId })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }
  
  return await response.json();
};

// Get chat history
export const getChatHistory = async (conversationId = 'default') => {
  const response = await fetch(`${API_URL}/history/${conversationId}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch history');
  }
  
  return await response.json();
};

// Clear chat history
export const clearChatHistory = async (conversationId = 'default') => {
  const response = await fetch(`${API_URL}/history/${conversationId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  
  return await response.json();
};