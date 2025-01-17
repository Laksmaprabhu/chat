import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';

// Create the store using configureStore
const store = configureStore({
    reducer: {
      student: studentReducer, // Profile slice reducer
    },
  });

  export default store;