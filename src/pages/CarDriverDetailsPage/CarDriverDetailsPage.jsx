import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Stack,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";
import {
  getOneCarAssignment,
  editCarAssignment,
  getAllAvaliableCarAssignments,
} from "../../redux/slices/carAssignment/thunk";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../../components/LoadingComponent";
import useBaseImageUrlForDriver from "../../hooks/useBaseImageUrlForDriver";
import notify from "../../components/notify";
import { format, parseISO } from "date-fns";
import { getUserCookie } from "../../hooks/authCookies";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

// Status styles
const statusStyles = {
  Linked: { textColor: "#085D3A", bgColor: "#ECFDF3", borderColor: "#ABEFC6" },
  OnRequest: {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
  },
  Leaved: { textColor: "#1F2A37", bgColor: "#F9FAFB", borderColor: "#E5E7EB" },
  Rejected: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

export function CarDriverDetailsPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageUrl = useBaseImageUrlForDriver();
  const user = getUserCookie();
console.log("user",user)
  const { assignment, availableCars, loading, updating } = useSelector(
    (state) => state.carAssignment
  );

    function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("CarDriver");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete")


  // Local state
  const [selectedCar, setSelectedCar] = useState(null);
  const [assignDate, setAssignDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [editingAssign, setEditingAssign] = useState(false);
  const [editingRelease, setEditingRelease] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [carSearch, setCarSearch] = useState("");
  const [status, setStatus] = useState("OnRequest");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize data when assignment is loaded
  useEffect(() => {
    if (assignment) {
      setSelectedCar(assignment.cars_id);
      setAssignDate(assignment.assign_datetime ? format(parseISO(assignment.assign_datetime), "yyyy-MM-dd") : "");
      setReleaseDate(assignment.release_date ? format(parseISO(assignment.release_date), "yyyy-MM-dd") : "");
      setStatus(assignment.status || "OnRequest");
    }
  }, [assignment]);

  // Fetch data on mount
  useEffect(() => {
    if (id) {
      dispatch(getOneCarAssignment(id));
      dispatch(getAllAvaliableCarAssignments());
    }
  }, [dispatch, id]);

  // Auto-save when changes are detected
  useEffect(() => {
    if (hasChanges) {
        handleSave();
          }
  }, [hasChanges, selectedCar, assignDate, releaseDate]);

  const handleChangeCar = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setHasChanges(true);
    setDialogOpen(false);
  };

  const handleSave = useCallback(async () => {
    if (!selectedCar) {
      notify(t("Please select a car"), "error");
      return;
    }

    const data = {
      cars_id: selectedCar._id,
      assign_datetime: assignDate,
      release_date: releaseDate || null,
    };

    try {
      await dispatch(editCarAssignment({ id, data })).unwrap();
      await dispatch(getOneCarAssignment(id)).unwrap();
      setHasChanges(false);
    } catch (error) {
      notify(error.message || t("Failed to update assignment"), "error");
    }
  }, [selectedCar, assignDate, releaseDate, dispatch, id, t]);

  const handleDateChange = (dateType, value) => {
    if (dateType === "assign") {
      setAssignDate(value);
      setEditingAssign(false);
    } else {
      setReleaseDate(value);
      setEditingRelease(false);
    }
    setHasChanges(true);
  };

  const handleReleaseNow = () => {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    setReleaseDate(currentDate);
    setHasChanges(true);
    notify(t("Release date set to today"), "success");
  };

  // Filter cars based on search term
  const filteredCars = availableCars?.data?.filter(
    (car) =>
      car?._id?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car?.car_model?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car?.plate_number?.toLowerCase().includes(carSearch.toLowerCase())
  );

  const styles = statusStyles[status] || {};

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  return (
    <Box p={isMobile ? 1 : 2} maxWidth="md">
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/CarDriver")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars-Drivers")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/CarDriver")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Cars-Drivers Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>#{id}</Typography>
      </Box>

      {/* Driver Card */}
      <Card
        sx={{
          mb: 2,
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {t("Driver")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar 
                src={assignment?.driver_id?.profile_image ? `${imageUrl}${assignment.driver_id.profile_image}` : DomiDriverImage} 
                sx={{ width: 64, height: 64 }} 
              />
            </Grid>
            <Grid item xs>
              <Typography fontWeight="bold">{assignment?.driver_id?.fullname || "N/A"}</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {assignment?.driver_id?.ratings?.average || 0}
                </Typography>
                <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                  fontWeight: "bold",
                  minWidth: 120,
                }}
                onClick={() => navigate(`/drivers/${assignment?.driver_id?._id}`)}
              >
                {t("View Profile")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Car Card */}
      <Card
        sx={{
          mb: 2,
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {t("Car")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container alignItems="center" spacing={2}>
            {selectedCar ? (
              <>
                <Grid item>
                  <Box
                    component="img"
                    src={selectedCar.car_images?.front ? `${imageUrl}${selectedCar.car_images.front}` : DomiCar}
                    alt={selectedCar.car_model}
                    sx={{ width: 64, height: 64, objectFit: "contain" }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">{selectedCar.plate_number}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >{`${selectedCar.car_model} • ${selectedCar.car_color}`}</Typography>
                </Grid>
                <Grid item>
                 {hasEditPermission && <Button
                    onClick={handleChangeCar}
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                      fontWeight: "bold",
                      minWidth: 100,
                    }}
                  >
                    {t("Change")}
                  </Button>}
                </Grid>
              </>
            ) : (
              <Grid item xs={12} textAlign="center">
               {hasEditPermission && <Button
                  onClick={handleChangeCar}
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    fontWeight: "bold",
                    py: 1.5,
                    minWidth: 150,
                  }}
                >
                  {t("Choose Car")}
                </Button>}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Change/Choose Car Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {selectedCar ? t("Change Car") : t("Choose Car")}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t("Search by Car ID, Plate or Model")}
            value={carSearch}
            onChange={(e) => setCarSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                borderColor: theme.palette.divider,
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 1,
                },
              },
            }}
          />

          <List sx={{ maxHeight: 400, overflowY: "auto" }}>
            {filteredCars?.length > 0 ? (
              filteredCars.map((car) => (
                <ListItem
                  button
                  key={car._id}
                  onClick={() => handleSelectCar(car)}
                  sx={{
                    display: "flex",
                    flexDirection: isArabic ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Textual info */}
                  <Box>
                    <Typography fontWeight="bold">{car.plate_number}</Typography>
                    <Typography variant="body2">
                      {car.car_model} • {car.car_color}
                    </Typography>
                  </Box>

                  {/* Car image */}
                  <Box
                    component="img"
                    src={car.car_images?.front ? `${imageUrl}${car.car_images.front}` : DomiCar}
                    alt={car.car_model}
                    sx={{ width: 60, height: 60, objectFit: "contain" }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography>{t("No cars found")}</Typography>
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "bold",
            }}
          >
            {t("Cancel")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Chip and Other Details */}
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          {t("Other Details")}
        </Typography>
        {false && <Chip
          label={t(status)}
          sx={{
            color: styles.textColor,
            backgroundColor: styles.bgColor,
            border: `1px solid ${styles.borderColor}`,
            fontWeight: "bold",
            px: 1.5,
            py: 0.5,
          }}
        />}
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Dates Card */}
      <Stack spacing={2} mb={2}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t("Assign Date")}
              </Typography>
              {editingAssign ? (
                <TextField
                  size="small"
                  type="date"
                  value={assignDate}
                  disabled={!user?.super_admin}
                  onChange={(e) => {
                    setAssignDate(e.target.value);
                    setHasChanges(true);
                  }}
                  onBlur={() => setEditingAssign(false)}
                  autoFocus
                  InputProps={{
                    sx: {
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    },
                  }}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography
                  fontWeight="bold"
                  color={theme.palette.primary.main}
                  sx={{ mt: 0.5, cursor: "pointer" }}
                  onClick={() => setEditingAssign(true)}
                >
                  {assignDate ? format(parseISO(assignDate), "dd/MM/yyyy") : t("Not set")}
                </Typography>
              )}
            </Box>
           {user?.super_admin&& <IconButton
              onClick={() => setEditingAssign(!editingAssign)}
              sx={{
                backgroundColor: theme.palette.action.hover,
                "&:hover": {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              {editingAssign ? (
                <CheckIcon 
                  color="primary" 
                  onClick={() => setEditingAssign(false)}
                />
              ) : (
                <EditIcon color="primary" />
              )}
            </IconButton>}
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t("Release Date")}
              </Typography>
              {editingRelease ? (
                <TextField
                  size="small"
                  type="date"
                  value={releaseDate}
                  disabled={!user?.super_admin}
                  onChange={(e) => {
                    setReleaseDate(e.target.value);
                    setHasChanges(true);
                  }}
                  onBlur={() => setEditingRelease(false)}
                  autoFocus
                  InputProps={{
                    sx: {
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    },
                  }}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography
                  fontWeight="bold"
                  color={theme.palette.primary.main}
                  sx={{ mt: 0.5, cursor: "pointer" }}
                >
                  {releaseDate ? format(parseISO(releaseDate), "dd/MM/yyyy") : t("Not set")}
                </Typography>
              )}
            </Box>
            <Box>
              {user?.super_admin && <IconButton
                onClick={() => setEditingRelease(!editingRelease)}
                sx={{
                  backgroundColor: theme.palette.action.hover,
                  "&:hover": {
                    backgroundColor: theme.palette.action.selected,
                  },
                  mr: 1,
                }}
              >
                {editingRelease ? (
                  <CheckIcon 
                    color="primary" 
                    onClick={() => setEditingRelease(false)}
                  />
                ) : (
                  <EditIcon color="primary" />
                )}
              </IconButton>}
            </Box>
          </CardContent>
        </Card>
              {!assignment?.release_date && hasEditPermission &&<Button
                variant="outlined"
                onClick={handleReleaseNow}
                sx={{
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  "&:hover": {
                    borderColor: theme.palette.error.dark,
                    backgroundColor: theme.palette.error.light,
                    color: "#fff",
                  },
                }}
              >
                {t("release now")}
              </Button>}
      </Stack>

      {/* Saving Indicator */}
      {hasChanges && (
        <Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {t("Saving changes...")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}