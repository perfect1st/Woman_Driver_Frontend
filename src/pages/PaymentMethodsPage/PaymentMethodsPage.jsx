// CarTypesPage.js
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const PaymentMethodsPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Initial car types data
  const initialPaymentMethod = [
    {
      id: 1,
      nameEn: "Cash",
      nameAr: "نقدي",
      status: "Available",
    },
    {
      id: 2,
      nameEn: "Visa",
      nameAr: "فيزا",
      status: "Available",
    },
    {
      id: 3,
      nameEn: "Wallet",
      nameAr: "محفظة",
      status: "Rejected",
    },
    
  ];

  const statusOptions = ["Available", "Rejected"];

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [filteredPaymentMethod, setFilteredPaymentMethod] = useState(initialPaymentMethod);

  // Table columns configuration
  const tableColumns = [
    { key: "id", label: t("Payment Method ID") },
    { key: "nameEn", label: t("nameEn") },
    { key: "nameAr", label: t("nameAr") },
    { key: "status", label: t("Status") },
  ];

  // Handle search/filter
  const handleSearch = (filters) => {
    const filtered = initialPaymentMethod.filter(type => {
      const matchesSearch = !filters.search ||
        type.id.toString().includes(filters.search.toLowerCase()) ||
        type.name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || type.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredPaymentMethod(filtered);
  };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedTypes = initialPaymentMethod.map(type =>
      type.id === row.id ? { ...type, status: newStatus } : type
    );

    setPaymentMethod(updatedTypes);
    setFilteredPaymentMethod(updatedTypes);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/paymentMethodDetails/${row.id}`);
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

  const addPaymentMethodSubmit = () => {
    navigate("/paymentMethod/AddPaymentMethod");
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
          title={t("Payment Methods")}
          subtitle={t("Payment Methods Details")}
          haveBtn={true}
          i18n={i18n}
          btn={t("Add Payment Method")}
          btnIcon={<ControlPointIcon />}
          onSubmit={addPaymentMethodSubmit}
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
          paymentMethod={true}
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
            data={filteredPaymentMethod}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            statusKey="status"
            showStatusChange={true}
            paymentMethod={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentMethodsPage;