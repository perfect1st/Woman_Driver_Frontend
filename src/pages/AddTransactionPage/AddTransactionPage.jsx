// AddTransactionPage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  useTheme,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../components/RTLTextField";
import { getAllUsersLookups, getAllTripsLookups } from "../../redux/slices/lookups/thunk";
import { createTransaction } from "../../redux/slices/wallet/thunk";
import { useSelector, useDispatch } from "react-redux";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import { getUserCookie } from "../../hooks/authCookies";

export default function AddTransactionPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const user = getUserCookie();
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);

  const { usersLookups = [], tripsLookups = [] } = useSelector((state) => state.lookups || {});

  // Debounce refs for search
  const userSearchRef = useRef(null);
  const tripSearchRef = useRef(null);


    function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Wallet");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete");

  // constants
  const userTypeOptions = [
    { value: "passenger", label: t("passenger") },
    { value: "driver_with_car", label: t("driver_with_car") },
    { value: "driver_company", label: t("driver_company") },
  ];

  const transactionTypeOptions = [
    { value: "credit", label: t("credit") },
    { value: "debit", label: t("debit") },
  ];

  const transactionReasonOptions = [
    { value: "cashback", label: t("cashback") },
    { value: "commission", label: t("commission") },
    { value: "payment_online", label: t("payment_online") },
    { value: "remaining_money_from_driver", label: t("remaining_money_from_driver") },
    { value: "daily_commission", label: t("daily_commission") },
    { value: "paid_cash_for_trip", label: t("paid_cash_for_trip") },
  ];

  const validationSchema = Yup.object({
    userType: Yup.string().required(t("User Type is required")),
    userName: Yup.mixed().required(t("User Name is required")),
    // tripId intentionally NOT required
    transactionType: Yup.string().required(t("Transaction Type is required")),
    transactionReason: Yup.string().required(t("Transaction Reason is required")),
    amount: Yup.number()
      .typeError(t("Amount must be a number"))
      .required(t("Amount is required"))
      .positive(t("Amount must be positive")),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      userType: "",
      userName: null, // will store full user object
      tripId: null, // will store full trip object (optional)
      transactionType: "",
      transactionReason: "",
      amount: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          trans_type: values.transactionType,
          amount: Number(values.amount),
          notes: values.notes || "",
          transaction_type: values.transactionReason,
          user_id: values.userName?._id, // user object or id
          admin_id: user?.id, 
          // trips_id should be omitted if not provided
          ...(values.tripId ? { trips_id: values.tripId._id || values.tripId } : {}),
        };

        // dispatch the createTransaction thunk and wait for result
        await dispatch(createTransaction({data:payload}));

        setLoading(false);
        navigate("/wallet");
      } catch (err) {
        console.error(err);
        setLoading(false);
        alert(t("An error occurred while creating the transaction"));
      }
    },
  });

  // fetch users when userType changes
  useEffect(() => {
    if (!formik.values.userType) return;
    setUsersLoading(true);
    // initial fetch without search
    let query = `user_type=${formik.values.userType}`
    dispatch(getAllUsersLookups({ query }))
      .finally(() => setUsersLoading(false));
  }, [dispatch, formik.values.userType]);

  useEffect(() => {
    if (!formik.values.userName) return;
    setTripsLoading(true);
    const userId = formik.values.userName._id ;
    let type = formik.values.userType == "passenger" ? "userId" : "driverId"
    let query = `${type}=${userId}`
    dispatch(getAllTripsLookups({ query }))
      .finally(() => setTripsLoading(false));
  }, [dispatch, formik.values.userName]);

  const handleUserSearch = (search) => {
    if (!formik.values.userType) return;
    if (userSearchRef.current) clearTimeout(userSearchRef.current);
   
  };

  const handleTripSearch = (search) => {
    if (!formik.values.userName) return;
    if (tripSearchRef.current) clearTimeout(tripSearchRef.current);
  };

  if(!hasAddPermission) return <Navigate to="/profile" />
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
            backgroundColor: theme.palette.secondary?.sec || '#f5f5f5',
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.userType}
        onChange={(e) => {
          const val = e.target.value;
          formik.setFieldValue('userType', val);
          // reset dependent fields
          formik.setFieldValue('userName', null);
          formik.setFieldValue('tripId', null);
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.userType && Boolean(formik.errors.userType)}
        helperText={formik.touched.userType && formik.errors.userType}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("Choose User Type")}</MenuItem>
        {userTypeOptions.map((type) => (
          <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
        ))}
      </CustomTextField>

      {/* User Name (searchable) */}
      <Typography variant="h6" gutterBottom>
        {t("User Name")} <Typography component="span" color="error.main">*</Typography>
      </Typography>

      <Autocomplete
        disablePortal
        fullWidth
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.fullname || opt.name || '')}
        options={usersLookups || []}
        loading={usersLoading}
        value={formik.values.userName}
        onChange={(e, newVal) => {
          formik.setFieldValue('userName', newVal);
          formik.setFieldValue('tripId', null);
        }}
        onInputChange={(e, value, reason) => {
          if (reason === 'input') handleUserSearch(value);
        }}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            variant="standard"
            placeholder={t("Search user by name or phone")}
            isRtl={isArabic}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              sx: {
                backgroundColor: theme.palette.secondary?.sec || '#f5f5f5',
                borderRadius: 1,
                p: '6px 10px',
              },
            }}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
          />
        )}
        sx={{ mb: 3 }}
      />

      {/* Trip ID (searchable) - optional */}
      <Typography variant="h6" gutterBottom>
        {t("Trip ID")} <Typography component="span" sx={{ color: 'text.secondary', fontSize: 12 }}>({t("optional")})</Typography>
      </Typography>

      <Autocomplete
        disablePortal
        fullWidth
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.trip_number || '')}
        options={tripsLookups || []}
        loading={tripsLoading}
        value={formik.values.tripId}
        onChange={(e, newVal) => formik.setFieldValue('tripId', newVal)}
        onInputChange={(e, value, reason) => {
          if (reason === 'input') handleTripSearch(value);
        }}
        disabled={!formik.values.userName}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            variant="standard"
            placeholder={t("Search trip by id or number")}
            isRtl={isArabic}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              sx: {
                backgroundColor: theme.palette.secondary?.sec || '#f5f5f5',
                borderRadius: 1,
                p: '6px 10px',
              },
            }}
          />
        )}
        sx={{ mb: 3 }}
      />

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
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary?.sec || '#f5f5f5',
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.transactionType}
        onChange={(e) => formik.setFieldValue('transactionType', e.target.value)}
        onBlur={formik.handleBlur}
        error={formik.touched.transactionType && Boolean(formik.errors.transactionType)}
        helperText={formik.touched.transactionType && formik.errors.transactionType}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">{t("Choose Transaction Type")}</MenuItem>
        {transactionTypeOptions.map((tOpt) => (
          <MenuItem key={tOpt.value} value={tOpt.value}>{tOpt.label}</MenuItem>
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
        isRtl={isArabic}
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary?.sec || '#f5f5f5',
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
          <MenuItem key={reason.value} value={reason.value}>{reason.label}</MenuItem>
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
            backgroundColor: theme.palette.secondary?.sec || '#f5f5f5',
            borderRadius: 1,
            p: '10px 12px',
          },
        }}
        value={formik.values.amount}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*\.?\d*$/.test(val)) formik.setFieldValue('amount', val);
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
            backgroundColor: theme.palette.secondary?.sec || '#f5f5f5',
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
