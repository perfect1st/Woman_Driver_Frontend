import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify'



//get all Passengers
export const getAllPassengersWithoutPaginations = createAsyncThunk(
    "/passengerSlice/getAllPassengersWithoutPaginations",
    async ({query=''}) => {
        try {
            const response = await useGetDataToken(`/users?user_type=passenger&${query}`);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);
export const getAllPassengers = createAsyncThunk(
    "/passengerSlice/getAllPassengers",
    async ({query=''}) => {
        try {
            const response = await useGetDataToken(`/users?user_type=passenger&${query}`);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);
//get one Passenger
export const getOnePassenger = createAsyncThunk(
    "/passengerSlice/getOnePassenger",
    async (id='') => {
        try {
            const response = await useGetDataToken(`/users/${id}`);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);
//edit Passenger
export const editPassenger = createAsyncThunk(
    "/passengerSlice/editPassenger",
    async ({id='',data}) => {
        try {
            const response = await useUpdateData(`/users/${id}`,data);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);


