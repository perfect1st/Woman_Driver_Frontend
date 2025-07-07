import React, { useState, useRef } from "react";
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
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";
import IOSSwitch from "../../components/IOSSwitch";

// Mock assets
const statusStyles = {
  Available: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Unavailable: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

const carTypes = ["Economy", "Flex", "Comfortable", "Premium", "Luxury"];

const driver = {
  name: "Sophia Bennett",
  id: "#DRV-12345",
  image: DomiDriverImage,
  referredBy: "Emma Davis",
  totalTrips: 2000,
  rating: 4.89,
  fullName: "Sophia Bennett",
  phone: "+201112223334",
  email: "sophia@example.com",
  password: "123123123",
  status: "Available",
  wallet: "EGP 98.50",
  verificationCode: "125753",
  verified: true,
  nationalId: "ID-123456",
  nationalIdExpiry: "2025-12-31",
  driverLicense: "LIC-789012",
  driverLicenseExpiry: "2024-10-15",
  accountNumber: "EG123456789",
  carType: "Economy",
  carModel: "Toyota Camry",
  carColor: "Gold",
  carYear: "2020",
  plateNumber: "145 اوص",
  carLicense: "CAR-LIC-456",
  carLicenseExpiry: "2023-12-31",
  isCompanyCar: true,
  transactions: [
    {
      id: 1,
      type: "Trip",
      title: "Today",
      time: "10:00 AM",
      description: "123 Main St to 789 Pine St",
      amount: "+ $15.00",
      status: "success",
      icon: <CalendarMonthIcon />,
    },
    {
      id: 2,
      type: "Cash Out",
      title: "Yesterday",
      time: "16:00 PM",
      description: "Bank transfer",
      amount: "- $18.75",
      status: "error",
      icon: <CreditCardIcon />,
    },
    {
      id: 3,
      type: "Top Up",
      title: "Today",
      time: "11:30 AM",
      description: "Credit card deposit",
      amount: "+ $50.00",
      status: "success",
      icon: <CreditCardIcon />,
    },
  ],
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
      status: "current",
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
        date: "2023-05-14",
        time: "03:30 PM - 04:25 PM",
        distance: "12.5 km",
        type: "Premium",
        fare: "EGP 85.00",
        waiting: "EGP 8.00",
        payment: "Credit Card",
        cashback: "EGP 5.00",
      },
      status: "past",
    },
    {
      id: 3,
      time: "9:15 AM",
      from: "University Campus",
      to: "Tech Park",
      driver: {
        name: "Sarah Williams",
        rating: 4.8,
        image: DomiDriverImage,
      },
      car: {
        plate: "DEF-456",
        color: "Blue",
        brand: "Hyundai Sonata",
        image: DomiCar,
      },
      timeline: [
        { type: "Pickup", time: "09:15 AM", address: "Main University Gate" },
        { type: "Dropoff", time: "09:45 AM", address: "Tech Park Entrance" },
      ],
      details: {
        date: "2023-05-13",
        time: "09:15 AM - 09:45 AM",
        distance: "8.3 km",
        type: "Comfortable",
        fare: "EGP 65.00",
        waiting: "EGP 0.00",
        payment: "Wallet",
        cashback: "EGP 3.00",
      },
      status: "past",
    },
  ],
};

export default function DriverDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState("");
  const [editingImage, setEditingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const fileInputRef = useRef(null);

  // State for editable fields
  const [editableFields, setEditableFields] = useState({
    fullName: driver.fullName,
    phone: driver.phone,
    email: driver.email,
    password: driver.password,
    status: driver.status,
    verificationCode: driver.verificationCode,
    verified: driver.verified,
    nationalId: driver.nationalId,
    nationalIdExpiry: driver.nationalIdExpiry,
    driverLicense: driver.driverLicense,
    driverLicenseExpiry: driver.driverLicenseExpiry,
    accountNumber: driver.accountNumber,
    carType: driver.carType,
    carModel: driver.carModel,
    carColor: driver.carColor,
    carYear: driver.carYear,
    plateNumber: driver.plateNumber,
    carLicense: driver.carLicense,
    carLicenseExpiry: driver.carLicenseExpiry,
    isCompanyCar: driver.isCompanyCar,
  });

  // State for edit mode and loading
  const [editMode, setEditMode] = useState({
    fullName: false,
    phone: false,
    email: false,
    password: false,
    status: false,
    verificationCode: false,
    verified: false,
    nationalId: false,
    nationalIdExpiry: false,
    driverLicense: false,
    driverLicenseExpiry: false,
    accountNumber: false,
    carType: false,
    carModel: false,
    carColor: false,
    carYear: false,
    plateNumber: false,
    carLicense: false,
    carLicenseExpiry: false,
    isCompanyCar: false,
  });

  const [loading, setLoading] = useState({
    fullName: false,
    phone: false,
    email: false,
    password: false,
    status: false,
    verificationCode: false,
    verified: false,
    nationalId: false,
    nationalIdExpiry: false,
    driverLicense: false,
    driverLicenseExpiry: false,
    accountNumber: false,
    carType: false,
    carModel: false,
    carColor: false,
    carYear: false,
    plateNumber: false,
    carLicense: false,
    carLicenseExpiry: false,
    isCompanyCar: false,
  });

  const handleOpenDrawer = (trip) => {
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTrip(null);
  };

  const handleOpenImageModal = (image, type) => {
    setSelectedImage(image);
    setImageType(type);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
    setImageType("");
    setEditingImage(false);
    setNewImage(null);
  };

  const handleEditImage = () => {
    setEditingImage(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Simple compression by reducing image size
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 800;
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          setNewImage(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    // In a real app, you would upload the image to your server
    console.log("Image saved:", imageType);
    setEditingImage(false);
    setNewImage(null);
  };

  const handleDeleteImage = () => {
    // In a real app, you would delete the image from your server
    console.log("Image deleted:", imageType);
    handleCloseImageModal();
  };

  const downloadImage = (imageSrc, fileName) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (field) => {
    setLoading((prev) => ({ ...prev, [field]: true }));

    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [field]: false }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
      console.log(`Saved ${field}:`, editableFields[field]);
    }, 1000);
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleAvailability = (event) => {
    const newStatus = event.target.checked ? "Available" : "Unavailable";
    handleFieldChange("status", newStatus);
    handleSave("status");
  };

  const toggleCompanyCar = () => {
    const newValue = !editableFields.isCompanyCar;
    handleFieldChange("isCompanyCar", newValue);
    handleSave("isCompanyCar");
  };

  const renderEditableField = (field, label, type = "text") => {
    if (field === "carType" && editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          <Select
            value={editableFields.carType}
            onChange={(e) => handleFieldChange("carType", e.target.value)}
            fullWidth
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
          >
            {carTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {t(type)}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      );
    }

    if (field === "status" && editMode[field]) {
      const styles = statusStyles[editableFields.status];
      return (
        <Box display="flex" alignItems="center" width="100%">
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
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      );
    }

    if (editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          <TextField
            value={editableFields[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            fullWidth
            size="small"
            type={type}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      );
    }

    if (field === "status") {
      const styles = statusStyles[editableFields.status];
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
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
            }}
          />
          <IconButton onClick={() => toggleEditMode(field)}>
            <EditIcon />
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
        <Typography sx={{ color: theme.palette.text.primary }}>
          {editableFields[field]}
        </Typography>
        <IconButton onClick={() => toggleEditMode(field)}>
          <EditIcon />
        </IconButton>
      </Box>
    );
  };

  const renderDownloadLink = (title, type) => (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography
        onClick={() =>
          downloadImage(DomiCar, `${title.replace(/\s+/g, "_")}.jpg`)
        }
        sx={{
          color: theme.palette.primary.main,
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        {t("Click Here To Download")}
      </Typography>
      <IconButton onClick={() => handleOpenImageModal(DomiCar, type)}>
        <VisibilityIcon />
      </IconButton>
    </Box>
  );

  const renderCarImageCard = (title, type) => (
    <Card
      sx={{
        background: theme.palette.secondary.sec,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <DirectionsCarIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ ml: 1 }}>
            {t(title)}
          </Typography>
        </Box>
        {renderDownloadLink(title, type)}
      </CardContent>
    </Card>
  );

  const renderTransactionItem = (transaction) => (
    <Card sx={{ background: theme.palette.secondary.sec, mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              color: theme.palette.primary.main,
            }}
          >
            {transaction.icon}
          </Box>
          <Box flexGrow={1}>
            <Typography fontWeight="bold">{t(transaction.title)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {transaction.time} · {transaction.description}
            </Typography>
          </Box>
          <Typography
            sx={{
              color:
                transaction.status === "success"
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              fontWeight: "bold",
            }}
          >
            {transaction.amount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Drivers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Drivers")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/Drivers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Driver Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{driver.name}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {driver.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {driver.id}
        </Typography>
      </Box>

      {/* Driver Profile with Status Toggle */}
      <Box
        maxWidth="md"
        mb={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box position="relative">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontSize: 40,
            }}
            src={driver.image || undefined}
          >
            {!driver.image && driver.name?.charAt(0)}
          </Avatar>
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor:
                editableFields.status === "Available"
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        </Box>

        {/* Status Toggle */}
        <Box display="flex" alignItems="center" mt={1}>
          <Typography>{t(editableFields.status)}</Typography>
          <IOSSwitch
            checked={editableFields.status === "Available"}
            onChange={toggleAvailability}
            color="primary" // أي لون تحب تستخدمه (مثلاً لون primary)
            sx={{ mx: 1 }}
          />
        </Box>

        <Typography mt={1}>
          {t("Total Trip")}: {driver.totalTrips}
        </Typography>
        <Box display="flex" alignItems="center" mt={0.5}>
          <Typography>{driver.rating}</Typography>
          <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box maxWidth="md" sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
  {isMobile ? (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Tab
          label={t("Driver Details")}
          value={0}
          onClick={() => setActiveTab(0)}
          sx={{
            width: "100%",
            borderBottom: activeTab === 0 ? `2px solid ${theme.palette.primary.main}` : "none",
            fontWeight: activeTab === 0 ? "bold" : "normal",
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Tab
          label={t("Car Documents")}
          value={1}
          onClick={() => setActiveTab(1)}
          sx={{
            width: "100%",
            borderBottom: activeTab === 1 ? `2px solid ${theme.palette.primary.main}` : "none",
            fontWeight: activeTab === 1 ? "bold" : "normal",
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Tab
          label={t("Payment Details")}
          value={2}
          onClick={() => setActiveTab(2)}
          sx={{
            width: "100%",
            borderBottom: activeTab === 2 ? `2px solid ${theme.palette.primary.main}` : "none",
            fontWeight: activeTab === 2 ? "bold" : "normal",
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Tab
          label={t("Trips")}
          value={3}
          onClick={() => setActiveTab(3)}
          sx={{
            width: "100%",
            borderBottom: activeTab === 3 ? `2px solid ${theme.palette.primary.main}` : "none",
            fontWeight: activeTab === 3 ? "bold" : "normal",
          }}
        />
      </Grid>
    </Grid>
  ) : (
    <Tabs
      value={activeTab}
      onChange={(e, newValue) => setActiveTab(newValue)}
      variant="standard"
    >
      <Tab label={t("Driver Details")} />
      <Tab label={t("Car Documents")} />
      <Tab label={t("Payment Details")} />
      <Tab label={t("Trips")} />
    </Tabs>
  )}
</Box>



      {/* Tab Content */}
      <Box maxWidth="md">
        {/* Driver Details Tab */}
        {activeTab === 0 && (
          <Grid container spacing={2}>
            {/* Row 1 */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Full Name")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("fullName", t("Full Name"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Phone Number")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField("phone", t("Phone Number"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Email")}</Typography>
                  <Box mt={1}>{renderEditableField("email", t("Email"))}</Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Password")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("password", t("Password"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Status")}</Typography>
                  <Box mt={1}>{renderEditableField("status", t("Status"))}</Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Verification Code")}
                  </Typography>
                  <Box
                    mt={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>{editableFields.verificationCode}</Typography>
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={editableFields.verified}
                        onChange={(e) => {
                          handleFieldChange("verified", e.target.checked);
                          handleSave("verified");
                        }}
                        disabled={loading.verified}
                        color="primary"
                      />
                      <Typography>{t("Verified code")}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* National ID Row */}
            <Grid item xs={12} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("National ID")}
                  </Typography>
                  {renderDownloadLink("National ID", "nationalId")}
                </CardContent>
              </Card>
            </Grid>

            {/* National ID Details Row */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("National ID Number")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField("nationalId", t("National ID Number"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Expired Date")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField(
                      "nationalIdExpiry",
                      t("Expired Date"),
                      "date"
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Driver License Row */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Driver License")}
                  </Typography>
                  {renderDownloadLink("Driver License", "driverLicense")}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Expired Date")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField(
                      "driverLicenseExpiry",
                      t("Expired Date"),
                      "date"
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Car Documents Tab */}
        {activeTab === 1 && (
          <Grid container spacing={2}>
            {/* Company Car Indicator */}
            <Grid item xs={12}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6" color="primary">
                  {t("Car Documents")}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography sx={{ mr: 1 }}>
                    {t(
                      editableFields.isCompanyCar
                        ? "Company Car"
                        : "Personal Car"
                    )}
                  </Typography>
                  <IOSSwitch
                    checked={editableFields.isCompanyCar}
                    onChange={toggleCompanyCar}
                    color="primary"
                    sx={{mx:1}}
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Car Pictures - Fixed Size */}
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car’s Picture Front", "carFront")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car’s Picture Back", "carBack")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car’s Picture Right side", "carRight")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car’s Picture Left Side", "carLeft")}
            </Grid>

            {/* Car License */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card
                sx={{
                  background: theme.palette.secondary.sec,
                  height: "100%",
                  flex: 1,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Car License")}
                  </Typography>
                  {renderDownloadLink("Car License", "carLicense")}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card
                sx={{
                  background: theme.palette.secondary.sec,
                  height: "100%",
                  flex: 1,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Expired Date")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField(
                      "carLicenseExpiry",
                      t("Expired Date"),
                      "date"
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Plate Number & Model */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Plate Number")}
                  </Typography>
                  <Box mt={1} display="flex" justifyContent="space-between">
                    <Typography>{editableFields.plateNumber}</Typography>
                    <IconButton
                      onClick={() =>
                        handleOpenImageModal(DomiCar, "plateNumber")
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Car Model")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("carModel", t("Car Model"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Color & Year */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Car Color")}</Typography>
                  <Box mt={1} display="flex" justifyContent="space-between">
                    <Typography>{editableFields.carColor}</Typography>
                    <IconButton
                      onClick={() => handleOpenImageModal(DomiCar, "carColor")}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Car Year")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("carYear", t("Car Year"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Car Type */}
            <Grid item xs={12} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Car Type")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("carType", t("Car Type"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Payment Details Tab */}
        {activeTab === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, mb: 2, background: theme.palette.secondary.sec }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">
                    {t("Wallet")}: {driver.wallet}
                  </Typography>
                  <CreditCardIcon color="primary" />
                </Box>
                <Typography variant="body1" mt={1}>
                  {t("Your Cash")}: {driver.wallet}
                </Typography>
              </Paper>

              <Typography variant="h6" color="primary" mb={1}>
                {t("Payment Details")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Account Number")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField("accountNumber", t("Account Number"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Bank letter")}
                  </Typography>
                  {renderDownloadLink("Bank Letter", "bankLetter")}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary" mt={3} mb={1}>
                {t("Transactions")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {driver.transactions.map((transaction) =>
                renderTransactionItem(transaction)
              )}
            </Grid>
          </Grid>
        )}

        {/* Trips Tab */}
        {activeTab === 3 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" mb={1}>
                {t("Current Trips")}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {driver.trips
                .filter((trip) => trip.status === "current")
                .map((trip, i) => (
                  <Card
                    key={`current-${i}`}
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
                            {trip.from} to {trip.to}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trip.time} · {trip.driver.name} · {trip.car.plate}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ fontSize: "16px", fontWeight: 700 }}
                          onClick={() => handleOpenDrawer(trip)}
                        >
                          {t("Details")}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

              <Typography variant="h6" color="primary" mt={4} mb={1}>
                {t("Past Trips")}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {driver.trips
                .filter((trip) => trip.status === "past")
                .map((trip, i) => (
                  <Card
                    key={`past-${i}`}
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
                            {trip.from} to {trip.to}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trip.time} · {trip.driver.name} · {trip.car.plate}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ fontSize: "16px", fontWeight: 700 }}
                          onClick={() => handleOpenDrawer(trip)}
                        >
                          {t("Details")}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Grid>
          </Grid>
        )}
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
                    right: 8,
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
                        mb: 4,
                        "&:last-child": { mb: 0 },
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
                              ? "calc(100% - 12px)"
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
                    left: 8,
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
                        mb: 4,
                        "&:last-child": { mb: 0 },
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
                              ? "calc(100% - 12px)"
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
                sx={{ mb: 2 }}
              >
                {t("Done")}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Image Modal */}
      <Dialog
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{t(imageType)}</Typography>
            <IconButton onClick={handleCloseImageModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingImage ? (
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => fileInputRef.current.click()}
                sx={{ mb: 2 }}
              >
                {t("Select New Image")}
              </Button>

              {newImage ? (
                <Box
                  component="img"
                  src={newImage}
                  alt="Preview"
                  sx={{
                    maxHeight: "60vh",
                    maxWidth: "100%",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {t("No image selected")}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              component="img"
              src={selectedImage}
              alt={imageType}
              sx={{
                maxHeight: "60vh",
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          {editingImage ? (
            <>
              <Button onClick={() => setEditingImage(false)}>
                {t("Cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveImage}
                disabled={!newImage}
              >
                {t("Save")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteImage}
              >
                {t("Delete")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditImage}
              >
                {t("Update")}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
