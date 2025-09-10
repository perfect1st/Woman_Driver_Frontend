import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import { useDeleteData } from "../../../hooks/useDeleteData";
import notify from "../../../components/notify";

// thunk.js
export const getAllSetting = createAsyncThunk(
  "settingSlice/getAllSettings",
  async () => {
    try {
        const response = await useGetDataToken(`/settings`);
        return response;
      
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
        }
  }
);


export const updateSetting = createAsyncThunk(
  "settingSlice/updateSetting", 
  async ({id, data}) => {
    try {
      const response = await useUpdateData(`/settings`, data);
      return response; 
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);