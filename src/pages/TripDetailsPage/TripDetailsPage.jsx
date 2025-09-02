// src/pages/Trips/TripDetailsPage.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RouteMap from "../RouteMap/RouteMap";
import { useDispatch, useSelector } from "react-redux";
import { getOneTrip } from "../../redux/slices/trip/thunk";
import LoadingPage from "../../components/LoadingComponent";
import useBaseImageUrl from "../../hooks/useBaseImageUrlForDriver";
import usePassengerBaseImageUrl from "../../hooks/useBaseImageUrl";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

const tripStatusStyles = {
  cancelled: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
    icon: <WarningIcon fontSize="small" sx={{ color: "#912018" }} />,
  },
  accepted: {
    textColor: "#1F2A37",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#1F2A37" }} />,
  },
  requested: {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
    icon: <AccessTimeIcon fontSize="small" sx={{ color: "#93370D" }} />,
  },
  complete: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />,
  },
  start: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
    icon: <AccessTimeIcon fontSize="small" sx={{ color: "#1849A9" }} />,
  },
};

export default function TripDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const baseImageUrl = useBaseImageUrl();
  const passengerBaseImageUrl = usePassengerBaseImageUrl();

  const [activeTab, setActiveTab] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRider, setLoadingRider] = useState(false);
  const [loadingDriver, setLoadingDriver] = useState(false);
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Trips");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit")
  const hasDeletePermission = hasPermission("delete")

  // Redux: slice.one holds { trip, loading }
  const { trip, loading } = useSelector((s) => s.trip);

  console.log("trip",trip)
  useEffect(() => {
    dispatch(getOneTrip(id));
  }, [dispatch, id]);

  if (loading || !trip) {
    return (

        <LoadingPage />
    );
  }

  // Normalize status key to lowercase for our styles map
  const statusKey = trip.trips_status?.toLowerCase();
  const styles = tripStatusStyles[statusKey] || {};

  // Build details object
  const details = {
    date: new Date(trip.createdAt).toLocaleDateString(),
    time: `${new Date(trip.createdAt).toLocaleTimeString()} - ${new Date(
      trip.updatedAt
    ).toLocaleTimeString()}`,
    distance: `${trip.kilos_number} km`,
    carType: isArabic ? trip.car_types_id?.name_ar :trip.car_types_id?.name_en || t("N/A"),
    fare: `${trip.cost}`,
    waiting: `${trip.total_waiting_minutes_cost}`,
    waitingTime: `${trip.waitings?.length} ${t("stops")}`,
    tripType: trip.is_scheduled ? t("Scheduled") : t("On Demand"),
    payment: isArabic ? trip.payment_method_id?.name_ar : trip.payment_method_id?.name_en || t("N/A"),
  };

  // Build timeline: first pickup, then any waitings, then dropoff
  const timeline = [
    {
      type: "Pickup",
      time: new Date(trip.createdAt).toLocaleTimeString(),
      address: `${trip?.from_name || ""}`,
    },
  
    // كل الانتظارات
    ...(trip.waitings || []).map((w, index) => {
      const start = new Date(w.waitings_start);
      const end = new Date(w.waitings_end);
      const durationMinutes = Math.round((end - start) / 1000 / 60);
  
      return {
        type: "Waiting",
        time: `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()} (${durationMinutes} ${t("common.mins")})`,
        address: `${t("waitingPeriod")} #${index + 1}`,
      };
    }),
  
    {
      type: "Dropoff",
      time: new Date(trip.updatedAt).toLocaleTimeString(),
      address: `${trip?.to_name || ""}`,
    },
  ];
  
  

  const handleTabChange = (_, v) => setActiveTab(v);

  const handleViewProfile = (type) => {
       if (type === "rider") {
         setLoadingRider(true);
         setLoadingRider(false);
         navigate(`/riderDetails/${trip.user_id._id}`);
       } else if (type === "driver" && trip.driver_id) {
         setLoadingDriver(true);
         setLoadingDriver(false);
         navigate(`/driverDetails/${trip.driver_id._id}`);
       
       }
     };

     if (!hasViewPermission) return <Navigate to="/profile" />;

  return (
    <Box p={isMobile ? 1 : 2} maxWidth="md">
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Trips")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Trips")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/Trips")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Trips Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>#{trip?.trip_number}</Typography>
      </Box>

      {/* Header */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        mb={2}
        gap={1}
      >
        <Typography variant="h5" fontWeight="bold">
          {t("Trip Details")}
        </Typography>
      </Box>

      {/* Tabs + Status */}
      <Box sx={{ mb: 2, position: "relative" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ "& .MuiTabs-flexContainer": { gap: 1 } }}
          >
            <Tab
              label={t("Trip Details")}
              sx={{
                p: 1,
                fontWeight: activeTab === 0 ? "bold" : "normal",
                color:
                  activeTab === 0
                    ? theme.palette.primary.main
                    : "text.secondary",
              }}
            />
            <Tab
              label={t("Trip Track")}
              sx={{
                p: 1,
                fontWeight: activeTab === 1 ? "bold" : "normal",
                color:
                  activeTab === 1
                    ? theme.palette.primary.main
                    : "text.secondary",
              }}
            />
          </Tabs>

          <Chip
            label={t(trip.trips_status)}
            icon={styles.icon}
            sx={{
              color: styles.textColor,
              backgroundColor: styles.bgColor,
              border: `1px solid ${styles.borderColor}`,
              fontWeight: "bold",
              borderRadius: 1,
              px: 1.5,
              py: 0.5,
              height: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: theme.palette.divider,
          }}
        />
      </Box>

      {activeTab === 0 ? (
        // Trip Details
        <Box>
          {/* Rider Card */}
          <Card
            sx={{
              mb: 2,
              boxShadow: "none",
              background: theme.palette.secondary.sec,
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
                color="primary"
              >
                {t("Rider")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar
                    src={`${passengerBaseImageUrl}${trip?.user_id?.profile_image}`}
                    sx={{ width: 64, height: 64 }}
                  >
                    {!trip?.user_id?.profile_image &&
                      trip?.user_id?.fullname.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">
                    {trip?.user_id?.fullname}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2">
                      {trip?.user_id?.rate || 5}
                    </Typography>
                    <StarIcon
                      fontSize="small"
                      color="primary"
                      sx={{ ml: 0.5 }}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewProfile("rider")}
                    disabled={loadingRider}
                    sx={{ borderWidth: 2, fontWeight: "bold", minWidth: 120 }}
                  >
                    {loadingRider ? (
                      <CircularProgress size={24} />
                    ) : (
                      t("View Profile")
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Driver Card (if any) */}
          {trip.driver_id && (
            <Card
              sx={{
                mb: 3,
                boxShadow: "none",
                background: theme.palette.secondary.sec,
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  mb={1}
                  color="primary"
                >
                  {t("Driver")}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={`${baseImageUrl}${trip.driver_id.profile_image}`}
                      sx={{ width: 64, height: 64 }}
                    >
                      {!trip.driver_id.profile_image &&
                        trip.driver_id.fullname.charAt(0)}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography fontWeight="bold">
                      {trip.driver_id.fullname}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2">
                        {trip.driver_id.rate || 5}
                      </Typography>
                      <StarIcon
                        fontSize="small"
                        color="primary"
                        sx={{ ml: 0.5 }}
                      />
                    </Box>
                  </Grid>

                  {/* Car Info if provided */}
                  {trip.car_snapshot && (
                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src={`${baseImageUrl}${trip.car_snapshot.car_images[0]?.front}`}
                          alt={trip.car_snapshot.car_model}
                          sx={{ width: 64, height: 64, objectFit: "contain" }}
                        />
                        <Box ml={2}>
                          <Typography fontWeight="bold">
                            {trip.car_snapshot.plate_number}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trip.car_snapshot.car_model} •{" "}
                            {trip.car_snapshot.car_color}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} md="auto" sx={{ ml: "auto" }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewProfile("driver")}
                      disabled={loadingDriver}
                      sx={{
                        borderWidth: 2,
                        fontWeight: "bold",
                        minWidth: 120,
                        mt: isMobile ? 2 : 0,
                      }}
                    >
                      {loadingDriver ? (
                        <CircularProgress size={24} />
                      ) : (
                        t("View Profile")
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Other Details */}
          <Typography variant="h6" mb={2} color="primary">
            {t("Other Details")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding sx={{ borderRadius: 2, overflow: "hidden" }}>
            {Object.entries(details).map(([key, value], index) => (
              <ListItem
                key={key}
                sx={{
                  bgcolor: index % 2 === 0 ? theme.palette.secondary.sec : "background.paper",
                  py: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  color: key === "payment" ? theme.palette.text.blue : "inherit"
                }}
              >
                <Typography variant="body1" fontWeight="medium">
                  {t(key)}
                </Typography>
                <Typography 
                  fontWeight="bold"
                  sx={{ color: key === "payment" ? theme.palette.text.blue : "inherit" }}
                >
                  {value}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        // Trip Track Tab
        <Box>
          <Box sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
            <RouteMap
              fromLat={trip.from_lng_lat?.coordinates[1]}
              fromLng={trip.from_lng_lat?.coordinates[0]}
              toLat={trip.to_lng_lat?.coordinates[1]}
              toLng={trip.to_lng_lat?.coordinates[0]}
            />
          </Box>
          <Typography variant="h6" mb={2} color="primary">
            {t("Trip Timeline")}
          </Typography>
          <Box
            sx={{
              position: "relative",
              pl: isArabic ? 0 : 4,
              pr: isArabic ? 4 : 0,
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                [isArabic ? "right" : "left"]: 8,
                top: 4,
                bottom: 0,
                width: 2,
                bgcolor: theme.palette.primary.main,
                zIndex: 1,
              }}
            />
            {timeline?.map((step, idx, arr) => {
              const isFirst = idx === 0;
              const isLast = idx === arr.length - 1;
              return (
                <Box key={idx} sx={{ position: "relative", mb: 4, zIndex: 2 }}>
                  <FiberManualRecordIcon
                    fontSize="small"
                    sx={{
                      color: theme.palette.primary.main,
                      position: "absolute",
                      [isArabic ? "right" : "left"]: -33,
                      top: isFirst ? 0 : isLast ? "calc(100% - 12px)" : "50%",
                      transform:
                        isFirst || isLast ? "none" : "translateY(-50%)",
                    }}
                  />
                  <Box
                    sx={{
                      ml: isArabic ? 0 : 4,
                      mr: isArabic ? 4 : 0,
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    <Typography fontWeight="bold">{t(step.type)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.time}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      mt={0.5}
                      flexDirection={isArabic ? "row-reverse" : "row"}
                    >
                      <LocationOnIcon
                        fontSize="small"
                        color="primary"
                        sx={{ [isArabic ? "ml" : "mr"]: 1 }}
                      />
                      <Typography variant="body2">{step.address}</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
