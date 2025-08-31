import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  useTheme,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import imageCompression from "browser-image-compression";
import { useDispatch } from "react-redux";
import { addCarType } from "../../redux/slices/carType/thunk";
import notify from "../../components/notify";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

export default function AddCarTypePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [carTypeImage, setCarTypeImage] = useState(null);
  const isArabic = i18n.language === "ar";
  const [loading, setLoading] = useState(false);

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("CarTypes");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete")


  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t("Car Type Name English is required"))
      .min(2, t("Name must be at least 2 characters")),
    nameAr: Yup.string()
      .required(t("Car Type Name Arabic is required"))
      .min(2, t("Name must be at least 2 characters")),
    waitingPrice: Yup.number()
      .required(t("Waiting Price is required"))
      .positive(t("Price must be positive")),
    kiloPrice: Yup.number()
      .required(t("Kilo Price is required"))
      .positive(t("Price must be positive")),
  });

  const formik = useFormik({
    initialValues: {
      nameEn: "",
      nameAr: "",
      waitingPrice: "",
      kiloPrice: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const formData = new FormData();
      formData.append("name_en", values.nameEn);
      formData.append("name_ar", values.nameAr);
      formData.append("waiting_price_per_minute", values.waitingPrice);
      formData.append("kilo_price", values.kiloPrice);

      if (carTypeImage) {
        formData.append("image", carTypeImage);
      }

      try {
        const response = await dispatch(addCarType({ data: formData })).unwrap();
        // alert(t("Car type added successfully!"));
        navigate("/CarTypes");
      } catch (err) {
        console.error("Error adding car type:", err);
        if (err?.response?.data?.errors && Array.isArray(err?.response?.data?.errors)) {
          err?.response?.data?.errors?.forEach((error) => {
            notify(error.message, "error");
          });
        } else {
          notify("حدث خطأ غير متوقع", "error");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setCarTypeImage(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  const handleRemoveImage = () => {
    setCarTypeImage(null);
  };


  if(!hasAddPermission) return <Navigate to="/profile" />

  return (
    <Box
      maxWidth="md"
      sx={{ p: 2 }}
      component="form"
      onSubmit={formik.handleSubmit}
    >
      {/* Breadcrumb */}
      <Box
        sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}
      >
        <Typography
          onClick={() => navigate("/CarTypes")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Car Types")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography>{t("Add Car Type")}</Typography>
      </Box>

      {/* Page Title */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Add Car Type")}
      </Typography>

      {/* Car Type Picture */}
      <Typography variant="h6" gutterBottom mt={3}>
        {t("Car Type Picture")}
      </Typography>

      <Card
        sx={{
          backgroundColor: theme.palette.secondary.sec,
          borderRadius: 1,
          mb: 3,
          border: "none",
          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Typography paragraph sx={{ mb: 2, alignSelf: "flex-start" }}>
            {t(
              "Maximum file size allowed is 2MB, supported file formats include .jpg, .png, and .pdf."
            )}
          </Typography>

          {carTypeImage ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#ECFDF3",
                border: "1px solid #ABEFC6",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ ml: 1 }}>{carTypeImage.name}</Typography>
              </Box>
              <IconButton onClick={handleRemoveImage} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Button
              component="label"
              variant="contained"
              endIcon={<AddIcon sx={{ [isArabic ? "mr" : ""]: 1 }} />}
            >
              {t("Upload Files")}
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleImageChange}
              />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Name English */}
      <Typography variant="h6" gutterBottom>
        {t("Car Type Name English")}
        <Typography component="span" sx={{ color: "error.main", mx: 1 }}>
          *
        </Typography>
      </Typography>
      <TextField
        fullWidth
        name="nameEn"
        placeholder={t("Enter the Car Type Name English")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            border: "none",
            borderRadius: 1,
            padding: "10px 12px",
          },
        }}
        value={formik.values.nameEn}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nameEn && Boolean(formik.errors.nameEn)}
        helperText={formik.touched.nameEn && formik.errors.nameEn}
        sx={{ mb: 3 }}
      />

      {/* Name Arabic */}
      <Typography variant="h6" gutterBottom>
        {t("Car Type Name Arabic")}
        <Typography component="span" sx={{ color: "error.main" }}>
          *
        </Typography>
      </Typography>
      <TextField
        fullWidth
        name="nameAr"
        placeholder={t("Enter the Car Type Name Arabic")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            border: "none",
            borderRadius: 1,
            padding: "10px 12px",
          },
        }}
        value={formik.values.nameAr}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nameAr && Boolean(formik.errors.nameAr)}
        helperText={formik.touched.nameAr && formik.errors.nameAr}
        sx={{ mb: 3 }}
      />

      {/* Waiting Price */}
      <Typography variant="h6" gutterBottom>
        {t("Waiting Price per minute")}
        <Typography component="span" sx={{ color: "error.main" }}>
          *
        </Typography>
      </Typography>
      <TextField
        fullWidth
        name="waitingPrice"
        placeholder={t("Enter Waiting Price per minute")}
        variant="standard"
        type="text"
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography>SAR</Typography>,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            border: "none",
            borderRadius: 1,
            padding: "10px 12px",
          },
        }}
        value={formik.values.waitingPrice}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("waitingPrice", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={
          formik.touched.waitingPrice && Boolean(formik.errors.waitingPrice)
        }
        helperText={formik.touched.waitingPrice && formik.errors.waitingPrice}
        sx={{ mb: 3 }}
      />

      {/* Kilo Price */}
      <Typography variant="h6" gutterBottom>
        {t("Kilo Price")}
        <Typography component="span" sx={{ color: "error.main" }}>
          *
        </Typography>
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
            border: "none",
            padding: "10px 12px",
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

      {/* Submit */}
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
