import React, { useState, useMemo, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import "./i18n/i18n";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { orange, green } from "@mui/material/colors";
import LoadingComponent from "./components/LoadingComponent";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home/Home";
import PassengersPage from "./pages/PassengersPage/PassengersPage";
import DriversPage from "./pages/DriversPage/DriversPage";
import RiderDetailsPage from "./pages/RiderDetailsPage/RiderDetailsPage";
import DriverDetailsPage from "./pages/DriverDetailsPage/DriverDetailsPage";
import TripsPage from "./pages/TripsPage/TripsPage";
import TripDetailsPage from "./pages/TripDetailsPage/TripDetailsPage";
import CarsPage from "./pages/CarsPage/CarsPage";
import CarDetailsPage from "./pages/CarDetailsPage/CarDetailsPage";
import driverImage from "./assets/DomiDriverImage.png";
import AddCarPage from "./pages/AddCarPage/AddCarPage";
import CarTypesPage from "./pages/CarTypesPage/CarTypesPage";
import CarTypeDetailsPage from "./pages/CarTypeDetailsPage/CarTypeDetailsPage";
import AddCarTypePage from "./pages/AddCarTypePage/AddCarTypePage";
import CarDriverPage from "./pages/CarDriverPage/CarDriverPage";
import { CarDriverDetailsPage } from "./pages/CarDriverDetailsPage/CarDriverDetailsPage";
import LinkCarDriverPage from "./pages/LinkCarDriverPage/LinkCarDriverPage";
import TrafficTimePage from "./pages/TrafficTimePage/TrafficTimePage";
import TrafficTimeDetailsPage from "./pages/TrafficTimeDetailsPage/TrafficTimeDetailsPage";
import AddTrafficTimePage from "./pages/AddTrafficTimePage/AddTrafficTimePage";
import WalletPage from "./pages/WalletPage/WalletPage";
import WalletDetailsPage from "./pages/WalletDetailsPage/WalletDetailsPage";
import AddTransactionPage from "./pages/AddTransactionPage/AddTransactionPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage/PaymentMethodsPage";
import PaymentMethodsDetailsPage from "./pages/PaymentMethodsDetailsPage/PaymentMethodsDetailsPage";
import AddPaymentMethodPage from "./pages/AddPaymentMethodPage/AddPaymentMethodPage";
import LoadingPage from "./components/LoadingComponent";
import NotFoundPage from "./components/NotFoundPage";
import Maintenance from "./components/Maintenance";
import CommissionPage from "./pages/CommissionPage/CommissionPage";
import LiqudationPage from "./pages/LiqudationPage/LiqudationPage";
import CommissionCategoryPage from "./pages/CommissionCategoryPage/CommissionCategoryPage";
import LiqudationDetailsPage from "./pages/LiqudationDetailsPage/LiqudationDetailsPage";
import CommissionDetailsPage from "./pages/CommissionDetailsPage/CommissionDetailsPage";
import CommissionCategoryDetails from "./pages/CommissionCategoryDetails/CommissionCategoryDetails";
import AddCommissionCategory from "./pages/AddCommissionCategory/AddCommissionCategory";
import TrackingFrequencyModal from "./components/Modals/TrackingFrequencyModal";
import NotifyRadiusModal from "./components/Modals/NotifyRadiusModal";
import LoginPage from "./pages/LoginPage/LoginPage";
import AddUserPage from "./pages/AddUserPage/AddUserPage";
import PermissionGroupsPage from "./pages/PermissionGroups/PermissionGroups";
import PermissionGroupDetailsPage from "./pages/PermissionGroups/PermissionGroupDetailsPage";
import UsersPage from "./pages/UsersPage/UsersPage";
import { getUserCookie } from "./hooks/authCookies";
import UserDetailsPage from "./pages/UserDetailsPage/UserDetailsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CouponsPage from "./pages/CouponsPage/CouponsPage";
import AddOfferPage from "./pages/OffersPage/AddOffer";
import OffersPage from "./pages/OffersPage/OffersPage";
import AddCouponPage from "./pages/CouponsPage/AddCoupon";
import CouponDetailsPage from "./pages/CouponsPage/CouponDetailsPage";
import OfferDetailsPage from "./pages/OffersPage/OfferDetails";
import { getAllSetting } from "./redux/slices/setting/thunk";
import { useDispatch } from "react-redux";
import CashbackPercentageModal from "./components/Modals/CashbackPercentageModal";
import PrivacyPolicyPage from "./pages/settings/PrivacyPolicyPage";
import HelpPage from "./pages/settings/HelpPage";
import ContactUsPage from "./pages/ContactUsPage/ContactUsPage";
import ProtectedRoute from "./Auth/ProtectedRoute";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

function App() {
  const [mode, setMode] = useState("light");
  const { i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSetting());
  }, []);
  // Update direction and language in localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem("theme-mode");
    if (storedMode) {
      setMode(storedMode);
    }

    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      document.documentElement.dir = storedLanguage === "ar" ? "rtl" : "ltr";
    } else {
      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    }
  }, [i18n]);

  // Listen for language changes to update RTL/LTR
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", i18n.language);
  }, [i18n.language]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme-mode", newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        direction: i18n.language === "ar" ? "rtl" : "ltr",
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#FF87AF" : "#E7548A",
            contrastText: "#ffffff",
          },
          secondary: {
            main: mode === "light" ? "#FFE9FB" : "#5A1A3B",
            sec: mode === "light" ? "#F9FAFB" : "#BDC8D2",
            border: mode === "light" ? "#F5F0F2" : "#CCB2BC",
          },
          background: {
            default: mode === "light" ? "#F5F0F2" : "#121212",
            secDefault: mode === "light" ? "#F7FAFA" : "#1F2937",
            DarkGray: mode === "light" ? "#F7FAFA" : "#1F2937",
            paper: mode === "light" ? "#FFFFFF" : "#1e1e1e",
          },
          customBackground: {
            mainCard: mode === "light" ? "#F3DFD1" : "#1f1f1f",
          },
          text: {
            primary: mode === "light" ? "#191C32" : "#ffffff",
            blue: mode === "light" ? "#0080FB" : "#0080FB",
          },
          whiteText: {
            primary: mode === "light" ? "#ffffff" : "#191C32",
          },
        },
        typography: {
          fontFamily: ["Cairo"].join(","),
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background:
                  mode === "light"
                    ? "#FFFFFF" // خلفية بيضاء في الوضع الفاتح
                    : "linear-gradient(220deg, #1A1A1A 0%, #2C2C2C 100%)",
                color: mode === "light" ? "#222" : "#fff",

                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                minHeight: "100vh",
                margin: 0,
                padding: 0,
                scrollbarColor:
                  mode === "dark" ? "#FF87AF #2C2C2C" : "#FF87AF #FFE9FB",
              },

              "body::-webkit-scrollbar, *::-webkit-scrollbar": {
                width: 8,
                height: 8,
              },
              "body::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb": {
                borderRadius: 8,
                backgroundColor: mode === "dark" ? "#FF87AF" : "#E7548A",
              },
              "body::-webkit-scrollbar-thumb:hover": {
                backgroundColor: mode === "dark" ? "#E7548A" : "#FF87AF",
              },
              "body::-webkit-scrollbar-track, *::-webkit-scrollbar-track": {
                borderRadius: 8,
                backgroundColor: mode === "dark" ? "#2C2C2C" : "#FFE9FB",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
              },
              containedPrimary: {
                backgroundColor: "#FF87AF",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: mode === "light" ? "#E7548A" : "#FF87AF",
                },
              },
              containedSecondary: {
                backgroundColor: "#FFE9FB",
                color: "#000000",
                "&:hover": {
                  backgroundColor: mode === "light" ? "#F3DFD1" : "#73415A",
                },
              },
              outlinedPrimary: {
                borderColor: "#FF87AF",
                color: "#FF87AF",
                "&:hover": {
                  backgroundColor: "rgba(255, 135, 175, 0.1)",
                  borderColor: "#E7548A",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(30, 30, 30, 0.85)",
                backdropFilter: "blur(8px)",
                boxShadow:
                  mode === "light"
                    ? "0px 4px 15px rgba(0, 0, 0, 0.1)"
                    : "0px 4px 15px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow:
                    mode === "light"
                      ? "0px 8px 25px rgba(0, 0, 0, 0.15)"
                      : "0px 8px 25px rgba(0, 0, 0, 0.4)",
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(32, 32, 32, 0.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(30, 30, 30, 0.8)",
                borderRadius: "8px",
              },
            },
          },
        },
      }),
    [mode, i18n.language]
  );

  const [openTracking, setOpenTracking] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [openCashback, setOpenCashback] = useState(false);

  const handleSidebarAction = (action) => {
    if (action === "openTrackingModal") setOpenTracking(true);
    if (action === "openNotifyRadiusModal") setOpenNotify(true);
    if (action === "openCashbackModal") setOpenCashback(true);
  };
  const user = getUserCookie();
  const hideHeader = location.pathname != "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="App"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {hideHeader && <Header onAction={handleSidebarAction} />}
          {/* Modals */}

          <main style={{ flex: 1 }}>
            <Routes>
              {/* المسارات العامة */}
              <Route
                path="/"
                element={
                  user ? <Navigate to="/home" /> : <Navigate to="/login" />
                }
              />
              {/* <Route path="/login" element={<LoginScreen />} /> */}

              {/* المسارات الخاصة التي تظهر فيها Sidebar */}
              <Route
                path="/login"
                element={
                  // <MainLayout>
                  <LoginPage />
                  // </MainLayout>
                }
              />
                  <Route element={<ProtectedRoute />}>

              <Route
                path="/home"
                element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                }
              />
              <Route
                path="/Passengers"
                element={
                  <MainLayout>
                    <PassengersPage />
                  </MainLayout>
                }
              />
              <Route
                path="/users"
                element={
                  <MainLayout>
                    <UsersPage />
                  </MainLayout>
                }
              />
              <Route
                path="/UserDetails/:id"
                element={
                  <MainLayout>
                    <UserDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Drivers"
                element={
                  <MainLayout>
                    <DriversPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Profile"
                element={
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                }
              />
              <Route
                path="/PermissionGroups/showpermissiongroup/:id"
                element={
                  <MainLayout>
                    <PermissionGroupDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Trips"
                element={
                  <MainLayout>
                    <TripsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Coupons"
                element={
                  <MainLayout>
                    <CouponsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Coupons/AddCoupon"
                element={
                  <MainLayout>
                    <AddCouponPage />
                  </MainLayout>
                }
              />
              <Route
                path="/couponDetails/:id"
                element={
                  <MainLayout>
                    <CouponDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Cars"
                element={
                  <MainLayout>
                    <CarsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CarTypes"
                element={
                  <MainLayout>
                    <CarTypesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CarDriver"
                element={
                  <MainLayout>
                    <CarDriverPage />
                  </MainLayout>
                }
              />
              <Route
                path="/TrafficTime"
                element={
                  <MainLayout>
                    <TrafficTimePage />
                  </MainLayout>
                }
              />
              <Route
                path="/users/AddUser"
                element={
                  <MainLayout>
                    <AddUserPage />
                  </MainLayout>
                }
              />
              <Route
                path="/PermissionGroups"
                element={
                  <MainLayout>
                    <PermissionGroupsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/PaymentMethods"
                element={
                  <MainLayout>
                    <PaymentMethodsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/liqudation"
                element={
                  <MainLayout>
                    <LiqudationPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Commission"
                element={
                  <MainLayout>
                    <CommissionPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CommissionCategory"
                element={
                  <MainLayout>
                    <CommissionCategoryPage />
                  </MainLayout>
                }
              />
              <Route
                path="/PaymentMethod/AddPaymentMethod"
                element={
                  <MainLayout>
                    <AddPaymentMethodPage />
                  </MainLayout>
                }
              />
              <Route
                path="/ContactUs"
                element={
                  <MainLayout>
                    <ContactUsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Loading"
                element={
                  <MainLayout>
                    <LoadingPage />
                  </MainLayout>
                }
              />
              <Route
                path="/paymentMethodDetails/:id"
                element={
                  <MainLayout>
                    <PaymentMethodsDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="CommissionCategory/AddCommissionCategory"
                element={
                  <MainLayout>
                    <AddCommissionCategory />
                  </MainLayout>
                }
              />
              <Route
                path="/LiqudationDetails/:id"
                element={
                  <MainLayout>
                    <LiqudationDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CommissionDetails/:id"
                element={
                  <MainLayout>
                    <CommissionDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CommissionCategoryDetails/:id"
                element={
                  <MainLayout>
                    <CommissionCategoryDetails />
                  </MainLayout>
                }
              />
              <Route
                path="/Wallet"
                element={
                  <MainLayout>
                    <WalletPage />
                  </MainLayout>
                }
              />
              <Route
                path="/offerDetails/:id"
                element={
                  <MainLayout>
                    <OfferDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Offers"
                element={
                  <MainLayout>
                    <OffersPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Offers/AddOffer"
                element={
                  <MainLayout>
                    <AddOfferPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Wallet/AddTransaction"
                element={
                  <MainLayout>
                    <AddTransactionPage />
                  </MainLayout>
                }
              />
              <Route
                path="/WalletDetails/:id"
                element={
                  <MainLayout>
                    <WalletDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/TrafficTimeDetails/:id"
                element={
                  <MainLayout>
                    <TrafficTimeDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/TrafficTime/AddTrafficTime"
                element={
                  <MainLayout>
                    <AddTrafficTimePage />
                  </MainLayout>
                }
              />
              <Route
                path="/CarDriverDetails/AddCarDrive"
                element={
                  <MainLayout>
                    <LinkCarDriverPage />
                  </MainLayout>
                }
              />
              <Route
                path="/tripDetails/:id"
                element={
                  <MainLayout>
                    <TripDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/riderDetails/:id"
                element={
                  <MainLayout>
                    <RiderDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/DriverDetails/:id"
                element={
                  <MainLayout>
                    <DriverDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CarDetails/:id"
                element={
                  <MainLayout>
                    <CarDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CarTypeDetails/:id"
                element={
                  <MainLayout>
                    <CarTypeDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CarDriverDetails/:id"
                element={
                  <MainLayout>
                    <CarDriverDetailsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Cars/AddCar"
                element={
                  <MainLayout>
                    <AddCarPage />
                  </MainLayout>
                }
              />
              <Route
                path="/CarTypes/AddCarType"
                element={
                  <MainLayout>
                    <AddCarTypePage />
                  </MainLayout>
                }
              />
              <Route
                path="/Help"
                element={
                  <MainLayout>
                    <HelpPage />
                  </MainLayout>
                }
              />
              <Route
                path="/PrivacyPolicy"
                element={
                  <MainLayout>
                    <PrivacyPolicyPage />
                  </MainLayout>
                }
              />
              <Route
                path="/admin/users"
                element={<MainLayout>{/* <RiderDetailsPage /> */}</MainLayout>}
              />
              <Route
                path="/accountantHome"
                element={<MainLayout>{/* <AccountantHome /> */}</MainLayout>}
              />
    </Route>

              <Route path="/Maintenance" element={<Maintenance />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        <TrackingFrequencyModal
          open={openTracking}
          onClose={() => setOpenTracking(false)}
        />
        <NotifyRadiusModal
          open={openNotify}
          onClose={() => setOpenNotify(false)}
        />
        <CashbackPercentageModal
          open={openCashback}
          onClose={() => setOpenCashback(false)}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={i18n.language === "ar"}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={mode}
        />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
