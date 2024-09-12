// messageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const messageStore = createSlice({
  name: 'message',
  initialState: {
    message: '',
    type: '',
    visible: false
  },
  reducers: {
    showMessage(state, action) {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.visible = true;
    },
    hideMessage(state) {
      state.message = '';
      state.type = '';
      state.visible = false;
    }
  }
});

const messageReducer = messageStore.reducer

export const { showMessage, hideMessage } = messageStore.actions;
export default messageReducer