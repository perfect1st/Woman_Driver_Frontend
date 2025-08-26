import React, { useState, useEffect, useRef } from "react";
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
  Avatar,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import {
  AddPhotoAlternate as AddPhotoIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/user/thunk";
import { getAllPermissionGroups } from "../../redux/slices/permissionGroup/thunk";
import notify from "../../components/notify";
import imageCompression from "browser-image-compression";
import CustomTextField from "../../components/RTLTextField";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

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

export default function AddUserPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { allPermissionGroups } = useSelector(
    (state) => state.permissionGroup
  );
  
  const [avatarImage, setAvatarImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(); 
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Users");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit")
  const hasDeletePermission = hasPermission("delete")
  useEffect(() => {
    dispatch(getAllPermissionGroups());
  }, [dispatch]);

  const validationSchema = Yup.object({
    name: Yup.string().required(t("Name is required")),
    phone_number: Yup.string().required(t("Phone number is required")),
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    password: Yup.string()
      .min(8, t("Password must be at least 8 characters"))
      .required(t("Password is required")),
      permissionGroup: Yup.array().min(1, t("Permission group is required")), // changed to array
    });

  const formik = useFormik({
    initialValues: {
      name: "",
      phone_number: "",
      email: "",
      password: "",
      permissionGroup: [], // now array
      is_admin: false,
      hasReportActions: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      
      // Text data
      formData.append("name", values.name);
      formData.append("phone_number", values.phone_number);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("groups", JSON.stringify(values.permissionGroup)); // ✅ Send as a single array
            formData.append("super_admin", values.is_admin);
      formData.append("has_report_actions", values.hasReportActions);
      
      // Avatar image
      if (avatarImage) {
        formData.append("profile_image", avatarImage);
      }

      try {
        await dispatch(register({ data: formData })).unwrap();
        navigate("/Users");
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
      }
    },
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setAvatarImage(compressed);
    } catch {
      setAvatarImage(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarImage(null);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }} maxWidth="md">
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 3 }}>
        <Typography
          onClick={() => navigate("/Users")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Users")}
        </Typography>
        <Typography sx={{ mx: 1 }}>&lt;</Typography>
        <Typography
          onClick={() => navigate("/Users")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Users List")}
        </Typography>
        <Typography sx={{ mx: 1 }}>&lt;</Typography>
        <Typography>{t("Add User")}</Typography>
      </Box>
  
      {/* Avatar Section */}
      {/* <Card sx={{ p: 3, mb: 4 }}> */}
        <Typography variant="h6" color="primary" gutterBottom>
          {t("Profile Picture")}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
  <input
    accept="image/*"
    type="file"
    ref={fileInputRef}
    hidden
    onChange={handleAvatarChange}
  />
  <Box position="relative">
    <IconButton
      onClick={() => fileInputRef.current.click()}
      sx={{
        p: 0, // علشان الـ Avatar يملأ الزر تمامًا
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      <Avatar
        src={avatarImage ? URL.createObjectURL(avatarImage) : undefined}
        sx={{
          width: 150,
          height: 150,
          bgcolor: "#fff",
          border: "1px solid #ccc",
        }}
      >
        {!avatarImage && (
          <AddPhotoIcon sx={{ fontSize: 60, color: "primary.main" }} />
        )}
      </Avatar>
    </IconButton>

    {avatarImage && (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveAvatar();
        }}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bgcolor: "rgba(255,255,255,0.8)",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
</Box>
      {/* </Card> */}
  
      {/* User Info Section */}
      {/* <Card sx={{ p: 3, mb: 4 }}> */}
        <Typography variant="h6" color="primary" gutterBottom>
          {t("User Details")}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CustomTextField
              fullWidth
              name="name"
              label={t("Full Name")}
              variant="filled"
              InputProps={{ disableUnderline: true }}
              sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              fullWidth
              name="phone_number"
              label={t("Phone Number")}
              variant="filled"
              InputProps={{ disableUnderline: true }}
              sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }}
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
              helperText={formik.touched.phone_number && formik.errors.phone_number}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              fullWidth
              name="email"
              label={t("Email")}
              variant="filled"
              InputProps={{ disableUnderline: true }}
              sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              label={t("Password")}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="filled" error={formik.touched.permissionGroup && Boolean(formik.errors.permissionGroup)}>
              <Typography sx={{ mb: 1 }}>{t("Permission Group")} *</Typography>
              <Select
    multiple
    name="permissionGroup"
    value={formik.values.permissionGroup}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    input={<FilledInput disableUnderline sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }} />}
    renderValue={(selected) => {
      return allPermissionGroups
        .filter((group) => selected.includes(group._id))
        .map((group) => group.name)
        .join(", ");
    }}
  >
    {allPermissionGroups?.map((group) => (
      <MenuItem key={group._id} value={group._id}>
        <Checkbox checked={formik.values.permissionGroup.includes(group._id)} />
        <Typography>{group.name}</Typography>
      </MenuItem>
    ))}
  </Select>
              {formik.touched.permissionGroup && formik.errors.permissionGroup && (
                <FormHelperText>{formik.errors.permissionGroup}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={3} flexWrap="wrap" mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_admin"
                    checked={formik.values.is_admin}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label={t("Administrator")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="hasReportActions"
                    checked={formik.values.hasReportActions}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label={t("Has Report Actions")}
              />
            </Box>
          </Grid>
        </Grid>
      {/* </Card> */}
  
      {/* Action Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        {/* <Button variant="outlined" onClick={() => navigate("/Users")}>
          {t("Cancel")}
        </Button> */}
      {hasAddPermission &&  <Button type="submit" variant="contained">
          {t("Create User")}
        </Button>}
      </Box>
    </Box>
  );
  
}