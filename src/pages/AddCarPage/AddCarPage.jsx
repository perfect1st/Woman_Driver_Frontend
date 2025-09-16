import React, { useState, useEffect } from "react";
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
  FilledInput,
  IconButton,
  useTheme,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addCar } from "../../redux/slices/car/thunk";
import { getAllCarTypesWithoutPaginations } from "../../redux/slices/carType/thunk";
import notify from "../../components/notify";
import imageCompression from "browser-image-compression";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

const LICENSE_FIELDS = ["front", "back"];
const IMAGE_FIELDS = ["front", "back", "right", "left"];


async function compressImage(file, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 1024;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Compression failed"));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

function toFieldKey(message) {
  const stopWords = ["is", "must"];
  let parts = message.split(" ");
  let idx = parts.findIndex((w) => stopWords.includes(w));
  if (idx === -1) idx = parts.length;
  const fieldWords = parts.slice(0, idx);
  const key = fieldWords
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
  return key;
}

export default function AddCarPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";
  const {  allCarTypes } = useSelector(
    (state) => state.carType
  );
const [loading,setLoading] = useState(false)

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Cars");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit")
  const hasDeletePermission = hasPermission("delete")

  const [licenseImages, setLicenseImages] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    let query = "";
    dispatch(getAllCarTypesWithoutPaginations({query}));
  }, [dispatch]);

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
    onSubmit: async (values) => {
      const formData = new FormData();
    
      // البيانات النصية أو الرقمية
      formData.append("plate_number", values.plateNumber);
      formData.append("car_model", values.carModel);
      formData.append("car_license_expired_date", values.licenseExpiredDate);
      formData.append("is_company_car", values.ownershipType === "company"); // Boolean
      formData.append("car_color", values.carColor);
      formData.append("car_year", values.carYear);
      formData.append("car_types_id", values.carType);
    
      // الملفات: الرخصة
      if (licenseImages.front)
        formData.append("car_license_front", licenseImages.front);
      if (licenseImages.back)
        formData.append("car_license_back", licenseImages.back);
    
      // الصور: السيارة
      if (images.front)
        formData.append("car_front", images.front);
      if (images.back)
        formData.append("car_back", images.back);
      if (images.left)
        formData.append("car_left", images.left);
      if (images.right)
        formData.append("car_right", images.right);
    if(loading) return
      try {
        setLoading(true)
        await dispatch(addCar({ data: formData })).unwrap();
        navigate("/Cars");
      } catch (errors) {
        const fieldErrors = {};
        errors.forEach(({ message }) => {
          const key = toFieldKey(message);
          if (formik.values.hasOwnProperty(key)) {
            fieldErrors[key] = t(message);
          } else {
            notify(t(message), "error");
          }
        });
        formik.setErrors(fieldErrors);
      } finally{
        setLoading(false)
      }
    },
    
  });


  const handleLicenseChange = (field) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setLicenseImages((prev) => ({ ...prev, [field]: compressed }));
    } catch {
      setLicenseImages((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleFileChange = (field) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImages((prev) => ({ ...prev, [field]: compressed }));
    } catch {
      setImages((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleRemoveLicense = (field) => () => {
    setLicenseImages((prev) => ({ ...prev, [field]: null }));
  };

  const handleRemoveImage = (field) => () => {
    setImages((prev) => ({ ...prev, [field]: null }));
  };

  if(!hasAddPermission) return <Navigate to="/profile" />

  return (
    <Box
      maxWidth="md"
      sx={{ p: 2 }}
      component="form"
      onSubmit={formik.handleSubmit}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}
      >
        <Typography
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars")}
        </Typography>
        <Typography sx={{ mx: 1 }}>&lt;</Typography>
        <Typography
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars Details")}
        </Typography>
        <Typography sx={{ mx: 1 }}>&lt;</Typography>
        <Typography>{t("Add Car")}</Typography>
      </Box>

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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {LICENSE_FIELDS.map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <Card sx={{ p: 2, borderRadius: 1 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CarIcon color="primary" />
                <Typography sx={{ ml: 1 }}>{t(`License ${field}`)}</Typography>
              </Box>
              {licenseImages[field] ? (
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
                    <CheckCircleIcon
                      sx={{
                        backgroundColor: "#067647",
                        color: "white",
                        borderRadius: "50%",
                        mx: 1,
                      }}
                    />
                    <Typography noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
                      {licenseImages[field].name}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleRemoveLicense(field)}>
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
                  startIcon={<AddIcon />}
                >
                  {t(`Upload ${field}`)}
                  <input
                    type="file"
                    hidden
                    onChange={handleLicenseChange(field)}
                  />
                </Button>
                  </Box>
              )}
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Typography>
            {t("Expired Date")}
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            name="licenseExpiredDate"
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
        </Grid>
      </Grid>

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
                {t("Select Car Type")}
              </MenuItem>
              {allCarTypes?.data?.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {isArabic ? type.name_ar : type.name_en}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.carType && formik.errors.carType && (
              <FormHelperText>{formik.errors.carType}</FormHelperText>
            )}
          </FormControl>
        </Grid>
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
                <Typography sx={{ ml: 1 }}>
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
                    <CheckCircleIcon
                      sx={{
                        backgroundColor: "#067647",
                        color: "white",
                        borderRadius: "50%",
                        mx: 1,
                      }}
                    />
                    <Typography noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
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
                    startIcon={<AddIcon sx={{ ml: 1 }} />}
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
        <Button type="submit" variant="contained" sx={{ px: 6 }} disabled={loading}>
          { loading ? <CircularProgress /> :t("Save")}
        </Button>
      </Box>
    </Box>
  );
}
