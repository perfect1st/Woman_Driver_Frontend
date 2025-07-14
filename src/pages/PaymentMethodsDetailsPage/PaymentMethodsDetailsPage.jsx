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

const PaymentMethodsDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const navigate = useNavigate();

  // Dummy payment method object
  const onePaymentMethod = {
    id: "#1",
    nameEn: "Credit Card",
    nameAr: "بطاقة ائتمان",
  };

  const [editableFields, setEditableFields] = useState({
    nameEn: onePaymentMethod.nameEn,
    nameAr: onePaymentMethod.nameAr,
  });

  const [editMode, setEditMode] = useState({
    nameEn: false,
    nameAr: false,
  });

  const [loading, setLoading] = useState({
    nameEn: false,
    nameAr: false,
  });

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (field) => {
    setLoading((prev) => ({ ...prev, [field]: true }));

    // Simulate API call
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [field]: false }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
      console.log(`Saved ${field}:`, editableFields[field]);
    }, 1000);
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const renderEditableCard = (field, label) => (
    <Card
      sx={{
        background: theme.palette.secondary.sec,
        p: 2,
        mb: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {t(label)}
      </Typography>

      {editMode[field] ? (
        <Box display="flex" alignItems="center" mt={1} gap={1}>
          <TextField
            type="text"
            value={editableFields[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            fullWidth
            size="small"
          />
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
        >
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
            {editableFields[field]}
          </Typography>
          <IconButton onClick={() => toggleEditMode(field)}>
            <EditIcon />
          </IconButton>
        </Box>
      )}
    </Card>
  );

  return (
    <Box p={3}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" mb={2}>
        <Typography
          onClick={() => navigate("/PaymentMethods")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Payment Methods")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/PaymentMethods")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Payment Methods Details")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography>{
          isArabic
            ? onePaymentMethod.nameAr
            : onePaymentMethod.nameEn
        }</Typography>
      </Box>

      {/* Title */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          {isArabic
            ? onePaymentMethod.nameAr
            : onePaymentMethod.nameEn}{" "}
          {onePaymentMethod.id}
        </Typography>
      </Box>

      {/* Editable Info Cards */}
      <Box maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderEditableCard(
              "nameEn",
              "Payment Method Name English"
            )}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard(
              "nameAr",
              "Payment Method Name Arabic"
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentMethodsDetailsPage;
