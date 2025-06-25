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

  export const ColorModeContext = React.createContext({
    toggleColorMode: () => {},
  });

  const RootRedirect = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simulate user fetching from localStorage or API
      const fetchUser = () => {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Error fetching user", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);

    if (loading) {
      return <LoadingComponent />;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    switch (user.type) {
      case "admin":
        return <Navigate to="/adminHome" replace />;
      case "accountant":
        return <Navigate to="/accountantHome" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

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


      localStorage.setItem('user', JSON.stringify({
        name: "Mokhtar Mahmoud",
        type: "admin",
        image: ""  
      }));

      localStorage.setItem(
        "token",
        "3316|n1OopYiD3x17odZB84vwIXeOT7kZqsxQ4F5aWePv7b2b7445"
      );
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
            },
            background: {
              default: mode === "light" ? "#F5F0F2" : "#121212",
              paper: mode === "light" ? "#FFFFFF" : "#1e1e1e",
            },
            customBackground: {
              mainCard: mode === "light" ? "#F3DFD1" : "#1f1f1f",
            },
            text: {
              primary: mode === "light" ? "#191C32" : "#ffffff",
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
            <Header />
            <main style={{ flex: 1 }}>
            <Routes>
  {/* المسارات العامة */}
  <Route path="/" element={<RootRedirect />} />
  {/* <Route path="/login" element={<LoginScreen />} /> */}

  {/* المسارات الخاصة التي تظهر فيها Sidebar */}
  <Route
    path="/adminHome"
    element={
      // <ProtectedRoute>
        <MainLayout>
          <Home />
        </MainLayout>
      // </ProtectedRoute>
    }
  />
  <Route
    path="/admin/users"
    element={
      // <ProtectedRoute>
        <MainLayout>
          {/* <AdminHome /> */}
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
</Routes>
            </main>
          </div>
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
