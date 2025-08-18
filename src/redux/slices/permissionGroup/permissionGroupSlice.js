// permissionGroupSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getAllPermissionGroups } from "./thunk";

const initialState = {
  allPermissionGroups: [],
  loading: false,
  error: null,
};

const permissionGroupSlice = createSlice({
  name: "permissionGroupSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPermissionGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissionGroups.fulfilled, (state, action) => {
        state.loading = false;
        // Use dummy data if API response is empty
        state.allPermissionGroups = action.payload?.length 
          ? action.payload 
          : [
              { id: '1', name: 'Administrators' },
              { id: '2', name: 'Managers' },
              { id: '3', name: 'Support Staff' },
              { id: '4', name: 'Field Operators' },
            ];
      })
      .addCase(getAllPermissionGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        
        // Fallback to dummy data on error
        state.allPermissionGroups = [
          { id: '1', name: 'Administrators' },
          { id: '2', name: 'Managers' },
          { id: '3', name: 'Support Staff' },
          { id: '4', name: 'Field Operators' },
        ];
      });
  },
});

export default permissionGroupSlice.reducer;