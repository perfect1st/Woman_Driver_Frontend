import { createSlice } from "@reduxjs/toolkit";
import {

} from "./thunk";

const initialState = {


  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
 
  },
});

export default userSlice.reducer;
