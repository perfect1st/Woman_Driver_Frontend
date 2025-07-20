// CarTypesPage.js
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const CarDriverPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == 'ar';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Initial car Driver data

  const initialCarDrivers = [
    {
      id: 1,
      driverName: "Ahmed Mostafa",
      carModel: "Toyota Corolla",
      assignDate: "2025-06-01",
      releaseDate: "2025-07-01",
      status: "Linked",
    },
    {
      id: 2,
      driverName: "Sara Ibrahim",
      carModel: "Hyundai Elantra",
      assignDate: "2025-06-15",
      releaseDate: "2025-07-05",
      status: "On Request",
    },
    {
      id: 3,
      driverName: "Mohamed Adel",
      carModel: "Chevrolet Truck",
      assignDate: "2025-05-10",
      releaseDate: "2025-06-30",
      status: "Leaved",
    },
    {
      id: 4,
      driverName: "Laila Samir",
      carModel: "Kia Sportage",
      assignDate: "2025-04-25",
      releaseDate: "2025-06-25",
      status: "Rejected",
    },
    {
      id: 5,
      driverName: "Hassan Ali",
      carModel: "Honda Civic",
      assignDate: "2025-07-01",
      releaseDate: "2025-07-10",
      status: "Linked",
    },
  ];
  

  const statusOptions = ["On Request", "Linked", "Leaved", "Rejected"];

  const [carDriver, setCarDriver] = useState(initialCarDrivers);
  const [filteredCarDriver, setFilteredCarDriver] = useState(initialCarDrivers);

  // Table columns configuration
  const tableColumns = [
    { key: "id", label: t("Cars-drivers ID") },
    { key: "driverName", label: t("Driver Name") },
    { key: "carModel", label: t("Car Model") },
    { key: "assignDate", label: t("Assign Date") },
    { key: "releaseDate", label: t("Release Date") },
    { key: "status", label: t("Status") },
  ];
  

  // Handle search/filter
  const handleSearch = (filters) => {
    const filtered = carDriver.filter(type => {
      const matchesSearch = !filters.search ||
        type.id.toString().includes(filters.search.toLowerCase()) ||
        type.name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || type.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredCarDriver(filtered);
  };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedTypes = carDriver.map(type =>
      type.id === row.id ? { ...type, status: newStatus } : type
    );

    setCarDriver(updatedTypes);
    setFilteredCarDriver(updatedTypes);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/CarDriverDetails/${row.id}`);
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

  const addCarDriverSubmit = () => {
    navigate("/CarDriverDetails/AddCarDrive");
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
          title={t("Cars-Drivers")}
          subtitle={t("Cars-Drivers Details")}
          haveBtn={true}
          i18n={i18n}
          btn={t("Link Car-Driver")}
          btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
          onSubmit={addCarDriverSubmit}
          isExcel={true}
          isPdf={true}
          isPrinter={true}
        />
      </Box>

      {/* Filter Section */}
      <Box sx={{ width: "100%", flexShrink: 0, my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          statusOptions={statusOptions}
          isCarDriver={true}
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
            data={filteredCarDriver}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            statusKey="status"
            showStatusChange={true}
            isCarDriver={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CarDriverPage;