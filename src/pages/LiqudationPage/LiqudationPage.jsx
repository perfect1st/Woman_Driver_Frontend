import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import notify from "../../components/notify";

const LiquidationPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // example initial data, replace with API call if needed
  const initialLiquidations = [
    {
      _id: "LQ001",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
      status: "completed",
      driverName: "gomaa",
      phoneNumber: "01008974112",
      totalBalance: 150.0,
    },
    {
      _id: "LQ002",
      startDate: "2024-07-10",
      endDate: "2024-07-12",
      status: "pending",
      driverName: "mohamed",
      phoneNumber: "1231231231",
      totalBalance: -75.5,
    },
    {
      _id: "LQ003",
      startDate: "2024-07-10",
      endDate: "2024-07-12",
      status: "pending",
      driverName: "mokhtar",
      phoneNumber: "1231231231",
      totalBalance: -120.5,
    },
    {
      _id: "LQ004",
      startDate: "2024-07-10",
      endDate: "2024-07-12",
      status: "pending",
      driverName: "moataz",
      phoneNumber: "1231231231",
      totalBalance: 321.5,
    },
  ];

  const [liquidations, setLiquidations] = useState(initialLiquidations);
  const [confirmLiquidation, setConfirmLiquidation] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredLiquidations, setFilteredLiquidations] = useState(initialLiquidations);

  const tableColumns = [
    { key: "_id", label: t("Liquidation ID") },
    { key: "driverName", label: t("Driver Name") },
    { key: "phoneNumber", label: t("Phone Number") },
    { key: "startDate", label: t("Start Date") },
    { key: "endDate", label: t("End Date") },
    { key: "status", label: t("Status") },
    {
      key: "totalBalance",
      label: t("Total Balance"),
      render: (row) => {
        const isPositive = row.totalBalance >= 0;
        const Icon = isPositive ? ArrowUpward : ArrowDownward;
        const color = isPositive ? theme.palette.success.main : theme.palette.error.main;
        return (
          <Box display="flex" alignItems="center" sx={{ color }}>
            <Icon fontSize="small" />
            <Box component="span" sx={{ ml: 0.5 }}>
              {row.totalBalance.toFixed(2)}
            </Box>
          </Box>
        );
      },
    },
  ];

  const handleSearch = (filters) => {
    const filtered = liquidations.filter((item) => {
      const lowerSearch = filters.search?.toLowerCase() || "";
      const matchesText =
        !lowerSearch ||
        item._id.toLowerCase().includes(lowerSearch) ||
        item.driverName.toLowerCase().includes(lowerSearch) ||
        item.phoneNumber.includes(lowerSearch);

      const matchesDate =
        (!filters.startDate || item.startDate === filters.startDate) &&
        (!filters.endDate || item.endDate === filters.endDate);

      return matchesText && matchesDate;
    });
    setFilteredLiquidations(filtered);
  };

  const onRowClick = (e, row) => {
    navigate(`/LiqudationDetails/${row._id}`);
  };

  const onLiquidationClick = (e, row) => {
    if (row?.status === "completed") {
      return notify(t("driver_already_liquidated"), "warning");
    }
    setSelectedRow(row);
    setConfirmLiquidation(true);
  };

  const handleConfirm = () => {
    // perform liquidation action, e.g., API call
    notify(t("liquidation_success"), "success");
    // update status locally
    setLiquidations((prev) =>
      prev.map((item) =>
        item._id === selectedRow._id ? { ...item, status: "completed" } : item
      )
    );
    setFilteredLiquidations((prev) =>
      prev.map((item) =>
        item._id === selectedRow._id ? { ...item, status: "completed" } : item
      )
    );
    setConfirmLiquidation(false);
  };

  const handleCancel = () => {
    setSelectedRow(null);
    setConfirmLiquidation(false);
  };

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
      <Header
        title={t("Liquidations")}
        subtitle={t("Liquidation Details")}
        i18n={i18n}
        isExcel={true}
        isPdf={true}
        isPrinter={true}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent onSearch={handleSearch} isLiquidation={true}  statusOptions={["active", "Pending"]} />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
      <TableComponent
          columns={tableColumns}
          data={filteredLiquidations}
          actionIconType="details"
          actionIconType2="liqudation_now"
          showStatusChange={false}
          onActionClick={onRowClick}
          liqudationClick={onLiquidationClick}
        />
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmLiquidation} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle>{t("confirm_liquidation_title")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("confirm_liquidation_message", { name: selectedRow?.driverName })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t("cancel")}</Button>
          <Button onClick={handleConfirm} variant="contained">
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiquidationPage;
