import React, { useEffect, useMemo } from "react";
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
  Line,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../../components/LoadingComponent";
import { useSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../redux/slices/trip/thunk";

const periodOptions = ["daily", "weekly", "monthly"];

const Home = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchParams, setSearchParams] = useSearchParams();
  const initialDate = searchParams.get("date") || "";
  const initialPeriod = searchParams.get("period") || "weekly";

  const initialTab =
    periodOptions.indexOf(initialPeriod) !== -1
      ? periodOptions.indexOf(initialPeriod)
      : 1;

  const [searchDate, setSearchDate] = React.useState(initialDate);
  const [activeTab, setActiveTab] = React.useState(initialTab);

  const { dashboardStats, loading } = useSelector((state) => state.trip || {});

  // keep URL in sync and request new stats whenever period or date changes
  useEffect(() => {
    const period = periodOptions[activeTab];

    // clone and set params without mutating original searchParams directly
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("period", period);
    if (searchDate) sp.set("date", searchDate);
    else sp.delete("date");

    // push params to URL
    setSearchParams(sp, { replace: true });

    // dispatch fetch
    dispatch(getDashboardStats({ filter: period, date: searchDate || undefined }));
  }, [activeTab, searchDate, dispatch]); // intentionally not including searchParams or setSearchParams

  // derived safe values with fallbacks
  const keyMetrics = dashboardStats?.keyMetrics || {
    totalDrivers: 0,
    totalRiders: 0,
    totalTrips: 0,
    totalRevenue: 0,
  };

  const tripsOverview = dashboardStats?.tripsOverview || [];
  const activeNow = dashboardStats?.activeNow || { activeDrivers: 0, activeRiders: 0 };

  const formattedRevenue = useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(Number(keyMetrics.totalRevenue || 0));
    } catch {
      return keyMetrics.totalRevenue ?? 0;
    }
  }, [keyMetrics.totalRevenue]);

  // handle tab change
  const handleTabChange = (_, newVal) => {
    if (typeof newVal === "number") setActiveTab(newVal);
  };

  const handleSearch = () => {
    // effect will pick up searchDate change because it's in dependency array
    // we already store searchDate in state via the date input
    // nothing else needed here
  };

  if (loading) return <LoadingComponent />;

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

        {false && <Box sx={{ display: "flex", flexDirection: "row", width: isMobile ? "100%" : "50%" }}>
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
        </Box>}
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
        {periodOptions.map((option, idx) => (
          <Tab
            key={option}
            label={t(option)}
            sx={{
              flex: 1,
              mx: 0.5,
              borderRadius: 1,
              minHeight: 48,
              bgcolor: activeTab === idx ? theme.palette.primary.main : theme.palette.background.secDefault,
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
          { title: t("totalDrivers"), value: keyMetrics.totalDrivers },
          { title: t("totalPassengers") || t("totalRiders"), value: keyMetrics.totalRiders },
          { title: t("totalTrips"), value: keyMetrics.totalTrips },
          {
            title: t("totalRevenue"),
            value: formattedRevenue,
            suffix: t("SAR"),
          },
        ].map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <Card sx={{ bgcolor: "background.secDefault", height: "100%" }}>
              <CardContent>
                <Typography variant="body1">{metric.title}</Typography>
                <Typography variant="h5" sx={{ my: 1 }}>
                  {metric.value} {metric.suffix ? <span style={{ margin: "0 4px" }}>{metric.suffix}</span> : null}
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
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderColor: "primary.main", p: 2 }}>
            <Typography variant="subtitle1">{t("tripsOverTime")}</Typography>
            <Typography variant="h5">{keyMetrics.totalTrips}</Typography>

            <Box sx={{ width: "100%", height: 320, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tripsOverview}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Active Users */}
      <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
        {t("activeUsers")}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {[
          { title: t("activePassengers") || t("activeRiders"), value: activeNow.activeRiders },
          { title: t("activeDrivers"), value: activeNow.activeDrivers },
        ].map((metric) => (
          <Grid item xs={12} sm={6} key={metric.title}>
            <Card sx={{ bgcolor: "background.secDefault" }}>
              <CardContent>
                <Typography variant="body1">{metric.title}</Typography>
                <Typography variant="h5" sx={{ my: 1, fontWeight: "bold" }}>
                  {metric.value}
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
