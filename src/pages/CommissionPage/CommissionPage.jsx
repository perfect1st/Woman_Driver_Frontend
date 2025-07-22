import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CommissionPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const initialCommissions = [
    {
      id: 1,
      commissionId: "COM001",
      driverName: "Michael Johnson",
      isAppVehicle: true,
      date: "2024-07-01",
      totalAmount: "$500",
      commissionAmount: "$50",
    },
    {
      id: 2,
      commissionId: "COM002",
      driverName: "Robert Brown",
      isAppVehicle: false,
      date: "2024-07-02",
      totalAmount: "$300",
      commissionAmount: "$30",
    },
    {
      id: 3,
      commissionId: "COM003",
      driverName: "William Davis",
      isAppVehicle: true,
      date: "2024-07-05",
      totalAmount: "$700",
      commissionAmount: "$70",
    },
  ];

  const [commissions, setCommissions] = useState(initialCommissions);
  const [filteredCommissions, setFilteredCommissions] = useState(initialCommissions);

  const tableColumns = [
    { key: "commissionId", label: t("Commission ID") },
    { key: "driverName", label: t("Driver Name") },
    {
      key: "isAppVehicle",
      label: t("App Vehicle?"),
      render: (row) => (row.isAppVehicle ? t("Yes") : t("No")),
    },    
    { key: "date", label: t("Date") },
    { key: "totalAmount", label: t("Total Amount") },
    { key: "commissionAmount", label: t("Commission Amount") },
  ];

  const handleSearch = (filters) => {
    const filtered = commissions.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.driverName.toLowerCase().includes(filters.search.toLowerCase());

      return matchesSearch;
    });

    setFilteredCommissions(filtered);
  };

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);
  const onActionClick = (e, row) => {
    navigate(`/CommissionDetails/${row.id}`);
  };
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
        title={t("Commissions")}
        subtitle={t("Commissions Details")}
        i18n={i18n}
        isExcel={true}
        isPdf={true}
        isPrinter={true}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent onSearch={handleSearch} isCommission={true} />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TableComponent
          columns={tableColumns}
          data={filteredCommissions}
          actionIconType="details"
          showStatusChange={false}
          onActionClick={onActionClick}
        />
      </Box>
    </Box>
  );
};

export default CommissionPage;
