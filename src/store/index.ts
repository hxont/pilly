import { configureStore } from '@reduxjs/toolkit';
import pharmacyReducer from '../slices/pharmacySlice';

const store = configureStore({
  reducer: {
    pharmacy: pharmacyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
