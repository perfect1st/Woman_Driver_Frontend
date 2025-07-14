import React from "react";
import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const draw = keyframes`
  0% {
    stroke-dashoffset: 500;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 500;
  }
`;

const AnimatedText = styled("text")(({ theme }) => ({
  fill: "none",
  stroke: theme.palette.primary.main,
  strokeWidth: 2,
  strokeDasharray: 500,
  strokeDashoffset: 500,
  animation: `${draw} 4s linear infinite`,
  fontSize: 48,
  fontFamily: "Arial, sans-serif",
}));

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <svg width="400" height="100" viewBox="0 0 400 100">
        <AnimatedText x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          WOMAN DRIVER
        </AnimatedText>
      </svg>
    </Box>
  );
};

export default LoadingPage;
