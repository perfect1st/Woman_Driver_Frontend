// File: CarTypeDetailsPage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  TextField,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import IOSSwitch from "../../components/IOSSwitch";
import { getOneCarType, editCarType } from "../../redux/slices/carType/thunk";
import { useDispatch, useSelector } from "react-redux";
import imageCompression from "browser-image-compression";
import useBaseImageUrlForDriver from "../../hooks/useBaseImageUrlForDriver";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import notify from "../../components/notify";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

const CarTypeDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar"
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseImageUrl = useBaseImageUrlForDriver();


  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("CarTypes");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete")

  const { carType } = useSelector((state) => state.carType);
  const [fields, setFields] = useState({
    nameEn: "",
    nameAr: "",
    waitingPrice: 0,
    kiloPrice: 0,
    status: true,
    image: null,
    previewUrl: "",
  });
  const [editMode, setEditMode] = useState({});
  const [loading, setLoading] = useState({});
  const fileInputRef = useRef();

  useEffect(() => {
    dispatch(getOneCarType(id))
  }, [id, dispatch, baseImageUrl]);
  useEffect(() => {
    if (carType) {
      setFields((prev) => ({
        ...prev,
        nameEn: carType?.name_en,
        nameAr: carType?.name_ar,
        waitingPrice: carType?.waiting_price_per_minute,
        kiloPrice: carType?.kilo_price,
        status: carType?.status,
        image: carType?.image ? baseImageUrl + carType?.image : "",
        previewUrl: carType?.image ? baseImageUrl + carType?.image : "",
      }));
    }
  }, [carType]);

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleAvailability = (e) => {
    const newStatus = e.target.checked;
    setFields((prev) => ({ ...prev, status: newStatus }));
  
    // حفظ القيمة مباشرة
    handleSave("status", newStatus);
  };

  const handleSave = async (field, customValue = null) => {
    setLoading((prev) => ({ ...prev, [field]: true }));
  
    const formData = new FormData();
  
    switch (field) {
      case "nameEn":
        formData.append("name_en", fields.nameEn);
        break;
      case "nameAr":
        formData.append("name_ar", fields.nameAr);
        break;
      case "waitingPrice":
        formData.append("waiting_price_per_minute", fields.waitingPrice);
        break;
      case "kiloPrice":
        formData.append("kilo_price", fields.kiloPrice);
        break;
      case "status":
        formData.append("status", customValue !== null ? customValue : fields.status);
        break;
      default:
        console.warn("Unknown field:", field);
        return;
    }
  
    try {
      await dispatch(editCarType({ id, data: formData })).unwrap();
     
    } catch (err) {
      console.error("Error adding car type:", err);
      if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach((error) => {
          notify(error.message, "error");
        });
      } else {
        notify("حدث خطأ غير متوقع", "error");
      }
    } finally {
      setEditMode((prev) => ({ ...prev, [field]: false }));
      await dispatch(getOneCarType(id)); // 👈 إعادة جلب البيانات بعد الحفظ
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  };
  
  
  

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFields((prev) => ({ ...prev, image: file, previewUrl: preview }));

    setLoading((prev) => ({ ...prev, image: true }));
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      });
      const formData = new FormData();
      formData.append("image", compressed);
      await dispatch(editCarType({ id, data: formData })).unwrap();
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
      await  dispatch(getOneCarType(id))
      setLoading((prev) => ({ ...prev, image: false }));
    }
  };

  const renderEditableCard = (field, title, currency = false) => (
    <Card
    sx={{
      background: theme.palette.secondary.sec,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      p: 2,
    }}
  >     
   <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">{t(title)}</Typography>
      </Box>
      {editMode[field] ? (
        <Box display="flex" alignItems="center" mt={2} gap={1}>
          <TextField
            value={fields[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            fullWidth
            size="small"
            type={currency ? "number" : "text"}
            InputProps={{
              startAdornment: currency && (
                <Typography sx={{ mr: 1 }}>SAR</Typography>
              ),
            }}
          />
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} gap={1}>

<Typography
            variant="h6"
            sx={{ mt: 1, color: theme.palette.text.blue }}
          >            {fields[field]}
            {currency ? " SAR" : ""}
            {field === "waitingPrice" && " / 1 Min."}
          </Typography>
          {hasEditPermission && <IconButton onClick={() => toggleEditMode(field)}>
            <EditIcon />
          </IconButton>}
        </Box>
      )}
    </Card>
  );

  if(!hasViewPermission) return <Navigate to="/profile" />
  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/CarTypes")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Car Types")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/CarTypes")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Car Types Details")}
        </Typography>  <Typography mx={1}>{`<`}</Typography>
        <Typography>{isArabic ? fields.nameAr : fields.nameEn}</Typography>    </Box>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        {isArabic ? fields.nameAr : fields.nameEn} 
      </Typography>

      {/* Image Section */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3} maxWidth="md">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <Box onClick={handleImageClick} sx={{ cursor: "pointer" }}>
          {fields.previewUrl ? (
            <Box
              component="img"
              src={fields.previewUrl}
              alt="car"
              sx={{
                width: 200,
                height: 150,
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          ) : (
            <AccountCircleIcon
              sx={{ fontSize: 200, color: theme.palette.text.disabled }}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
        <Typography>{fields.status ? t("active") : t("Unavailable")}</Typography>
                <IOSSwitch
          checked={fields.status}
          onChange={toggleAvailability}
          sx={{ mx: 1 }}
          color="primary"
          disabled={!hasEditPermission}
        />
        </Box>
        </Box>

      {/* Editable Fields */}
      <Box maxWidth="md">

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderEditableCard("nameEn", "Car Type Name English")}
        </Grid>
        <Grid item xs={12}>
          {renderEditableCard("nameAr", "Car Type Name Arabic")}
        </Grid>
        <Grid item xs={12}>
          {renderEditableCard("waitingPrice", "Waiting Price per minute", true)}
        </Grid>
        <Grid item xs={12}>
          {renderEditableCard("kiloPrice", "Kilo Price", true)}
        </Grid>
      </Grid>
      </Box>
    </Box>
  );
};

export default CarTypeDetailsPage;
