import { configureStore } from '@reduxjs/toolkit';
import passengerSlice from './slices/passenger/passengerSlice';
import driverSlice from './slices/driver/driverSlice';


export const store = configureStore({
  reducer: {

    passenger: passengerSlice,
    driver: driverSlice

  },
});
