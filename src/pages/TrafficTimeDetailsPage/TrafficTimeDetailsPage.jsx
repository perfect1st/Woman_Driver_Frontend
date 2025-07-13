import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  TextField,
  CircularProgress,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TrafficTimeDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const navigate = useNavigate();

  // Dummy traffic time object
  const oneTrafficTime = {
    id: "#76312",
    nameEn: "Traffic Time 7 PM",
    nameAr: "موعد الذروة 7 مساءً",
    timeFrom: "06:00",
    timeTo: "10:00",
    kiloPrice: "150 %",
  };

  const [editableFields, setEditableFields] = useState({
    nameEn: oneTrafficTime.nameEn,
    nameAr: oneTrafficTime.nameAr,
    timeFrom: oneTrafficTime.timeFrom,
    timeTo: oneTrafficTime.timeTo,
    kiloPrice: oneTrafficTime.kiloPrice,
  });

  const [editMode, setEditMode] = useState({
    nameEn: false,
    nameAr: false,
    timeFrom: false,
    timeTo: false,
    kiloPrice: false,
  });

  const [loading, setLoading] = useState({
    nameEn: false,
    nameAr: false,
    timeFrom: false,
    timeTo: false,
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

  const renderEditableCard = (field, label,type='text') => (
    <Card
      sx={{
        background: theme.palette.secondary.sec,
        p: 1,
        mb: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="title" fontWeight={"bold"}>{t(label)}</Typography>

      {editMode[field] ? (
        <Box display="flex" alignItems="center" mt={1} gap={1}>
          <TextField
          type={type}
            value={editableFields[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            fullWidth
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} gap={1}>
          <Typography
            variant="title"
            sx={{ color: theme.palette.text.blue }}
          >
            {editableFields[field]}
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

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/TrafficTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Traffic Time")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/TrafficTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Traffic Time Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{isArabic ? oneTrafficTime.nameAr :oneTrafficTime.nameEn}</Typography>
      </Box>

      {/* Title */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
        {isArabic ? oneTrafficTime.nameAr :oneTrafficTime.nameEn} {oneTrafficTime.id}
        </Typography>
      </Box>

      {/* Editable Info Cards */}
      <Box maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderEditableCard("nameEn", "Traffic Time Name English")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("nameAr", "Traffic Time Name Arabic")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("timeFrom", "Time From",'time')}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("timeTo", "Time To",'time')}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("kiloPrice", "Kilo Price")}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TrafficTimeDetailsPage;
