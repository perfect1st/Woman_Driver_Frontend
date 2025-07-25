import React from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RouteMap from "../RouteMap/RouteMap";

export default function WaitingTimesDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { waitingTimeId } = useParams();

  const waitingData = {
    date: "2023-07-20",
    time: "02:30 PM",
    waitingTime: "18 min",
    tripId: "32654",
    lat: 30.0444,
    lng: 31.2357,
    location: "123 Main St, Cairo",
  };


  return (
    <Box p={isMobile ? 1 : 2} maxWidth="md">
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/WaitingTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Waiting Times")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/WaitingTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Waiting Times Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>#{waitingTimeId || waitingData.tripId}</Typography>
      </Box>

      {/* Location Details Title */}
      <Typography variant="h5" fontWeight="bold" color="primary" mb={0.5}>
        {t("Location Details")}
      </Typography>

      {/* Underline */}
      <RouteMap fromLat={30.0444} fromLng={31.2357} toLat={30.0720} toLng={31.3460} />





      {/* Other Details Title */}
      <Typography variant="h6" color="primary" mb={0.5}>
        {t("Other Details")}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Details List */}
      <List disablePadding>
  {[
    { key: "Date", value: waitingData.date },
    { key: "Time", value: waitingData.time },
    { key: "Waiting Time", value: waitingData.waitingTime },
    {
      key: "Trip ID",
      value: (
        <Typography
          onClick={() => navigate(`/TripDetails/${waitingData.tripId}`)}
          sx={{
            color: theme.palette.primary.main,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          #{waitingData.tripId}
        </Typography>
      ),
    },
  ].map((item, index) => (
    <ListItem
      key={item.key}
      sx={{
        bgcolor: index % 2 === 0 ? theme.palette.secondary.sec : "background.paper",
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
