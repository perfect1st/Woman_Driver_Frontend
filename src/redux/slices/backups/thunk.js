import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../../hook/useNotification";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useInsertData } from "../../../hooks/useInsertData";
import { useUpdateData } from "../../../hooks/useUpdateData";

export const getAllBackups=createAsyncThunk(
    "/backupsSlice/getAllBackups",
    async(query)=>{
        try {
            const response=await useGetDataToken(`/backups?${query}`);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);

export const addOneBackup=createAsyncThunk(
    "/backupsSlice/addOneBackup",
    async({data})=>{
        try {
            const response = await useInsertData("/backups/create", data);
            notify(" تم الاضافة بنجاح ", "success");
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);


export const downloadBackup=createAsyncThunk(
    "/backupsSlice/downloadBackup",
    async({id})=>{
        try {
            // /api/v1/backups/download/:id
            const response=await useGetDataToken(`/api/v1/backups/download/${id}`);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);