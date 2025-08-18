import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// thunk.js
export const getAllPermissionGroups = createAsyncThunk(
  "permissionGroupSlice/getAllPermissionGroups",
  async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return empty array to trigger dummy data fallback
      return []; 
      
      // const response = await useGetDataToken(`endpoint-here`);
      // return response;
    } catch (error) {
      throw new Error("Failed to fetch permission groups");
    }
  }
);


