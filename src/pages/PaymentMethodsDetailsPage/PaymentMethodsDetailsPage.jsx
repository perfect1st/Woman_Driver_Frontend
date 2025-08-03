import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editPaymentMethod,
  getOnePaymentMethod,
} from "../../redux/slices/paymentMethod/thunk";

const PaymentMethodsDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOnePaymentMethod(id));
  }, []);

  const { paymentMethod } = useSelector((state) => state.paymentMethod);
  console.log("paymentMethod", paymentMethod);
  // Dummy payment method object

  const [editableFields, setEditableFields] = useState({
    name_en: paymentMethod?.name_en,
    name_ar: paymentMethod?.name_ar,
  });

  const [editMode, setEditMode] = useState({
    name_en: false,
    name_ar: false,
  });

  const [loading, setLoading] = useState({
    name_en: false,
    name_ar: false,
  });

  useEffect(() => {
    if (paymentMethod) {
      setEditableFields({
        name_en: paymentMethod.name_en || "",
        name_ar: paymentMethod.name_ar || "",
      });
    }
  }, [paymentMethod]);

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (field) => {
    setLoading((prev) => ({ ...prev, [field]: true }));
    const data = {
      [field]: editableFields[field],
    };
    try {
      await dispatch(editPaymentMethod({ id, data }));
    } catch (error) {
      console.error("Error saving field:", error);
    } finally {
      setEditMode((prev) => ({ ...prev, [field]: false }));
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
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
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.primary }}
          >
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
        <Typography>
          {isArabic ? paymentMethod?.name_ar : paymentMethod?.name_en}
        </Typography>
      </Box>

      {/* Title */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          {isArabic ? paymentMethod?.name_ar : paymentMethod?.name_en}{" "}
          {paymentMethod?.id}
        </Typography>
      </Box>

      {/* Editable Info Cards */}
      <Box maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderEditableCard("name_en", "Payment Method Name English")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("name_ar", "Payment Method Name Arabic")}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentMethodsDetailsPage;
