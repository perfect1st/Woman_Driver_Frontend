import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  InputAdornment,
  Button,
  useTheme,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomTextField from '../RTLTextField';
import { ReactComponent as SearchIcon } from '../../assets/searchIcon.svg'
import { ArrowDropDown } from '@mui/icons-material';

const FilterComponent = ({ onSearch, cityOptions = [], statusOptions = [], isDriver = false }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  
  const [filters, setFilters] = useState({ 
    search: '', 
    city: '', 
    status: '' 
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setFilters({
      search: queryParams.get('keyword') || '',
      city: queryParams.get('city') || '',
      status: queryParams.get('status') || ''
    });
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Handle search by URL parameters
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.set('keyword', filters.search);
    if (filters.city) queryParams.set('city', filters.city);
    if (filters.status) queryParams.set('status', filters.status);
    
    navigate({
      pathname: location.pathname,
      search: queryParams.toString()
    });

    // Handle search with formatted parameters
    onSearch({
      keyword: filters.search,
      city: filters.city,
      status: filters.status
    });
  };

  // Find city name by ID for display
  const getCityNameById = (id) => {
    const city = cityOptions.find(c => c._id === id);
    return city ? city.name : '';
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
            sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }}
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

        {/* City Select */}
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
            sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }}
            isRtl={isArabic}
            SelectProps={{
              IconComponent: (props) => (
                <ArrowDropDown
                  {...props}
                  sx={{
                    left: 'auto',
                    right: 8,
                    position: 'absolute',
                  }}
                />
              ),
              MenuProps: {
                PaperProps: { style: { maxHeight: 250 } }
              },
              renderValue: (selected) => {
                if (!selected) return t('All');
                return getCityNameById(selected) || t('All');
              }
            }}
          >
            <MenuItem value="">{t('All')}</MenuItem>
            {cityOptions.map(city => (
              <MenuItem key={city._id} value={city._id}>
                {city.name}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Status Select */}
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
            SelectProps={{
              IconComponent: (props) => (
                <ArrowDropDown
                  {...props}
                  sx={{
                    left: 'auto',
                    right: 8,
                    position: 'absolute',
                  }}
                />
              ),
              MenuProps: {
                PaperProps: { style: { maxHeight: 250 } }
              }
            }}
            sx={{ backgroundColor: theme.palette.secondary.sec, borderRadius: 1 }}
          >
            <MenuItem value="">{t('All')}</MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>
                {t(status)}
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
              borderRadius: 1
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