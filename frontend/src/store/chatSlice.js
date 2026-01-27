import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { addMessage, setMessages, clearMessages, setLoading } = chatSlice.actions;
export default chatSlice.reducer;