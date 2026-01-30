import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import GoogleCallback from './components/Auth/GoogleCallback'; // NEW
import ChatBot from './components/Chat/ChatBot';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* NEW: Google OAuth callback */}
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);