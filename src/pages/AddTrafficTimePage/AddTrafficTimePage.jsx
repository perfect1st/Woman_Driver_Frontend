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
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addTrafficTime } from "../../redux/slices/trafficTime/thunk";

export default function AddTrafficTimePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    title_en: Yup.string()
      .required(t("Traffic Time Name English is required"))
      .min(2, t("Name must be at least 2 characters")),
    title_ar: Yup.string()
      .required(t("Traffic Time Name Arabic is required"))
      .min(2, t("Name must be at least 2 characters")),
    time_from: Yup.string().required(t("Time From is required")),
    time_to: Yup.string().required(t("Time To is required")),
    kilo_price_percentage: Yup.number()
      .required(t("Kilo Price is required"))
      .positive(t("Price must be positive")),
  });

  const formik = useFormik({
    initialValues: {
      title_en: "",
      title_ar: "",
      time_from: "",
      time_to: "",
      kilo_price_percentage: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(addTrafficTime({ data: values })).unwrap();
        navigate("/TrafficTime");
      } catch (error) {
        console.error("Add TrafficTime error:", error);
      } finally {
        setLoading(false);
      }
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
        <Typography>{t("Add Traffic Time")}</Typography>
      </Box>

      {/* Title */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Add Traffic Time")}
      </Typography>

      {/* English Name */}
      <Typography variant="h6" gutterBottom mt={3}>
        {t("Traffic Time Name English")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="title_en"
        placeholder={t("Enter the Traffic Time Name English")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.title_en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title_en && Boolean(formik.errors.title_en)}
        helperText={formik.touched.title_en && formik.errors.title_en}
        sx={{ mb: 3 }}
      />

      {/* Arabic Name */}
      <Typography variant="h6" gutterBottom>
        {t("Traffic Time Name Arabic")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="title_ar"
        placeholder={t("Enter the Traffic Time Name Arabic")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.title_ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
        helperText={formik.touched.title_ar && formik.errors.title_ar}
        sx={{ mb: 3 }}
      />

      {/* Time From */}
      <Typography variant="h6" gutterBottom>
        {t("Time From")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="time"
        name="time_from"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.time_from}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.time_from && Boolean(formik.errors.time_from)}
        helperText={formik.touched.time_from && formik.errors.time_from}
        sx={{ mb: 3 }}
      />

      {/* Time To */}
      <Typography variant="h6" gutterBottom>
        {t("Time To")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="time"
        name="time_to"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.time_to}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.time_to && Boolean(formik.errors.time_to)}
        helperText={formik.touched.time_to && formik.errors.time_to}
        sx={{ mb: 3 }}
      />

      {/* Kilo Price */}
      <Typography variant="h6" gutterBottom>
        {t("kilo_price_percentage")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="kilo_price_percentage"
        placeholder={`${t("Enter Kilo Price")} %`}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography>%</Typography>,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.kilo_price_percentage}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("kilo_price_percentage", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.kilo_price_percentage && Boolean(formik.errors.kilo_price_percentage)}
        helperText={formik.touched.kilo_price_percentage && formik.errors.kilo_price_percentage}
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
