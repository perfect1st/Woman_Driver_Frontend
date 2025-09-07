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
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addOffer } from "../../redux/slices/offer/thunk";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

export default function AddOfferPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Offers");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasAddPermission = hasPermission("add");

  const validationSchema = Yup.object({
    title: Yup.string().required(t("offer.validation.title")),
    offer_type: Yup.string().required(t("offer.validation.offer_type")),
    offer_value: Yup.number()
      .required(t("offer.validation.offer_value"))
      .min(0, t("offer.validation.offer_value_min")) 
      .when("offer_type", {
        is: "percentage",
        then: (schema) =>
          schema.max(100, t("offer.validation.offer_value_max_percentage")), 
      }),
    maximum_discount_value: Yup.number()
      .required(t("offer.validation.max_discount"))
      .min(1, t("offer.validation.max_discount_min")),
    start_date: Yup.date().required(t("offer.validation.start_date")),
    end_date: Yup.date()
      .required(t("offer.validation.end_date"))
      .min(Yup.ref("start_date"), t("offer.validation.end_date_after")),
    desc: Yup.string().required(t("offer.validation.desc")),
  });
  
  const formik = useFormik({
    initialValues: {
      title: "",
      offer_type: "percentage",
      offer_value: "",
      maximum_discount_value: "",
      start_date: "",
      end_date: "",
      desc: "",
      status: "active",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await dispatch(addOffer({ data: values })).unwrap();
        notify("تمت إضافة العرض بنجاح", "success");
        navigate("/Offers");
      } catch (error) {
        notify(error, "error"); 
      } finally {
        setLoading(false);
      }
    },
  });

  if (!hasAddPermission) return <Navigate to="/profile" />;

  return (
    <Box
      maxWidth="md"
      sx={{ p: 2 }}
      component="form"
      onSubmit={formik.handleSubmit}
    >
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
        <Typography
          onClick={() => navigate("/Offers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("offer.breadcrumb.offers")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/Offers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("offer.breadcrumb.details")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography>{t("offer.breadcrumb.add")}</Typography>
      </Box>

      <Typography variant="h5" color="primary" gutterBottom>
        {t("offer.add_title")}
      </Typography>

      {/* Title */}
      <Typography variant="h6" gutterBottom>
        {t("offer.fields.title")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        placeholder={t("offer.placeholders.title")}
        name="title"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        sx={{ mb: 3 }}
      />

      {/* Offer Type */}
      <Typography variant="h6" gutterBottom>
        {t("offer.fields.offer_type")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        select
        fullWidth
        name="offer_type"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.offer_type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.offer_type && Boolean(formik.errors.offer_type)}
        helperText={formik.touched.offer_type && formik.errors.offer_type}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("offer.placeholders.offer_type")}</MenuItem>
        <MenuItem value="percentage">{t("offer.types.percentage")}</MenuItem>
        <MenuItem value="fixed">{t("offer.types.fixed")}</MenuItem>
      </TextField>

      {/* Offer Value */}
      <Typography variant="h6" gutterBottom>
        {t("offer.fields.offer_value")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="number"
        placeholder={t("offer.placeholders.offer_value")}
        name="offer_value"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.offer_value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.offer_value && Boolean(formik.errors.offer_value)}
        helperText={formik.touched.offer_value && formik.errors.offer_value}
        sx={{ mb: 3 }}
      />

      {/* Max Discount */}
      <Typography variant="h6" gutterBottom>
        {t("offer.fields.max_discount")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="number"
        placeholder={t("offer.placeholders.max_discount")}
        name="maximum_discount_value"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.maximum_discount_value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.maximum_discount_value && Boolean(formik.errors.maximum_discount_value)}
        helperText={formik.touched.maximum_discount_value && formik.errors.maximum_discount_value}
        sx={{ mb: 3 }}
      />

      {/* Start Date */}
      <Typography variant="h6" gutterBottom>
        {t("offer.fields.start_date")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="date"
        name="start_date"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        InputLabelProps={{ shrink: true }}
        value={formik.values.start_date}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.start_date && Boolean(formik.errors.start_date)}
        helperText={formik.touched.start_date && formik.errors.start_date}
        sx={{ mb: 3 }}
      />

      {/* End Date */}
      <Typography variant="h6" gutterBottom>
        {t("offer.fields.end_date")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="date"
        name="end_date"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        InputLabelProps={{ shrink: true }}
        value={formik.values.end_date}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.end_date && Boolean(formik.errors.end_date)}
        helperText={formik.touched.end_date && formik.errors.end_date}
        sx={{ mb: 3 }}
      />

      {/* Description */}
      <Typography variant="h6" gutterBottom>
        {t("offer.fields.desc")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder={t("offer.placeholders.desc")}
        name="desc"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.desc}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.desc && Boolean(formik.errors.desc)}
        helperText={formik.touched.desc && formik.errors.desc}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />

      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ px: 6 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? t("offer.saving") : t("offer.save")}
        </Button>
      </Box>
    </Box>
  );
}
