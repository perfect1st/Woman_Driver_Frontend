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

const Home = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState(1);

  // Dummy data
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

  // return (
  //   <LoadingComponent />
  // )

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Typography variant="h6">{t("home")}</Typography>
      <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
        {t("overview")}
      </Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newVal) => setActiveTab(newVal)}
        variant="fullWidth"
        sx={{
          mt: 2,
          backgroundColor: theme.palette.background.secDefault,
          borderRadius: 1,
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {[t("daily"), t("weekly"), t("monthly")].map((label, index) => (
          <Tab
            key={index}
            label={label}
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
              "&.Mui-selected": {
                color: "#ffffff",
              },
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
