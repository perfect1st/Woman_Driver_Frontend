import React, { useEffect, useState } from "react";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StarIcon from "@mui/icons-material/Star";
import TableComponent from "../../components/TableComponent/TableComponent";
import { ReactComponent as ExcelIcon } from "../../assets/xsl-02.svg";
import { ReactComponent as PdfIcon } from "../../assets/pdf-02.svg";
import { ReactComponent as PrinterIcon } from "../../assets/printer.svg";
import { getOneDailyCommission } from "../../redux/slices/dailyCommissions/thunk";
import { useDispatch, useSelector } from "react-redux";
import useBaseImageUrlForDriver from "../../hooks/useBaseImageUrlForDriver";

export default function CommissionDetailsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { dailyCommission } = useSelector((state) => state.dailyCommissions);
  let commissonPercentage = 0;

  if (dailyCommission?.data?.driver_id?.user_type === "driver_with_car") {
    commissonPercentage =
      dailyCommission?.data?.commission_category_id
        ?.commission_value_driver_with_car || 0;
  } else if (dailyCommission?.data?.driver_id?.user_type === "driver_company") {
    commissonPercentage =
      dailyCommission?.data?.commission_category_id
        ?.commission_value_driver_company || 0;
  }
  

  // fetch commission on mount and on search
  useEffect(() => {
    dispatch(
      getOneDailyCommission({
        id,
        query: searchDate ? `?date=${searchDate}` : "",
      })
    );
  }, [dispatch, id, searchDate]);

  const handleTabChange = (e, newVal) => setActiveTab(newVal);

  const handleSearch = () => {
    navigate(`${location.pathname}?date=${searchDate}`);
  };
  const baseImageUrl = useBaseImageUrlForDriver();

  const driver = dailyCommission?.data?.driver_id;
  const car = driver?.current_car;
  const trips = dailyCommission?.data?.trips_array || [];






const handleExport = (type) => {
  if (!trips || trips.length === 0) return;

  const exportData = trips.map((trip, idx) => ({
    "Trip #": trip.trip_number,
    "Start Time": new Date(trip.trip_start_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    "End Time": new Date(trip.trip_end_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    "Total Amount": trip.cost,
    "Trip Commission": (trip.cost * commissonPercentage) / 100,
  }));

  if (type === "excel") {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trips");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `Trips_${new Date().toISOString()}.xlsx`);
  } else if (type === "pdf") {
    const doc = new jsPDF();
    doc.text("Trips Report", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [Object.keys(exportData[0])],
      body: exportData.map((row) => Object.values(row)),
    });
    doc.save(`Trips_${new Date().toISOString()}.pdf`);
  } else if (type === "print") {
    const printableWindow = window.open("", "_blank");
    const htmlContent = `
      <html>
        <head>
          <title>Trips Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Trips Report</h2>
          <table>
            <thead>
              <tr>${Object.keys(exportData[0])
                .map((key) => `<th>${key}</th>`)
                .join("")}</tr>
            </thead>
            <tbody>
              ${exportData
                .map(
                  (row) =>
                    `<tr>${Object.values(row)
                      .map((value) => `<td>${value}</td>`)
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printableWindow.document.write(htmlContent);
    printableWindow.document.close();
    printableWindow.print();
  }
};



  return (
    <Box p={2} maxWidth={"md"}>
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
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
                    onClick={() => navigate("/Commission")}
        >
          {t("Commission Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>#{id}</Typography>
      </Box>

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
              borderRadius: isArabic ? "0 4px 4px 0" : "4px 0 0 4px",
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
            borderRadius: isArabic ? "4px 0 0 4px" : "0 4px 4px 0",
            height: 40,
            whiteSpace: "nowrap",
          }}
        >
          {t("filter")}
        </Box>
      </Box>

      {/* Driver Card */}
      {driver && (
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
                <Avatar
                  src={`${baseImageUrl}${driver?.profile_image || "uploads/users/default.png"}`}
                  sx={{ width: 64, height: 64 }}
                />
              </Grid>
              <Grid item xs>
                <Typography fontWeight="bold">{driver?.fullname}</Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">
                    {driver?.ratings?.average?.toFixed(1) || 0}
                  </Typography>
                  <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                {car && (
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src={`${baseImageUrl}${car?.car_images?.front}`}
                      width={64}
                      height={64}
                      alt="car"
                    />
                    <Box ml={2}>
                      <Typography fontWeight="bold">
                        {car?.plate_number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {car?.car_model} • {car?.car_color}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md="auto" sx={{ ml: "auto" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={loading}
                  sx={{ borderWidth: 2, fontWeight: "bold", minWidth: 120 }}
                  onClick={() => navigate(`/DriverDetails/${driver?._id}`)}
                >
                  {loading ? <CircularProgress size={24} /> : t("View Profile")}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
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
    <IconButton color="primary" onClick={() => handleExport("pdf")}>
      <PdfIcon />
    </IconButton>
    <IconButton color="primary" onClick={() => handleExport("excel")}>
      <ExcelIcon />
    </IconButton>
    <IconButton color="primary" onClick={() => handleExport("print")}>
      <PrinterIcon />
    </IconButton>
  </Box>
)}
      </Box>

      {/* Tab Content */}
      {activeTab === 0 ? (
        <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: theme.palette.secondary.sec,
              display: "flex",
              flexDirection: "column",
              height: "100%", // يخلي الكارت ياخد ارتفاع العمود بالكامل
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography>{t("Total Amount")}</Typography>
              <Typography variant="h5" fontWeight="bold" my={1}>
                {dailyCommission?.data?.total_amount || 0}
              </Typography>
              <Typography color={theme.palette.secondary.sec}> - </Typography>
            </CardContent>
          </Card>
        </Grid>
      
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: theme.palette.secondary.sec,
              display: "flex",
              flexDirection: "column",
              height: "100%", // نفس الفكرة
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography>{t("Commission Amount")}</Typography>
              <Typography variant="h5" fontWeight="bold" my={1}>
                {dailyCommission?.data?.commission_amount || 0}
              </Typography>
              <Typography color="primary">
               +{" "} {dailyCommission?.data?.driver_id?.user_type === "driver_with_car"
                  ? dailyCommission?.data?.commission_category_id
                      ?.commission_value_driver_with_car
                  : dailyCommission?.data?.commission_category_id
                      ?.commission_value_driver_company}{" "}
                %
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      ) : (
        <TableComponent
        columns={[
          { key: "trip_number", label: t("Trip Number") },
          { key: "start_time", label: t("Start Time") },
          { key: "end_time", label: t("End Time") },
          { key: "cost", label: t("Total Amount") },
          { key: "trip_commisson", label: t("Trip Commisson") },
        ]}
        data={trips.map((trip) => ({
          trip_number: trip.trip_number,
          start_time: new Date(trip.trip_start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          end_time: new Date(trip.trip_end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          cost: trip.cost,
          trip_commisson: trip.cost * commissonPercentage / 100,
        }))}
        
        
          
          dontShowActions={true}
        />
      )}
    </Box>
  );
}
