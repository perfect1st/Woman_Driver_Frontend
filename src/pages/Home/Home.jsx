import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../../components/LoadingComponent";
import { useSearchParams } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

const Home = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == 'ar'
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const periodOptions = ["day", "week", "month"];
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDate = searchParams.get("date") || "";
  const initialPeriod = searchParams.get("period") || "week"; // default to 'week'
  const [searchDate, setSearchDate] = useState(initialDate);
  const [activeTab, setActiveTab] = useState(
    periodOptions.indexOf(initialPeriod) !== -1
      ? periodOptions.indexOf(initialPeriod)
      : 1
  );
  
  const tripsData = [
    { day: "mon", trips: 400 },
    { day: "tue", trips: 300 },
    { day: "wed", trips: 200 },
    { day: "thu", trips: 500 },
    { day: "fri", trips: 800 },
    { day: "sat", trips: 700 },
    { day: "sun", trips: 600 },
  ];

  const citiesData = [
    { city: "City A", trips: 400 },
    { city: "City B", trips: 700 },
    { city: "City C", trips: 300 },
    { city: "City D", trips: 900 },
    { city: "City E", trips: 500 },
    { city: "City F", trips: 400 },
    { city: "City G", trips: 700 },
    { city: "City H", trips: 300 },
    { city: "City I", trips: 900 },
  ];
  const maxValue = Math.max(...citiesData.map((item) => item.trips));

  const handleTabChange = (_, newVal) => {
    setActiveTab(newVal);
    searchParams.set("period", periodOptions[newVal]);
    setSearchParams(searchParams);
  };
  
  const handleSearch = () => {
    if (searchDate) {
      searchParams.set("date", searchDate);
    } else {
      searchParams.delete("date");
    }
    setSearchParams(searchParams);
  };

  // return (
  //   <LoadingComponent />
  // )

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Typography variant="h6">{t("home")}</Typography>
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mt: 1,
    width: "100%",
    flexWrap: "wrap",
    gap: 2,
  }}
>
  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
    {t("overview")}
  </Typography>

  <Box
  sx={{
    display: "flex",
    flexDirection: "row",
    width: "50%",
  }}
>
  <TextField
    size="small"
    type="date"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
    fullWidth
    sx={{
      "& .MuiOutlinedInput-root": {
        borderTopLeftRadius: isArabic ? 0 : "4px",
        borderBottomLeftRadius: isArabic ? 0 : "4px",
        borderTopRightRadius: isArabic ? "4px" : 0,
        borderBottomRightRadius: isArabic ? "4px" : 0,
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
      borderLeft: isArabic ? "1px solid rgba(0, 0, 0, 0.23)" : "none",
      borderRight: isArabic ? "none" : "1px solid rgba(0, 0, 0, 0.23)",
      padding: "0 16px",
      fontSize: "1rem",
      cursor: "pointer",
      fontWeight: "bold",
      borderTopLeftRadius: isArabic ? "4px" : 0,
      borderBottomLeftRadius: isArabic ? "4px" : 0,
      borderTopRightRadius: isArabic ? 0 : "4px",
      borderBottomRightRadius: isArabic ? 0 : "4px",
      height: 40,
    }}
  >
    {t("filter")}
  </Box>
</Box>


</Box>



      {/* Tabs */}
      <Tabs
  value={activeTab}
  onChange={handleTabChange}
  variant="fullWidth"
  sx={{
    mt: 2,
    backgroundColor: theme.palette.background.secDefault,
    borderRadius: 1,
    "& .MuiTabs-indicator": { display: "none" },
  }}
>
  {periodOptions.map((option, index) => (
    <Tab
      key={option}
      label={t(option)}
      sx={{
        flex: 1,
        mx: 0.5,
        borderRadius: 1,
        minHeight: 48,
        bgcolor:
          activeTab === index
            ? theme.palette.primary.main
            : theme.palette.background.secDefault,
        color: theme.palette.primary.main,
        "&.Mui-selected": { color: "#fff" },
      }}
    />
  ))}
</Tabs>


      {/* Key Metrics */}
      <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
        {t("keyMetrics")}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {[
          { title: t("totalDrivers"), value: "1,250", change: "+10%" },
          { title: t("totalPassengers"), value: "2,500", change: "+12%" },
          { title: t("totalTrips"), value: "15,320", change: "+5%" },
          { title: t("totalRevenue"), value: "250,000", change: "+8%" },
        ].map((metric, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ bgcolor: "background.secDefault", height: "100%" }}>
              <CardContent>
                <Typography variant="body1">{metric.title}</Typography>
                <Typography variant="h5" sx={{ my: 1 }}>
                  {metric.value}{" "}
                  {metric?.title == t("totalRevenue") ? (
                    <span style={{ margin: "0 2px" }}>{t("SAR")}</span>
                  ) : (
                    ""
                  )}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  {metric.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Trips Overview */}
      <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
        {t("tripsOverview")}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{ borderColor: "primary.main", p: 2, height: 250 }}
          >
            <Typography variant="subtitle1">{t("tripsOverTime")}</Typography>
            <Typography variant="h5">1,500</Typography>
            <ResponsiveContainer width="100%" height="70%">
              <LineChart data={tripsData} className="no-focus-outline">
                <Line
                  type="monotone"
                  dataKey="trips"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                />
                <XAxis dataKey="day" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{ borderColor: "primary.main", p: 2, height: 250 }}
          >
            <Typography variant="subtitle1">{t("tripsByCity")}</Typography>
            <Typography variant="h5">3,000</Typography>
            <ResponsiveContainer width="100%" height="70%">
              <BarChart data={citiesData}>
                <XAxis dataKey="city" axisLine={false} tickLine={false} />
                <Bar
                  dataKey="trips"
                  stackId="a"
                  fill={theme.palette.primary.main} // الجزء المملوء
                  barSize={30}
                  radius={[0, 0, 4, 4]}
                  />
                <Bar
                  dataKey={(data) => maxValue - data.trips} // الجزء الفارغ
                  stackId="a"
                  fill={theme.palette.background.default} 
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Active Users */}
      <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
        {t("activeUsers")}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {[
          { title: t("activePassengers"), value: "1,500", change: "+12%" },
          { title: t("activeDrivers"), value: "1,000", change: "+10%" },
        ].map((metric, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card sx={{ bgcolor: "background.secDefault" }}>
              <CardContent>
                <Typography variant="body1">{metric.title}</Typography>
                <Typography variant="h5" sx={{ my: 1, fontWeight: "bold" }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  {metric.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
