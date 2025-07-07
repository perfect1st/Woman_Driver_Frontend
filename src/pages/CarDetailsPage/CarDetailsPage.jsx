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
  Divider,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import IOSSwitch from "../../components/IOSSwitch";

// Mock assets and styles
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

const carTypes = ["Sedan", "SUV", "Truck", "Van", "Luxury"];

const carData = {
  id: "#72641",
  model: "Toyota Camry",
  carType: "Sedan",
  companyCar: true,
  licenseExpiry: "2025-10-01",
  status: "Available",
  image: DomiCar,
  plateNumber: "145 اوص",
  carColor: "Gold",
  carYear: "2020",
  carLicense: "CAR-LIC-456",
  totalTrips: 1250,
  rating: 4.7,
};

export default function CarDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState("");
  const [editingImage, setEditingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const fileInputRef = useRef(null);

  // State for editable fields
  const [editableFields, setEditableFields] = useState({
    model: carData.model,
    carType: carData.carType,
    plateNumber: carData.plateNumber,
    carColor: carData.carColor,
    carYear: carData.carYear,
    carLicense: carData.carLicense,
    licenseExpiry: carData.licenseExpiry,
    isCompanyCar: carData.companyCar,
    status: carData.status,
  });

  // State for edit mode and loading
  const [editMode, setEditMode] = useState({
    model: false,
    carType: false,
    plateNumber: false,
    carColor: false,
    carYear: false,
    carLicense: false,
    licenseExpiry: false,
    isCompanyCar: false,
    status: false,
  });

  const [loading, setLoading] = useState({
    model: false,
    carType: false,
    plateNumber: false,
    carColor: false,
    carYear: false,
    carLicense: false,
    licenseExpiry: false,
    isCompanyCar: false,
    status: false,
  });

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
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    console.log("Image saved:", imageType);
    setEditingImage(false);
    setNewImage(null);
  };

  const handleDeleteImage = () => {
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

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{carData.model}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2} textAlign="start">
        <Typography variant="h5" fontWeight="bold">
          {carData.model} {carData.id}
        </Typography>
      </Box>

      {/* Car Image */}
      <Box
        maxWidth="md"
        mb={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box position="relative">
          <Box
            component="img"
            src={carData.image}
            alt={carData.model}
            sx={{
              width: 200,
              height: 150,
              objectFit: "contain",
              borderRadius: 2,
              // border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>

        {/* Car Name */}
        <Typography variant="h6" mt={2} color="primary">
          {carData.model}
        </Typography>

        {/* Status Toggle */}
        <Box display="flex" alignItems="center" mt={0.5}>
          <Typography>{t(editableFields.status)}</Typography>
          <IOSSwitch
            checked={editableFields.status === "Available"}
            onChange={toggleAvailability}
            sx={{ mx: 1 }}
             color="primary"
          />
        </Box>

        {/* Car Info */}
        {/* <Box display="flex" alignItems="center" mt={1}>
          <Typography mr={1}>
            {t("Total Trip")}: {carData.totalTrips}
          </Typography>
          <Box display="flex" alignItems="center" ml={2}>
            <Typography>{carData.rating}</Typography>
            <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
          </Box>
        </Box> */}
      </Box>

      {/* Car Documents Section */}
      <Box maxWidth="md">
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

          {/* Car Pictures */}
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
                    "licenseExpiry",
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
                  {renderEditableField("model", t("Car Model"))}
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
      </Box>

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