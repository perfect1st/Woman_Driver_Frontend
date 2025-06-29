import React from "react";
import { Box, keyframes } from "@mui/material";
import logo from "../assets/Logo.png"; // ✅ غيّر المسار حسب مكان اللوجو

// ✨ أنميشن وميض / ترسم
const pulse = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
`;

const LoadingComponent = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        // width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fff", // لون الخلفية
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="App Logo"
        sx={{
          width: 200,
          height: 200,
          animation: `${pulse} 1.5s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          mt: 2,
          fontSize: 18,
          color: "#888",
          animation: "fadein 2s ease-in-out infinite",
        }}
      >
        جاري التحميل...
      </Box>
    </Box>
  );
};

export default LoadingComponent;
