import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const DriversPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
  // Initial data
  const initialDrivers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      carType: "Toyota Corolla",
      nationalId: "29805231234567",
      driverLicenseExpiry: "2025-10-01",
      carLicenseExpiry: "2025-12-31",
      accountStatus: "Available",
    },
    {
      id: 2,
      name: "Mona Ali",
      carType: "Hyundai Elantra",
      nationalId: "29906021234567",
      driverLicenseExpiry: "2024-11-15",
      carLicenseExpiry: "2024-09-30",
      accountStatus: "Pending",
    },
    {
      id: 3,
      name: "Youssef Khaled",
      carType: "Kia Sportage",
      nationalId: "30007181234567",
      driverLicenseExpiry: "2026-03-20",
      carLicenseExpiry: "2026-01-10",
      accountStatus: "Rejected",
    },
    {
      id: 4,
      name: "Sara Mohamed",
      carType: "Honda Civic",
      nationalId: "29708251234567",
      driverLicenseExpiry: "2025-07-01",
      carLicenseExpiry: "2025-08-15",
      accountStatus: "Available",
    },
    {
      id: 5,
      name: "Omar Farouk",
      carType: "Nissan Sunny",
      nationalId: "29609141234567",
      driverLicenseExpiry: "2024-12-05",
      carLicenseExpiry: "2025-01-30",
      accountStatus: "Pending",
    },
  ];
  

  const [carTypes, setCarTypes] = useState([
    { _id: "1", name: "Toyota Corolla" },
    { _id: "2", name: "Hyundai Elantra" },
    { _id: "3", name: "Kia Sportage" },
    { _id: "4", name: "Honda Civic" },
    { _id: "5", name: "Nissan Sunny" },
  ]);
  
  const statusOptions = ["Available", "Pending", "Rejected"];
  const handleSearch = (filters) => {
    // filters will contain:
    //   keyword: search term
    //   city: city ID (e.g. '1')
    //   status: status string (e.g. 'Available')

    console.log("Search filters:", filters);
    // Make API call with these filters
  };

  // State management
  const [passengers, setPassengers] = useState(initialDrivers);
  const [filteredPassengers, setFilteredPassengers] =
    useState(initialDrivers);

  // Table columns configuration
  const tableColumns = [
    { key: "id", label: t("Driver ID") },
    { key: "name", label: t("Driver name") },
    { key: "carType", label: t("Car type") },
    { key: "nationalId", label: t("National ID") },
    { key: "driverLicenseExpiry", label: t("Driver license expiry") },
    { key: "carLicenseExpiry", label: t("Car license expiry") },
    { key: "accountStatus", label: t("Account status") },
  ];
  

  // Handle search/filter
  // const handleSearch = (filters) => {
  //   const filtered = passengers.filter(passenger => {
  //     const matchesSearch = !filters.search ||
  //       passenger.name.toLowerCase().includes(filters.search.toLowerCase()) ||
  //       passenger.number.toLowerCase().includes(filters.search.toLowerCase());

  //     const matchesCity = !filters.city || passenger.city === filters.city;
  //     const matchesStatus = !filters.status || passenger.accountStatus === filters.status;

  //     return matchesSearch && matchesCity && matchesStatus;
  //   });

  //   setFilteredPassengers(filtered);
  // };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedPassengers = passengers.map((p) =>
      p.id === row.id ? { ...p, accountStatus: newStatus } : p
    );

    setPassengers(updatedPassengers);
    setFilteredPassengers(updatedPassengers);
    console.log(`Status changed for ${row.name} to ${newStatus}`);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/DriverDetails/${row.id}`)
    // alert(
    //   `Showing details for: ${row.name}\nID: ${row.id}\nStatus: ${row.accountStatus}`
    // );
  };

  // Prevent horizontal scrolling on the entire page
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
      <Box
        sx={{
          width: "100%",
          flexShrink: 0,
        }}
      >
        <Header
          title={t("Drivers")}
          subtitle={t("Drivers Details")}
          i18n={i18n}
          isExcel={true}
          isPdf={true}
          isPrinter={true}
        />
      </Box>

      {/* Filter Section */}
      <Box
        sx={{
          width: "100%",
          flexShrink: 0,
          my: 2,
        }}
      >
        <FilterComponent
          onSearch={handleSearch}
          carTypeOptions={carTypes}
          statusOptions={statusOptions}
          isDriver={true}
        />
      </Box>

      {/* Table Section - Flexible container */}
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
            // border: '1px solid #e0e0e0',
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
            data={filteredPassengers}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            isDriver={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DriversPage;
