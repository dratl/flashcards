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
    },
    addQuizIdForTopic: (state, action) => {
      const { topicId, quizId } = action.payload;
      state.topics[topicId].quizIds.push(quizId);
    },
    addQuizId: (state, action) => {
      const { quizId, topicId } = action.payload;
      if (state.topics[topicId]) {
        state.topics[topicId].quizIds.push(quizId);
      }
    }
  }
});

// Selector to get all topics
export const selectTopics = (state) => state.topics.topics;

// Export actions and reducer
export const { addTopic, addQuizIdForTopic, addQuizId } = topicsSlice.actions;
export default topicsSlice.reducer;