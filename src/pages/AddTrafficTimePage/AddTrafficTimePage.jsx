import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddTrafficTimePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t("Traffic Time Name English is required"))
      .min(2, t("Name must be at least 2 characters")),
    nameAr: Yup.string()
      .required(t("Traffic Time Name Arabic is required"))
      .min(2, t("Name must be at least 2 characters")),
    timeFrom: Yup.string().required(t("Time From is required")),
    timeTo: Yup.string().required(t("Time To is required")),
    kiloPrice: Yup.number()
      .required(t("Kilo Price is required"))
      .positive(t("Price must be positive")),
  });

  const formik = useFormik({
    initialValues: {
      nameEn: "",
      nameAr: "",
      timeFrom: "",
      timeTo: "",
      kiloPrice: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);

      // Simulate API
      setTimeout(() => {
        console.log("Traffic Time Submitted:", values);
        setLoading(false);
        alert(t("Traffic time added successfully!"));
        navigate("/TrafficTime");
      }, 1500);
    },
  });

  return (
    <Box maxWidth="md" sx={{ p: 2 }} component="form" onSubmit={formik.handleSubmit}>
      {/* Breadcrumbs */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
        <Typography
          onClick={() => navigate("/TrafficTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Traffic Time")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/TrafficTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Traffic Time Details")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography>{t("Add Traffic Time")}</Typography>
      </Box>

      {/* Title */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Add Traffic Time")}
      </Typography>

      {/* Fields */}

      {/* English Name */}
      <Typography variant="h6" gutterBottom mt={3}>
        {t("Traffic Time Name English")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="nameEn"
        placeholder={t("Enter the Traffic Time Name English")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: "10px 12px",
          },
        }}
        value={formik.values.nameEn}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nameEn && Boolean(formik.errors.nameEn)}
        helperText={formik.touched.nameEn && formik.errors.nameEn}
        sx={{ mb: 3 }}
      />

      {/* Arabic Name */}
      <Typography variant="h6" gutterBottom>
        {t("Traffic Time Name Arabic")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="nameAr"
        placeholder={t("Enter the Traffic Time Name Arabic")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: "10px 12px",
          },
        }}
        value={formik.values.nameAr}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nameAr && Boolean(formik.errors.nameAr)}
        helperText={formik.touched.nameAr && formik.errors.nameAr}
        sx={{ mb: 3 }}
      />

      {/* Time From */}
      <Typography variant="h6" gutterBottom>
        {t("Time From")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="time"
        name="timeFrom"
        variant="standard"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: "10px 12px",
          },
        }}
        value={formik.values.timeFrom}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.timeFrom && Boolean(formik.errors.timeFrom)}
        helperText={formik.touched.timeFrom && formik.errors.timeFrom}
        sx={{ mb: 3 }}
      />

      {/* Time To */}
      <Typography variant="h6" gutterBottom>
        {t("Time To")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="time"
        name="timeTo"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: "10px 12px",
          },
        }}
        value={formik.values.timeTo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.timeTo && Boolean(formik.errors.timeTo)}
        helperText={formik.touched.timeTo && formik.errors.timeTo}
        sx={{ mb: 3 }}
      />

      {/* Kilo Price */}
      <Typography variant="h6" gutterBottom>
        {t("Kilo Price")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="kiloPrice"
        placeholder={t("Enter Kilo Price")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography>SAR</Typography>,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: "10px 12px",
          },
        }}
        value={formik.values.kiloPrice}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("kiloPrice", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.kiloPrice && Boolean(formik.errors.kiloPrice)}
        helperText={formik.touched.kiloPrice && formik.errors.kiloPrice}
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
