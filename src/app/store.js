import { configureStore } from "@reduxjs/toolkit";
// src/app/store.js
import topicsReducer from '../features/topics/topicsSlice';
import quizzesReducer from '../features/quizzes/quizzesSlice';

export default configureStore({
  reducer: {
    topics: topicsReducer,
    quizzes: quizzesReducer
  },
});