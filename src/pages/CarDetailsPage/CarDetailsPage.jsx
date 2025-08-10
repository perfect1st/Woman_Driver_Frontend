import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Checkbox,
  Divider,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import IOSSwitch from "../../components/IOSSwitch";
import { getOneCar, editCar } from "../../redux/slices/car/thunk";
import { getAllCarTypesWithoutPaginations } from "../../redux/slices/carType/thunk";
import { useDispatch, useSelector } from "react-redux";
import useBaseImageUrlForDriver from '../../hooks/useBaseImageUrlForDriver'

// Mock assets and styles
const statusStyles = {
  Available: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Unavailable: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

const carTypes = ["Sedan", "SUV", "Truck", "Van", "Luxury"];

const carData = {
  id: "#72641",
  model: "Toyota Camry",
  carType: "Sedan",
  companyCar: true,
  licenseExpiry: "2025-10-01",
  status: "Available",
  image: DomiCar,
  plateNumber: "145 اوص",
  carColor: "Gold",
  carYear: "2020",
  carLicense: "CAR-LIC-456",
  totalTrips: 1250,
  rating: 4.7,
};

export default function CarDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const {id} = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState("");
  const [editingImage, setEditingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const fileInputRef = useRef(null);
  const baseImageUrl = useBaseImageUrlForDriver();
  const [newImageFile, setNewImageFile] = useState(null);
  const [savingImage, setSavingImage] = useState(false);
  // State for editable fields
  const [editableFields, setEditableFields] = useState({
    model: "",
    carType: "",
    plateNumber: "",
    carColor: "",
    carYear: "",
    isCompanyCar: false,
    status: "available",
  });

  // State for edit mode and loading
  const [editMode, setEditMode] = useState({
    model: false,
    carType: false,
    plateNumber: false,
    carColor: false,
    carYear: false,
    carLicense: false,
    licenseExpiry: false,
    isCompanyCar: false,
    status: false,
  });

  const [loading, setLoading] = useState({
    model: false,
    carType: false,
    plateNumber: false,
    carColor: false,
    carYear: false,
    carLicense: false,
    licenseExpiry: false,
    isCompanyCar: false,
    status: false,
  });
  const {car}=useSelector(state=>state.car)
  const {allCarTypes}=useSelector(state=>state.carType)
  useEffect(() => {
    if (car) {
      setEditableFields({
        model: car?.car_model,
        carType: car?.car_types_id?._id,
        plateNumber: car?.plate_number,
        carColor: car?.car_color,
        carYear: car?.car_year,
        isCompanyCar: car?.is_company_car,
        status: car?.status,
      });
    }
  }, [car]);
  useEffect(()=>{
    dispatch(getOneCar(id))
    dispatch(getAllCarTypesWithoutPaginations({query:''}))
  },[])

  const handleOpenImageModal = (image, type) => {
    setSelectedImage(image);
    setImageType(type);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
    setImageType("");
    setEditingImage(false);
    setNewImage(null);
  };

  const handleEditImage = () => {
    setEditingImage(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file); // Store actual File object
      
      const reader = new FileReader();
      reader.onload = (event) => {
        // setNewImagePreview(event.target.result); // For preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    if (!newImageFile) return;
  
    // Correct field mapping for backend
    const fieldMap = {
      carFront: "car_front",
      carBack: "car_back",
      carRight: "car_right",
      carLeft: "car_left",
      carLicenseFront: "car_license_front",
      carLicenseBack: "car_license_back",
    };
  
    const fieldName = fieldMap[imageType];
    if (!fieldName) {
      console.error("Unknown image type:", imageType);
      return;
    }
  
    setSavingImage(true);
    
    try {
      const formData = new FormData();
      formData.append(fieldName, newImageFile); // Append actual File
      
      await dispatch(editCar({ id: car._id, data: formData })).unwrap();
      
      // Refresh car data
      dispatch(getOneCar(id));
      handleCloseImageModal();
    } catch (error) {
      console.error("Image update failed:", error);
    } finally {
      setSavingImage(false);
    }
  };

  const handleDeleteImage = () => {
    console.log("Image deleted:", imageType);
    handleCloseImageModal();
  };

  const downloadImage = (imageSrc, fileName) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (field) => {
    setLoading((prev) => ({ ...prev, [field]: true }));
    
    const formData = new FormData();
    let key;
    let value = editableFields[field];

    switch (field) {
      case "model":
        key = "car_model";
        break;
      case "carType":
        key = "car_types_id";
        break;
      case "plateNumber":
        key = "plate_number";
        break;
      case "carColor":
        key = "car_color";
        break;
      case "carYear":
        key = "car_year";
        value = parseInt(value, 10); // Convert to number
        break;
      case "isCompanyCar":
        key = "is_company_car";
        value = value ? "true" : "false"; // Convert to string
        break;
      case "status":
        key = "status";
        break;
      default:
        key = field;
    }

    formData.append(key, value);

    try {
      await dispatch(editCar({ id: car._id, data: formData })).unwrap();
      setLoading((prev) => ({ ...prev, [field]: false }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      setLoading((prev) => ({ ...prev, [field]: false }));
      console.error("Error updating car:", error);
    }
  };


  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Modify status toggle to match API values
  const toggleAvailability = (event) => {
    const newStatus = event.target.checked ? "available" : "unavailable";
    handleFieldChange("status", newStatus);
    handleSave("status");
  };

  const toggleCompanyCar = () => {
    const newValue = !editableFields.isCompanyCar;
    handleFieldChange("isCompanyCar", newValue);
    handleSave("isCompanyCar");
  };

  const getCarTypeName = (id) => {
    const type = allCarTypes?.data?.find(t => t._id === id);
    return type ? (isArabic ? type.name_ar : type.name_en) : "";
  };
  
  const renderEditableField = (field, label, type = "text") => {
    if (field === "carType" && !editMode[field]) {
      return (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Typography sx={{ color: theme.palette.text.primary }}>
            {getCarTypeName(editableFields.carType)}
          </Typography>
          <IconButton onClick={() => toggleEditMode(field)}>
            <EditIcon />
          </IconButton>
        </Box>
      );
      }
    if (field === "carType" && editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          <Select
            value={editableFields.carType}
            onChange={(e) => handleFieldChange("carType", e.target.value)}
            fullWidth
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
          >
            {allCarTypes?.data?.map((type) => (
              <MenuItem key={type._id} value={type._id}>
                {isArabic ? type.name_ar : type.name_en}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      );
    }

    if (field === "status" && editMode[field]) {
      const styles = statusStyles[editableFields.status];
      return (
        <Box display="flex" alignItems="center" width="100%">
          <Select
            value={editableFields.status}
            onChange={(e) => handleFieldChange("status", e.target.value)}
            fullWidth
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
          >
            {Object.keys(statusStyles).map((status) => (
              <MenuItem key={status} value={status}>
                {t(status)}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      );
    }

    if (editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          <TextField
            value={editableFields[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            fullWidth
            size="small"
            type={type}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      );
    }

    if (field === "status") {
      const styles = statusStyles[editableFields.status];
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Chip
            label={t(editableFields.status)}
            sx={{
              color: styles.textColor,
              backgroundColor: styles.bgColor,
              border: `1px solid ${styles.borderColor}`,
              fontWeight: "bold",
              borderRadius: 1,
              px: 1.5,
              py: 0.5,
            }}
          />
          <IconButton onClick={() => toggleEditMode(field)}>
            <EditIcon />
          </IconButton>
        </Box>
      );
    }

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Typography sx={{ color: theme.palette.text.primary }}>
          {editableFields[field]}
        </Typography>
        <IconButton onClick={() => toggleEditMode(field)}>
          <EditIcon />
        </IconButton>
      </Box>
    );
  };

  const renderDownloadLink = (title, type, imageUrl) => (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography
              onClick={() => downloadImage(imageUrl, `${title.replace(/\s+/g, "_")}.jpg`)}

        sx={{
          color: theme.palette.primary.main,
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        {t("Click Here To Download")}
      </Typography>
      <IconButton onClick={() => handleOpenImageModal(imageUrl, type)}>
        <VisibilityIcon />
      </IconButton>
    </Box>
  );

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${baseImageUrl}${path}`;
  };
  const renderCarImageCard = (title, type, imagePath) => (
    <Card
      sx={{
        background: theme.palette.secondary.sec,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <DirectionsCarIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ ml: 1 }}>
            {t(title)}
          </Typography>
        </Box>
        {renderDownloadLink(title, type, getImageUrl(imagePath))}
      </CardContent>
    </Card>
  );

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/Cars")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{car?.car_model}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2} textAlign="start">
        <Typography variant="h5" fontWeight="bold">
        {car?.car_model} 
        </Typography>
      </Box>

      {/* Car Image */}
      <Box
        maxWidth="md"
        mb={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box position="relative">
          <Box
            component="img"
            src={`${baseImageUrl}${car?.car_images?.front}`}
            alt={car?.car_model}
            sx={{
              width: 200,
              height: 150,
              objectFit: "contain",
              borderRadius: 2,
              // border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>

        {/* Car Name */}
        <Typography variant="h6" mt={2} color="primary">
          {car?.car_model}
        </Typography>

        {/* Status Toggle */}
        <Box display="flex" alignItems="center" mt={0.5}>
          <Typography>{t(editableFields.status)}</Typography>
          <IOSSwitch
            checked={editableFields.status === "Available"}
            onChange={toggleAvailability}
            sx={{ mx: 1 }}
             color="primary"
          />
        </Box>

        {/* Car Info */}
        {/* <Box display="flex" alignItems="center" mt={1}>
          <Typography mr={1}>
            {t("Total Trip")}: {carData.totalTrips}
          </Typography>
          <Box display="flex" alignItems="center" ml={2}>
            <Typography>{carData.rating}</Typography>
            <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
          </Box>
        </Box> */}
      </Box>

      {/* Car Documents Section */}
      <Box maxWidth="md">
        <Grid container spacing={2}>
          {/* Company Car Indicator */}
          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" color="primary">
                {t("Car Documents")}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography sx={{ mr: 1 }}>
                  {t(
                    editableFields.isCompanyCar
                      ? "Company Car"
                      : "Personal Car"
                  )}
                </Typography>
                <IOSSwitch
                  checked={editableFields.isCompanyCar}
                  onChange={toggleCompanyCar}
                  color="primary"
                  sx={{mx:1}}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Car Pictures */}
          <Grid item xs={12} md={6}>
            {renderCarImageCard(
              "Car's Picture Front", 
              "carFront", 
              car?.car_images?.front
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderCarImageCard(
              "Car’s Picture Back", 
              "carBack", 
              car?.car_images?.back
            )}
          </Grid>
       
          <Grid item xs={12} md={6}>
            {renderCarImageCard(
              "Car's Picture Right side", 
              "carRight", 
              car?.car_images?.right
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderCarImageCard(
              "Car's Picture Left side", 
              "carLeft", 
              car?.car_images?.left
            )}
          </Grid>

          {/* Car License */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                background: theme.palette.secondary.sec,
                height: "100%",
                flex: 1,
              }}
            >
              <CardContent>
                <Typography variant="subtitle2">
                  {t("Car License Front")}
                </Typography>

                {renderDownloadLink(
                  "Car License Front", 
                  "carLicenseFront", 
                 getImageUrl(car?.car_license_images?.front)
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                background: theme.palette.secondary.sec,
                height: "100%",
                flex: 1,
              }}
            >
              <CardContent>
                <Typography variant="subtitle2">
                  {t("Car License Back")}
                </Typography>
                {renderDownloadLink(
                  "Car License Back", 
                  "carLicenseBack", 
                  getImageUrl(car?.car_license_images?.back)
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                background: theme.palette.secondary.sec,
                height: "100%",
                flex: 1,
              }}
            >
              <CardContent>
                <Typography variant="subtitle2">
                  {t("Expired Date")}
                </Typography>
                <Box mt={1}>
                  {renderEditableField(
                    "licenseExpiry",
                    t("Expired Date"),
                    "date"
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Plate Number & Model */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {t("Plate Number")}
                </Typography>
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Typography>{editableFields.plateNumber}</Typography>
                  <Box mt={1}>
        {renderEditableField("plateNumber", t("Plate Number"))}
      </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Car Model")}</Typography>
                <Box mt={1}>
                  {renderEditableField("model", t("Car Model"))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Color & Year */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Car Color")}</Typography>
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Typography>{editableFields.carColor}</Typography>
                  <Box mt={1}>
        {renderEditableField("carColor", t("Car Color"))}
      </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Car Year")}</Typography>
                <Box mt={1}>
                  {renderEditableField("carYear", t("Car Year"))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Car Type */}
          <Grid item xs={12} sx={{ display: "flex" }}>
            <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Car Type")}</Typography>
                <Box mt={1}>
                  {renderEditableField("carType", t("Car Type"))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Image Modal */}
      <Dialog
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{t(imageType)}</Typography>
            <IconButton onClick={handleCloseImageModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingImage ? (
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => fileInputRef.current.click()}
                sx={{ mb: 2 }}
              >
                {t("Select New Image")}
              </Button>

              {newImage ? (
                <Box
                  component="img"
                  src={newImage}
                  alt="Preview"
                  sx={{
                    maxHeight: "60vh",
                    maxWidth: "100%",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {t("No image selected")}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              component="img"
              src={selectedImage}
              alt={imageType}
              sx={{
                maxHeight: "60vh",
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          {editingImage ? (
            <>
              <Button onClick={() => setEditingImage(false)}>
                {t("Cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveImage}
                disabled={!newImageFile || savingImage}
                >
        {savingImage ? <CircularProgress size={24} /> : t("Save")}
        </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteImage}
                sx={{mx:1}}
              >
                {t("Delete")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{mx:1}}

                onClick={handleEditImage}
              >
                {t("Update")}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}