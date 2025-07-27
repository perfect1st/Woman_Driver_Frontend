import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";
import RouteMap from "../RouteMap/RouteMap";
import { useDispatch, useSelector } from "react-redux";
import { getOnePassenger } from "../../redux/slices/passenger/thunk";
import LoadingPage from "../../components/LoadingComponent";
import useBaseImageUrl from "../../hooks/useBaseImageUrl";

const statusStyles = {
  Available: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Pending: { textColor: "#1849A9", bgColor: "#EFF8FF", borderColor: "#B2DDFF" },
  Rejected: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

export default function RiderDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { passenger, loading } = useSelector((s) => s.passenger);

  // EDITABLE STATE HOOKS
  const [editable, setEditable] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    status: "",
    verificationCode: "",
    verified: false,
  });
  const [editMode, setEditMode] = useState({});
  const [saving, setSaving] = useState({});

  // DRAWER
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // FETCH passenger ON MOUNT
  useEffect(() => {
    dispatch(getOnePassenger(id));
  }, [dispatch, id]);

  // SEED editable WHEN passenger LOADS
  useEffect(() => {
    if (passenger) {
      setEditable({
        fullName: passenger.fullname || "",
        phone: passenger.phone_number || "",
        email: passenger.email || "",
        password: "",
        status: passenger.status === "active" ? "Available" : passenger.status,
        verificationCode: passenger.verification_code || "",
        verified: passenger.is_code_verified || false,
      });
      setEditMode({});
      setSaving({});
    }
  }, [passenger]);

  // MOCKED TRIPS (exactly your array)
  const trips = useMemo(
    () =>
      passenger
        ? [
            {
              id: 1,
              time: "12:00 PM",
              from: "123 Main St",
              to: "456 Oak Ave",
              driver: {
                name: "John Smith",
                rating: 4.9,
                image: DomiDriverImage,
              },
              car: {
                plate: "ABC-123",
                color: "Black",
                brand: "Toyota Camry",
                image: DomiCar,
              },
              timeline: [
                {
                  type: "Pickup",
                  time: "03:06 PM",
                  address: "123 Main St, Anytown",
                },
                {
                  type: "Waiting",
                  time: "03:30 PM",
                  address: "579 Anytown, Main St",
                },
                {
                  type: "Dropoff",
                  time: "04:05 PM",
                  address: "456 Oak Ave, Anytown",
                },
              ],
              details: {
                date: "2023-05-15",
                time: "03:06 PM - 04:05 PM",
                distance: "5.2 km",
                type: "Standard",
                fare: "EGP 45.00",
                waiting: "EGP 5.00",
                payment: "Cash",
                cashback: "EGP 0.00",
              },
            },
            {
              id: 2,
              time: "3:30 PM",
              from: "City Mall",
              to: "Airport",
              driver: {
                name: "Michael Johnson",
                rating: 4.7,
                image: DomiDriverImage,
              },
              car: {
                plate: "XYZ-789",
                color: "White",
                brand: "Honda Accord",
                image: DomiCar,
              },
              timeline: [
                {
                  type: "Pickup",
                  time: "03:30 PM",
                  address: "City Mall, Main Entrance",
                },
                {
                  type: "Waiting",
                  time: "03:50 PM",
                  address: "Airport Parking Lot",
                },
                {
                  type: "Dropoff",
                  time: "04:25 PM",
                  address: "Airport Terminal B",
                },
              ],
              details: {
                date: "2023-05-15",
                time: "03:30 PM - 04:25 PM",
                distance: "12.5 km",
                type: "Premium",
                fare: "EGP 85.00",
                waiting: "EGP 8.00",
                payment: "Credit Card",
                cashback: "EGP 5.00",
              },
            },
          ]
        : [],
    [passenger]
  );

  const baseImageUrl = useBaseImageUrl();

  // BUILD rider OBJECT (identical keys)
  const rider = useMemo(
    () => ({
      name: passenger?.fullname,
      id: passenger?._id ? `#${passenger._id.slice(-6)}` : "",
      image: `${baseImageUrl}${passenger?.profile_image}`,
      referredBy: passenger?.fullname,
      totalTrips: trips.length,
      rating: passenger?.rating || 0,
      fullName: editable.fullName,
      phone: editable.phone,
      email: editable.email,
      password: editable.password,
      status: editable.status,
      wallet: "EGP 98.50",
      verificationCode: editable.verificationCode,
      verified: editable.verified,
      trips,
    }),
    [passenger, editable, trips]
  );

  // EARLY RETURN SPINNER
  if (loading || !passenger) {
    return (
        <LoadingPage />
    );
  }

  // HANDLERS (unchanged logic)
  const handleFieldChange = (f, v) => setEditable((e) => ({ ...e, [f]: v }));
  const toggleEdit = (f) => setEditMode((m) => ({ ...m, [f]: !m[f] }));
  const handleSave = (f) => {
    setSaving((s) => ({ ...s, [f]: true }));
    setTimeout(() => {
      setSaving((s) => ({ ...s, [f]: false }));
      setEditMode((m) => ({ ...m, [f]: false }));
      console.log(`Saved ${f}:`, editable[f]);
    }, 1000);
  };
  const openDrawer = (t) => (setSelectedTrip(t), setDrawerOpen(true));
  const closeDrawer = () => (setDrawerOpen(false), setSelectedTrip(null));

  const renderEditableField = (field) => {
    const styles = statusStyles[editable.status] || statusStyles.Available;
    if (editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          {field === "status" ? (
            <Select
              value={editable.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              fullWidth
              size="small"
              sx={{ flexGrow: 1, mr: 1 }}
            >
              {Object.keys(statusStyles).map((st) => (
                <MenuItem key={st} value={st}>
                  {t(st)}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              value={editable[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
              type={field === "password" ? "password" : "text"}
              sx={{ flexGrow: 1, mr: 1 }}
            />
          )}
          <IconButton
            onClick={() => handleSave(field)}
            disabled={saving[field]}
          >
            {saving[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      );
    }
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box>
          {field === "status" ? (
            <Chip
              label={t(editable.status)}
              sx={{
                color: styles.textColor,
                backgroundColor: styles.bgColor,
                border: `1px solid ${styles.borderColor}`,
                fontWeight: "bold",
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
              }}
            />
          ) : (
            <Typography>{editable[field]}</Typography>
          )}
        </Box>
        <IconButton onClick={() => toggleEdit(field)}>
          <EditIcon />
        </IconButton>
      </Box>
    );
  };

  

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Passengers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Rider")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography
          onClick={() => navigate("/Passengers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Rider Details")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography>{rider.name}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {rider.name}
        </Typography>
      {false &&  <Typography variant="subtitle1" color="text.secondary">
          {rider.id}
        </Typography>}
      </Box>

      <Box maxWidth="md">
        <Box mb={3} display="flex" flexDirection="column" alignItems="center">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontSize: 40,
              mb: 1,
            }}
            src={rider.image}
          >
            {!rider.image && rider.name.charAt(0)}
          </Avatar>
          <Typography color="primary" fontWeight="bold" fontSize={18}>
            {rider.name}
          </Typography>
          <Typography>
            {t("Total Trip")}: {rider.totalTrips}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography>{rider.rating}</Typography>
            <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
          </Box>
        </Box>
        <Typography variant="h6" color="primary" mb={1}>
          {t("Rider Details")}
        </Typography>

        <Grid container spacing={2} direction="column">
          {/* Full Name */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Full Name")}</Typography>
                <Box mt={1}>{renderEditableField("fullName")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Phone */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Phone Number")}</Typography>
                <Box mt={1}>{renderEditableField("phone")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Email */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Email")}</Typography>
                <Box mt={1}>{renderEditableField("email")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Password */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Password")}</Typography>
                <Box mt={1}>{renderEditableField("password")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Status */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Status")}</Typography>
                <Box mt={1}>{renderEditableField("status")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Wallet */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Wallet")}</Typography>
                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{rider.wallet}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    {t("Transaction")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Verification */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {t("Verification Code")}
                </Typography>

                {/* One‑line layout with space between code and checkbox */}
                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Read‑only code text */}
                  <Typography>{editable.verificationCode}</Typography>

                  {/* Checkbox + label */}
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      color="primary" // uses main color
                      checked={editable.verified}
                      onChange={(e) =>
                        handleFieldChange("verified", e.target.checked)
                      }
                      disabled={saving.verified}
                    />
                    <Typography sx={{ fontWeight: "bold" }}>
                      {t("Verified code")}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Trips List */}
      <Typography variant="h6" mt={4} mb={2}>
        {t("Trips")}
      </Typography>
      <Box maxWidth="md">
        <Grid container spacing={2} direction="column">
          {rider.trips.map((trip) => (
            <Grid item xs={12} key={trip.id}>
              <Card sx={{ background: theme.palette.secondary.sec }}>
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
                    <Box>
                      <Typography variant="subtitle2">{t("Trip")}</Typography>
                      <Typography variant="body2">
                        {trip.time} · {trip.from} to {trip.to}
                      </Typography>
                    </Box>
                    <Box flexGrow={1} textAlign="end">
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: 16, fontWeight: 700 }}
                        onClick={() => openDrawer(trip)}
                      >
                        {t("Details")}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor={isArabic ? "left" : "right"}
        open={drawerOpen}
        onClose={closeDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "40%",
            minWidth: 300,
          },
        }}
      >
        {selectedTrip && (
          <Box p={2} display="flex" flexDirection="column" height="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                {t("Trip Details")}
              </Typography>
              <IconButton onClick={closeDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ bgcolor: "grey.200", mb: 2, borderRadius: 1 }}>
              <RouteMap
                fromLat={30.0444}
                fromLng={31.2357}
                toLat={30.072}
                toLng={31.346}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 1, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={DomiDriverImage}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedTrip.driver.name}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.25}>
                          <StarIcon
                            fontSize="small"
                            color="primary"
                            sx={{ mr: 0.5 }}
                          />
                          <Typography variant="body2">
                            {selectedTrip.driver.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center">
                      <Box
                        component="img"
                        src={selectedTrip.car.image}
                        alt={selectedTrip.car.brand}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: "contain",
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 1,
                          p: 0.5,
                        }}
                      />
                      <Box ml={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedTrip.car.plate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedTrip.car.color} • {selectedTrip.car.brand}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box
                      display="flex"
                      justifyContent={isMobile ? "flex-start" : "flex-end"}
                    >
                      <Button variant="outlined" size="small">
                        {t("Open Chat")}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
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
                  left: isArabic ? "auto" : 8,
                  right: isArabic ? 8 : "auto",
                  top: 4,
                  bottom: 0,
                  width: 2,
                  bgcolor: theme.palette.primary.main,
                  zIndex: 1,
                }}
              />
              {selectedTrip.timeline.map((step, i, arr) => {
                const isFirst = i === 0,
                  isLast = i === arr.length - 1;
                return (
                  <Box
                    key={i}
                    sx={{ position: "relative", mb: isLast ? 0 : 4, zIndex: 2 }}
                  >
                    {(isFirst || isLast) && (
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                          color: theme.palette.primary.main,
                          position: "absolute",
                          left: isArabic ? "auto" : -33,
                          right: isArabic ? -33 : "auto",
                          top: isFirst ? 0 : isLast ? "calc(100% - 12px)" : "50%",
                          transform:
                            isFirst || isLast ? "none" : "translateY(-50%)",
                        }}
                      />
                    )}
                    <Typography fontWeight="bold">{t(step.type)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.time}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <LocationOnIcon
                        fontSize="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">{step.address}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                {t("Trip Information")}
              </Typography>

              <List disablePadding>
                {Object.entries(selectedTrip.details).map(([key, value], i) => (
                  <ListItem
                    key={key}
                    sx={{
                      bgcolor:
                        i % 2 === 0 ? theme.palette.secondary.main : "inherit",
                      py: 1.5,
                    }}
                  >
                    <ListItemText
                      sx={{ display: "flex", alignItems: "center" }}
                      primary={t(key)}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {value}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ mt: "auto", pt: 2, mb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Button variant="contained" fullWidth onClick={closeDrawer} sx={{mb:2}}>
                {t("Done")}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
