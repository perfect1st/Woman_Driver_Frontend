import React, { useState } from "react";
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
  ListItemText,
  Stack,
  InputAdornment
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import DomiCar from "../../assets/DomiCar.png";
import DomiDriverImage from "../../assets/DomiDriverImage.png";

// Status styles
const statusStyles = {
  Linked: { textColor: "#085D3A", bgColor: "#ECFDF3", borderColor: "#ABEFC6" },
  "On Request": { textColor: "#93370D", bgColor: "#FFFAEB", borderColor: "#FEDF89" },
  Leaved: { textColor: "#1F2A37", bgColor: "#F9FAFB", borderColor: "#E5E7EB" },
  Rejected: { textColor: "#912018", bgColor: "#FEF3F2", borderColor: "#FECDCA" }
};

// Mock data
const mockDriver = {
  id: "DRV-001",
  name: "Emma Davis",
  image: DomiDriverImage,
  rating: 4.8
};

const availableCars = [
  { id: "CAR-001", plate: "اوص 8298", brand: "Toyota Camry", color: "White", image: DomiCar },
  { id: "CAR-002", plate: "أ ب ج 1234", brand: "Honda Civic", color: "Black", image: DomiCar },
  { id: "CAR-003", plate: "د هـ و 5678", brand: "Hyundai Elantra", color: "Silver", image: DomiCar },
  { id: "CAR-004", plate: "ز ح ط 9012", brand: "Kia Sportage", color: "Red", image: DomiCar },
  { id: "CAR-005", plate: "ك ل م 3456", brand: "Nissan Altima", color: "Blue", image: DomiCar },
];

export function CarDriverDetailsPage() {
  const { t, i18n } = useTranslation();
  const {id} = useParams();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [car, setCar] = useState(availableCars[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignDate, setAssignDate] = useState("2025-07-26");
  const [releaseDate, setReleaseDate] = useState("2026-01-25");
  const [editingAssign, setEditingAssign] = useState(false);
  const [editingRelease, setEditingRelease] = useState(false);
  const [status, setStatus] = useState("On Request");

  const styles = statusStyles[status] || {};

  const handleChangeCar = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);
  
  const handleChooseCar = (selectedCar) => {
    setCar(selectedCar);
    setDialogOpen(false);
  };

  // Filter cars based on search term
  const filteredCars = availableCars.filter(car => 
    car.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={isMobile ? 1 : 2} maxWidth="md">
      {/* Breadcrumb */}
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
        <Typography>#{id}</Typography>
      </Box>

      {/* Driver Card */}
      <Card sx={{ 
        mb: 2, 
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">{t('Driver')}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar src={mockDriver.image} sx={{ width: 64, height: 64 }} />
            </Grid>
            <Grid item xs>
              <Typography fontWeight="bold">{mockDriver.name}</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary">{mockDriver.rating}</Typography>
                <StarIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />
              </Box>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: theme.palette.primary.main, 
                  borderWidth: 2, 
                  fontWeight: 'bold',
                  minWidth: 120
                }}
              >
                {t('View Profile')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Car Card */}
      <Card sx={{ 
        mb: 2, 
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">{t('Car')}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container alignItems="center" spacing={2}>
            {car ? (
              <>
                <Grid item>
                  <Box 
                    component="img" 
                    src={car.image} 
                    alt={car.brand} 
                    sx={{ width: 64, height: 64, objectFit: 'contain' }} 
                  />
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">{car.plate}</Typography>
                  <Typography variant="body2" color="text.secondary">{`${car.brand} • ${car.color}`}</Typography>
                </Grid>
                <Grid item>
                  <Button 
                    onClick={handleChangeCar} 
                    variant="outlined" 
                    sx={{ 
                      borderColor: theme.palette.primary.main, 
                      borderWidth: 2, 
                      fontWeight: 'bold',
                      minWidth: 100
                    }}
                  >
                    {t('Change')}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} textAlign="center">
                <Button 
                  onClick={handleChangeCar} 
                  variant="contained" 
                    sx={{ 
                      backgroundColor: theme.palette.primary.main,
                      fontWeight: 'bold',
                      py: 1.5,
                      minWidth: 150
                    }}
                >
                  {t('Choose Car')}
                </Button>
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
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {car ? t('Change Car') : t('Choose Car')}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t('Search by Car ID, Plate or Model')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              filteredCars.map((carOption) => (
                <ListItem 
                  button 
                  key={carOption.id}
                  onClick={() => handleChooseCar(carOption)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: car?.id === carOption.id ? theme.palette.primary.light : 'transparent',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%',
                    justifyContent: 'space-between' 
                  }}>
                     <Typography variant="body1" fontWeight="bold" color={theme?.palette?.text?.blue}>
                        #{carOption.id}
                      </Typography>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {carOption.plate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {carOption.brand} • {carOption.color}
                      </Typography>
                    </Box>
                    <Box
                      component="img"
                      src={carOption.image}
                      alt={carOption.brand}
                      sx={{ width: 60, height: 60, objectFit: 'contain' }}
                    />
                    {/* {car?.id === carOption.id && (
                      <CheckIcon sx={{ 
                        color: theme.palette.primary.main, 
                        // ml:  2 
                      }} />
                    )} */}
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
            onClick={handleClose}
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 'bold'
            }}
          >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Chip and Other Details */}
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight="bold" color="primary">{t('Other Details')}</Typography>
        <Chip
          label={t(status)}
          sx={{ 
            color: styles.textColor, 
            backgroundColor: styles.bgColor, 
            border: `1px solid ${styles.borderColor}`, 
            fontWeight: 'bold',
            px: 1.5,
            py: 0.5
          }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Dates Card */}
      <Stack spacing={2} mb={2}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('Assign Date')}</Typography>
              {editingAssign ? (
                <TextField 
                  size="small" 
                  type="date" 
                  value={assignDate} 
                  onChange={(e) => setAssignDate(e.target.value)}
                  InputProps={{
                    sx: { 
                      fontWeight: 'bold',
                      color: theme?.palette?.text?.blue
                    }
                  }}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography fontWeight="bold" color={theme?.palette?.text?.blue} sx={{ mt: 0.5 }}>
                  {new Date(assignDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
            <IconButton 
              onClick={() => setEditingAssign(!editingAssign)}
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected
                }
              }}
            >
              {editingAssign ? <CheckIcon color="primary" /> : <EditIcon color="primary" />}
            </IconButton>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('Release Date')}</Typography>
              {editingRelease ? (
                <TextField 
                  size="small" 
                  type="date" 
                  value={releaseDate} 
                  onChange={(e) => setReleaseDate(e.target.value)}
                  InputProps={{
                    sx: { 
                      fontWeight: 'bold',
                      color: theme?.palette?.text?.blue
                    }
                  }}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography fontWeight="bold" color={theme?.palette?.text?.blue} sx={{ mt: 0.5 }}>
                  {new Date(releaseDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
            <IconButton 
              onClick={() => setEditingRelease(!editingRelease)}
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected
                }
              }}
            >
              {editingRelease ? <CheckIcon color="primary" /> : <EditIcon color="primary" />}
            </IconButton>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}