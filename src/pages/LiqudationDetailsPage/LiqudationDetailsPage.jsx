// LiqudationDetailsPage.jsx
import React from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RouteMap from "../RouteMap/RouteMap";

export default function LiqudationDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { waitingTimeId } = useParams(); // زي ما كان في التصميم الأصلي

  // --- بيانات تجريبية: عوّضها ببيانات من API حسب حاجتك ---
  const sampleData = [
    {
      _id: "LQ001",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
      status: "completed",
      driverName: "gomaa",
      phoneNumber: "01008974112",
      totalBalance: 150.0,
      address: "Cairo Tower, Gezira, Cairo",
      lat: 30.0444,
      lng: 31.2357,
      notes: "All receipts submitted",
    },
    {
      _id: "LQ002",
      startDate: "2024-07-10",
      endDate: "2024-07-12",
      status: "pending",
      driverName: "mohamed",
      phoneNumber: "1231231231",
      totalBalance: -75.5,
      address: "El-Nasr st, Nasr City, Cairo",
      lat: null,
      lng: null,
      notes: "Missing invoice #23",
    },
  ];

  // اختر السجل المطلوب أو الافتراضي
  const current =
    sampleData.find((s) => s._id === waitingTimeId) || sampleData[0];

  return (
    <Box p={isMobile ? 1 : 2} maxWidth="md">
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Liqudation")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Liquidations")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/Liqudation")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Liquidation Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>#{waitingTimeId || current._id}</Typography>
      </Box>



      {/* Other Details Title */}
      <Typography variant="h6" color="primary" mb={0.5}>
      {t("Liquidation Details")}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Details List — نفس طريقة التنسيق في صفحتك */}
      <List disablePadding>
        {[
          { key: "Date Range", value: `${current.startDate} — ${current.endDate}` },
          { key: "Driver Name", value: current.driverName },
          { key: "Phone Number", value: current.phoneNumber },
          { key: "Status", value: current.status },
          { key: "Total Balance", value: current.totalBalance?.toFixed(2) ?? "-" },
         
          { key: "Notes", value: current.notes || "-" },
        ].map((item, index) => (
          <ListItem
            key={item.key}
            sx={{
              bgcolor: index % 2 === 0 ? theme.palette.secondary.sec || "#f7f7f7" : "background.paper",
              py: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                textAlign: "start",
              }}
            >
              <Box sx={{ width: "40%", pl: 1 }}>
                <Typography fontWeight="medium">{t(item.key)}</Typography>
              </Box>
              <Box sx={{ width: "60%", pr: 1 }}>
                {typeof item.value === "string" ? (
                  <Typography fontWeight="bold">{item.value}</Typography>
                ) : (
                  item.value
                )}
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
