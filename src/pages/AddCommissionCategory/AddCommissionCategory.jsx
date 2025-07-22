import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  CircularProgress,
  Divider,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../components/RTLTextField";

export default function AddCommissionCategory() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const carTypeOptions = ["SUV", "Sedan", "Truck", "Van"];

  const validationSchema = Yup.object({
    commissionValue: Yup.number()
      .required(t("Commission Value is required"))
      .positive(t("Value must be positive")),
    carType: Yup.string().required(t("Car Type is required")),
    amountFrom: Yup.number()
      .required(t("Amount From is required"))
      .positive(t("Amount must be positive")),
    amountTo: Yup.number()
      .required(t("Amount To is required"))
      .positive(t("Amount must be positive")),
  });

  const formik = useFormik({
    initialValues: {
      commissionValue: "",
      carType: "",
      amountFrom: "",
      amountTo: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);

      setTimeout(() => {
        console.log("Commission Category Submitted:", values);
        setLoading(false);
        alert(t("Commission category added successfully!"));
        navigate("/CommissionCategories");
      }, 1500);
    },
  });

  const inputStyle = {
    backgroundColor: theme.palette.secondary.sec,
    borderRadius: 1,
    p: "10px 12px",
  };

  return (
    <Box maxWidth="md" sx={{ p: 2 }} component="form" onSubmit={formik.handleSubmit}>
      {/* Breadcrumbs */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
        <Typography
          onClick={() => navigate("/CommissionCategories")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Commission Categories")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography>{t("Add Commission Category")}</Typography>
      </Box>

      {/* Title */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Add Commission Category")}
      </Typography>

      {/* Commission Value */}
      <Typography variant="h6" gutterBottom mt={3}>
        {`${t("Commission Value")}  %`} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="commissionValue"
        placeholder={t("Enter Commission Value")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography ml={1}>%</Typography>,
          sx: inputStyle,
        }}
        value={formik.values.commissionValue}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("commissionValue", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.commissionValue && Boolean(formik.errors.commissionValue)}
        helperText={formik.touched.commissionValue && formik.errors.commissionValue}
        sx={{ mb: 3 }}
      />

      {/* Car Type */}
      <Typography variant="h6" gutterBottom>
        {t("Car Type")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        select
        fullWidth
        name="carType"
        placeholder={t("Select Car Type")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: inputStyle,
        }}
        value={formik.values.carType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.carType && Boolean(formik.errors.carType)}
        helperText={formik.touched.carType && formik.errors.carType}
        sx={{ mb: 3 }}
      >
        {carTypeOptions.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </CustomTextField>

      {/* Amount From */}
      <Typography variant="h6" gutterBottom>
        {t("Amount From")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="amountFrom"
        placeholder={t("Enter Amount From")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography ml={1}>{t("SAR")}</Typography>,
          sx: inputStyle,
        }}
        value={formik.values.amountFrom}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("amountFrom", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.amountFrom && Boolean(formik.errors.amountFrom)}
        helperText={formik.touched.amountFrom && formik.errors.amountFrom}
        sx={{ mb: 3 }}
      />

      {/* Amount To */}
      <Typography variant="h6" gutterBottom>
        {t("Amount To")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="amountTo"
        placeholder={t("Enter Amount To")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography ml={1}>{t("SAR")}</Typography>,
          sx: inputStyle,
        }}
        value={formik.values.amountTo}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("amountTo", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.amountTo && Boolean(formik.errors.amountTo)}
        helperText={formik.touched.amountTo && formik.errors.amountTo}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ px: 6 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? t("Saving...") : t("Save")}
        </Button>
      </Box>
    </Box>
  );
}
