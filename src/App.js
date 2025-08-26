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
import driverImage from "./assets/DomiDriverImage.png"
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

  export const ColorModeContext = React.createContext({
    toggleColorMode: () => {},
  });

  

  function App() {
    const [mode, setMode] = useState("light");
    const { i18n } = useTranslation();
    const location = useLocation();

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
                  background: mode === "light"
                    ? "#FFFFFF" // خلفية بيضاء في الوضع الفاتح
                    : "linear-gradient(220deg, #1A1A1A 0%, #2C2C2C 100%)",
                    color: mode === "light" ? "#222" : "#fff",

                  backgroundAttachment: "fixed",
                  backgroundSize: "cover",
                  minHeight: "100vh",
                  margin: 0,
                  padding: 0,
                  scrollbarColor: mode === "dark"
                    ? "#FF87AF #2C2C2C"
                    : "#FF87AF #FFE9FB",
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
  
    const handleSidebarAction = (action) => {
      if (action === "openTrackingModal") setOpenTracking(true);
      if (action === "openNotifyRadiusModal") setOpenNotify(true);
    };
    const user = getUserCookie();
    const hideHeader = location.pathname != '/login';

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
           {hideHeader && <Header  onAction={handleSidebarAction} />}
               {/* Modals */}
  
            <main style={{ flex: 1 }}>
            <Routes>
  {/* المسارات العامة */}
  <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
  {/* <Route path="/login" element={<LoginScreen />} /> */}

  {/* المسارات الخاصة التي تظهر فيها Sidebar */}
  <Route
    path="/login"
    element={
      // <ProtectedRoute>
        // <MainLayout>
          <LoginPage />
        // </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/home"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <Home />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Passengers"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <PassengersPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/users"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <UsersPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/UserDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <UserDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Drivers"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <DriversPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Profile"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/PermissionGroups/showpermissiongroup/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <PermissionGroupDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Trips"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <TripsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Cars"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CarsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CarTypes"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CarTypesPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CarDriver"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CarDriverPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/TrafficTime"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <TrafficTimePage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/users/AddUser"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <AddUserPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/PermissionGroups"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <PermissionGroupsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/PaymentMethods"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <PaymentMethodsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/liqudation"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <LiqudationPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Commission"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CommissionPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CommissionCategory"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CommissionCategoryPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/PaymentMethod/AddPaymentMethod"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <AddPaymentMethodPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Loading"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <LoadingPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/paymentMethodDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <PaymentMethodsDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="CommissionCategory/AddCommissionCategory"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <AddCommissionCategory />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/LiqudationDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <LiqudationDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CommissionDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CommissionDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CommissionCategoryDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CommissionCategoryDetails />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Wallet"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <WalletPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Wallet/AddTransaction"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <AddTransactionPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/WalletDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <WalletDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/TrafficTimeDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <TrafficTimeDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/TrafficTimes/AddTrafficTime"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <AddTrafficTimePage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CarDriverDetails/AddCarDrive"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <LinkCarDriverPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/tripDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <TripDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/riderDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <RiderDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/DriverDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <DriverDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CarDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CarDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CarTypeDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CarTypeDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CarDriverDetails/:id"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <CarDriverDetailsPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/Cars/AddCar"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <AddCarPage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/CarTypes/AddCarType"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <AddCarTypePage />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/admin/users"
    element={
      // <ProtectedRoute>
        <MainLayout>
          {/* <RiderDetailsPage /> */}
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/accountantHome"
    element={
      // <ProtectedRoute>
        <MainLayout>
          {/* <AccountantHome /> */}
        </MainLayout>
      // </ProtectedRoute>
    }
  />

                <Route path="/Maintenance" element={<Maintenance />} />
                <Route path="*" element={<NotFoundPage />} />

</Routes>
            </main>
          </div>
          <TrackingFrequencyModal open={openTracking} onClose={() => setOpenTracking(false)} />
          <NotifyRadiusModal open={openNotify} onClose={() => setOpenNotify(false)} />
          
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
