// src/components/DriverTrips/DriverTrips.js
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Divider, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  IconButton, 
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteMap from "../RouteMap/RouteMap";
import { useDispatch, useSelector } from "react-redux";
import { getAllDriverTrips } from "../../redux/slices/trip/thunk";
import { useSearchParams } from "react-router-dom";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import { useTranslation } from "react-i18next";

const DriverTrips = ({ driverId, onTripClick }) => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Safely parse page and limit parameters
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  
  // Parse with fallbacks and validation
  const page = pageParam && !isNaN(pageParam) ? parseInt(pageParam, 10) : 1;
  const limit = limitParam && !isNaN(limitParam) ? parseInt(limitParam, 10) : 10;

  const { allDriverTrips, loading } = useSelector((state) => state.trip);

  useEffect(() => {
    // Ensure parameters are valid before fetching
    if (!isNaN(page) && !isNaN(limit)) {
      const query = `page=${page}&limit=${limit}`;
      dispatch(getAllDriverTrips({ id: driverId, query }));
    }
  }, [dispatch, driverId, page, limit]);

  const handlePageChange = (newPage) => {
    searchParams.set("page", String(newPage));
    setSearchParams(searchParams);
  };

  const handleLimitChange = (newLimit) => {
    searchParams.set("limit", String(newLimit));
    searchParams.set("page", "1"); // Reset to first page
    setSearchParams(searchParams);
  };

  const handleOpenDrawer = (trip) => {
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTrip(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to format coordinates
  const formatCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates)) return "";
    return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" mb={1}>
          {t("Trips")}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {allDriverTrips.data?.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography>{t("NoDriverTrips")}</Typography>
          </Box>
        ) : (
          <>
            {allDriverTrips.data?.map((trip) => (
              <Card
                key={trip._id}
                sx={{ background: theme.palette.secondary.sec, mb: 2 }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      sx={{
                        borderRadius: 1,
                        backgroundColor: theme.palette.background.paper,
                        p: 1,
                      }}
                    >
                      <CalendarMonthIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                    </IconButton>
                    <Box flexGrow={1}>
                      <Typography variant="subtitle2">
                        {formatDate(trip.createdAt)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(trip.createdAt)}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ fontSize: "16px", fontWeight: 700 }}
                      onClick={() => {
                        onTripClick(trip)
                        // handleOpenDrawer(trip)
                      }}
                    >
                      {t("Details")}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
            
            <PaginationFooter
              currentPage={page}
              totalPages={allDriverTrips.totalPages || 1}
              limit={limit}
              onPageChange={(_, value) => handlePageChange(value)}
              onLimitChange={(e) => handleLimitChange(e.target.value)}
            />
          </>
        )}
      </Grid>

      {/* Trip Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "40%",
            minWidth: 300,
          },
        }}
      >
        {selectedTrip && (
          <Box
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                {t("Trip Details")}
              </Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Map */}
            <Box sx={{ height: "200px", mb: 2, borderRadius: 1 }}>
              {selectedTrip.from_lng_lat && selectedTrip.to_lng_lat ? (
                <RouteMap
                  fromLat={selectedTrip.from_lng_lat.coordinates[1]}
                  fromLng={selectedTrip.from_lng_lat.coordinates[0]}
                  toLat={selectedTrip.to_lng_lat.coordinates[1]}
                  toLng={selectedTrip.to_lng_lat.coordinates[0]}
                />
              ) : (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  height="100%"
                  bgcolor="grey.200"
                >
                  <Typography>{t("MapUnavailable")}</Typography>
                </Box>
              )}
            </Box>

            {/* Location Details */}
            <Box mb={2}>
              <Typography fontWeight="bold">{t("From")}</Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <LocationOnIcon
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Typography>
                  {selectedTrip.from_lng_lat ? 
                    formatCoordinates(selectedTrip.from_lng_lat.coordinates) : 
                    "Unknown location"}
                </Typography>
              </Box>
            </Box>

            <Box mb={2}>
              <Typography fontWeight="bold">{t("To")}</Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <LocationOnIcon
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Typography>
                  {selectedTrip.to_lng_lat ? 
                    formatCoordinates(selectedTrip.to_lng_lat.coordinates) : 
                    "Unknown location"}
                </Typography>
              </Box>
            </Box>

            {/* Trip Information */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                {t("Trip Information")}
              </Typography>
              <List disablePadding>
                <ListItem
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    py: 1.5,
                  }}
                >
                  <ListItemText primary="Date" />
                  <Typography fontWeight="bold">
                    {formatDate(selectedTrip.createdAt)}
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    py: 1.5,
                  }}
                >
                  <ListItemText primary="Distance" />
                  <Typography fontWeight="bold">
                    {selectedTrip.kilos_number} km
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    py: 1.5,
                  }}
                >
                  <ListItemText primary="Fare" />
                  <Typography fontWeight="bold">
                    SAR {selectedTrip.cost}
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    py: 1.5,
                  }}
                >
                  <ListItemText primary="Waiting Cost" />
                  <Typography fontWeight="bold">
                    SAR {selectedTrip.total_waiting_minutes_cost || 0}
                  </Typography>
                </ListItem>
                <ListItem
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    py: 1.5,
                  }}
                >
                  <ListItemText primary="Payment Method" />
                  <Typography fontWeight="bold">
                    {selectedTrip.payment_method_id?.name_en || ""}
                  </Typography>
                </ListItem>
              </List>
            </Box>

            <Box sx={{ mt: "auto", pt: 2, mb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleCloseDrawer}
              >
                {t('Done')}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Grid>
  );
};

export default DriverTrips;