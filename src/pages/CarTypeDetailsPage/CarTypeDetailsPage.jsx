import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import IOSSwitch from "../../components/IOSSwitch";
import DomiCar from "../../assets/DomiCar.png";

const CarTypeDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const navigate = useNavigate();

  // Initial car type data
  const carTypeData = {
    id: "#76312",
    nameEn: "Economy",
    nameAr: "اقتصادي",
    waitingPrice: 10,
    kiloPrice: 30,
    status: "Available",
    image: DomiCar,
  };

  // State for editable fields
  const [editableFields, setEditableFields] = useState({
    nameEn: carTypeData.nameEn,
    nameAr: carTypeData.nameAr,
    waitingPrice: carTypeData.waitingPrice,
    kiloPrice: carTypeData.kiloPrice,
    status: carTypeData.status,
  });

  // State for edit mode and loading
  const [editMode, setEditMode] = useState({
    nameEn: false,
    nameAr: false,
    waitingPrice: false,
    kiloPrice: false,
  });

  const [loading, setLoading] = useState({
    nameEn: false,
    nameAr: false,
    waitingPrice: false,
    kiloPrice: false,
  });

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
    setEditableFields((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const renderEditableCard = (field, title, currency = false) => {
    return (
      <Card
        sx={{
          background: theme.palette.secondary.sec,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2">{t(title)}</Typography>
          
        </Box>

        {editMode[field] ? (
          <Box display="flex" alignItems="center" mt={2} gap={1}>
            <TextField
              value={editableFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
              type={currency ? "number" : "text"}
              InputProps={{
                startAdornment: currency && (
                  <Typography sx={{ mr: 1 }}>SAR</Typography>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <IconButton
              onClick={() => handleSave(field)}
              disabled={loading[field]}
            >
              {loading[field] ? (
                <CircularProgress size={24} />
              ) : (
                <SaveIcon />
              )}
            </IconButton>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} gap={1}>

          <Typography
            variant="h6"
            sx={{ mt: 1, color: theme.palette.text.blue }}
          >
            {editableFields[field]}
            {currency ? " SAR" : ""}
            {field === "waitingPrice" && " / 1 Min."}
          </Typography>
          <IconButton
          onClick={() => toggleEditMode(field)}
          sx={{ visibility: editMode[field] ? "hidden" : "visible" }}
        >
          <EditIcon />
        </IconButton>
        </Box>
        )}
      </Card>
    );
  };

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/CarTypes")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Car Types")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/CarTypes")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Car Types Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{editableFields.nameEn}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2} textAlign="start">
        <Typography variant="h5" fontWeight="bold">
          {editableFields.nameEn} {carTypeData.id}
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
            src={carTypeData.image}
            alt={editableFields.nameEn}
            sx={{
              width: 200,
              height: 150,
              objectFit: "contain",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Status Toggle */}
        <Box display="flex" alignItems="center" mt={2}>
          <Typography>{t(editableFields.status)}</Typography>
          <IOSSwitch
            checked={editableFields.status === "Available"}
            onChange={toggleAvailability}
            sx={{ mx: 1 }}
            color="primary"
          />
        </Box>
      </Box>

      {/* Car Type Details Cards */}
      <Box maxWidth="md">
        <Grid container spacing={2}>
          {/* English Name */}
          <Grid item xs={12} md={12}>
            {renderEditableCard("nameEn", "Car Type Name English")}
          </Grid>

          {/* Arabic Name */}
          <Grid item xs={12} md={12}>
            {renderEditableCard("nameAr", "Car Type Name Arabic")}
          </Grid>

          {/* Waiting Price */}
          <Grid item xs={12} md={12}>
            {renderEditableCard("waitingPrice", "Waiting Price per minute", true)}
          </Grid>

          {/* Kilo Price */}
          <Grid item xs={12} md={12}>
            {renderEditableCard("kiloPrice", "Kilo Price", true)}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CarTypeDetailsPage;