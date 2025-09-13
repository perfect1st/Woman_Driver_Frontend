import React from "react";
import { Box } from "@mui/material";
import { styled, keyframes, useTheme } from "@mui/system";

const draw = keyframes`
  0% { stroke-dashoffset: 500; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 500; }
`;

const AnimatedText = styled("text")(({ theme }) => ({
  fill: "none",
  stroke: theme.palette.primary.main,
  strokeWidth: 2,
  strokeDasharray: 500,
  strokeDashoffset: 500,
  animation: `${draw} 4s linear infinite`,
  fontFamily: "Arial, sans-serif",
  // Responsive font size
  fontSize: "6vw",
  [theme.breakpoints.up('sm')]: {
    fontSize: '48px',
  },
}));

const LoadingPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        // backgroundColor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <svg
          viewBox="0 0 400 100"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <AnimatedText x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            WOMAN DRIVER
          </AnimatedText>
        </svg>
      </Box>
    </Box>
  );
};

export default LoadingPage;
