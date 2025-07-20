import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
const CarsPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == 'ar'
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Initial car data
  const initialCars = [
    {
      id: 1,
      model: "Toyota Corolla",
      carType: "Sedan",
      companyCar: "Company Car",
      licenseExpiry: "2025-10-01",
      status: "Available",
    },
    {
      id: 2,
      model: "Hyundai Elantra",
      carType: "Sedan",
      companyCar: "User Car",
      licenseExpiry: "2024-11-15",
      status: "Rejected",
    },
    {
      id: 3,
      model: "Kia Sportage",
      carType: "SUV",
      companyCar: "Company Car",
      licenseExpiry: "2026-03-20",
      status: "Available",
    },
    {
      id: 4,
      model: "Honda Civic",
      carType: "Sedan",
      companyCar: "User Car",
      licenseExpiry: "2025-07-01",
      status: "Available",
    },
    {
      id: 5,
      model: "Nissan Sunny",
      carType: "Sedan",
      companyCar: "Company Car",
      licenseExpiry: "2024-12-05",
      status: "Rejected",
    },
  ];

  // Options for filters
  const carTypeOptions = [
    { _id: "1", name: "Sedan" },
    { _id: "2", name: "SUV" },
    { _id: "3", name: "Truck" },
    { _id: "4", name: "Van" },
  ];
  
  const companyCarOptions = ["Company Car", "User Car"];
  const statusOptions = ["Available", "Rejected"];

  const [cars, setCars] = useState(initialCars);
  const [filteredCars, setFilteredCars] = useState(initialCars);

  // Table columns configuration
  const tableColumns = [
    { key: "id", label: t("Car ID") },
    { key: "model", label: t("Car Model") },
    { key: "carType", label: t("Car type") },
    { key: "companyCar", label: t("Company Car") },
    { key: "licenseExpiry", label: t("Car license EX") },
    { key: "status", label: t("Car status") },
  ];

  // Handle search/filter
  const handleSearch = (filters) => {
    const filtered = cars.filter(car => {
      const matchesSearch = !filters.search ||
        car.id.toString().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCarType = !filters.carType || car.carType === 
        carTypeOptions.find(ct => ct._id === filters.carType)?.name;
      
      const matchesCompanyCar = !filters.companyCar || car.companyCar === filters.companyCar;
      const matchesStatus = !filters.status || car.status === filters.status;

      return matchesSearch && matchesCarType && matchesCompanyCar && matchesStatus;
    });

    setFilteredCars(filtered);
  };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedCars = cars.map(car =>
      car.id === row.id ? { ...car, status: newStatus } : car
    );

    setCars(updatedCars);
    setFilteredCars(updatedCars);
    console.log(`Status changed for ${row.model} to ${newStatus}`);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/CarDetails/${row.id}`);
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

  const addCarSubmit = () => {
    navigate("/Cars/AddCar");
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
          title={t("Cars")}
          subtitle={t("Cars Details")}
          i18n={i18n}
          haveBtn={true}
          btn={t("Add Car")}
          btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
          onSubmit={addCarSubmit}
          isExcel={true}
          isPdf={true}
          isPrinter={true}
        />
      </Box>

      {/* Filter Section */}
      <Box sx={{ width: "100%", flexShrink: 0, my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          carTypeOptions={carTypeOptions}
          companyCarOptions={companyCarOptions}
          statusOptions={statusOptions}
          isCar={true}
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
            data={filteredCars}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            statusKey="status"
            showStatusChange={true}
            isCar={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CarsPage;