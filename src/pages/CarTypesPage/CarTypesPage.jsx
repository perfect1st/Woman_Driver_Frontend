// CarTypesPage.js
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const CarTypesPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Initial car types data
  const initialCarTypes = [
    {
      id: 1,
      name: "Economy",
      status: "Available",
    },
    {
      id: 2,
      name: "Family",
      status: "Available",
    },
    {
      id: 3,
      name: "Truck",
      status: "Rejected",
    },
    {
      id: 4,
      name: "Van",
      status: "Available",
    },
    {
      id: 5,
      name: "Hatchback",
      status: "Rejected",
    },
  ];

  const statusOptions = ["Available", "Rejected"];

  const [carTypes, setCarTypes] = useState(initialCarTypes);
  const [filteredCarTypes, setFilteredCarTypes] = useState(initialCarTypes);

  // Table columns configuration
  const tableColumns = [
    { key: "id", label: t("Car Type ID") },
    { key: "name", label: t("Car Type Name") },
    { key: "status", label: t("Car Type Status") },
  ];

  // Handle search/filter
  const handleSearch = (filters) => {
    const filtered = carTypes.filter(type => {
      const matchesSearch = !filters.search ||
        type.id.toString().includes(filters.search.toLowerCase()) ||
        type.name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || type.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredCarTypes(filtered);
  };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedTypes = carTypes.map(type =>
      type.id === row.id ? { ...type, status: newStatus } : type
    );

    setCarTypes(updatedTypes);
    setFilteredCarTypes(updatedTypes);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/CarTypeDetails/${row.id}`);
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
    navigate("/CarTypes/AddCarType");
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
          title={t("Car Types")}
          subtitle={t("Car Types Details")}
          haveBtn={true}
          i18n={i18n}
          btn={t("Add Car Type")}
          btnIcon={<ControlPointIcon />}
          onSubmit={addCarTypeSubmit}
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
          isCarType={true}
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
            data={filteredCarTypes}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            statusKey="status"
            showStatusChange={true}
            isCarType={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CarTypesPage;