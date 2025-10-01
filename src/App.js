import React, { useState, useMemo, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import "./i18n/i18n";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home/Home";
import NotFoundPage from "./components/NotFoundPage";
import Maintenance from "./components/Maintenance";
import LoginPage from "./pages/LoginPage/LoginPage";

import { getUserCookie } from "./hooks/authCookies";

import { getAllNotifications, getAllSetting } from "./redux/slices/setting/thunk";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./Auth/ProtectedRoute";
import SecondHeader from "./components/SecondHeader/SecondHeader";
import Footer from "./components/Footer";

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
            main: mode === "light" ? "#095690" : "#22ABCE",
            contrastText: "#ffffff",
          },
          secondary: {
            main: mode === "light" ? "#F39A15" : "#F39A15",
            contrastText: "#ffffff",
          },
          info: {
            main: "#22ABCE",
          },
          background: {
            default: mode === "light" ? "#ffffff" : "#0f172a",
            paper: mode === "light" ? "#ffffff" : "#1e293b",
            secDefault: mode === "light" ? "#CFDBE8" : "#1f2937",
            gray: mode === "light" ? "#E5E5E5" : "#334155",
          },
          text: {
            primary: mode === "light" ? "#0f172a" : "#f1f5f9",
            sec: mode === "light" ? "#f1f5f9" : "#0f172a",
            secondary: mode === "light" ? "#475569" : "#CBD5E1",
          },
        },
        typography: {
          fontFamily: ["Cairo", "Arial", "sans-serif"].join(","),
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor:
                  mode === "light"
                    ? "#ffffff"
                    : "linear-gradient(220deg, #0f172a 0%, #1e293b 100%)",
                color: mode === "light" ? "#0f172a" : "#f1f5f9",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                minHeight: "100vh",
                margin: 0,
                padding: 0,
                scrollbarColor:
                  mode === "dark" ? "#22ABCE #1e293b" : "#095690 #CFDBE8",
              },
              "body::-webkit-scrollbar, *::-webkit-scrollbar": {
                width: 8,
                height: 8,
              },
              "body::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb": {
                borderRadius: 8,
                backgroundColor: mode === "dark" ? "#22ABCE" : "#095690",
              },
              "body::-webkit-scrollbar-thumb:hover": {
                backgroundColor: mode === "dark" ? "#F39A15" : "#22ABCE",
              },
              "body::-webkit-scrollbar-track, *::-webkit-scrollbar-track": {
                borderRadius: 8,
                backgroundColor: mode === "dark" ? "#1e293b" : "#E5E5E5",
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
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                },
              },
              containedPrimary: {
                backgroundColor: "#095690",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: mode === "light" ? "#07406d" : "#22ABCE",
                },
              },
              containedSecondary: {
                backgroundColor: "#F39A15",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: mode === "light" ? "#d6810d" : "#f59e0b",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light"
                    ? "#ffffff"
                    : "rgba(30, 41, 59, 0.9)",
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
                    ? "rgba(255, 255, 255, 0.95)"
                    : "rgba(15, 23, 42, 0.95)",
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
                    ? "#ffffff"
                    : "rgba(30, 41, 59, 0.8)",
                borderRadius: "8px",
              },
            },
          },
        },
      }),
    [mode, i18n.language]
  );
  


  const user = getUserCookie();

 // ======= Replace the old polling block with this =======

// read cookie once at mount to avoid unstable deps
const initialUser = useMemo(() => getUserCookie(), []);
const isLoggedIn = Boolean(initialUser?.id); 




useEffect(() => {
  if (!isLoggedIn) return; 

  dispatch(getAllNotifications());

  const interval = setInterval(() => {
    dispatch(getAllNotifications());
  }, 60000); 

  return () => clearInterval(interval);
}, [dispatch, isLoggedIn]);


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
          {hideHeader && <Header />}
           <SecondHeader />
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
            
    </Route>

              <Route path="/Maintenance" element={<Maintenance />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
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
