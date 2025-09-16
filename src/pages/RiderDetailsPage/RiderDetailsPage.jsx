import React, { useEffect, useState, useMemo, useRef } from "react";
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
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";
import RouteMap from "../RouteMap/RouteMap";
import { useDispatch, useSelector } from "react-redux";
import {
  getOnePassenger,
  editPassenger,
} from "../../redux/slices/passenger/thunk";
import LoadingPage from "../../components/LoadingComponent";
import useBaseImageUrl from "../../hooks/useBaseImageUrl";
import useBaseImageUrlForDriver from "../../hooks/useBaseImageUrlForDriver";
import { getAllPassengerTrips, getTripChat } from "../../redux/slices/trip/thunk";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import { format } from "date-fns";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import ModernChatDrawer from "../DriverDetailsPage/ModernChatDrawer";

const statusStyles = {
  active: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Pending: { textColor: "#1849A9", bgColor: "#EFF8FF", borderColor: "#B2DDFF" },
  banned: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

export default function RiderDetailsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { passenger, loading } = useSelector((s) => s.passenger);
  const { allPassengerTrips,chat, loading: tripsLoading } = useSelector(
    (state) => state.trip
  );

  // Search params for pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Passengers");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit")
  const hasDeletePermission = hasPermission("delete")


  // EDITABLE STATE HOOKS
  const [editable, setEditable] = useState({
    fullname: "",
    phone_number: "",
    email: "",
    password: "",
    status: "",
    verification_code: "",
    is_code_verified: false,
  });
  const [editMode, setEditMode] = useState({});
  const [saving, setSaving] = useState({});
  // DRAWER
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);

  // FETCH passenger ON MOUNT
  useEffect(() => {
    dispatch(getOnePassenger(id));
  }, [dispatch, id]);

  // Fetch trips when page/limit changes
  useEffect(() => {
    const query = `page=${page}&limit=${limit}`;
    dispatch(getAllPassengerTrips({ id, query }));
  }, [dispatch, id, page, limit]);

  // SEED editable WHEN passenger LOADS
  useEffect(() => {
    if (passenger) {
      setEditable({
        fullname: passenger.fullname || "",
        phone_number: passenger.phone_number || "",
        email: passenger.email || "",
        password: "",
        status: passenger.status === "active" ? "Available" : passenger.status,
        verification_code: passenger.verification_code || "",
        is_code_verified: passenger.is_code_verified || false,
      });
      setEditMode({});
      setSaving({});
    }
  }, [passenger]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language, {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  const baseImageUrl = useBaseImageUrl();
  const baseImageUrlForDriver = useBaseImageUrlForDriver();

  // Transform API trip data to component format
  const transformTrips = (trips) => {
    return trips?.data?.map((trip) => ({
      id: trip._id,
      time: format(new Date(trip.createdAt), "hh:mm a"),
      from: trip.from_name,
      to: trip.to_name,
      driver: {
        name: trip.driver_id?.fullname || t("Unknown"),
        rating: 5.0, // Default rating if not available
        image: trip.driver_id?.profile_image
          ? `${baseImageUrl}${trip.driver_id.profile_image}`
          : DomiDriverImage,
      },
      car: {
        plate: trip.car_snapshot?.plate_number || "",
        color: trip.car_snapshot?.car_color || "",
        brand: trip.car_snapshot?.car_model || "",
        image: `${baseImageUrlForDriver}${trip.car_snapshot?.car_images[0]?.front}` ||  DomiCar,
      },
      timeline: [
        {
          type: "Pickup",
          time: formatTime(trip.createdAt),
          address: trip?.from_name || t("Pickup Location")
        },
        {
          type: "Dropoff",
          time: formatTime(trip.updatedAt),
          address: trip?.to_name || t("Dropoff Location")
        }
      ],
      details: {
        date: format(new Date(trip.createdAt), "yyyy-MM-dd"),
        time: `${format(new Date(trip.createdAt), "hh:mm a")} - ${
          trip.trip_start_time
            ? format(new Date(trip.trip_start_time), "hh:mm a")
            : "-"
        }`,
        distance: `${trip.kilos_number} km`,
        type: trip.car_types_id?.name_en || "",
        fare: `SAR ${trip.cost}`,
        waiting: `SAR ${trip.total_waiting_minutes_cost}`,
        payment: trip.payment_method_id?.name_en || "",
        cashback: "SAR 0.00", // Not in API
      },
      coordinates: {
        from: trip.from_lng_lat?.coordinates || [],
        to: trip.to_lng_lat?.coordinates || [],
      },
    }));
  };

  const transformedTrips = useMemo(() => {
    return allPassengerTrips ? transformTrips(allPassengerTrips) : [];
  }, [allPassengerTrips]);


  // BUILD rider OBJECT
  const rider = useMemo(
    () => ({
      name: passenger?.fullname,
      id: passenger?._id ? `#${passenger._id.slice(-6)}` : "",
      image: `${baseImageUrl}${passenger?.profile_image}`,
      referredBy: passenger?.fullname,
      totalTrips: transformedTrips?.length,
      rating: passenger?.rating || 0,
      fullname: editable.fullname,
      phone_number: editable.phone_number,
      email: editable.email,
      password: editable.password,
      status: editable.status,
      wallet: "",
      verification_code: editable.verification_code,
      is_code_verified: editable.is_code_verified,
      trips: transformedTrips,
    }),
    [passenger, editable, transformedTrips]
  );

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(Number(newPage)), limit: String(limit) });
  };

  const handleLimitChange = (newLimit) => {
    setSearchParams({ page: "1", limit: String(Number(newLimit)) });
  };




  // ------------------ Chat Drawer Implementation ------------------
  const chatListRef = useRef(null);

  // messages array (support chat or chat.data)
  const messages = Array.isArray(chat) ? chat : chat?.data || [];

  const getSenderImage = (sender) => {
    if (!sender) return DomiDriverImage;
    const img = sender.profile_image || sender.profileImage || "";
    if (!img) return DomiDriverImage;
    // if img looks like a full URL, return it directly; otherwise prefix baseImageUrl
    if (img.startsWith("http") || img.startsWith("uploads/")) return img.startsWith("http") ? img : `${baseImageUrl}${img}`;
    return `${baseImageUrl}${img}`;
  };

  // helper: return audio src for voice messages
  const getAudioSrc = (msg) => {
    const t = msg.text_voice_message || msg.text || "";
    if (!t) return null;
    // already a data URI
    if (t.startsWith("data:audio")) return t;
    // if it looks like a file path to uploads -> prefix baseImageUrl
    if (t.startsWith("uploads/") || t.startsWith("/uploads/")) return `${baseImageUrl}${t}`;
    // otherwise assume raw base64 and use audio/mpeg
    return `data:audio/mpeg;base64,${t}`;
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages.length]);



  // EARLY RETURN SPINNER
  if (loading || !passenger) {
    return <LoadingPage />;
  }

  if(!hasViewPermission) return <Navigate to="/profile" />

  // HANDLERS (unchanged logic)
  const handleFieldChange = (f, v) => setEditable((e) => ({ ...e, [f]: v }));
  const toggleEdit = (f) => setEditMode((m) => ({ ...m, [f]: !m[f] }));
  const handleSave = async (field) => {
    setSaving((s) => ({ ...s, [field]: true }));

    try {
      const updatedField = { [field]: editable[field] };

      // Special case: translate status back to backend value if needed
      if (field === "status") {
        updatedField[field] =
          editable.status === "Available" ? "active" : editable.status;
      }

      await dispatch(editPassenger({ id, data: updatedField }));

      setEditMode((m) => ({ ...m, [field]: false }));
    } catch (error) {
      console.error("Edit error:", error);
    } finally {
      setSaving((s) => ({ ...s, [field]: false }));
    }
  };

  const openDrawer = (t) => (setSelectedTrip(t), setDrawerOpen(true));
  const closeDrawer = () => (setDrawerOpen(false), setSelectedTrip(null));

  const renderEditableField = (field) => {
    const styles = statusStyles[editable.status] || statusStyles.active;
    if (editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          {field === "status" ? (
            <Select
              value={editable.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              fullWidth
              size="small"
              sx={{ flexGrow: 1, mr: 1 }}
            >
              {Object.keys(statusStyles).map((st) => (
                <MenuItem key={st} value={st}>
                  {t(st)}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              value={editable[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
              type={field === "password" ? "password" : "text"}
              sx={{ flexGrow: 1, mr: 1 }}
            />
          )}
          <IconButton
            onClick={() => handleSave(field)}
            disabled={saving[field]}
          >
            {saving[field] ? <CircularProgress size={24} /> : <SaveIcon />}
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
        <Box>
          {field === "status" ? (
            <Chip
              label={t(editable.status)}
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
          ) : (
            <Typography>{editable[field]}</Typography>
          )}
        </Box>
        {hasEditPermission && <IconButton onClick={() => toggleEdit(field)}>
          <EditIcon />
        </IconButton>}
      </Box>
    );
  };

  return (
    <Box p={2}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Passengers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Rider")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography
          onClick={() => navigate("/Passengers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Rider Details")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography>{rider.name}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {rider.name}
        </Typography>
        {false && (
          <Typography variant="subtitle1" color="text.secondary">
            {rider.id}
          </Typography>
        )}
      </Box>

      <Box maxWidth="md">
        <Box mb={3} display="flex" flexDirection="column" alignItems="center">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontSize: 40,
              mb: 1,
            }}
            src={rider.image}
          >
            {!rider.image && rider.name.charAt(0)}
          </Avatar>
          <Typography color="primary" fontWeight="bold" fontSize={18}>
            {rider.name}
          </Typography>
          <Typography>
            {t("Total Trip")}: {allPassengerTrips?.total || 0}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography>{rider.rating}</Typography>
            <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
          </Box>
        </Box>
        <Typography variant="h6" color="primary" mb={1}>
          {t("Rider Details")}
        </Typography>

        <Grid container spacing={2} direction="column">
          {/* Full Name */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Full Name")}</Typography>
                <Box mt={1}>{renderEditableField("fullname")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Phone */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Phone Number")}</Typography>
                <Box mt={1}>{renderEditableField("phone_number")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Email */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Email")}</Typography>
                <Box mt={1}>{renderEditableField("email")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Password */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Password")}</Typography>
                <Box mt={1}>{renderEditableField("password")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Status */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Status")}</Typography>
                <Box mt={1}>{renderEditableField("status")}</Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Wallet */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                {/* <Typography variant="subtitle2">{t("Wallet")}</Typography> */}
                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography fontWeight={"bold"}>{t("Wallet")}</Typography>
                  {/* <Typography>{rider.wallet}</Typography> */}
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                    onClick={() =>
                      navigate(`/walletDetails/${id}?fromUser=true`)
                    }
                     >
                    {t("Transaction")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Verification */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {t("Verification Code")}
                </Typography>

                {/* One‑line layout with space between code and checkbox */}
                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Read‑only code text */}
                  <Typography>{editable.verification_code}</Typography>

                  {/* Checkbox + label */}
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      color="primary"
                      checked={editable.is_code_verified}
                      onChange={(e) => {
                        const newValue = e.target.checked;

                        // Update local state
                        handleFieldChange("is_code_verified", newValue);

                        // Call Redux thunk with the correct value
                        dispatch(
                          editPassenger({
                            id,
                            data: { is_code_verified: newValue }, // pass the correct new value
                          })
                        );
                      }}
                      disabled={saving.is_code_verified}
                    />

                    <Typography sx={{ fontWeight: "bold" }}>
                      {t("Verified code")}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Trips List */}
     {rider?.trips?.length == 0 ?  <Box
        sx={{
          maxWidth: "md",
          width: "100%",
          minHeight: { xs: 240, sm: 320 }, 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h6" mb={1} sx={{ fontWeight: 700 }}>
            {t("there_are_no_trips")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("no_trips_subtitle", "Once the rider completes trips they will appear here.")}
          </Typography>
        </Box>
      </Box>
       :  <>
      <Typography variant="h6" mt={4} mb={2}>
        {t("Trips")}
      </Typography>
      <Box maxWidth="md">
        {tripsLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} direction="column">
              {rider.trips.map((trip) => (
                <Grid item xs={12} key={trip.id}>
                  <Card sx={{ background: theme.palette.secondary.sec }}>
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
                        <Box>
                          <Typography variant="subtitle2">
                            {t("Trip")}
                          </Typography>
                          <Typography variant="body2">
                            {trip.time} · {trip.from} to {trip.to}
                          </Typography>
                        </Box>
                        <Box flexGrow={1} textAlign="end">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ fontSize: 16, fontWeight: 700 }}
                            onClick={() => openDrawer(trip)}
                          >
                            {t("Details")}
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <PaginationFooter
              currentPage={page}
              totalPages={allPassengerTrips?.totalPages || 1}
              limit={limit}
              onPageChange={(e, value) => handlePageChange(value)} // <-- تحويل القيمة
              onLimitChange={(e) => handleLimitChange(Number(e.target.value))} // <-- تحويل القيمة
            />
          </>
        )}
      </Box>
      </>}

      {/* Drawer */}
      <Drawer
        anchor={isArabic ? "left" : "right"}
        open={drawerOpen}
        onClose={closeDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "40%",
            minWidth: 300,
          },
        }}
      >
        {selectedTrip && (
          <Box p={2} display="flex" flexDirection="column" height="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                {t("Trip Details")}
              </Typography>
              <IconButton onClick={closeDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ bgcolor: "grey.200", mb: 2, borderRadius: 1 }}>
              <RouteMap
                fromLat={selectedTrip.coordinates.from[1]}
                fromLng={selectedTrip.coordinates.from[0]}
                toLat={selectedTrip.coordinates.to[1]}
                toLng={selectedTrip.coordinates.to[0]}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 1, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={selectedTrip.driver.image}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedTrip.driver.name}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.25}>
                          <StarIcon
                            fontSize="small"
                            color="primary"
                            sx={{ mr: 0.5 }}
                          />
                          <Typography variant="body2">
                            {selectedTrip.driver.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
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
                          {selectedTrip.car.color} • {selectedTrip.car.brand}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box
                      display="flex"
                      justifyContent={isMobile ? "flex-start" : "flex-end"}
                    >
                      <Button variant="outlined" size="small" onClick={async ()=>{
setChatLoading(true)
await dispatch(getTripChat(selectedTrip.id))
setChatLoading(false)
setChatDrawerOpen(true)
                        
                      }}>
                        {chatLoading ? <CircularProgress size={20} /> : t("Open Chat")}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
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
            <Box sx={{ mt: "auto", pt: 2, mb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="contained"
                fullWidth
                onClick={closeDrawer}
                sx={{ mb: 2 }}
              >
                {t("Done")}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
        {/* ----------------- Chat Drawer ----------------- */}


        <ModernChatDrawer
  open={chatDrawerOpen}
  onClose={() => setChatDrawerOpen(false)}
  messages={messages}
  currentUserId={passenger?._id}        
  isArabic={isArabic}
  isMobile={isMobile}
  chatLoading={chatLoading}
  getAudioSrc={getAudioSrc}
  getSenderImage={getSenderImage}
  t={t}
/>

    </Box>
  );
}
