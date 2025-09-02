import React, { useEffect, useState } from "react";
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
import {addCommissionCategory} from "../../redux/slices/commissionCategory/thunk";
import {
  getAllCarTypesWithoutPaginations,
} from "../../redux/slices/carType/thunk";
import { useDispatch, useSelector } from "react-redux";
export default function AddCommissionCategory() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language =="ar"
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { allCarTypes } = useSelector((state) => state.carType);
console.log("allCarTypes",allCarTypes)
  useEffect(()=>{
    dispatch(getAllCarTypesWithoutPaginations({query:""}))
  },[])

  const validationSchema = Yup.object({
    commission_value_driver_with_car: Yup.number()
      .required(t("Commission Driver With Car Value is required"))
      .positive(t("Value must be positive")),
      commission_value_driver_company: Yup.number()
      .required(t("Commission Driver Company Value is required"))
      .positive(t("Value must be positive")),
      car_types_id: Yup.string().required(t("Car Type is required")),
    amount_from: Yup.number()
      .required(t("Amount From is required"))
      .positive(t("Amount must be positive")),
    amount_to: Yup.number()
      .required(t("Amount To is required"))
      .positive(t("Amount must be positive")),
  });

  const formik = useFormik({
    initialValues: {
      commission_value_driver_with_car: "",
      commission_value_driver_company: "",
      car_types_id: "",
      amount_from: "",
      amount_to: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await dispatch(addCommissionCategory({data:values}))
      console.log("Commission Category Submitted:", values);
      setLoading(false);
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
          onClick={() => navigate("/CommissionCategory")}
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
        {`${t("Commission (Driver With Car)")}  %`} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="commission_value_driver_with_car"
        placeholder={t("Enter Driver With Car Commission Value")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography ml={1}>%</Typography>,
          sx: inputStyle,
        }}
        value={formik.values.commission_value_driver_with_car}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("commission_value_driver_with_car", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.commission_value_driver_with_car && Boolean(formik.errors.commission_value_driver_with_car)}
        helperText={formik.touched.commission_value_driver_with_car && formik.errors.commission_value_driver_with_car}
        sx={{ mb: 3 }}
      />
      <Typography variant="h6" gutterBottom mt={3}>
        {`${t("Commission (Driver Company)")}  %`} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="commission_value_driver_company"
        placeholder={t("Enter Driver Company Commission Value")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography ml={1}>%</Typography>,
          sx: inputStyle,
        }}
        value={formik.values.commission_value_driver_company}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("commission_value_driver_company", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.commission_value_driver_company && Boolean(formik.errors.commission_value_driver_company)}
        helperText={formik.touched.commission_value_driver_company && formik.errors.commission_value_driver_company}
        sx={{ mb: 3 }}
      />

      {/* Car Type */}
      <Typography variant="h6" gutterBottom>
        {t("Car Type")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        select
        fullWidth
        name="car_types_id"
        placeholder={t("Select Car Type")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: inputStyle,
        }}
        value={formik.values.car_types_id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.car_types_id && Boolean(formik.errors.car_types_id)}
        helperText={formik.touched.car_types_id && formik.errors.car_types_id}
        sx={{ mb: 3 }}
      >
        {allCarTypes?.data?.map((type) => (
          <MenuItem key={type?._id} value={type?._id}>
            {isArabic ? type?.name_ar : type?.name_en}
          </MenuItem>
        ))}
      </CustomTextField>

      {/* Amount From */}
      <Typography variant="h6" gutterBottom>
        {t("Amount From")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="amount_from"
        placeholder={t("Enter Amount From")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography ml={1}>{t("SAR")}</Typography>,
          sx: inputStyle,
        }}
        value={formik.values.amount_from}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("amount_from", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.amount_from && Boolean(formik.errors.amount_from)}
        helperText={formik.touched.amount_from && formik.errors.amount_from}
        sx={{ mb: 3 }}
      />

      {/* Amount To */}
      <Typography variant="h6" gutterBottom>
        {t("Amount To")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="amount_to"
        placeholder={t("Enter Amount To")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography ml={1}>{t("SAR")}</Typography>,
          sx: inputStyle,
        }}
        value={formik.values.amount_to}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("amount_to", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.amount_to && Boolean(formik.errors.amount_to)}
        helperText={formik.touched.amount_to && formik.errors.amount_to}
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
