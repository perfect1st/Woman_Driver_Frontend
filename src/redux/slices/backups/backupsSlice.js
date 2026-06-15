import { createSlice } from "@reduxjs/toolkit";
import { getAllBackups,addOneBackup } from "./thunk";

const initialState={
    backups:[]
};

const backupsSlice=createSlice({
    initialState,
    name:"backupsSlice",
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllBackups.fulfilled,(state,action)=>{
            state.backups=action.payload;
        });
        builder.addCase(addOneBackup.fulfilled,(state,action)=>{
            // state.backups.push(action.payload);
        })
    }
});

export default backupsSlice.reducer;