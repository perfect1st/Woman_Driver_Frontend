import { configureStore } from '@reduxjs/toolkit';
import passengerSlice from './slices/passenger/passengerSlice';
import driverSlice from './slices/driver/driverSlice';
import carTypeSlice from './slices/carType/carTypeSlice';
import paymentMethodSlice from './slices/paymentMethod/paymentMethodSlice';


export const store = configureStore({
  reducer: {

    passenger: passengerSlice,
    driver: driverSlice,
    carType: carTypeSlice,
    paymentMethod: paymentMethodSlice

  },
});
