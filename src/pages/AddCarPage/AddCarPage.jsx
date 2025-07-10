import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FilledInput,
  IconButton,
  useTheme,
  FormHelperText,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

const IMAGE_FIELDS = ["Front", "Back", "Right", "Left"];
const CAR_TYPE_OPTIONS = ["Sedan", "SUV", "Truck", "Hatchback"];

export default function AddCarPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState({});
  const isArabic = i18n.language === "ar";

  // Form validation schema
  const validationSchema = Yup.object({
    licenseExpiredDate: Yup.date().required(t("Expired date is required")),
    carModel: Yup.string().required(t("Car model is required")),
    ownershipType: Yup.string().required(t("Ownership type is required")),
    plateNumber: Yup.string().required(t("Plate number is required")),
    carColor: Yup.string().required(t("Car color is required")),
    carType: Yup.string().required(t("Car type is required")),
    carYear: Yup.number()
      .min(1900, t("Invalid year"))
      .max(new Date().getFullYear() + 1, t("Invalid year"))
      .required(t("Car year is required")),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      licenseExpiredDate: "",
      carModel: "",
      ownershipType: "",
      plateNumber: "",
      carColor: "",
      carType: "",
      carYear: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Prepare form data including images
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      Object.entries(images).forEach(([field, file]) => {
        if (file) formData.append(field, file);
      });

      // Submit logic here (API call, etc.)
      console.log("Form submitted:", Object.fromEntries(formData));
      alert(t("Form submitted successfully!"));
    },
  });

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImages((prev) => ({ ...prev, [field]: file }));
  };

  const handleRemoveImage = (field) => () => {
    setImages((prev) => ({ ...prev, [field]: null }));
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
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars Details")}
        </Typography>
        <Typography sx={{ mx: 1 }}>{"<"}</Typography>
        <Typography>{t("Add Car")}</Typography>
      </Box>

      {/* Car License */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Car License")}
      </Typography>
      <Box
        sx={{
          height: 2,
          backgroundColor: theme.palette.secondary.sec,
          mb: 2,
          borderRadius: 1,
        }}
      />
      <Typography gutterBottom>{t("Car License Picture")}</Typography>
      <Card
        sx={{
          backgroundColor: theme.palette.secondary.sec,
          borderRadius: 1,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{t("maxSizeText")}</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ [isArabic ? "ml" : "mr"]: 1 }} />}
          >
            {t("Upload Files")}
          </Button>
        </CardContent>
      </Card>

      {/* Expired Date */}
      <Box sx={{ mb: 3 }}>
        <Typography>
          {t("Expired Date")}
          <Typography component="span" sx={{ color: "error.main" }}>
            *
          </Typography>
        </Typography>
        <TextField
          fullWidth
          name="licenseExpiredDate"
          placeholder={t("Enter the Expired Date")}
          variant="filled"
          type="date"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            disableUnderline: true,
            sx: {
              backgroundColor: theme.palette.secondary.sec,
              borderRadius: 1,
            },
          }}
          value={formik.values.licenseExpiredDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.licenseExpiredDate &&
            Boolean(formik.errors.licenseExpiredDate)
          }
          helperText={
            formik.touched.licenseExpiredDate &&
            formik.errors.licenseExpiredDate
          }
        />
      </Box>

      {/* Car Details */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Car Details")}
      </Typography>
      <Box
        sx={{
          height: 2,
          backgroundColor: theme.palette.secondary.sec,
          mb: 2,
          borderRadius: 1,
        }}
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Model */}
        <Grid item xs={12} md={6}>
          <Typography>
            {t("Car Model")}
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            name="carModel"
            placeholder={t("Enter the Car Model name")}
            variant="filled"
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              },
            }}
            value={formik.values.carModel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.carModel && Boolean(formik.errors.carModel)}
            helperText={formik.touched.carModel && formik.errors.carModel}
          />
        </Grid>

        {/* Company/Personal */}
        <Grid item xs={12} md={6}>
          <Typography>
            {t("Company Car")}
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          </Typography>

          <FormControl
            fullWidth
            variant="filled"
            error={
              formik.touched.ownershipType &&
              Boolean(formik.errors.ownershipType)
            }
          >
            <Select
              name="ownershipType"
              displayEmpty
              value={formik.values.ownershipType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              input={
                <FilledInput
                  disableUnderline
                  sx={{
                    backgroundColor: theme.palette.secondary.sec,
                    borderRadius: 1,
                  }}
                />
              }
            >
              <MenuItem value="" disabled>
                {/* <em>
                  </em> */}
                {t("Is Company Car ?")}
              </MenuItem>
              <MenuItem value="company">{t("Company Car")}</MenuItem>
              <MenuItem value="personal">{t("Personal Car")}</MenuItem>
            </Select>
            {formik.touched.ownershipType && formik.errors.ownershipType && (
              <FormHelperText>{formik.errors.ownershipType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Plate */}
        <Grid item xs={12} md={6}>
          <Typography>
            {t("Plate Number")}
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            name="plateNumber"
            placeholder={t("Enter the Plate Number")}
            variant="filled"
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              },
            }}
            value={formik.values.plateNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.plateNumber && Boolean(formik.errors.plateNumber)
            }
            helperText={formik.touched.plateNumber && formik.errors.plateNumber}
          />
        </Grid>

        {/* Color */}
        <Grid item xs={12} md={6}>
          <Typography>
            {t("Car Color")}
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            name="carColor"
            placeholder={t("Enter the Car Color")}
            variant="filled"
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              },
            }}
            value={formik.values.carColor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.carColor && Boolean(formik.errors.carColor)}
            helperText={formik.touched.carColor && formik.errors.carColor}
          />
        </Grid>

        {/* Type */}
        <Grid item xs={12} md={6}>
          <Typography>
            {t("Car Type")}
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          </Typography>

          <FormControl
            fullWidth
            variant="filled"
            error={formik.touched.carType && Boolean(formik.errors.carType)}
          >
            <Select
              name="carType"
              displayEmpty
              value={formik.values.carType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              input={
                <FilledInput
                  disableUnderline
                  sx={{
                    backgroundColor: theme.palette.secondary.sec,
                    borderRadius: 1,
                  }}
                />
              }
            >
              <MenuItem value="" disabled>
                {/* <em>
                  </em> */}
                {t("Select Car Type")}
              </MenuItem>
              {CAR_TYPE_OPTIONS.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.carType && formik.errors.carType && (
              <FormHelperText>{formik.errors.carType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Year */}
        <Grid item xs={12} md={6}>
          <Typography>
            {t("Car Year")}
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            name="carYear"
            placeholder={t("Enter the Car Year")}
            variant="filled"
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              },
            }}
            value={formik.values.carYear}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.carYear && Boolean(formik.errors.carYear)}
            helperText={formik.touched.carYear && formik.errors.carYear}
          />
        </Grid>
      </Grid>

      {/* Car Pictures */}
      <Typography variant="h5" color="primary" gutterBottom>
        {t("Car Picture")}
      </Typography>
      <Box
        sx={{
          height: 2,
          backgroundColor: theme.palette.secondary.sec,
          mb: 2,
          borderRadius: 1,
        }}
      />
      <Grid container spacing={2}>
        {IMAGE_FIELDS.map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <Card sx={{ p: 2, borderRadius: 1 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CarIcon color="primary" />
                <Typography sx={{ [isArabic ? "mr" : "ml"]: 1 }}>
                  {t(`Car’s Picture ${field}`)}
                </Typography>
              </Box>
              {images[field] ? (
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 1,
                      minWidth: 0,
                    }}
                  >
                    {/* Icon */}
                    <CheckCircleIcon
                      sx={{
                        backgroundColor: "#067647",
                        color: "white",
                        borderRadius: "50%",
                        mx: 1,
                      }}
                    />
                    {/* Truncated filename */}
                    <Typography
                      noWrap
                      sx={{
                        flexGrow: 1, // so the typography takes all remaining space
                        minWidth: 0, // important for overflow inside flex
                      }}
                    >
                      {images[field].name}
                    </Typography>
                  </Box>

                  <IconButton onClick={handleRemoveImage(field)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography>{t("maxSizeText")}</Typography>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<AddIcon sx={{ [isArabic ? "ml" : "mr"]: 1 }} />}
                  >
                    {t("Upload Files")}
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange(field)}
                    />
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          // fullWidth
          sx={{
            px: 6, // increases left & right padding, makes button wider
          }}
        >
          {t("Save")}
        </Button>
      </Box>
    </Box>
  );
}
