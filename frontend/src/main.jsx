import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Chatbot from './components/ChatBot.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
   <Chatbot/>
   </Provider>
  </StrictMode>,
)
