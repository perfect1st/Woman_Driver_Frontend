import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import TrackingFrequencyModal from "./Modals/TrackingFrequencyModal";
import NotifyRadiusModal from "./Modals/NotifyRadiusModal";

const MainLayout = ({ children }) => {
  const [openTracking, setOpenTracking] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);

  const handleSidebarAction = (action) => {
    if (action === "openTrackingModal") setOpenTracking(true);
    if (action === "openNotifyRadiusModal") setOpenNotify(true);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar onAction={handleSidebarAction} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header لو عندك */}
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>

      {/* Modals */}
      <TrackingFrequencyModal open={openTracking} onClose={() => setOpenTracking(false)} />
      <NotifyRadiusModal open={openNotify} onClose={() => setOpenNotify(false)} />
    </Box>
  );
};

export default MainLayout;
