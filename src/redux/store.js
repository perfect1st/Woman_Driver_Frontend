import { configureStore } from '@reduxjs/toolkit';
import passengerSlice from './slices/passenger/passengerSlice';


export const store = configureStore({
  reducer: {

    passenger: passengerSlice

  },
});
