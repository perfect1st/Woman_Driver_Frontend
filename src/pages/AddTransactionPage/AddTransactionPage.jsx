import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../components/RTLTextField";

export default function AddTransactionPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    userType: Yup.string().required(t("User Type is required")),
    userName: Yup.string().required(t("User Name is required")),
    tripId: Yup.string().required(t("Trip ID is required")),
    transactionType: Yup.string().required(t("Transaction Type is required")),
    transactionReason: Yup.string().required(t("Transaction Reason is required")),
    amount: Yup.number()
      .required(t("Amount is required"))
      .positive(t("Amount must be positive")),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      userType: "",
      userName: "",
      tripId: "",
      transactionType: "",
      transactionReason: "",
      amount: "",
      notes: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        console.log("Transaction Submitted:", values);
        setLoading(false);
        alert(t("Transaction added successfully!"));
        navigate("/transactions");
      }, 1500);
    },
  });

  // Options
  const userTypeOptions = ["Client", "Driver", "Admin"];
  const userNameOptions = formik.values.userType ? ["John Doe", "Jane Smith"] : [];
  const tripIdOptions = formik.values.userName ? ["TRIP123", "TRIP456"] : [];
  const transactionTypeOptions = formik.values.tripId ? ["Credit", "Debit"] : [];
  const transactionReasonOptions = formik.values.transactionType ? ["Payment", "Refund", "Adjustment"] : [];

  return (
    <Box maxWidth="md" sx={{ p: 2 }} component="form" onSubmit={formik.handleSubmit}>
      {/* Breadcrumbs */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography onClick={() => navigate('/wallet')} sx={{ cursor: "pointer", color: theme.palette.primary.main }}>
          {t("Wallet")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography onClick={() => navigate('/wallet')} sx={{ cursor: "pointer", color: theme.palette.primary.main }}>
          {t("Wallet Details")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography color="text.primary">{t("Add Transaction")}</Typography>
      </Box>

      {/* Title */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Add Transaction")}
      </Typography>

      {/* User Type */}
      <Typography variant="h6" gutterBottom mt={3}>
        {t("User Type")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        select
        name="userType"
        placeholder={t("Choose User Type")}
        variant="standard"
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.userType}
        onChange={(e) => {
          const val = e.target.value;
          formik.setFieldValue('userType', val);
          formik.setFieldValue('userName', '');
          formik.setFieldValue('tripId', '');
          formik.setFieldValue('transactionType', '');
          formik.setFieldValue('transactionReason', '');
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.userType && Boolean(formik.errors.userType)}
        helperText={formik.touched.userType && formik.errors.userType}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("Choose User Type")}</MenuItem>
        {userTypeOptions.map((type) => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </CustomTextField>

      {/* User Name */}
      <Typography variant="h6" gutterBottom>
        {t("User Name")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        select
        name="userName"
        placeholder={t("Choose User Name")}
        variant="standard"
        disabled={!formik.values.userType}
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.userName}
        onChange={(e) => {
          const val = e.target.value;
          formik.setFieldValue('userName', val);
          formik.setFieldValue('tripId', '');
          formik.setFieldValue('transactionType', '');
          formik.setFieldValue('transactionReason', '');
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.userName && Boolean(formik.errors.userName)}
        helperText={formik.touched.userName && formik.errors.userName}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("Choose User Name")}</MenuItem>
        {userNameOptions.map((name) => (
          <MenuItem key={name} value={name}>{name}</MenuItem>
        ))}
      </CustomTextField>

      {/* Trip ID */}
      <Typography variant="h6" gutterBottom>
        {t("Trip ID")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        select
        name="tripId"
        placeholder={t("Choose Trip ID")}
        variant="standard"
        disabled={!formik.values.userName}
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.tripId}
        onChange={(e) => {
          const val = e.target.value;
          formik.setFieldValue('tripId', val);
          formik.setFieldValue('transactionType', '');
          formik.setFieldValue('transactionReason', '');
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.tripId && Boolean(formik.errors.tripId)}
        helperText={formik.touched.tripId && formik.errors.tripId}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("Choose Trip ID")}</MenuItem>
        {tripIdOptions.map((id) => (
          <MenuItem key={id} value={id}>{id}</MenuItem>
        ))}
      </CustomTextField>

      {/* Transaction Type */}
      <Typography variant="h6" gutterBottom>
        {t("Transaction Type")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        select
        name="transactionType"
        placeholder={t("Choose Transaction Type")}
        variant="standard"
        disabled={!formik.values.tripId}
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.transactionType}
        onChange={(e) => {
          const val = e.target.value;
          formik.setFieldValue('transactionType', val);
          formik.setFieldValue('transactionReason', '');
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.transactionType && Boolean(formik.errors.transactionType)}
        helperText={formik.touched.transactionType && formik.errors.transactionType}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("Choose Transaction Type")}</MenuItem>
        {transactionTypeOptions.map((type) => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </CustomTextField>

      {/* Transaction Reason */}
      <Typography variant="h6" gutterBottom>
        {t("Transaction Reason")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        select
        name="transactionReason"
        placeholder={t("Choose Transaction Reason")}
        variant="standard"
        disabled={!formik.values.transactionType}
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.transactionReason}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.transactionReason && Boolean(formik.errors.transactionReason)}
        helperText={formik.touched.transactionReason && formik.errors.transactionReason}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("Choose Transaction Reason")}</MenuItem>
        {transactionReasonOptions.map((reason) => (
          <MenuItem key={reason} value={reason}>{reason}</MenuItem>
        ))}
      </CustomTextField>

      {/* Amount */}
      <Typography variant="h6" gutterBottom>
        {t("Amount")} <Typography component="span" color="error.main">*</Typography>
      </Typography>
      <CustomTextField
        fullWidth
        name="amount"
        placeholder={t("Enter the Amount")}
        variant="standard"
        type="text"
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.amount}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*\.?\d*$/.test(val)) formik.setFieldValue("amount", val);
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.touched.amount && formik.errors.amount}
        sx={{ mb: 3 }}
      />

      {/* Notes */}
      <Typography variant="h6" gutterBottom>
        {t("Notes")}
      </Typography>
      <CustomTextField
        fullWidth
        name="notes"
        placeholder={t("Enter the Notes")}
        variant="standard"
        multiline
        rows={4}
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.notes}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.notes && Boolean(formik.errors.notes)}
        helperText={formik.touched.notes && formik.errors.notes}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ px: 6 }}
        >
          {loading ? t("Saving...") : t("Save")}
        </Button>
      </Box>
    </Box>
  );
}
