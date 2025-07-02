import React, { useState } from "react";
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
  Container,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";

// Mock assets - in real app, import from actual files

const statusStyles = {
  Available: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Pending: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
  },
  Rejected: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

const rider = {
  name: "Emma Davis",
  id: "#4141321",
  image: DomiDriverImage,
  referredBy: "Sophia Bennett",
  totalTrips: 40,
  rating: 4.89,
  fullName: "Emma Davis",
  phone: "+201112223334",
  email: "emma@example.com",
  password: "123123123",
  status: "Available",
  wallet: "EGP 98.50",
  verificationCode: "125753",
  verified: true,
  trips: [
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
        { type: "Pickup", time: "03:06 PM", address: "123 Main St, Anytown" },
        { type: "Waiting", time: "03:30 PM", address: "579 Anytown, Main St" },
        { type: "Dropoff", time: "04:05 PM", address: "456 Oak Ave, Anytown" },
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
        { type: "Waiting", time: "03:50 PM", address: "Airport Parking Lot" },
        { type: "Dropoff", time: "04:25 PM", address: "Airport Terminal B" },
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
  ],
};

export default function RiderDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const status = rider.status;
  const styles = statusStyles[status];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // State for editable fields
  const [editableFields, setEditableFields] = useState({
    fullName: rider.fullName,
    phone: rider.phone,
    email: rider.email,
    password: rider.password,
    status: rider.status,
    verificationCode: rider.verificationCode, // Add this
    verified: rider.verified, // Add this
  });

  // State for edit mode and loading
  const [editMode, setEditMode] = useState({
    fullName: false,
    phone: false,
    email: false,
    password: false,
    status: false,
    verificationCode: false, // Add this
    verified: false, // Add this
  });

  const [loading, setLoading] = useState({
    fullName: false,
    phone: false,
    email: false,
    password: false,
    status: false,
    verificationCode: false, // Add this
    verified: false, // Add this
  });

  const handleOpenDrawer = (trip) => {
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTrip(null);
  };

  // Handle field change
  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save changes
  const handleSave = (field) => {
    setLoading((prev) => ({ ...prev, [field]: true }));

    // Simulate API call
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [field]: false }));
      setEditMode((prev) => ({ ...prev, [field]: false }));

      // In a real app, you would update your data source here
      console.log(`Saved ${field}:`, editableFields[field]);
    }, 1000);
  };

  // Toggle edit mode
  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Render editable field based on edit mode
  const renderEditableField = (field, label, type = "text") => {
    const styles = statusStyles[editableFields.status];

    if (editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          {field === "status" ? (
            <Select
              value={editableFields.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              fullWidth
              size="small"
              sx={{ flexGrow: 1, mr: 1 }}
            >
              {Object.keys(statusStyles).map((status) => (
                <MenuItem key={status} value={status}>
                  {t(status)}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              value={editableFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
              type={type}
              sx={{ flexGrow: 1, mr: 1 }}
            />
          )}
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
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
              label={t(editableFields.status)}
              sx={{
                color: styles.textColor,
                backgroundColor: styles.bgColor,
                border: `1px solid ${styles.borderColor}`,
                fontWeight: "bold",
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                justifyContent: "flex-start",
              }}
            />
          ) : (
            <Typography sx={{ color: theme.palette.text.blue }}>
              {editableFields[field]}
            </Typography>
          )}
        </Box>
        <IconButton onClick={() => toggleEditMode(field)}>
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
          onClick={() => navigate('/Passengers')}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Rider")}
        </Typography>
        <Typography mx={1}>/</Typography>
        <Typography
          onClick={() => navigate('/Passengers')}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Rider Details")}
        </Typography>
        <Typography mx={1}>/</Typography>
        <Typography>{rider.name}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {rider.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {rider.id}
        </Typography>
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
  src={rider.image || undefined}
>
  {!rider.image && rider.name?.charAt(0)}
</Avatar>

          <Typography color="primary" fontWeight="bold" fontSize={18}>
            {rider.referredBy}
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

        <Grid container spacing={2} direction="column" alignItems="stretch">
          {/* Full Name */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Full Name")}</Typography>
                <Box mt={1}>
                  {renderEditableField("fullName", t("Full Name"))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Phone Number")}</Typography>
                <Box mt={1}>
                  {renderEditableField("phone", t("Phone Number"))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Email")}</Typography>
                <Box mt={1}>{renderEditableField("email", t("Email"))}</Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Password")}</Typography>
                <Box mt={1}>
                  {renderEditableField("password", t("Password"))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Status")}</Typography>
                <Box mt={1}>{renderEditableField("status", t("Status"))}</Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Wallet - remains non-editable */}
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
                    sx={{
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    {t("Transaction")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Verification Code - remains non-editable */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {t("Verification Code")}
                </Typography>
                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {editMode.verificationCode ? (
                    <Box display="flex" alignItems="center" width="100%">
                      <TextField
                        value={editableFields.verificationCode}
                        onChange={(e) =>
                          handleFieldChange("verificationCode", e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                      <IconButton
                        onClick={() => handleSave("verificationCode")}
                        disabled={loading.verificationCode}
                      >
                        {loading.verificationCode ? (
                          <CircularProgress size={24} />
                        ) : (
                          <SaveIcon />
                        )}
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography>{editableFields.verificationCode}</Typography>
                  )}

                  <Box display="flex" alignItems="center">
                    {editMode.verified ? (
                      <Box display="flex" alignItems="center">
                        <Checkbox
                          checked={editableFields.verified}
                          onChange={(e) =>
                            handleFieldChange("verified", e.target.checked)
                          }
                          disabled={loading.verified}
                        />
                        {loading.verified ? (
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                        ) : (
                          <IconButton
                            onClick={() => handleSave("verified")}
                            size="small"
                            sx={{ mr: 0.5 }}
                          >
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center">
                        <Checkbox
                          checked={editableFields.verified}
                          onChange={() => {
                            // Toggle verified status and save immediately
                            const newValue = !editableFields.verified;
                            handleFieldChange("verified", newValue);
                            handleSave("verified");
                          }}
                          disabled={loading.verified}
                        />
                        {/* <IconButton 
                onClick={() => toggleEditMode("verified")} 
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton> */}
                      </Box>
                    )}
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

      <Typography variant="h6" mt={4} mb={2}>
        {t("Trips")}
      </Typography>

      <Box maxWidth="md">
        <Grid container spacing={2} direction="column">
          {rider.trips.map((trip, i) => (
            <Grid item xs={12} key={i}>
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
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                        onClick={() => handleOpenDrawer(trip)}
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

      {/* Trip Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "40%",
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
            {/* Header */}
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

            {/* Map iframe placeholder */}
            <Box
              sx={{
                height: "200px",
                bgcolor: "grey.200",
                mb: 2,
                borderRadius: 1,
              }}
            >
              <iframe
                title="map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, borderRadius: "4px" }}
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13673.119570834748!2d31.235365!3d30.044419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDcuMyJF!5e0!3m2!1sen!2seg!4v1650000000000!5m2!1sen!2seg`}
                allowFullScreen
              />
            </Box>

            {/* Driver & Car Info */}
            <Box sx={{ width: "100%", mb: 2 }}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 1,
                  p: 2,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Driver Info */}
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={DomiDriverImage}
                        alt={selectedTrip.driver.name}
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

                  {/* Car Info */}
                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center">
                      <Box
                        component="img"
                        src={selectedTrip.car.image}
                        alt={selectedTrip.car.brand}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: "contain", // ← اجعل الصورة كاملة
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 1,
                          // border: `1px solid ${theme.palette.divider}`,
                          p: 0.5, // إضافة Padding خفيف حول الصورة
                        }}
                      />
                      <Box ml={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedTrip.car.plate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedTrip.car.color} &bull;{" "}
                          {selectedTrip.car.brand}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Open Chat Button on same line */}
                  <Grid item xs={12} md={3}>
                    <Box
                      display="flex"
                      justifyContent={isMobile ? "flex-start" : "flex-end"}
                    >
                      <Button variant="outlined" color="primary" size="small">
                        {t("Open Chat")}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>

            {/* Timeline */}
            {isArabic ? (
              <Box sx={{ position: "relative", pr: 4, mb: 3 }}>
                {/* Vertical Line */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 8, // تحت مركز الدائرة
                    top: 4,
                    bottom: 0,
                    width: 2,
                    bgcolor: theme.palette.primary.main,
                    zIndex: 1,
                  }}
                />

                {selectedTrip.timeline.map((step, idx, arr) => {
                  const isFirst = idx === 0;
                  const isLast = idx === arr.length - 1;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "relative",
                        mb: 4, // مسافة بين الخطوات
                        "&:last-child": { mb: 0 }, // لا مسافة أخيرة
                        zIndex: 2,
                      }}
                    >
                      {/* Circle */}
                      {(isFirst || isLast) && (
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{
                            color: theme.palette.primary.main,
                            position: "absolute",
                            right: "-33px",
                            top: isFirst
                              ? 0
                              : isLast
                              ? "calc(100% - 12px)" // تقريباً ارتفاع الأيقونة
                              : "50%",
                            transform:
                              isFirst || isLast ? "none" : "translateY(-50%)",
                          }}
                        />
                      )}

                      {/* Lines */}
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
            ) : (
              <Box sx={{ position: "relative", pl: 4, mb: 3 }}>
                {/* Vertical Line */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 8, // تحت مركز الدائرة
                    top: 4,
                    bottom: 0,
                    width: 2,
                    bgcolor: theme.palette.primary.main,
                    zIndex: 1,
                  }}
                />

                {selectedTrip.timeline.map((step, idx, arr) => {
                  const isFirst = idx === 0;
                  const isLast = idx === arr.length - 1;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "relative",
                        mb: 4, // مسافة بين الخطوات
                        "&:last-child": { mb: 0 }, // لا مسافة أخيرة
                        zIndex: 2,
                      }}
                    >
                      {/* Circle */}
                      {(isFirst || isLast) && (
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{
                            color: theme.palette.primary.main,
                            position: "absolute",
                            left: "-33px",
                            top: isFirst
                              ? 0
                              : isLast
                              ? "calc(100% - 12px)" // تقريباً ارتفاع الأيقونة
                              : "50%",
                            transform:
                              isFirst || isLast ? "none" : "translateY(-50%)",
                          }}
                        />
                      )}

                      {/* Lines */}
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
            )}

            {/* Trip Details */}
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

            {/* Divider and Done Button */}
            <Box sx={{ mt: "auto", pt: 2, mb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleCloseDrawer}
                sx={{ mb: 2 }} // ← margin bottom for the button
              >
                {t("Done")}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
