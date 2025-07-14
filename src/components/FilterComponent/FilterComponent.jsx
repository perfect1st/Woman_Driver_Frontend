import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  InputAdornment,
  Button,
  useTheme,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTextField from "../RTLTextField";
import { ReactComponent as SearchIcon } from "../../assets/searchIcon.svg";
import { ArrowDropDown } from "@mui/icons-material";

const FilterComponent = ({
  onSearch,
  cityOptions = [],
  statusOptions = [],
  isDriver = false,
  tripTypeOptions = [],
  carTypeOptions = [],
  isTrip = false,
  isCar = false,
  isCarType = false,
  isCarDriver = false,
  companyCarOptions = [],
  isTrafficTime = false,
  isWallet = false,
  isInWalletDetails=false
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    search: "",
    city: "",
    carType: "",
    companyCar: "",
    status: "",
    tripType: "",
    userType: "",
    transactionType: "",
    transactionReason: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setFilters({
      search: queryParams.get("keyword") || "",
      city: queryParams.get("city") || "",
      carType: queryParams.get("carType") || "",
      companyCar: queryParams.get("companyCar") || "",
      status: queryParams.get("status") || "",
      tripType: queryParams.get("tripType") || "",
          userType: queryParams.get("userType") || "",
    transactionType: queryParams.get("transactionType") || "",
    transactionReason: queryParams.get("transactionReason") || "",
    });
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    const queryParams = new URLSearchParams();
    
    if (isInWalletDetails) queryParams.set("tab", "history");
    if (filters.search) queryParams.set("keyword", filters.search);
    if (filters.city) queryParams.set("city", filters.city);
    if (filters.carType) queryParams.set("carType", filters.carType);
    if (filters.companyCar) queryParams.set("companyCar", filters.companyCar);
    if (filters.status) queryParams.set("status", filters.status);
    if (filters.tripType) queryParams.set("tripType", filters.tripType);
    if (filters.userType) queryParams.set("userType", filters.userType);
    if (filters.transactionType)
      queryParams.set("transactionType", filters.transactionType);
    if (filters.transactionReason)
      queryParams.set("transactionReason", filters.transactionReason);
    const queryString = queryParams.toString();

    // ✅ اطبع الكويري في الكونسل فقط
    console.log("Query for backend:", queryString);

    navigate({
      pathname: location.pathname,
      search: queryString,
    });
  };

  const handleCancelFilters = () => {
    setFilters({
      search: "",
      city: "",
      carType: "",
      companyCar: "",
      status: "",
      tripType: "",
      userType: "",
      transactionType: "",
      transactionReason: "",
    });

    // إزالة الباراميترز من الـ URL
    navigate({
      pathname: location.pathname,
      search: "",
    });

    // عرض كل البيانات من جديد
    onSearch({
      keyword: "",
      city: "",
      carType: "",
      status: "",
      tripType: "",
      userType: "",
      transactionType: "",
      transactionReason: "",
    });
  };

  // Find city name by ID for display
  const getCityNameById = (id) => {
    const city = cityOptions.find((c) => c._id === id);
    return city ? city.name : "";
  };
  const getCarTypeById = (id) => {
    const carType = carTypeOptions.find((c) => c._id === id);
    return carType ? carType.name : "";
  };

  return (
    <Box sx={{ mb: 3, px: { xs: 1, sm: 2 } }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        <Grid
          item
          xs={12}
          sm={6}
          md={
            isWallet
              ? 6
              : isCarType
              ? 7
              : isCar
              ? 4
              : isTrip
              ? 4
              : isDriver
              ? 4
              : 7
          }
        >
          <CustomTextField
            fullWidth
            size="small"
            name="search"
            placeholder={
              isWallet
                ? t("Search by User name and Wallet ID")
                : isTrafficTime
                ? t("Search by Traffic Time ID and Traffic Time Name")
                : isCarDriver
                ? t("Search by Cars-Drivers ID and Driver Name and Car Model")
                : isCarType
                ? t("Search by Car Type ID and Car Type Name")
                : isCar
                ? t("Search by Car ID and Car Model")
                : isTrip
                ? t("Search by Rider name and Driver name")
                : isDriver
                ? t("Search by Driver name and number")
                : t("Search by Passenger name and number")
            }
            sx={{
              backgroundColor: theme.palette.secondary.sec,
              borderRadius: 1,
            }}
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

        {isWallet && (
          <>
            {/* User Type Select */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomTextField
                select
                fullWidth
                size="small"
                label={t("User Type")}
                name="userType"
                value={filters.userType || ""}
                onChange={handleChange}
                variant="outlined"
                isRtl={isArabic}
                SelectProps={{
                  IconComponent: (props) => (
                    <ArrowDropDown
                      {...props}
                      sx={{ left: "auto", right: 8, position: "absolute" }}
                    />
                  ),
                  MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
                }}
                sx={{
                  backgroundColor: theme.palette.secondary.sec,
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">{t("All")}</MenuItem>
                <MenuItem value="driver">{t("Driver")}</MenuItem>
                <MenuItem value="passenger">{t("Passenger")}</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Transaction Type Select */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomTextField
                select
                fullWidth
                size="small"
                label={t("Transaction Type")}
                name="transactionType"
                value={filters.transactionType || ""}
                onChange={handleChange}
                variant="outlined"
                isRtl={isArabic}
                SelectProps={{
                  IconComponent: (props) => (
                    <ArrowDropDown
                      {...props}
                      sx={{ left: "auto", right: 8, position: "absolute" }}
                    />
                  ),
                  MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
                }}
                sx={{
                  backgroundColor: theme.palette.secondary.sec,
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">{t("All")}</MenuItem>
                <MenuItem value="add">{t("Add")}</MenuItem>
                <MenuItem value="withdraw">{t("Withdraw")}</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Transaction Reason Select */}
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                select
                fullWidth
                size="small"
                label={t("Transaction Reason")}
                name="transactionReason"
                value={filters.transactionReason || ""}
                onChange={handleChange}
                variant="outlined"
                isRtl={isArabic}
                SelectProps={{
                  IconComponent: (props) => (
                    <ArrowDropDown
                      {...props}
                      sx={{ left: "auto", right: 8, position: "absolute" }}
                    />
                  ),
                  MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
                }}
                sx={{
                  backgroundColor: theme.palette.secondary.sec,
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">{t("All")}</MenuItem>
                <MenuItem value="bonus">{t("Bonus")}</MenuItem>
                <MenuItem value="tripPayment">{t("Trip Payment")}</MenuItem>
                <MenuItem value="walletCorrection">
                  {t("Wallet Correction")}
                </MenuItem>
              </CustomTextField>
            </Grid>
          </>
        )}

        {isTrip && (
          <Grid item xs={12} sm={3} md={2}>
            <CustomTextField
              select
              fullWidth
              size="small"
              label={t("Trip Type")}
              name="tripType"
              value={filters.tripType}
              onChange={handleChange}
              variant="outlined"
              isRtl={isArabic}
              SelectProps={{
                IconComponent: (props) => (
                  <ArrowDropDown
                    {...props}
                    sx={{
                      left: "auto",
                      right: 8,
                      position: "absolute",
                    }}
                  />
                ),
                MenuProps: {
                  PaperProps: { style: { maxHeight: 250 } },
                },
                renderValue: (selected) => {
                  if (!selected) return t("All");
                  const tripType = tripTypeOptions.find(
                    (t) => t._id === selected
                  );
                  return tripType ? tripType.name : t("All");
                },
              }}
              sx={{
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              }}
            >
              <MenuItem value="">{t("All")}</MenuItem>
              {tripTypeOptions.map((tripType) => (
                <MenuItem key={tripType._id} value={tripType._id}>
                  {tripType.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        )}

        {/* City Select */}
        {false && (
          <Grid item xs={12} sm={3} md={3}>
            <CustomTextField
              select
              fullWidth
              size="small"
              label={t("City")}
              name="city"
              value={filters.city}
              onChange={handleChange}
              variant="outlined"
              sx={{
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              }}
              isRtl={isArabic}
              SelectProps={{
                IconComponent: (props) => (
                  <ArrowDropDown
                    {...props}
                    sx={{
                      left: "auto",
                      right: 8,
                      position: "absolute",
                    }}
                  />
                ),
                MenuProps: {
                  PaperProps: { style: { maxHeight: 250 } },
                },
                renderValue: (selected) => {
                  if (!selected) return t("All");
                  return getCityNameById(selected) || t("All");
                },
              }}
            >
              <MenuItem value="">{t("All")}</MenuItem>
              {cityOptions.map((city) => (
                <MenuItem key={city._id} value={city._id}>
                  {city.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        )}
        {/* Car Type Select (for trips and drivers) */}
        {(isCar || isTrip || isDriver) && (
          <Grid item xs={12} sm={3} md={isDriver ? 3 : 2}>
            <CustomTextField
              select
              fullWidth
              size="small"
              label={t("Car type")}
              name="carType"
              value={filters.carType}
              onChange={handleChange}
              variant="outlined"
              isRtl={isArabic}
              SelectProps={{
                IconComponent: (props) => (
                  <ArrowDropDown
                    {...props}
                    sx={{
                      left: "auto",
                      right: 8,
                      position: "absolute",
                    }}
                  />
                ),
                MenuProps: {
                  PaperProps: { style: { maxHeight: 250 } },
                },
                renderValue: (selected) => {
                  if (!selected) return t("All");
                  const carType = carTypeOptions.find(
                    (c) => c._id === selected
                  );
                  return carType ? carType.name : t("All");
                },
              }}
              sx={{
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              }}
            >
              <MenuItem value="">{t("All")}</MenuItem>
              {carTypeOptions.map((carType) => (
                <MenuItem key={carType._id} value={carType._id}>
                  {carType.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        )}

        {/* Company Car Select (for cars) */}
        {isCar && (
          <Grid item xs={12} sm={3} md={2}>
            <CustomTextField
              select
              fullWidth
              size="small"
              label={t("Company Car")}
              name="companyCar"
              value={filters.companyCar}
              onChange={handleChange}
              variant="outlined"
              isRtl={isArabic}
              SelectProps={{
                IconComponent: (props) => (
                  <ArrowDropDown
                    {...props}
                    sx={{
                      left: "auto",
                      right: 8,
                      position: "absolute",
                    }}
                  />
                ),
                MenuProps: {
                  PaperProps: { style: { maxHeight: 250 } },
                },
                renderValue: (selected) => {
                  if (!selected) return t("All");
                  return t(selected);
                },
              }}
              sx={{
                backgroundColor: theme.palette.secondary.sec,
                borderRadius: 1,
              }}
            >
              <MenuItem value="">{t("All")}</MenuItem>
              {companyCarOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {t(option)}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        )}

        {/* Status Select */}
        <Grid
          item
          xs={12}
          sm={3}
          md={isWallet ? 4 : isCarType ? 3 : isCar ? 2 : isTrip ? 2 : 3}
        >
          <CustomTextField
            select
            fullWidth
            size="small"
            label={
              isCarType
                ? t("Car Type Status")
                : isCar
                ? t("Car status")
                : t("Account Status")
            }
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
                    left: "auto",
                    right: 8,
                    position: "absolute",
                  }}
                />
              ),
              MenuProps: {
                PaperProps: { style: { maxHeight: 250 } },
              },
            }}
            sx={{
              backgroundColor: theme.palette.secondary.sec,
              borderRadius: 1,
            }}
          >
            <MenuItem value="">{t("All")}</MenuItem>
            {statusOptions.map((status) => (
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
              borderRadius: 1,
            }}
          >
            {t("Search")}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={1}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancelFilters}
            size="medium"
            sx={{
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              borderRadius: 1,
            }}
          >
            {t("Cancel")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterComponent;
