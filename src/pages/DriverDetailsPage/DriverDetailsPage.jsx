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
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";
import IOSSwitch from "../../components/IOSSwitch";
import RouteMap from "../RouteMap/RouteMap";
import { ReactComponent as FrontCar } from "../../assets/frontCar.svg";
import { ReactComponent as BackCar } from "../../assets/backCar.svg";
import { ReactComponent as LeftCar } from "../../assets/leftCar.svg";
import { ReactComponent as RigthCar } from "../../assets/rigthCar.svg";
import { getOneDriver, editDriver } from "../../redux/slices/driver/thunk";
import { useDispatch, useSelector } from "react-redux";
import useBaseImageUrlForDriver from '../../hooks/useBaseImageUrlForDriver'
import LoadingPage from "../../components/LoadingComponent";

// Mock assets for trips and transactions since real data doesn't include them
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
const AccountStatus = {
  Accepted: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Pending: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
  },
  Rejected: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};
const carTypes = ["Economy", "Flex", "Comfortable", "Premium", "Luxury"];

// Mock trip data since it's not available in the real API response
const mockTrips = [
  {
    id: 1,
    time: "12:00 PM",
    from: "123 Main St",
    to: "456 Oak Ave",
    driver: {
      name: "John Smith",
      rating: 4.9,
      image: DomiDriverImage,
    },
    car: {
      plate: "ABC-123",
      color: "Black",
      brand: "Toyota Camry",
      image: DomiCar,
    },
    timeline: [
      { type: "Pickup", time: "03:06 PM", address: "123 Main St, Anytown" },
      { type: "Waiting", time: "03:30 PM", address: "579 Anytown, Main St" },
      { type: "Dropoff", time: "04:05 PM", address: "456 Oak Ave, Anytown" },
    ],
    details: {
      date: "2023-05-15",
      time: "03:06 PM - 04:05 PM",
      distance: "5.2 km",
      type: "Standard",
      fare: "EGP 45.00",
      waiting: "EGP 5.00",
      payment: "Cash",
      cashback: "EGP 0.00",
    },
    status: "current",
  },
  {
    id: 2,
    time: "3:30 PM",
    from: "City Mall",
    to: "Airport",
    driver: {
      name: "Michael Johnson",
      rating: 4.7,
      image: DomiDriverImage,
    },
    car: {
      plate: "XYZ-789",
      color: "White",
      brand: "Honda Accord",
      image: DomiCar,
    },
    timeline: [
      {
        type: "Pickup",
        time: "03:30 PM",
        address: "City Mall, Main Entrance",
      },
      { type: "Waiting", time: "03:50 PM", address: "Airport Parking Lot" },
      { type: "Dropoff", time: "04:25 PM", address: "Airport Terminal B" },
    ],
    details: {
      date: "2023-05-14",
      time: "03:30 PM - 04:25 PM",
      distance: "12.5 km",
      type: "Premium",
      fare: "EGP 85.00",
      waiting: "EGP 8.00",
      payment: "Credit Card",
      cashback: "EGP 5.00",
    },
    status: "past",
  },
  {
    id: 3,
    time: "9:15 AM",
    from: "University Campus",
    to: "Tech Park",
    driver: {
      name: "Sarah Williams",
      rating: 4.8,
      image: DomiDriverImage,
    },
    car: {
      plate: "DEF-456",
      color: "Blue",
      brand: "Hyundai Sonata",
      image: DomiCar,
    },
    timeline: [
      { type: "Pickup", time: "09:15 AM", address: "Main University Gate" },
      { type: "Dropoff", time: "09:45 AM", address: "Tech Park Entrance" },
    ],
    details: {
      date: "2023-05-13",
      time: "09:15 AM - 09:45 AM",
      distance: "8.3 km",
      type: "Comfortable",
      fare: "EGP 65.00",
      waiting: "EGP 0.00",
      payment: "Wallet",
      cashback: "EGP 3.00",
    },
    status: "past",
  },
];

// Mock transaction data since it's not available in the real API response
const mockTransactions = [
  {
    id: 1,
    type: "Trip",
    title: "Today",
    time: "10:00 AM",
    description: "123 Main St to 789 Pine St",
    amount: "+ $15.00",
    status: "success",
    icon: <CalendarMonthIcon />,
  },
  {
    id: 2,
    type: "Cash Out",
    title: "Yesterday",
    time: "16:00 PM",
    description: "Bank transfer",
    amount: "- $18.75",
    status: "error",
    icon: <CreditCardIcon />,
  },
  {
    id: 3,
    type: "Top Up",
    title: "Today",
    time: "11:30 AM",
    description: "Credit card deposit",
    amount: "+ $50.00",
    status: "success",
    icon: <CreditCardIcon />,
  },
];

const tabOptions = [
  "driver-details",
  "car-documents",
  "payment-details",
  "trips",
];

export default function DriverDetailsPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState("");
  const [editingImage, setEditingImage] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const defaultTab = tabOptions[0]; // first tab by default
  const currentTab =
    tabParam && tabOptions.includes(tabParam) ? tabParam : defaultTab;
  const baseImageUrl = useBaseImageUrlForDriver();

  // Get the actual driver data from Redux store
  const driverState = useSelector((state) => state.driver);
  const driverData = driverState.driver;
  const apiLoading = driverState.loading;
  // Determine if we have valid driver data
  const hasDriverData = driverData && driverData._id;

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Map API data to UI display values
  const getDriverStatusDisplay = () => {
    if (!hasDriverData) return "Unavailable";
    return driverData.driver_is_available ? "Available" : "Unavailable";
  };

  const getAccountStatusDisplay = () => {
    if (!hasDriverData) return "Pending";
    // Map API status to UI status
    switch (driverData.status) {
      case "active":
        return "Accepted";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  // Get full image URL
  const getImageUrl = (path) => {
    return `${baseImageUrl}${path}`;
  };

  // Get car type name (in a real app, this would come from car types API)
  const getCarType = () => {
    if (!hasDriverData || !driverData.car) return "Economy";
    // This is a simplified version - in reality you'd map car_types_id to a name
    const carTypeId = driverData.car.car_types_id;
    if (carTypeId === "686519b88de6100981d2ed17") return "Economy";
    if (carTypeId === "686519b88de6100981d2ed18") return "Comfortable";
    return "Economy";
  };

  // State for editable fields - initialized with real data if available
  const [editableFields, setEditableFields] = useState({
    fullName: hasDriverData ? driverData.fullname : "Sophia Bennett",
    phone: hasDriverData ? driverData.phone_number : "+201112223334",
    email: hasDriverData ? driverData.email : "sophia@example.com",
    password: "",
    status: getDriverStatusDisplay(),
    accountStatus: getAccountStatusDisplay(),
    verificationCode: hasDriverData ? driverData.verification_code : "125753",
    verified: hasDriverData ? driverData.is_code_verified : true,
    nationalId: hasDriverData ? driverData.national_id_number : "ID-123456",
    nationalIdExpiry: hasDriverData 
      ? formatDate(driverData.national_id_expired_date) 
      : "2025-12-31",
    driverLicense: hasDriverData 
      ? (driverData.driver_license_images && driverData.driver_license_images.length > 0 
          ? "License Uploaded" 
          : "No License") 
      : "LIC-789012",
    driverLicenseExpiry: hasDriverData 
      ? formatDate(driverData.driver_license_expired_date) 
      : "2024-10-15",
    accountNumber: hasDriverData ? driverData.account_number : "EG123456789",
    carType: hasDriverData ? getCarType() : "Economy",
    carModel: hasDriverData && driverData.car ? driverData.car.car_model : "Toyota Camry",
    carColor: hasDriverData && driverData.car ? driverData.car.car_color : "Gold",
    carYear: hasDriverData && driverData.car ? driverData.car.car_year.toString() : "2020",
    plateNumber: hasDriverData && driverData.car ? driverData.car.plate_number : "145 اوص",
    carLicense: hasDriverData && driverData.car && driverData.car.car_license_images 
      ? "License Uploaded" 
      : "CAR-LIC-456",
    carLicenseExpiry: "2023-12-31", // Not in real data
    isCompanyCar: hasDriverData && driverData.car ? driverData.car.is_company_car : true,
  });

  useEffect(() => {
    dispatch(getOneDriver({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (hasDriverData) {
      // Update editable fields when driver data changes
      setEditableFields({
        fullName: driverData.fullname,
        phone: driverData.phone_number,
        email: driverData.email,
        password: "",
        status: getDriverStatusDisplay(),
        accountStatus: getAccountStatusDisplay(),
        verificationCode: driverData.verification_code || "N/A",
        verified: driverData.is_code_verified,
        nationalId: driverData.national_id_number,
        nationalIdExpiry: formatDate(driverData.national_id_expired_date),
        driverLicense: driverData.driver_license_images && driverData.driver_license_images.length > 0 
          ? "License Uploaded" 
          : "No License",
        driverLicenseExpiry: formatDate(driverData.driver_license_expired_date),
        accountNumber: driverData.account_number,
        carType: getCarType(),
        carModel: driverData.car ? driverData.car.car_model : "",
        carColor: driverData.car ? driverData.car.car_color : "",
        carYear: driverData.car ? driverData.car.car_year.toString() : "",
        plateNumber: driverData.car ? driverData.car.plate_number : "",
        carLicense: driverData.car && driverData.car.car_license_images 
          ? "License Uploaded" 
          : "No License",
        carLicenseExpiry: "N/A", // Not available in API
        isCompanyCar: driverData.car ? driverData.car.is_company_car : false,
      });
    }
  }, [hasDriverData, driverData]);

  useEffect(() => {
    if (!tabParam) {
      setSearchParams({ tab: defaultTab });
    }
  }, [tabParam, setSearchParams]);

  const handleTabChange = (e, newValue) => {
    setSearchParams({ tab: tabOptions[newValue] });
  };

  // State for edit mode and loading
  const [editMode, setEditMode] = useState({
    fullName: false,
    phone: false,
    email: false,
    password: false,
    status: false,
    AccountStatus: false,
    verificationCode: false,
    verified: false,
    nationalId: false,
    nationalIdExpiry: false,
    driverLicense: false,
    driverLicenseExpiry: false,
    accountNumber: false,
    carType: false,
    carModel: false,
    carColor: false,
    carYear: false,
    plateNumber: false,
    carLicense: false,
    carLicenseExpiry: false,
    isCompanyCar: false,
  });

  const [loading, setLoading] = useState({
    fullName: false,
    phone: false,
    email: false,
    password: false,
    status: false,
    AccountStatus: false,
    verificationCode: false,
    verified: false,
    nationalId: false,
    nationalIdExpiry: false,
    driverLicense: false,
    driverLicenseExpiry: false,
    accountNumber: false,
    carType: false,
    carModel: false,
    carColor: false,
    carYear: false,
    plateNumber: false,
    carLicense: false,
    carLicenseExpiry: false,
    isCompanyCar: false,
  });

  const handleOpenDrawer = (trip) => {
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTrip(null);
  };

  const handleOpenImageModal = (images, type) => {
    // If images is a string (single image), convert to array
    const imageArray = Array.isArray(images) ? images : [images];
    setSelectedImage(imageArray);
    setImageType(type);
    setImageModalOpen(true);
    setEditingImage(false);
    setNewImages([]);
    setImagePreviews([]);
    setUploadError("");
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
    setImageType("");
    setEditingImage(false);
    setNewImages([]);
    setImagePreviews([]);
    setUploadError("");
  };

  const handleEditImage = () => {
    setEditingImage(true);
    setNewImages([]);
    setImagePreviews([]);
    setUploadError("");
  };

  // Compress and convert image to base64
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 800;
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve({
            file: dataURLtoFile(compressedDataUrl, file.name),
            preview: compressedDataUrl
          });
        };
      };
      reader.readAsDataURL(file);
    });
  };

  // Convert data URL to File object
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const maxFiles = imageType === "nationalId" || imageType === "driverLicense" ? 2 : 1;
      
      if (files.length > maxFiles) {
        setUploadError(t(`You can only upload up to ${maxFiles} images`));
        return;
      }

      setUploadError("");
      
      try {
        const processedImages = await Promise.all(
          files.map(file => compressImage(file))
        );
        
        const newFiles = processedImages.map(item => item.file);
        const newPreviews = processedImages.map(item => item.preview);
        
        setNewImages(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
      } catch (error) {
        setUploadError(t("Error processing images. Please try again."));
      }
    }
  };

  const handleSaveImage = async () => {
    if (newImages.length === 0) {
      setUploadError(t("Please select at least one image"));
      return;
    }

    // Create FormData and append all images
    const formData = new FormData();
    
    // Append the driver ID
    
    // Append all images based on imageType
    newImages.forEach((image, index) => {
      formData.append(`${imageType}`, image);
    });
    formData.append('user_type', driverData?.user_type || ''); // <-- Add this line here

    
    // Dispatch the editDriver action with the formData
    setLoading((prev) => ({ ...prev, [imageType]: true }));
    
    try {
      await dispatch(editDriver({ id, data:formData }));
      // Update local state with new images
      if (imageType === "nationalId") {
        setEditableFields(prev => ({
          ...prev,
          nationalId: "License Uploaded"
        }));
      } else if (imageType === "driverLicense") {
        setEditableFields(prev => ({
          ...prev,
          driverLicense: "License Uploaded"
        }));
      }

       await dispatch(getOneDriver({ id}));
      // Close editing mode
      setEditingImage(false);
      setNewImages([]);
      setImagePreviews([]);
      setUploadError("");
    } catch (error) {
      setUploadError(t("Failed to upload images. Please try again."));
    } finally {
      setLoading((prev) => ({ ...prev, [imageType]: false }));
    }
  };

  const handleDeleteImage = () => {
    // In a real app, you would delete the image from your server
    console.log("Image deleted:", imageType);
    handleCloseImageModal();
  };

  const downloadImage = (imageSrc, fileName) => {
    if (!imageSrc || imageSrc === DomiCar) {
      // Use mock image if no real image is available
      const link = document.createElement("a");
      link.href = DomiCar;
      link.download = fileName || "car_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // If imageSrc is an array, download the first image
    const src = Array.isArray(imageSrc) ? imageSrc[0] : imageSrc;
    
    const link = document.createElement("a");
    link.href = src;
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
    
    // Create FormData object instead of regular object
    const formData = new FormData();
    
    // Prepare data to send to API based on the field being edited
    switch (field) {
      case "fullName":
        formData.append('fullname', editableFields.fullName);
        break;
      case "phone":
        formData.append('phone_number', editableFields.phone);
        break;
      case "email":
        formData.append('email', editableFields.email);
        break;
      case "status":
        formData.append('driver_is_available', editableFields.status === "Available");
        break;
      case "accountStatus":
        // Map UI status to API status
        let apiStatus = "pending";
        if (editableFields.accountStatus === "Accepted") apiStatus = "active";
        if (editableFields.accountStatus === "Rejected") apiStatus = "rejected";
        formData.append('status', apiStatus);
        break;
      case "verified":
        formData.append('is_code_verified', editableFields.verified);
        break;
      case "nationalId":
        formData.append('national_id_number', editableFields.nationalId);
        break;
      case "nationalIdExpiry":
        formData.append('national_id_expired_date', editableFields.nationalIdExpiry);
        break;
      case "driverLicenseExpiry":
        formData.append('driver_license_expired_date', editableFields.driverLicenseExpiry);
        break;
      case "accountNumber":
        formData.append('account_number', editableFields.accountNumber);
        break;
      case "carModel":
        formData.append('car[car_model]', editableFields.carModel);
        break;
      case "carColor":
        formData.append('car[car_color]', editableFields.carColor);
        break;
      case "carYear":
        formData.append('car[car_year]', parseInt(editableFields.carYear));
        break;
      case "plateNumber":
        formData.append('car[plate_number]', editableFields.plateNumber);
        break;
      case "isCompanyCar":
        formData.append('car[is_company_car]', editableFields.isCompanyCar);
        break;
      default:
        break;
    }
    formData.append('user_type', driverData?.user_type || ''); // <-- Add this line here

    try {
      
      if (formData.entries().next().value) { // Check if formData has entries
        await dispatch(editDriver({ id, data:formData }));
        await dispatch(getOneDriver({ id}));
      }
    } catch (error) {
      console.log("error")
    }finally{
      // Dispatch with formData
        setLoading((prev) => ({ ...prev, [field]: false }));
        setEditMode((prev) => ({ ...prev, [field]: false }));
        console.log(`Saved ${field}:`, editableFields[field]);

    }
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleAvailability = (event) => {
    const newStatus = event.target.checked ? "Available" : "Unavailable";
    handleFieldChange("status", newStatus);
    handleSave("status");
  };

  const toggleCompanyCar = () => {
    const newValue = !editableFields.isCompanyCar;
    handleFieldChange("isCompanyCar", newValue);
    handleSave("isCompanyCar");
  };

  const renderEditableField = (field, label, type = "text") => {
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
            {carTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {t(type)}
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
    
    if (field === "accountStatus" && editMode[field]) {
      const styles = AccountStatus[editableFields.accountStatus];
      return (
        <Box display="flex" alignItems="center" width="100%">
          <Select
            value={editableFields.accountStatus}
            onChange={(e) => handleFieldChange("accountStatus", e.target.value)}
            fullWidth
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
          >
            {Object.keys(AccountStatus).map((status) => (
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
    
    if (field === "accountStatus") {
      const styles = AccountStatus[editableFields.accountStatus];
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Chip
            label={t(editableFields.accountStatus)}
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
            <EditIcon sx={{ color: theme.palette.primary.main }} />
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
            <EditIcon sx={{ color: theme.palette.primary.main }} />
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
          <EditIcon sx={{ color: theme.palette.primary.main }} />
        </IconButton>
      </Box>
    );
  };

  const renderDownloadLink = (title, type) => {
    let imageSrc = "";
    let fileName = "";
    
    // Determine which image to use based on type
    switch (type) {
      case "nationalId":
        imageSrc = hasDriverData && driverData.national_id_images && driverData.national_id_images.length > 0
          ? driverData.national_id_images.map(img => getImageUrl(img))
          : [DomiCar];
        fileName = `national_id_${driverData ? driverData._id : 'mock'}.jpg`;
        break;
      case "driverLicense":
        imageSrc = hasDriverData && driverData.driver_license_images && driverData.driver_license_images.length > 0
          ? driverData.driver_license_images.map(img => getImageUrl(img))
          : [DomiCar];
        fileName = `driver_license_${driverData ? driverData._id : 'mock'}.jpg`;
        break;
      case "carLicense":
        imageSrc = hasDriverData && driverData.car && driverData.car.car_license_images && driverData.car.car_license_images.length > 0
          ? [getImageUrl(driverData.car.car_license_images[0])]
          : [DomiCar];
        fileName = `car_license_${driverData ? driverData._id : 'mock'}.jpg`;
        break;
      case "bankLetter":
        imageSrc = hasDriverData && driverData.bank_letter_image
          ? [getImageUrl(driverData.bank_letter_image)]
          : [DomiCar];
        fileName = `bank_letter_${driverData ? driverData._id : 'mock'}.jpg`;
        break;
      default:
        imageSrc = [DomiCar];
        fileName = `${type}_image.jpg`;
    }
    
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          onClick={() => downloadImage(imageSrc, fileName)}
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {t("Click Here To Download")}
        </Typography>
        <IconButton onClick={() => handleOpenImageModal(imageSrc, type)}>
          <VisibilityIcon sx={{ color: theme.palette.primary.main }} />
        </IconButton>
      </Box>
    );
  };

  const renderCarImageCard = (title, type) => {
    // Determine which car image to show based on type
    let imageSrc = DomiCar;
    let index = 0;
    
    if (hasDriverData && driverData.car && driverData.car.car_images && driverData.car.car_images.length > 0) {
      switch (type) {
        case "carFront":
          index = 0;
          break;
        case "carBack":
          index = 1;
          break;
        case "carRight":
          index = 2;
          break;
        case "carLeft":
          index = 3;
          break;
        default:
          index = 0;
      }
      if (index < driverData.car.car_images.length) {
        imageSrc = getImageUrl(driverData.car.car_images[index]);
        // Test if the image actually loads
        const testImage = new Image();
        testImage.src = imageSrc;
        testImage.onerror = () => {
          console.error(`Failed to load image: ${imageSrc}`);
          // You could set a fallback here if needed
        };
      }
    }
    
    return (
      <Card sx={{ background: theme.palette.secondary.sec, height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <IconButton>
              {type === "carFront" ? (
                <FrontCar />
              ) : type === "carBack" ? (
                <BackCar />
              ) : type === "carRight" ? (
                <RigthCar />
              ) : type === "carLeft" ? (
                <LeftCar />
              ) : (
                <DirectionsCarIcon fontSize="small" />
              )}
            </IconButton>
            <Typography variant="subtitle2" sx={{ mx: 1 }}>
              {t(title)}
            </Typography>
          </Box>
          {renderDownloadLink(title, type)}
        </CardContent>
      </Card>
    );
  };

  const renderTransactionItem = (transaction) => (
    <Card sx={{ background: theme.palette.secondary.sec, mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <IconButton
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: isArabic ? 0 : 2,
              ml: isArabic ? 2 : 0,
              color: theme.palette.primary.main,
            }}
          >
            {transaction.icon}
          </IconButton>
          <Box flexGrow={1}>
            <Typography fontWeight="bold">{t(transaction.title)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {transaction.time} · {transaction.description}
            </Typography>
          </Box>
          <Typography
            sx={{
              color:
                transaction.status === "success"
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              fontWeight: "bold",
            }}
          >
            {transaction.amount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );


  if(apiLoading){
    return <LoadingPage />
  }
  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Drivers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Drivers")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/Drivers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Driver Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{hasDriverData ? driverData.fullname : "Driver"}</Typography>
      </Box>
      
      {/* Name & ID */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {hasDriverData ? driverData.fullname : "Sophia Bennett"}
        </Typography>
       {false && <Typography variant="subtitle1" color="text.secondary">
          {hasDriverData ? `#DRV-${driverData._id.slice(-5)}` : "#DRV-12345"}
        </Typography>}
      </Box>
      
      {/* Driver Profile with Status Toggle */}
      <Box
        maxWidth="md"
        mb={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box position="relative">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontSize: 40,
            }}
            src={hasDriverData && driverData.profile_image 
              ? getImageUrl(driverData.profile_image) 
              : DomiDriverImage}
          >
            {!hasDriverData || !driverData.profile_image && 
              (hasDriverData ? driverData.fullname.charAt(0) : "S")}
          </Avatar>
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor:
                editableFields.status === "Available"
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        </Box>
        
        {/* Status Toggle */}
        <Box display="flex" alignItems="center" mt={1}>
          <Typography>{t(editableFields.status)}</Typography>
          <IOSSwitch
          disabled
            checked={editableFields.status === "Available"}
            onChange={toggleAvailability}
            color="primary"
            sx={{ mx: 1 }}
          />
        </Box>
        
        <Typography mt={1}>
          {t("Total Trip")}: {hasDriverData ? "2" : "2"}
        </Typography>
        
        <Box display="flex" alignItems="center" mt={0.5}>
          <Typography>{hasDriverData ? "4.89" : "4.89"}</Typography>
          <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
        </Box>
      </Box>
      
      {/* Tabs */}
      <Tabs
        value={tabOptions.indexOf(currentTab)}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons="auto"
      >
        <Tab label={t("Driver Details")} />
        <Tab label={t("Car Documents")} />
        <Tab label={t("Payment Details")} />
        <Tab label={t("Trips")} />
      </Tabs>
      
      {/* Tab Content */}
      <Box maxWidth="md">
        {/* Driver Details Tab */}
        {tabParam === "driver-details" && (
          <Grid container spacing={2}>
            {/* Row 1 */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Full Name")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("fullName", t("Full Name"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Phone Number")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField("phone", t("Phone Number"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Row 2 */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Email")}</Typography>
                  <Box mt={1}>{renderEditableField("email", t("Email"))}</Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Password")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("password", t("Password"), "password")}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Row 3 */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Account Status")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("accountStatus", t("Account Status"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Verification Code")}
                  </Typography>
                  <Box
                    mt={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>{editableFields.verificationCode}</Typography>
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={editableFields.verified}
                        onChange={(e) => {
                          handleFieldChange("verified", e.target.checked);
                          handleSave("verified");
                        }}
                        disabled={loading.verified}
                        color="primary"
                      />
                      <Typography>{t("Verified code")}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* National ID Row */}
            <Grid item xs={12} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("National ID")}
                  </Typography>
                  {renderDownloadLink("National ID", "nationalId")}
                </CardContent>
              </Card>
            </Grid>
            
            {/* National ID Details Row */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("National ID Number")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField("nationalId", t("National ID Number"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Expired Date")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField(
                      "nationalIdExpiry",
                      t("Expired Date"),
                      "date"
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Driver License Row */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Driver License")}
                  </Typography>
                  {renderDownloadLink("Driver License", "driverLicense")}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Expired Date")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField(
                      "driverLicenseExpiry",
                      t("Expired Date"),
                      "date"
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Car Documents Tab */}
        {tabParam === "car-documents" && (
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
                    sx={{ mx: 1 }}
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Car Pictures - Fixed Size */}
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car's Picture Front", "carFront")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car's Picture Back", "carBack")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car's Picture Right side", "carRight")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCarImageCard("Car's Picture Left Side", "carLeft")}
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
                    {t("Car License")}
                  </Typography>
                  {renderDownloadLink("Car License", "carLicense")}
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
                      "carLicenseExpiry",
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
                    <IconButton
                      onClick={() =>
                        handleOpenImageModal(
                          hasDriverData && driverData.car && driverData.car.car_images && driverData.car.car_images.length > 0
                            ? driverData.car.car_images.map(img => getImageUrl(img))
                            : [DomiCar],
                          "plateNumber"
                        )
                      }
                    >
                      <VisibilityIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Car Model")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("carModel", t("Car Model"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Color & Year */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{t("Car Color")}</Typography>
                  <Box mt={1}>
                    {renderEditableField("carColor", t("Car Color"))}
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
        )}
        
        {/* Payment Details Tab */}
        {tabParam === "payment-details" && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, mb: 2, background: theme.palette.secondary.sec }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">
                    {t("Wallet")}: {hasDriverData ? "EGP 0.00" : "EGP 98.50"}
                  </Typography>
                  <CreditCardIcon color="primary" />
                </Box>
                <Typography variant="body1" mt={1}>
                  {t("Your Cash")}: {hasDriverData ? "EGP 0.00" : "EGP 98.50"}
                </Typography>
              </Paper>
              <Typography variant="h6" color="primary" mb={1}>
                {t("Payment Details")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Account Number")}
                  </Typography>
                  <Box mt={1}>
                    {renderEditableField("accountNumber", t("Account Number"))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Card sx={{ background: theme.palette.secondary.sec, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {t("Bank letter")}
                  </Typography>
                  {renderDownloadLink("Bank Letter", "bankLetter")}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" mt={3} mb={1}>
                {t("Transactions")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {mockTransactions.map((transaction) =>
                renderTransactionItem(transaction)
              )}
            </Grid>
          </Grid>
        )}
        
        {/* Trips Tab */}
        {tabParam === "trips" && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" mb={1}>
                {t("Current Trips")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {mockTrips
                .filter((trip) => trip.status === "current")
                .map((trip, i) => (
                  <Card
                    key={`current-${i}`}
                    sx={{ background: theme.palette.secondary.sec, mb: 2 }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          sx={{
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            p: 1,
                          }}
                        >
                          <CalendarMonthIcon
                            sx={{ color: theme.palette.primary.main }}
                          />
                        </IconButton>
                        <Box flexGrow={1}>
                          <Typography variant="subtitle2">
                            {trip.from} to {trip.to}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trip.time} · {trip?.driver?.name} · {trip.car.plate}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ fontSize: "16px", fontWeight: 700 }}
                          onClick={() => handleOpenDrawer(trip)}
                        >
                          {t("Details")}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              <Typography variant="h6" color="primary" mt={4} mb={1}>
                {t("Past Trips")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {mockTrips
                .filter((trip) => trip.status === "past")
                .map((trip, i) => (
                  <Card
                    key={`past-${i}`}
                    sx={{ background: theme.palette.secondary.sec, mb: 2 }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          sx={{
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            p: 1,
                          }}
                        >
                          <CalendarMonthIcon
                            sx={{ color: theme.palette.primary.main }}
                          />
                        </IconButton>
                        <Box flexGrow={1}>
                          <Typography variant="subtitle2">
                            {trip?.from} to {trip?.to}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trip?.time} · {trip?.driver?.name} · {trip?.car?.plate}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ fontSize: "16px", fontWeight: 700 }}
                          onClick={() => handleOpenDrawer(trip)}
                        >
                          {t("Details")}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Trip Details Drawer */}
      <Drawer
        anchor={isArabic ? "left" : "right"}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "40%",
            minWidth: 300,
          },
        }}
      >
        {selectedTrip && (
          <Box
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                {t("Trip Details")}
              </Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            {/* Map iframe placeholder */}
            <Box
              sx={{
                // height: "200px",
                bgcolor: "grey.200",
                mb: 2,
                borderRadius: 1,
              }}
            >
              <RouteMap
                fromLat={30.0444}
                fromLng={31.2357}
                toLat={30.072}
                toLng={31.346}
              />
            </Box>
            
            {/* Driver & Car Info */}
            <Box sx={{ width: "100%", mb: 2 }}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 1,
                  p: 2,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Driver Info */}
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={selectedTrip?.driver?.image}
                        alt={selectedTrip?.driver?.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedTrip?.driver?.name}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.25}>
                          <StarIcon
                            fontSize="small"
                            color="primary"
                            sx={{ mr: 0.5 }}
                          />
                          <Typography variant="body2">
                            {selectedTrip?.driver?.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Car Info */}
                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center">
                      <Box
                        component="img"
                        src={selectedTrip.car.image}
                        alt={selectedTrip.car.brand}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: "contain",
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 1,
                          p: 0.5,
                        }}
                      />
                      <Box ml={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedTrip.car.plate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedTrip.car.color} &bull; {selectedTrip.car.brand}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Open Chat Button on same line */}
                  <Grid item xs={12} md={3}>
                    <Box
                      display="flex"
                      justifyContent={isMobile ? "flex-start" : "flex-end"}
                    >
                      <Button variant="outlined" color="primary" size="small">
                        {t("Open Chat")}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
            
            {/* Timeline */}
            {isArabic ? (
              <Box sx={{ position: "relative", pr: 4, mb: 3 }}>
                {/* Vertical Line */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 4,
                    bottom: 0,
                    width: 2,
                    bgcolor: theme.palette.primary.main,
                    zIndex: 1,
                  }}
                />
                {selectedTrip.timeline.map((step, idx, arr) => {
                  const isFirst = idx === 0;
                  const isLast = idx === arr.length - 1;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "relative",
                        mb: 4,
                        "&:last-child": { mb: 0 },
                        zIndex: 2,
                      }}
                    >
                      {/* Circle */}
                      {(isFirst || isLast) && (
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{
                            color: theme.palette.primary.main,
                            position: "absolute",
                            right: "-33px",
                            top: isFirst
                              ? 0
                              : isLast
                              ? "calc(100% - 12px)"
                              : "50%",
                            transform:
                              isFirst || isLast ? "none" : "translateY(-50%)",
                          }}
                        />
                      )}
                      {/* Lines */}
                      <Typography fontWeight="bold">{t(step.type)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.time}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <LocationOnIcon
                          fontSize="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2">{step.address}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box sx={{ position: "relative", pl: 4, mb: 3 }}>
                {/* Vertical Line */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: 4,
                    bottom: 0,
                    width: 2,
                    bgcolor: theme.palette.primary.main,
                    zIndex: 1,
                  }}
                />
                {selectedTrip.timeline.map((step, idx, arr) => {
                  const isFirst = idx === 0;
                  const isLast = idx === arr.length - 1;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "relative",
                        mb: 4,
                        "&:last-child": { mb: 0 },
                        zIndex: 2,
                      }}
                    >
                      {/* Circle */}
                      {(isFirst || isLast) && (
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{
                            color: theme.palette.primary.main,
                            position: "absolute",
                            left: "-33px",
                            top: isFirst
                              ? 0
                              : isLast
                              ? "calc(100% - 12px)"
                              : "50%",
                            transform:
                              isFirst || isLast ? "none" : "translateY(-50%)",
                          }}
                        />
                      )}
                      {/* Lines */}
                      <Typography fontWeight="bold">{t(step.type)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.time}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <LocationOnIcon
                          fontSize="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2">{step.address}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
            
            {/* Trip Details */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                {t("Trip Information")}
              </Typography>
              <List disablePadding>
                {Object.entries(selectedTrip.details).map(([key, value], i) => (
                  <ListItem
                    key={key}
                    sx={{
                      bgcolor:
                        i % 2 === 0 ? theme.palette.secondary.main : "inherit",
                      py: 1.5,
                    }}
                  >
                    <ListItemText
                      sx={{ display: "flex", alignItems: "center" }}
                      primary={t(key)}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {value}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
            
            {/* Divider and Done Button */}
            <Box sx={{ mt: "auto", pt: 2, mb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleCloseDrawer}
                sx={{ mb: 2 }}
              >
                {t("Done")}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
      
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
                multiple
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => fileInputRef.current.click()}
                sx={{ mb: 2 }}
              >
                {t("Select New Images")}
              </Button>
              
              <Collapse in={!!uploadError}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {uploadError}
                </Alert>
              </Collapse>
              
              {imagePreviews.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t("Image Previews")}
                  </Typography>
                  <Grid container spacing={1}>
                    {imagePreviews.map((preview, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          component="img"
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            maxHeight: "200px",
                            maxWidth: "100%",
                            objectFit: "contain",
                            display: "block",
                            margin: "0 auto",
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              {Array.isArray(selectedImage) ? (
                <Grid container spacing={2}>
                  {selectedImage.map((img, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        component="img"
                        src={img}
                        alt={`${imageType} ${index + 1}`}
                        sx={{
                          maxHeight: "60vh",
                          maxWidth: "100%",
                          objectFit: "contain",
                          display: "block",
                          margin: "0 auto",
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
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
                    borderRadius: 1,
                  }}
                />
              )}
            </Box>
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
                disabled={newImages.length === 0}
              >
                {t("Save")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteImage}
                sx={{ mx: 1 }}
              >
                {t("Delete")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditImage}
                sx={{ mx: 1 }}
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
