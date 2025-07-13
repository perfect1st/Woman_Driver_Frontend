// CarTypesPage.js
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

const TrafficTimePage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Initial car types data
  const domiTrafficTimes = [
    {
      id: 1,
      trafficTimeName: "Traffic Time 7 PM",
      kiloPrice: 1.25,
      timeFrom: "06:00",
      timeTo: "10:00",
      status: "Available",
    },
    {
      id: 2,
      trafficTimeName: "Morning Time 8 AM",
      kiloPrice: 1.75,
      timeFrom: "08:00",
      timeTo: "14:00",
      status: "Available",
    },
    {
      id: 3,
      trafficTimeName: "3 PM",
      kiloPrice: 2.5,
      timeFrom: "00:00",
      timeTo: "23:59",
      status: "Rejected",
    },
    {
      id: 4,
      trafficTimeName: "12 PM",
      kiloPrice: 2.0,
      timeFrom: "07:00",
      timeTo: "19:00",
      status: "Available",
    },
  ];

  const statusOptions = ["Available", "Rejected"];

  const [trafficTimes, setTrafficTimes] = useState(domiTrafficTimes);
  const [filteredTrafficTimes, setFilteredTrafficTimes] =
    useState(domiTrafficTimes);

  // Table columns configuration
  const tableColumns = [
    { key: "id", label: t("Traffic Time ID") },
    { key: "trafficTimeName", label: t("Traffic Time Name") },
    { key: "kiloPrice", label: t("Kilo Price") },
    { key: "timeFrom", label: t("Time From") },
    { key: "timeTo", label: t("Time To") },
    { key: "status", label: t("Status") },
  ];

  // Handle search/filter
  const handleSearch = (filters) => {
    const filtered = trafficTimes.filter((type) => {
      const matchesSearch =
        !filters.search ||
        type.id.toString().includes(filters.search.toLowerCase()) ||
        type.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || type.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredTrafficTimes(filtered);
  };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedTypes = trafficTimes.map((type) =>
      type.id === row.id ? { ...type, status: newStatus } : type
    );

    setTrafficTimes(updatedTypes);
    setFilteredTrafficTimes(updatedTypes);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/TrafficTimeDetails/${row.id}`);
  };

  // Prevent horizontal scrolling
  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const addCarTypeSubmit = () => {
    navigate("/TrafficTimes/AddTrafficTime");
  };

  return (
    <Box
      component="main"
      sx={{
        p: isSmallScreen ? 2 : 3,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Box sx={{ width: "100%", flexShrink: 0 }}>
        <Header
          title={t("Traffic Time")}
          subtitle={t("Traffic Time Details")}
          haveBtn={true}
          i18n={i18n}
          btn={t("Add Traffic Time")}
          btnIcon={<ControlPointIcon />}
          onSubmit={addCarTypeSubmit}
        />
      </Box>

      {/* Filter Section */}
      <Box sx={{ width: "100%", flexShrink: 0, my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          statusOptions={statusOptions}
          isTrafficTime={true}
        />
      </Box>

      {/* Table Section */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            overflow: "auto",
            borderRadius: 1,
            boxShadow: 1,
            "&::-webkit-scrollbar": {
              height: "6px",
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[400],
              borderRadius: "4px",
            },
          }}
        >
          <TableComponent
            columns={tableColumns}
            data={filteredTrafficTimes}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            statusKey="status"
            showStatusChange={true}
            isTrafficTime={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TrafficTimePage;
