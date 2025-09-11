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
import { addPaymentMethod } from "../../redux/slices/paymentMethod/thunk";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";


export default function AddPaymentMethodPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("PaymentMethods");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete");

  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t("Payment Method Name English is required"))
      .min(2, t("Name must be at least 2 characters")),
    nameAr: Yup.string()
      .required(t("Payment Method Name Arabic is required"))
      .min(2, t("Name must be at least 2 characters")),
      type: Yup.string()
      .required(t("Payment Method Type is required")),
  });

  const formik = useFormik({
    initialValues: {
      nameEn: "",
      nameAr: "",
          type: "", 

    },
    validationSchema,
    onSubmit:async  (values) => {
      const data ={
        name_ar:values?.nameAr,
        name_en:values?.nameEn,
        type: values?.type,
        status:true
      }
      try {
        setLoading(true);
        await dispatch(addPaymentMethod({data}))
        navigate("/PaymentMethods");
        
      } catch (error) {
        console.log("error")
      }finally{
        setLoading(false);
      }

   
    },
  });
  if (!hasAddPermission) return <Navigate to="/profile" />;

  return (
    <Box maxWidth="md" sx={{ p: 2 }} component="form" onSubmit={formik.handleSubmit}>
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
        <Typography
          onClick={() => navigate("/PaymentMethods")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Payment Methods")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/PaymentMethods")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Payment Methods Details")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography>{t("Add Payment Method")}</Typography>
      </Box>

      <Typography variant="h5" color="primary" gutterBottom>
        {t("Add Payment Method")}
      </Typography>

      <Typography variant="h6" gutterBottom mt={3}>
        {t("Payment Method Name English")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="nameEn"
        placeholder={t("Enter the Payment Method Name English")}
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

      <Typography variant="h6" gutterBottom>
        {t("Payment Method Name Arabic")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <TextField
        fullWidth
        name="nameAr"
        placeholder={t("Enter the Payment Method Name Arabic")}
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

<Typography variant="h6" gutterBottom>
  {t("Payment Method Type")}{" "}
  <Typography component="span" color="error.main">*</Typography>
</Typography>
<TextField
  select
  fullWidth
  name="type"
  variant="standard"
  value={formik.values.type}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={formik.touched.type && Boolean(formik.errors.type)}
  helperText={formik.touched.type && formik.errors.type}
  InputProps={{
    disableUnderline: true,
    sx: {
      backgroundColor: theme.palette.secondary.sec,
      borderRadius: 1,
      p: "10px 12px",
    },
  }}
  sx={{ mb: 3 }}
>
  <MenuItem value="">{t("Select Payment Method Type")}</MenuItem>
  <MenuItem value="cash">{t("Cash")}</MenuItem>
  <MenuItem value="visa">{t("Visa")}</MenuItem>
  <MenuItem value="cash_wallet">{t("Cash Wallet")}</MenuItem>
</TextField>

      <Divider sx={{ my: 3 }} />

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
