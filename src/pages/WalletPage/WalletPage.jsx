// CarTypesPage.js
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const WalletPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Initial car types data
  const initialWallet = [
    {
      id: 1,
      userName: "Mohammed Salem",
      userType: "Driver",
      dashboardUser: "Admin A",
      transactionType: "Deposit",
      transactionReason: "Weekly settlement",
      status: "Accepted",
    },
    {
      id: 2,
      userName: "Lina Ahmed",
      userType: "Customer",
      dashboardUser: "Admin B",
      transactionType: "Withdrawal",
      transactionReason: "Refund",
      status: "Pending",
    },
    {
      id: 3,
      userName: "Youssef Kamal",
      userType: "Driver",
      dashboardUser: "System",
      transactionType: "Deduction",
      transactionReason: "Penalty",
      status: "Rejected",
    },
    {
      id: 4,
      userName: "Sara Nabil",
      userType: "Customer",
      dashboardUser: "Admin C",
      transactionType: "Deposit",
      transactionReason: "Bonus",
      status: "Accepted",
    },
    {
      id: 5,
      userName: "Ahmed Mostafa",
      userType: "Driver",
      dashboardUser: "Admin A",
      transactionType: "Withdrawal",
      transactionReason: "Driver request",
      status: "Pending",
    },
  ];

  
  const statusOptions = ["Accepted", "Rejected"];

  const [wallet, setWallet] = useState(initialWallet);
  const [filteredWallet, setFilteredWallet] = useState(initialWallet);

  // Table columns configuration
  const tableColumns = [
    { key: "id", label: t("Transaction ID") },
    { key: "userName", label: t("User Name") },
    { key: "userType", label: t("User Type") },
    { key: "dashboardUser", label: t("Dashboard User") },
    { key: "transactionType", label: t("Transaction Type") },
    { key: "transactionReason", label: t("Transaction Reason") },
    { key: "status", label: t("Status") },
  ];

  // Handle search/filter
  const handleSearch = (filters) => {
    const filtered = wallet.filter(type => {
      const matchesSearch = !filters.search ||
        type.id.toString().includes(filters.search.toLowerCase()) ||
        type.name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || type.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredWallet(filtered);
  };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedTypes = wallet.map(type =>
      type.id === row.id ? { ...type, status: newStatus } : type
    );

    setWallet(updatedTypes);
    setFilteredWallet(updatedTypes);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/TransactionDetails/${row.id}`);
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
    navigate("/Wallet/AddTransaction");
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
          title={t("Wallet")}
          subtitle={t("Wallet Details")}
          haveBtn={true}
          i18n={i18n}
          btn={t("Add Transaction")}
          btnIcon={<ControlPointIcon />}
          onSubmit={addCarTypeSubmit}
        />
      </Box>

      {/* Filter Section */}
      <Box sx={{ width: "100%", flexShrink: 0, my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          statusOptions={statusOptions}
          isWallet={true}
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
            data={filteredWallet}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            statusKey="status"
            showStatusChange={true}
            isWallet={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WalletPage;