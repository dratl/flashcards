// src/features/topics/topicsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topics: {}
};

export const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    addTopic: (state, action) => {
      const { id, name, icon } = action.payload;
      state.topics[id] = {
        id,
        name,
        icon,
        quizIds: []
      };
    }
  }
});

// Selector to get all topics
export const selectTopics = (state) => state.topics.topics;

// Export actions and reducer
export const { addTopic } = topicsSlice.actions;
export default topicsSlice.reducer;