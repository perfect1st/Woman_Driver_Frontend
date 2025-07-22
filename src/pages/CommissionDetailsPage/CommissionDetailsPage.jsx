import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarIcon from "@mui/icons-material/Star";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableComponent from "../../components/TableComponent/TableComponent";
import { ReactComponent as ExcelIcon } from "../../assets/xsl-02.svg";
import { ReactComponent as PdfIcon } from "../../assets/pdf-02.svg";
import { ReactComponent as PrinterIcon } from "../../assets/printer.svg";
import carImage from "../../assets/DomiCar.png";
import driverImage from "../../assets/DomiDriverImage.png";
export default function CommissionDetailsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(0);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (e, newVal) => setActiveTab(newVal);

  // State hooks for managing active tab, search date, and loading status
  const handleSearch = () => {
    navigate(`${location.pathname}?date=${searchDate}`);
  };

  return (
    <Box p={2} maxWidth={'md'}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Commission")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Commission")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/Commission")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Commission Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>#{id}</Typography>
      </Box>
      {/* Breadcrumb navigation */}

      {/* Filter Date */}
      <Typography fontWeight="bold" color="primary" mb={1}>
        {t("Filter Date")}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" flexDirection="row" width="100%" mb={3}>
  <TextField
    size="small"
    type="date"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
    fullWidth
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: isArabic ? "0 4px 4px 0" :"4px 0 0 4px",
      },
    }}
  />
  <Box
    component="button"
    onClick={handleSearch}
    style={{
      background: theme.palette.primary.main,
      color: "#fff",
      border: "1px solid rgba(0, 0, 0, 0.23)",
      padding: "0 16px",
      fontSize: "1rem",
      cursor: "pointer",
      fontWeight: "bold",
      borderRadius: isArabic ? "4px 0 0 4px" :"0 4px 4px 0",
      height: 40,
      whiteSpace: "nowrap",
    }}
  >
    {t("filter")}
  </Box>
</Box>


      {/* Driver Card */}
      <Card
        sx={{
          background: theme.palette.secondary.sec,
          mb: 3,
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Typography fontWeight="bold" color="primary" mb={1}>
            {t("Driver")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar src={driverImage} sx={{ width: 64, height: 64 }} />
            </Grid>
            <Grid item xs>
              <Typography fontWeight="bold">Driver Name</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2">4.8</Typography>
                <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" alignItems="center">
                <Box component="img" src={carImage} width={64} height={64} />
                <Box ml={2}>
                  <Typography fontWeight="bold">اوص 8298</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toyota Camry • White
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md="auto" sx={{ ml: "auto" }}>
              <Button
                variant="outlined"
                color="primary"
                disabled={loading}
                sx={{ borderWidth: 2, fontWeight: "bold", minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : t("View Profile")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs with Icons */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ "& .MuiTabs-flexContainer": { gap: 1 } }}
        >
          <Tab
            label={t("Commission Details")}
            sx={{
              fontWeight: activeTab === 0 ? "bold" : "normal",
              color:
                activeTab === 0 ? theme.palette.primary.main : "text.secondary",
            }}
          />
          <Tab
            label={t("History")}
            sx={{
              fontWeight: activeTab === 1 ? "bold" : "normal",
              color:
                activeTab === 1 ? theme.palette.primary.main : "text.secondary",
            }}
          />
        </Tabs>
        {activeTab === 1 && (
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="primary">
              <PdfIcon />
            </IconButton>
            <IconButton color="primary">
              <ExcelIcon />
            </IconButton>
            <IconButton color="primary">
              <PrinterIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Tab Content */}
      {activeTab === 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography fontWeight="bold" color="primary">
                  {t("Total Amount")}
                </Typography>
                <Typography variant="h5" fontWeight="bold" my={1}>
                  10,000
                </Typography>
                <Typography color="text.secondary">+12%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography fontWeight="bold" color="primary">
                  {t("Commission Amount")}
                </Typography>
                <Typography variant="h5" fontWeight="bold" my={1}>
                  7,620
                </Typography>
                <Typography color="text.secondary">10%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <>
          {/* Icons */}
          {/* Table with Dummy Data */}
          <TableComponent
  columns={[
    { key: "id", label: t("Commission ID") },
    { key: "time", label: t("Time") },
    { key: "totalAmount", label: t("Total Amount") },
    { key: "category", label: t("Commission Category") },
    { key: "commissionAmount", label: t("Commission Amount") },
  ]}
  data={[
    { id: "#1234", time: "12:30 PM", totalAmount: "10,000", category: "Ride", commissionAmount: "500" },
    { id: "#1235", time: "1:00 PM", totalAmount: "8,000", category: "Delivery", commissionAmount: "400" },
    { id: "#1236", time: "2:15 PM", totalAmount: "12,000", category: "Ride", commissionAmount: "600" },
  ]}
  dontShowActions={true}
/>
        </>
      )}
    </Box>
  );
}
