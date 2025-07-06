import React, { useState } from "react";
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
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";

// Icons for status
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Trip status styles
const tripStatusStyles = {
  Cancelled: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
    icon: <WarningIcon fontSize="small" sx={{ color: "#912018" }} />,
  },
  Complete: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />,
  },
  "On Request": {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
    icon: <AccessTimeIcon fontSize="small" sx={{ color: "#93370D" }} />,
  },
  "Approved by driver": {
    textColor: "#1F2A37",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#1F2A37" }} />,
  },
  Start: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
    icon: <AccessTimeIcon fontSize="small" sx={{ color: "#1849A9" }} />,
  },
};

// Mock trip data
const trip = {
  id: "72641",
  status: "Complete",
  rider: {
    name: "Emma Davis",
    id: "#4141321",
    image: DomiDriverImage,
    rating: 4.89,
  },
  driver: {
    name: "Sophia Carter",
    id: "#DRV12345",
    image: DomiDriverImage,
    rating: 4.8,
    car: {
      plate: "اوص 8298",
      color: "White",
      brand: "Toyota Camry",
      image: DomiCar,
      type: "Standard",
    },
  },
  details: {
    date: "2023-05-15",
    time: "03:06 PM - 04:05 PM",
    distance: "5.2 km",
    carType: "Standard",
    fare: "EGP 45.00",
    waiting: "EGP 5.00",
    waitingTime: "24 min",
    payment: "Cash",
  },
  timeline: [
    { type: "Pickup", time: "03:06 PM", address: "123 Main St, Anytown" },
    { type: "Waiting", time: "03:30 PM", address: "579 Anytown, Main St" },
    { type: "Dropoff", time: "04:05 PM", address: "456 Oak Ave, Anytown" },
  ],
};

export default function TripDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const status = trip.status;
  const styles = tripStatusStyles[status] || {};

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewProfile = (type) => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      if (type === "rider") {
        navigate(`/riderDetails/${trip.rider.id}`);
      } else {
        navigate(`/driverDetails/${trip.driver.id}`);
      }
    }, 1000);
  };

  return (
    <Box p={isMobile ? 1 : 2}>
      {/* Breadcrumb */}

      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate('/Trips')}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Trips")}
        </Typography>
        <Typography mx={1}>/</Typography>
        <Typography
          onClick={() => navigate('/Trips')}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Trips Details")}
        </Typography>
        <Typography mx={1}>/</Typography>
        <Typography>#{tripId || trip.id}</Typography>
      </Box>

      {/* Header with tabs and status */}
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

<Box sx={{ mb: 2, position: "relative" }}>
  <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
    {/* Tabs */}
    <Tabs 
      value={activeTab} 
      onChange={handleTabChange} 
      sx={{ 
        minHeight: "auto",
        "& .MuiTabs-flexContainer": { gap: 1 }
      }}
    >
      <Tab 
        label={t("Trip Details")} 
        sx={{ 
          minHeight: "auto",
          minWidth: "auto",
          p: 1,
          mb: 1 ,
          fontWeight: activeTab === 0 ? "bold" : "normal",
          color: activeTab === 0 ? theme.palette.primary.main : "text.secondary",
          // borderBottom: activeTab === 0 ? `2px solid ${theme.palette.primary.main}` : "none"
        }} 
      />
      <Tab 
        label={t("Trip Track")} 
        sx={{ 
          minHeight: "auto",
          minWidth: "auto",
          p: 1,
          mb: 1 ,
          fontWeight: activeTab === 1 ? "bold" : "normal",
          color: activeTab === 1 ? theme.palette.primary.main : "text.secondary",
          // borderBottom: activeTab === 1 ? `2px solid ${theme.palette.primary.main}` : "none"
        }} 
      />
    </Tabs>

    {/* Status Chip */}
    <Chip
      label={t(status)}
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

  {/* Full-width underline */}
  <Box
    sx={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "2px",
      backgroundColor: theme.palette.divider,
      zIndex: 0,
    }}
  />
</Box>


      {/* Tab Content */}
      {activeTab === 0 ? (
        // Trip Details Tab
        <Box>
          {/* Rider Card */}
          <Card sx={{ 
            background: theme.palette.secondary.sec, 
            mb: 2,
            boxShadow: "none"
          }}>
            <CardContent>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                mb={1}
                color="primary"
              >
                {t("Rider")}
              </Typography>
              <Divider sx={{ mb: 2}} />
              
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
                      fontSize: 24,
                    }}
                    src={trip.rider.image || undefined}
                  >
                    {!trip.rider.image && trip.rider.name.charAt(0)}
                  </Avatar>
                </Grid>
                
                <Grid item xs>
                  <Typography fontWeight="bold">{trip.rider.name}</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2">{trip.rider.rating}</Typography>
                    <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
                  </Box>
                </Grid>
                
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewProfile("rider")}
                    disabled={loading}
                    sx={{ 
                      borderWidth: 2,
                      fontWeight: "bold",
                      minWidth: 120
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : t("View Profile")}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Driver Card */}
          <Card sx={{ 
            background: theme.palette.secondary.sec,
            mb: 3,
            boxShadow: "none"
          }}>
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
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
                      fontSize: 24,
                    }}
                    src={trip.driver.image || undefined}
                  >
                    {!trip.driver.image && trip.driver.name.charAt(0)}
                  </Avatar>
                </Grid>
                
                <Grid item xs>
                  <Typography fontWeight="bold">{trip.driver.name}</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2">{trip.driver.rating}</Typography>
                    <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
                  </Box>
                </Grid>
                
                {/* Car Info */}
                <Grid item xs={12} md={5}>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src={trip.driver.car.image}
                      alt={trip.driver.car.brand}
                      sx={{
                        width: 64,
                        height: 64,
                        objectFit: "contain",
                      }}
                    />
                    <Box ml={2}>
                      <Typography fontWeight="bold">
                        {trip.driver.car.plate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trip.driver.car.brand} • {trip.driver.car.color}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {/* View Profile Button at the end */}
                <Grid item xs={12} md="auto" sx={{ ml: "auto" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewProfile("driver")}
                    disabled={loading}
                    sx={{ 
                      borderWidth: 2,
                      fontWeight: "bold",
                      minWidth: 120,
                      mt: isMobile ? 2 : 0
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : t("View Profile")}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Other Details */}
          <Typography 
            variant="h6" 
            mb={2}
            color="primary"
          >
            {t("Other Details")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List disablePadding sx={{ borderRadius: 2, overflow: "hidden" }}>
            {Object.entries(trip.details).map(([key, value], index) => (
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
          {/* Map */}
          <Box
            sx={{
              height: "300px",
              bgcolor: "grey.200",
              mb: 3,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <iframe
              title="trip-map"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13673.119570834748!2d31.235365!3d30.044419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDcuMyJF!5e0!3m2!1sen!2seg!4v1650000000000!5m2!1sen!2seg`}
              allowFullScreen
            />
          </Box>

          {/* Timeline */}
          <Typography variant="h6" mb={2} color="primary">
            {t("Trip Timeline")}
          </Typography>
          
          <Box 
            sx={{ 
              position: "relative", 
              pl: isArabic ? 0 : 4,
              pr: isArabic ? 4 : 0,
              mb: 3 
            }}
          >
            {/* Vertical Line */}
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

            {trip.timeline.map((step, idx, arr) => {
              const isFirst = idx === 0;
              const isLast = idx === arr.length - 1;
              
              return (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    mb: 4,
                    zIndex: 2,
                  }}
                >
                  {/* Circle */}
                  <FiberManualRecordIcon
                    fontSize="small"
                    sx={{
                      color: theme.palette.primary.main,
                      position: "absolute",
                      [isArabic ? "right" : "left"]: isArabic ? "-33px" : "-33px",
                      top: isFirst ? 0 : isLast ? "calc(100% - 12px)" : "50%",
                      transform: isFirst || isLast ? "none" : "translateY(-50%)",
                    }}
                  />

                  <Box 
                    sx={{ 
                      ml: isArabic ? 0 : 4,
                      mr: isArabic ? 4 : 0,
                      textAlign: isArabic ? "right" : "left"
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