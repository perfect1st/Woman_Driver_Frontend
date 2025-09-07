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
import { addCoupon } from "../../redux/slices/coupon/thunk"; 
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

export default function AddCouponPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Coupons");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasAddPermission = hasPermission("add");

  const validationSchema = Yup.object({
    title: Yup.string().required(t("coupon.validation.title")),
    coupon_type: Yup.string().required(t("coupon.validation.coupon_type")),
    coupon_value: Yup.number()
      .required(t("coupon.validation.coupon_value"))
      .min(0, t("coupon.validation.coupon_value_min"))
      .when("coupon_type", {
        is: "percentage",
        then: (schema) =>
          schema.max(100, t("coupon.validation.coupon_value_max_percentage")),
      }),
    maximum_discount_value: Yup.number()
      .required(t("coupon.validation.max_discount"))
      .min(1, t("coupon.validation.max_discount_min")),
    usage_count: Yup.number()
      .required(t("coupon.validation.usage_count"))
      .min(1, t("coupon.validation.usage_count_min")),
    usage_count_per_user_value: Yup.number()
      .required(t("coupon.validation.usage_count_per_user"))
      .min(1, t("coupon.validation.usage_count_per_user_min")),
    start_date: Yup.date().required(t("coupon.validation.start_date")),
    end_date: Yup.date()
      .required(t("coupon.validation.end_date"))
      .min(Yup.ref("start_date"), t("coupon.validation.end_date_after")),
    desc: Yup.string().required(t("coupon.validation.desc")),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      coupon_type: "percentage",
      coupon_value: "",
      maximum_discount_value: "",
      usage_count: "",
      usage_count_per_user_value: "",
      start_date: "",
      end_date: "",
      desc: "",
      status: "active",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await dispatch(addCoupon({ data: values })).unwrap();
        notify("تمت إضافة الكوبون بنجاح", "success");
        navigate("/Coupons");
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
          onClick={() => navigate("/Coupons")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("coupon.breadcrumb.coupons")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/Coupons")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("coupon.breadcrumb.details")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography>{t("coupon.breadcrumb.add")}</Typography>
      </Box>

      <Typography variant="h5" color="primary" gutterBottom>
        {t("coupon.add_title")}
      </Typography>

      {/* Title */}
      <Typography variant="h6" gutterBottom>
        {t("coupon.fields.title")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        placeholder={t("coupon.placeholders.title")}
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

      {/* Coupon Type */}
      <Typography variant="h6" gutterBottom>
        {t("coupon.fields.coupon_type")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        select
        fullWidth
        name="coupon_type"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.coupon_type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.coupon_type && Boolean(formik.errors.coupon_type)}
        helperText={formik.touched.coupon_type && formik.errors.coupon_type}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("coupon.placeholders.coupon_type")}</MenuItem>
        <MenuItem value="percentage">{t("coupon.types.percentage")}</MenuItem>
        <MenuItem value="fixed">{t("coupon.types.fixed")}</MenuItem>
      </TextField>

      {/* Coupon Value */}
      <Typography variant="h6" gutterBottom>
        {t("coupon.fields.coupon_value")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="number"
        placeholder={t("coupon.placeholders.coupon_value")}
        name="coupon_value"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.coupon_value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.coupon_value && Boolean(formik.errors.coupon_value)}
        helperText={formik.touched.coupon_value && formik.errors.coupon_value}
        sx={{ mb: 3 }}
      />

      {/* Max Discount */}
      <Typography variant="h6" gutterBottom>
        {t("coupon.fields.max_discount")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="number"
        placeholder={t("coupon.placeholders.max_discount")}
        name="maximum_discount_value"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.maximum_discount_value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.maximum_discount_value &&
          Boolean(formik.errors.maximum_discount_value)
        }
        helperText={
          formik.touched.maximum_discount_value &&
          formik.errors.maximum_discount_value
        }
        sx={{ mb: 3 }}
      />

      {/* Usage Count */}
      <Typography variant="h6" gutterBottom>
        {t("coupon.fields.usage_count")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="number"
        placeholder={t("coupon.placeholders.usage_count")}
        name="usage_count"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.usage_count}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.usage_count && Boolean(formik.errors.usage_count)}
        helperText={formik.touched.usage_count && formik.errors.usage_count}
        sx={{ mb: 3 }}
      />

      {/* Usage Count Per User */}
      <Typography variant="h6" gutterBottom>
        {t("coupon.fields.usage_count_per_user")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        type="number"
        placeholder={t("coupon.placeholders.usage_count_per_user")}
        name="usage_count_per_user_value"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { backgroundColor: theme.palette.secondary.sec, borderRadius: 1, p: "10px 12px" },
        }}
        value={formik.values.usage_count_per_user_value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.usage_count_per_user_value &&
          Boolean(formik.errors.usage_count_per_user_value)
        }
        helperText={
          formik.touched.usage_count_per_user_value &&
          formik.errors.usage_count_per_user_value
        }
        sx={{ mb: 3 }}
      />

      {/* Start Date */}
      <Typography variant="h6" gutterBottom>
        {t("coupon.fields.start_date")} <Typography component="span" color="error.main">*</Typography>
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
        {t("coupon.fields.end_date")} <Typography component="span" color="error.main">*</Typography>
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
        {t("coupon.fields.desc")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder={t("coupon.placeholders.desc")}
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
          {loading ? t("coupon.saving") : t("coupon.save")}
        </Button>
      </Box>
    </Box>
  );
}
