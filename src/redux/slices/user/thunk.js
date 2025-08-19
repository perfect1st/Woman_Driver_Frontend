import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

export const register = createAsyncThunk(
  "/userSlice/register",
  async ({data}) => {
    try {
      const response = await useInsertData(`/admins/register`,data);
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
export const login = createAsyncThunk(
  "/userSlice/login",
  async ({data}) => {
    try {
      const response = await useInsertData(`/admins/login`,data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data?.message, "error");
      }
    }
  }
);

