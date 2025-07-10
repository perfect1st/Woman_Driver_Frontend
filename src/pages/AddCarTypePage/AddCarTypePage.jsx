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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCarTypePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [carTypeImage, setCarTypeImage] = useState(null);
  const isArabic = i18n.language === "ar";
  const [loading, setLoading] = useState(false);

  // Form validation schema
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

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      nameEn: "",
      nameAr: "",
      waitingPrice: "",
      kiloPrice: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);

      // Prepare form data including image
      const formData = new FormData();
      formData.append("nameEn", values.nameEn);
      formData.append("nameAr", values.nameAr);
      formData.append("waitingPrice", values.waitingPrice);
      formData.append("kiloPrice", values.kiloPrice);

      if (carTypeImage) {
        formData.append("image", carTypeImage);
      }

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        console.log("Form submitted:", Object.fromEntries(formData));
        alert(t("Car type added successfully!"));
        navigate("/CarTypes");
      }, 1500);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCarTypeImage(file);
  };

  const handleRemoveImage = () => {
    setCarTypeImage(null);
  };

  return (
    <Box
      maxWidth="md"
      sx={{ p: 2 }}
      component="form"
      onSubmit={formik.handleSubmit}
    >
      {/* Breadcrumbs */}
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
        <Typography
          onClick={() => navigate("/CarTypes")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Car Types Details")}
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
            justifyContent: "space-between",
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

      {/* Car Type Name English */}
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
            "& input": {
              // color: theme.palette.text.blue
            },
          },
        }}
        value={formik.values.nameEn}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nameEn && Boolean(formik.errors.nameEn)}
        helperText={formik.touched.nameEn && formik.errors.nameEn}
        sx={{ mb: 3 }}
      />

      {/* Car Type Name Arabic */}
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
            "& input": {
              // color: theme.palette.text.blue
            },
          },
        }}
        value={formik.values.nameAr}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nameAr && Boolean(formik.errors.nameAr)}
        helperText={formik.touched.nameAr && formik.errors.nameAr}
        sx={{ mb: 3 }}
      />

      {/* Waiting Price per minute */}
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
        type="text" // text, not number
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography>SAR</Typography>,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            border: "none",
            borderRadius: 1,
            padding: "10px 12px",
            "& input": {
              // color: theme.palette.text.blue
            },
          },
        }}
        value={formik.values.waitingPrice}
        onChange={(e) => {
          const value = e.target.value;
          // Accept only digits and optional dot (for decimal values)
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
        type="text" // Use text instead of number
        InputProps={{
          disableUnderline: true,
          endAdornment: <Typography>SAR</Typography>,
          sx: {
            backgroundColor: theme.palette.secondary.sec,
            borderRadius: 1,
            border: "none",
            padding: "10px 12px",
            "& input": {
              // Optional: style input text
            },
          },
        }}
        value={formik.values.kiloPrice}
        onChange={(e) => {
          const value = e.target.value;
          // Allow only digits and one optional decimal point
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>

        <Button
          type="submit"
          variant="contained"
          // fullWidth
          sx={{
            px: 6 // increases left & right padding, makes button wider
          }}
                    disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? t("Saving...") : t("Save")}
        </Button>
      </Box>
    </Box>
  );
}
