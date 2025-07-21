import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TripsPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Initial trips data
  const initialTrips = [
    {
      id: 1,
      tripId: "TRIP001",
      riderName: "John Doe",
      driverName: "Michael Johnson",
      tripType: "Standard",
      carType: "Sedan",
      tripStatus: "Complete",
    },
    {
      id: 2,
      tripId: "TRIP002",
      riderName: "Jane Smith",
      driverName: "Robert Brown",
      tripType: "Premium",
      carType: "SUV",
      tripStatus: "On Request",
    },
    {
      id: 3,
      tripId: "TRIP003",
      riderName: "Bob Johnson",
      driverName: "William Davis",
      tripType: "Economy",
      carType: "Compact",
      tripStatus: "Cancelled",
    },
    {
      id: 4,
      tripId: "TRIP004",
      riderName: "Alice Williams",
      driverName: "David Wilson",
      tripType: "Standard",
      carType: "Sedan",
      tripStatus: "Approved by driver",
    },
    {
      id: 5,
      tripId: "TRIP005",
      riderName: "Charlie Brown",
      driverName: "James Miller",
      tripType: "Premium",
      carType: "Luxury",
      tripStatus: "Start",
    },
  ];

  // Filter options
  const tripTypeOptions = [
    { _id: "1", name: "Standard" },
    { _id: "2", name: "Premium" },
    { _id: "3", name: "Economy" },
    { _id: "4", name: "Luxury" },
  ];

  const carTypeOptions = [
    { _id: "1", name: "Sedan" },
    { _id: "2", name: "SUV" },
    { _id: "3", name: "Compact" },
    { _id: "4", name: "Luxury" },
  ];

  const statusOptions = [
    "Complete",
    "Cancelled",
    "On Request",
    "Approved by driver",
    "Start",
  ];

  // State management
  const [trips, setTrips] = useState(initialTrips);
  const [filteredTrips, setFilteredTrips] = useState(initialTrips);

  // Table columns configuration
  const tableColumns = [
    { key: "tripId", label: t("Trip ID") },
    { key: "riderName", label: t("Rider name") },
    { key: "driverName", label: t("Driver name") },
    { key: "tripType", label: t("Trip Type") },
    { key: "carType", label: t("Car Type") },
    { key: "tripStatus", label: t("Trip status") }, // This will be styled automatically
  ];

  // Handle search/filter
  const handleSearch = (filters) => {
    const filtered = trips.filter((trip) => {
      const matchesSearch =
        !filters.search ||
        trip.riderName.toLowerCase().includes(filters.search.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(filters.search.toLowerCase());

      const matchesTripType =
        !filters.tripType || trip.tripType === filters.tripType;
      const matchesCarType =
        !filters.carType || trip.carType === filters.carType;
      const matchesStatus =
        !filters.status || trip.tripStatus === filters.status;

      return (
        matchesSearch && matchesTripType && matchesCarType && matchesStatus
      );
    });

    setFilteredTrips(filtered);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/tripDetails/${row.id}`);
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
        <Header title={t("Trips")} subtitle={t("Trips Details")} i18n={i18n} isExcel={true} isPdf={true} isPrinter={true} />
      </Box>

      {/* Filter Section */}
      <Box sx={{ width: "100%", flexShrink: 0, my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          tripTypeOptions={tripTypeOptions}
          carTypeOptions={carTypeOptions}
          statusOptions={statusOptions}
          isTrip={true}
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
            data={filteredTrips}
            onViewDetails={handleViewDetails}
            statusKey="tripStatus" // Use tripStatus field for styling
            showStatusChange={true} // Hide status change options
            actionIconType="info" // Use info icon instead of more icon
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TripsPage;
