import { configureStore } from "@reduxjs/toolkit";
// src/app/store.js
import topicsReducer from '../features/topics/topicsSlice';

export default configureStore({
  reducer: {
    topics: topicsReducer
  },
});