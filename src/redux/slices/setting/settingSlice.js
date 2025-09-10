import { createSlice } from "@reduxjs/toolkit";
import { getAllSetting, updateSetting } from "./thunk";

const initialState = {
  setting: null,
  loading: false,
  error: null,
  message: null, // add message for success feedback
};

const settingSlice = createSlice({
  name: "settingSlice",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all
      .addCase(getAllSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.setting = action.payload; // API returns setting object directly
      })
      .addCase(getAllSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      // Update
      .addCase(updateSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.setting = action.payload.setting; 
        state.message = action.payload.message; 
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearMessage } = settingSlice.actions;
export default settingSlice.reducer;
