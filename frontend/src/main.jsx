import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatBot from './components/Chat/ChatBot';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Route */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/chat" replace />} />
          
          {/* 404 - Redirect to chat */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
