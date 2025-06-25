// components/MainLayout.js
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar"; // تأكد أنك عامل هذا الملف
import { Box } from "@mui/material";

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* <Header /> */}
        <Box component="main" sx={{ flex: 1, p: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
