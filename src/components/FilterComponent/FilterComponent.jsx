import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../RTLTextField';
import { ReactComponent as SearchIcon } from '../../assets/searchIcon.svg'

const FilterComponent = ({ onSearch, cityOptions = [], statusOptions = [], isDriver = false }) => {
  const theme = useTheme();
  const { t , i18n } = useTranslation();
  const isArabic = i18n.language == 'ar'
  const [filters, setFilters] = useState({ search: '', city: '', status: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSearch(filters);
  };

  return (
    <Box sx={{ mb: 3, px: { xs: 1, sm: 2 } }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        <Grid item xs={12} sm={6} md={5}>
          <CustomTextField
            fullWidth
            size="small"
            name="search"
            placeholder={isDriver ? t("Search by Driver name and number") : t("Search by Passenger name and number")}
            sx={{ backgroundColor:theme.palette.secondary.sec ,  borderRadius:1 }}
            value={filters.search}
            onChange={handleChange}
            isRtl={isArabic}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

  {/* City Select as TextField */}
<Grid item xs={12} sm={3} md={3}>
  <CustomTextField
    select
    fullWidth
    size="small"
    label={t('City')}
    name="city"
    value={filters.city}
    onChange={handleChange}
    variant="outlined"
    sx={{ backgroundColor: theme.palette.secondary.sec,  borderRadius:1 }}
    isRtl={isArabic}
    SelectProps={{
      MenuProps: {
        PaperProps: {
          style: { maxHeight: 250 }
        }
      }
    }}
  >
    <MenuItem value="">{t('All')}</MenuItem>
    {cityOptions.map(city => (
      <MenuItem key={city} value={city}>
        {city}
      </MenuItem>
    ))}
  </CustomTextField>
</Grid>

{/* Status Select as TextField */}
<Grid item xs={12} sm={3} md={3}>
  <CustomTextField
    select
    fullWidth
    size="small"
    label={t('Account Status')}
    name="status"
    value={filters.status}
    onChange={handleChange}
    variant="outlined"
    isRtl={isArabic}
    sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius:1 }}
  >
    <MenuItem value="">{t('All')}</MenuItem>
    {statusOptions.map(status => (
      <MenuItem key={status} value={status}>
        {status}
      </MenuItem>
    ))}
  </CustomTextField>
</Grid>


        {/* Search Button */}
        <Grid item xs={12} sm={12} md={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            size="medium"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.whiteText.primary,
              borderRadius:1
            }}
          >
            {t('Search')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterComponent;
