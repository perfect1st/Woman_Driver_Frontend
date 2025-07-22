import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  TextField,
  CircularProgress,
  MenuItem,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CommissionCategoryDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const navigate = useNavigate();

  // Dummy data
  const oneCommission = {
    id: "4521",
    commissionValue: "15",
    carType: "SUV",
    amountFrom: "1000",
    amountTo: "5000",
  };

  const carTypeOptions = ["SUV", "Sedan", "Truck", "Van"];

  const [editableFields, setEditableFields] = useState({
    commissionValue: oneCommission.commissionValue,
    carType: oneCommission.carType,
    amountFrom: oneCommission.amountFrom,
    amountTo: oneCommission.amountTo,
  });

  const [editMode, setEditMode] = useState({
    commissionValue: false,
    carType: false,
    amountFrom: false,
    amountTo: false,
  });

  const [loading, setLoading] = useState({
    commissionValue: false,
    carType: false,
    amountFrom: false,
    amountTo: false,
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

  const renderEditableCard = (field, label, type = "text", selectOptions = [], adornment = null) => (
    <Card
      sx={{
        background: theme.palette.secondary.sec,
        p: 1,
        mb: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="title" fontWeight={"bold"}>
        {t(label)}
      </Typography>

      {editMode[field] ? (
        <Box display="flex" alignItems="center" mt={1} gap={1}>
          {selectOptions.length > 0 ? (
            <TextField
              select
              value={editableFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
            >
              {selectOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              type={type}
              value={editableFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: adornment ? (
                  <Typography ml={1}>{adornment}</Typography>
                ) : null,
              }}
            />
          )}
          <IconButton onClick={() => handleSave(field)} disabled={loading[field]}>
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} gap={1}>
          <Typography variant="title" sx={{ color: theme.palette.text.blue }}>
            {editableFields[field]} {adornment || ""}
          </Typography>
          <IconButton onClick={() => toggleEditMode(field)}>
            <EditIcon />
          </IconButton>
        </Box>
      )}
    </Card>
  );

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={4}>
        <Typography
          onClick={() => navigate("/CommissionCategories")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Commission Categories")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/CommissionCategories")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Commission Categories Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{`#${oneCommission.id}`}</Typography>
      </Box>

      {/* Title */}
      

      {/* Editable Info Cards */}
      <Box maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderEditableCard("commissionValue", "Commission Value %", "number", [], "%")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("carType", "Car Type", "text", carTypeOptions)}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("amountFrom", "Amount From", "number", [], t('SAR'))}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("amountTo", "Amount To", "number", [], t('SAR'))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CommissionCategoryDetails;
