import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const CommissionCategoryPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const initialCategories = [
    {
      id: 1,
      commissionValue: "10%",
      carTypes: ["Sedan", "SUV"],
      amountFrom: 100,
      amountTo: 500,
      status: "Available",
    },
    {
      id: 2,
      commissionValue: "15%",
      carTypes: ["Van"],
      amountFrom: 500,
      amountTo: 1000,
      status: "Rejected",
    },
    {
      id: 3,
      commissionValue: "5%",
      carTypes: ["Sedan"],
      amountFrom: 50,
      amountTo: 200,
      status: "Available",
    },
  ];

  const statusOptions = ["Available", "Rejected"];
  const [categories, setCategories] = useState(initialCategories);
  const [filteredCategories, setFilteredCategories] = useState(initialCategories);

  const tableColumns = [
    { key: "id", label: t("Commission Category ID") },
    { key: "commissionValue", label: t("Commission Value") },
    {
      key: "carTypes",
      label: t("Car Types"),
      render: (row) => row.carTypes.join(", "),
    },
    { key: "amountFrom", label: t("Amount From") },
    { key: "amountTo", label: t("Amount To") },
    { key: "status", label: t("Status") },
  ];

  const carTypeOptions = [
    { _id: "1", name: "Sedan" },
    { _id: "2", name: "SUV" },
    { _id: "3", name: "Truck" },
    { _id: "4", name: "Van" },
  ];

  const handleSearch = (filters) => {
    const filtered = categories.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.id.toString().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || item.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredCategories(filtered);
  };

  const handleStatusChange = (row, newStatus) => {
    const updated = categories.map((item) =>
      item.id === row.id ? { ...item, status: newStatus } : item
    );
    setCategories(updated);
    setFilteredCategories(updated);
  };

  const handleViewDetails = (row) => {
    navigate(`/CommissionCategoryDetails/${row.id}`);
  };

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const handleAddCategory = () => {
    navigate("/CommissionCategory/AddCommissionCategory");
  };

  return (
    <Box
      sx={{
        p: isSmallScreen ? 2 : 3,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        title={t("Commission Categories")}
        subtitle={t("Commission Categories Details")}
        haveBtn={true}
        i18n={i18n}
        btn={t("Add Commission Category")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={handleAddCategory}
        isExcel={true}
        isPdf={true}
        isPrinter={true}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          statusOptions={statusOptions}
          isCommissionCategory={true}
          carTypeOptions={carTypeOptions}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TableComponent
          columns={tableColumns}
          data={filteredCategories}
          onStatusChange={handleStatusChange}
          onViewDetails={handleViewDetails}
          statusKey="status"
          showStatusChange={true}
          isCommissionCategory={true}
        />
      </Box>
    </Box>
  );
};

export default CommissionCategoryPage;
