import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";

const WaitingTimePage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const initialWaitingTimes = [
    {
      id: 1,
      waitingTimeId: "WT001",
      date: "2024-07-01",
      waitingTimeEnd: "2024-07-01 10:30",
      totalWaitingTime: "30 min",
      tripId: "TRIP123",
    },
    {
      id: 2,
      waitingTimeId: "WT002",
      date: "2024-07-02",
      waitingTimeEnd: "2024-07-02 14:15",
      totalWaitingTime: "45 min",
      tripId: "TRIP124",
    },
    {
      id: 3,
      waitingTimeId: "WT003",
      date: "2024-07-05",
      waitingTimeEnd: "2024-07-05 18:00",
      totalWaitingTime: "20 min",
      tripId: "TRIP125",
    },
  ];

  const [waitingTimes, setWaitingTimes] = useState(initialWaitingTimes);
  const [filteredWaitingTimes, setFilteredWaitingTimes] = useState(initialWaitingTimes);

  const tableColumns = [
    { key: "waitingTimeId", label: t("Waiting Time ID") },
    { key: "date", label: t("Date") },
    { key: "waitingTimeEnd", label: t("Waiting Time End") },
    { key: "totalWaitingTime", label: t("Total Waiting Time") },
    { key: "tripId", label: t("Trip ID") },
  ];

  const handleSearch = (filters) => {
    const filtered = waitingTimes.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.waitingTimeId.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.tripId.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDate = !filters.date || item.date === filters.date;

      return matchesSearch && matchesDate;
    });

    setFilteredWaitingTimes(filtered);
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
        title={t("Waiting Time")}
        subtitle={t("Waiting Time Details")}
        i18n={i18n}
        isExcel={true}
        isPdf={true}
        isPrinter={true}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent onSearch={handleSearch} isWaitingTime={true} />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TableComponent
          columns={tableColumns}
          data={filteredWaitingTimes}
          actionIconType="details"
          showStatusChange={false}
        />
      </Box>
    </Box>
  );
};

export default WaitingTimePage;
