import React, { useState } from "react";
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Stack,
  InputAdornment,
  ListItemText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";

// Mock data
const availableDrivers = [
  { id: "DRV-001", name: "Emma Davis", image: DomiDriverImage, rating: 4.8 },
  { id: "DRV-002", name: "Sarah Johnson", image: DomiDriverImage, rating: 4.9 },
  { id: "DRV-003", name: "Lisa Anderson", image: DomiDriverImage, rating: 4.7 },
];

const availableCars = [
  { id: "CAR-001", plate: "اوص 8298", brand: "Toyota Camry", color: "White", image: DomiCar },
  { id: "CAR-002", plate: "أ ب ج 1234", brand: "Honda Civic", color: "Black", image: DomiCar },
  { id: "CAR-003", plate: "د هـ و 5678", brand: "Hyundai Elantra", color: "Silver", image: DomiCar },
];

export default function LinkCarDriverPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // State management
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [driverSearch, setDriverSearch] = useState("");
  const [carSearch, setCarSearch] = useState("");
  const [assignDate, setAssignDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  // Filter functions
  const filteredDrivers = availableDrivers.filter(driver => 
    driver.id.toLowerCase().includes(driverSearch.toLowerCase()) ||
    driver.name.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const filteredCars = availableCars.filter(car => 
    car.id.toLowerCase().includes(carSearch.toLowerCase()) ||
    car.brand.toLowerCase().includes(carSearch.toLowerCase()) ||
    car.plate.toLowerCase().includes(carSearch.toLowerCase())
  );

  // Selection handlers
  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setDriverModalOpen(false);
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setCarModalOpen(false);
  };

  // Save handler
  const handleSave = () => {
    console.log("Saving link:", { selectedDriver, selectedCar, assignDate, releaseDate });
    // Here you would typically make an API call
    navigate('/CarDriver'); // Navigate back after save
  };

  return (
    <Box p={isMobile ? 1 : 2} maxWidth="md">
           <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography 
          onClick={() => navigate('/CarDriver')} 
          sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
        >
          {t('Cars-Drivers')}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography 
          onClick={() => navigate('/CarDriver')} 
          sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
        >
          {t('Cars-Drivers Details')}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography>{t("Link Car-Driver")}</Typography>
      </Box>

      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        {t("Link Car-Driver")}
      </Typography>

      {/* Driver Card */}
      <Card sx={{ 
        mb: 3, 
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        borderRadius: 2
      }}>
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
                    src={selectedDriver.image} 
                    sx={{ width: 64, height: 64 }} 
                  />
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">{selectedDriver.name}</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {selectedDriver.rating}
                    </Typography>
                    <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
                  </Box>
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    onClick={() => setDriverModalOpen(true)}
                    sx={{ 
                      borderColor: theme.palette.primary.main, 
                      borderWidth: 2, 
                      fontWeight: 'bold',
                      minWidth: 100
                    }}
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
                  sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    fontWeight: 'bold',
                    py: 1.5,
                    minWidth: 150
                  }}
                >
                  {t("Choose Driver")}
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Car Card */}
      <Card sx={{ 
        mb: 3, 
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        borderRadius: 2
      }}>
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
                    src={selectedCar.image} 
                    alt={selectedCar.brand} 
                    sx={{ width: 64, height: 64, objectFit: 'contain' }} 
                  />
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">{selectedCar.plate}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCar.brand} • {selectedCar.color}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    onClick={() => setCarModalOpen(true)}
                    sx={{ 
                      borderColor: theme.palette.primary.main, 
                      borderWidth: 2, 
                      fontWeight: 'bold',
                      minWidth: 100
                    }}
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
                  sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    fontWeight: 'bold',
                    py: 1.5,
                    minWidth: 150
                  }}
                >
                  {t("Choose Car")}
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Date Selection */}
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
              type="date"
              value={assignDate}
              onChange={(e) => setAssignDate(e.target.value)}
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
          </Box>
          
          <Box>
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

          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Save Button */}
      <Box display="flex" justifyContent="end">
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedDriver || !selectedCar || !assignDate}
          sx={{ 
            backgroundColor: theme.palette.primary.main,
            fontWeight: "bold",
            minWidth: 200,
            py: 1.5,
            px: 4,
            fontSize: "1.1rem"
          }}
        >
          {t("Save")}
        </Button>
      </Box>

      {/* Driver Selection Modal */}
      <Dialog 
        open={driverModalOpen} 
        onClose={() => setDriverModalOpen(false)} 
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {selectedDriver ? t("Change Driver") : t("Choose Driver")}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t("Search by Driver ID or Name")}
            value={driverSearch}
            onChange={(e) => setDriverSearch(e.target.value)}
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
                  borderWidth: 1
                }
              }
            }}
          />
          
          <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <ListItem 
                  button 
                  key={driver.id}
                  onClick={() => handleSelectDriver(driver)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: selectedDriver?.id === driver.id ? theme.palette.primary.light : 'transparent',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%',
                    gap: 2
                  }}>
                    <Avatar src={driver.image} sx={{ width: 48, height: 48 }} />
                    <Box flexGrow={1}>
                      <Typography variant="body1" fontWeight="bold" color={theme?.palette?.text?.blue}>
                        #{driver.id}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {driver.name}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" mr={0.5}>
                        {driver.rating}
                      </Typography>
                      <StarIcon fontSize="small" color="primary" />
                    </Box>
                    {selectedDriver?.id === driver.id && (
                      <CheckIcon sx={{ color: theme.palette.primary.main }} />
                    )}
                  </Box>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary={t("No drivers found")} 
                  primaryTypographyProps={{ textAlign: 'center' }} 
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDriverModalOpen(false)}
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 'bold'
            }}
          >
            {t("Cancel")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Car Selection Modal */}
      <Dialog 
        open={carModalOpen} 
        onClose={() => setCarModalOpen(false)} 
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)"
          }
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
                  borderWidth: 1
                }
              }
            }}
          />
          
          <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
             <ListItem 
  button 
  key={car.id}
  onClick={() => handleSelectCar(car)}
  sx={{
    borderRadius: 1,
    mb: 0.5,
    backgroundColor: selectedCar?.id === car.id ? theme.palette.primary.light : 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }}
>
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      width: '100%', 
      gap: 2 
    }}
  >
    <Typography variant="body1" fontWeight="bold" color={theme.palette.text.blue}>
      #{car.id}
    </Typography>

    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {car.plate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {car.brand} • {car.color}
                      </Typography>
                    </Box>

    <Box
      component="img"
      src={car.image}
      alt={car.brand}
      sx={{ width: 60, height: 60, objectFit: 'contain' }}
    />
  </Box>
</ListItem>

              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary={t("No cars found")} 
                  primaryTypographyProps={{ textAlign: 'center' }} 
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCarModalOpen(false)}
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 'bold'
            }}
          >
            {t("Cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}