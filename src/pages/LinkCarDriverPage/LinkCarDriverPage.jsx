import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Stack,
  InputAdornment,
  ListItemText,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import {
  addCarAssignment,
  getAllAvaliableCarAssignments,
  getAllAvaliableDriversAssignments,
} from "../../redux/slices/carAssignment/thunk";
import { useDispatch, useSelector } from "react-redux";
import useBaseImageUrlForDriver from "../../hooks/useBaseImageUrlForDriver";
import notify from "../../components/notify";
import { format } from "date-fns";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

export default function LinkCarDriverPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageUrl = useBaseImageUrlForDriver();

  const { availableCars, availableDrivers } = useSelector(
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

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [driverSearch, setDriverSearch] = useState("");
  const [carSearch, setCarSearch] = useState("");
  const [assignDate, setAssignDate] = useState(new Date());
  const [releaseDate, setReleaseDate] = useState("");

  useEffect(() => {
    dispatch(getAllAvaliableDriversAssignments());
    dispatch(getAllAvaliableCarAssignments());
  }, [dispatch]);

  const filteredDrivers = availableDrivers?.data?.filter(
    (driver) =>
      driver?._id?.toLowerCase().includes(driverSearch.toLowerCase()) ||
      driver?.fullname?.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const filteredCars = availableCars?.data?.filter(
    (car) =>
      car?._id?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car?.car_model?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car?.plate_number?.toLowerCase().includes(carSearch.toLowerCase())
  );

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setDriverModalOpen(false);
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setCarModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedDriver || !selectedCar || !assignDate) return;
  
    const data = {
      driver_id: selectedDriver._id,
      cars_id: selectedCar._id,
      assign_datetime: assignDate,
      ...(releaseDate && { release_date: releaseDate }),
    };
  
    try {
      // unwrap() will throw if the thunk was rejected
      const response = await dispatch(addCarAssignment({ data })).unwrap();
  console.log("response",response)
      notify(t("LinkedSuccessfully"), "success");
      navigate("/CarDriver");
    } catch (error) {
      // Your existing error handler
      if (error?.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => notify(err.message, "error"));
      } else {
        notify("حدث خطأ غير متوقع. حاول مرة أخرى.", "error");
      }
      // no navigate here
    }
  };
  
  
  if(!hasAddPermission) return <Navigate to="/profile" />

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
        <Typography>{t("Link Car-Driver")}</Typography>
      </Box>

      {/* Title */}
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        {t("Link Car-Driver")}
      </Typography>

      {/* Driver Card */}
      <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={1}>
            {t("Driver")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container alignItems="center" spacing={2}>
            {selectedDriver ? (
              <>
                <Grid item>
                  <Avatar
                    src={`${imageUrl}${selectedDriver.profile_image}`}
                    sx={{ width: 64, height: 64 }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">{selectedDriver.fullname}</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2">{selectedDriver.rating || 5}</Typography>
                    <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
                  </Box>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => setDriverModalOpen(true)}
                    sx={{ fontWeight: "bold", minWidth: 100 }}
                  >
                    {t("Change")}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} textAlign="end">
                <Button
                  variant="contained"
                  onClick={() => setDriverModalOpen(true)}
                  sx={{ fontWeight: "bold", py: 1.5, minWidth: 150 }}
                >
                  {t("Choose Driver")}
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Car Card */}
      <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={1}>
            {t("Car")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container alignItems="center" spacing={2}>
            {selectedCar ? (
              <>
                <Grid item>
                  <Box
                    component="img"
                    src={`${imageUrl}${selectedCar?.car_images?.front}`}
                    alt={selectedCar?.car_model}
                    sx={{ width: 64, height: 64, objectFit: "contain" }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">{selectedCar.plate_number}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCar?.car_year} • {selectedCar.car_color}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => setCarModalOpen(true)}
                    sx={{ fontWeight: "bold", minWidth: 100 }}
                  >
                    {t("Change")}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} textAlign="end">
                <Button
                  variant="contained"
                  onClick={() => setCarModalOpen(true)}
                  sx={{ fontWeight: "bold", py: 1.5, minWidth: 150 }}
                >
                  {t("Choose Car")}
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Dates */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          {t("Other Details")}
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body1" color="text.primary" sx={{fontWeight: 'bold'}} mb={1}>
              {t("Assign Date")}
            </Typography>
            <TextField
  fullWidth
  type="text"
  value={format(assignDate, "dd/MM/yyyy")}
  disabled
  InputLabelProps={{ shrink: true }}
  InputProps={{
    sx: {
      fontWeight: 'bold',
      '& input.Mui-disabled': {
        color: theme.palette.primary.main,
        WebkitTextFillColor: theme.palette.primary.main, // This is key for disabled text
      },
    },
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.secondary.sec,
      borderRadius: 0,
      "& fieldset": { border: "none" },
      "&:hover fieldset, &:focus-within fieldset": { border: "none" },
    },
  }}
/>



          </Box>
          
          {false && <Box>
          <Typography variant="body1" color="text.primary" sx={{fontWeight: 'bold'}} mb={1}>
          {t("Release Date")}
            </Typography>
            <TextField
  fullWidth
  variant="outlined"
  type="date"
  value={releaseDate}
  onChange={(e) => setReleaseDate(e.target.value)}
  InputLabelProps={{ shrink: true }}
  InputProps={{
    sx: {
      // your bold/color styles
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    }
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.secondary.sec,  // flat bg
      borderRadius: 0,                                // no radius
      "& fieldset": {
        border: "none",                              // remove border
      },
      // if you want to suppress the hover/focus outline as well:
      "&:hover fieldset, &:focus-within fieldset": {
        border: "none",
      }
    }
  }}
/>

          </Box>}
        </Stack>
      </Box>

      {/* Save */}
      <Divider sx={{ my: 3 }} />
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedDriver || !selectedCar || !assignDate}
          sx={{
            backgroundColor: theme.palette.primary.main,
            fontWeight: "bold",
            minWidth: 200,
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          {t("Save")}
        </Button>
      </Box>

      {/* Driver Modal */}
      <Dialog open={driverModalOpen} onClose={() => setDriverModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedDriver ? t("Change Driver") : t("Choose Driver")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t("Search by Driver ID or Name")}
            value={driverSearch}
            onChange={(e) => setDriverSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
       <List sx={{ maxHeight: 400, overflowY: "auto" }}>
  {filteredDrivers?.length > 0 ? (
    filteredDrivers.map((driver) => (
      <ListItem button key={driver._id} onClick={() => handleSelectDriver(driver)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 2,
            // switch row direction in RTL
            flexDirection: theme.direction === "rtl" ? "row-reverse" : "row",
          }}
        >
          <Avatar
            src={`${imageUrl}${driver.profile_image}`}
            sx={{ width: 48, height: 48 }}
          />

          <Box flexGrow={1}>
            <Typography fontWeight="bold">{driver.fullname}</Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Typography variant="body2" mr={0.5}>
              {driver?.rating || 5}
            </Typography>
            <StarIcon fontSize="small" color="primary" />
          </Box>

          {selectedDriver?._id === driver._id && (
            <CheckIcon color="primary" />
          )}
        </Box>
      </ListItem>
    ))
  ) : (
    <ListItem>
      <ListItemText primary={t("No drivers found")} />
    </ListItem>
  )}
</List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDriverModalOpen(false)}>{t("Cancel")}</Button>
        </DialogActions>
      </Dialog>

      {/* Car Modal */}
      <Dialog open={carModalOpen} onClose={() => setCarModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedCar ? t("Change Car") : t("Choose Car")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t("Search by Car ID, Plate or Model")}
            value={carSearch}
            onChange={(e) => setCarSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
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
          // flip order in RTL so image is still on the right
          flexDirection: theme.direction === "rtl" ? "row-reverse" : "row",
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
          src={`${imageUrl}${car.car_images?.front}`}
          alt={car.car_model}
          sx={{ width: 60, height: 60, objectFit: "contain" }}
        />
      </ListItem>
    ))
  ) : (
    <ListItem>
      <ListItemText primary={t("No cars found")} />
    </ListItem>
  )}
</List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCarModalOpen(false)}>{t("Cancel")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
