import React, { useState, useMemo, useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Toolbar,
  createTheme,
  useMediaQuery,
} from "@mui/material";
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

import {
  getAllNotifications,
  getAllSetting,
} from "./redux/slices/setting/thunk";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./Auth/ProtectedRoute";
import SecondHeader from "./components/SecondHeader/SecondHeader";
import Footer from "./components/Footer";
import Admissions from "./pages/Admissions/Admissions";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import FeePaymentPage from "./pages/FeePaymentPage/FeePaymentPage";
import UsersPage from "./pages/Users/Users";
import UserDetails from "./pages/Users/UserDetails";
import VisionsArticlesPage from "./pages/Home/VisionsArticlesPage";
import NewsPage from "./pages/Home/NewsPage";
import ArticalDetails from "./pages/Home/ArticalDetails";
import AllNationalitiesPage from "./pages/nationality/AllNationalitiesPage";

import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import AddNationalityPage from "./pages/nationality/AddNationalityPage";
import NationalityDetailsPage from "./pages/nationality/NationalityDetailsPage";
import AllCountriesPage from "./pages/Countries/AllCountriesPage";
import AddCountryPage from "./pages/Countries/AddCountryPage";
import CountryDetailsPage from "./pages/Countries/CountryDetailsPage";
import AllCitiesInOneCountryPage from "./pages/Countries/AllCitiesInOneCountryPage";
import AddCityPage from "./pages/Countries/AddCityPage";
import CityDetailsPage from "./pages/Countries/CityDetailsPage";
import AllfaculitiesPage from "./pages/Faculities/AllfaculitiesPage";
import AddFaculityPage from "./pages/Faculities/AddFaculityPage";
import FaculityDetailsPage from "./pages/Faculities/FaculityDetailsPage";

import AllDepartmnentsPage from "./pages/Departments/AllDepartmnentsPage";
import AddDepartmentPage from "./pages/Departments/AddDepartmentPage";
import DepartmentDetailsPage from "./pages/Departments/DepartmentDetailsPage";
import AllAcademyTermsPage from "./pages/AcademyTerms/AllAcademyTermsPage";
import AddAcademyTermPage from "./pages/AcademyTerms/AddAcademyTermPage";
import AllMaterialsPage from "./pages/Materials/AllMaterialsPage";
import AddMaterialPage from "./pages/Materials/AddMaterialPage";
import MaterialDetailsPage from "./pages/Materials/MaterialDetailsPage";
import AllFeesTypesPage from "./pages/FeesTypes/AllFeesTypesPage";
import AddFeesTypesPage from "./pages/FeesTypes/AddFeesTypesPage";
import FeeDetailsPage from "./pages/FeesTypes/FeeDetailsPage";
import AllTransactionsPage from "./pages/Transactions/AllTransactionsPage";
import AddTransactionPage from "./pages/Transactions/AddTransactionPage";
import TransactionDetailsPage from "./pages/Transactions/TransactionDetailsPage";
import AcademyTermDetailsPage from "./pages/AcademyTerms/AcademyTermDetailsPage";
import AllTransactionTypesPage from "./pages/TransactionTypes/AllTransactionTypesPage";
import AddTransactionTypePage from "./pages/TransactionTypes/AddTransactionTypePage";
import TransactionTypeDetailsPage from "./pages/TransactionTypes/TransactionTypeDetailsPage";
import AllFaculitiesPricesPage from "./pages/FaculitiesPrices/AllFaculitiesPricesPage";
import AddFaculityPricePage from "./pages/FaculitiesPrices/AddFaculityPricePage";
import FaculityPriceDetailsPage from "./pages/FaculitiesPrices/FaculityPriceDetailsPage";
import AllDepartmentsPage from "./pages/websiteDepartments/AllDepartmentsPage";
import AddWebsiteDepartmentPage from "./pages/websiteDepartments/AddWebsiteDepartmentPage";
import AllArticlesPage from "./pages/WebsiteArticles/AllArticlesPage";
import AddArticlePage from "./pages/WebsiteArticles/AddArticlePage";
import ArticleDetailsPage from "./pages/WebsiteArticles/ArticleDetailsPage";
import WebSiteDepartmentDetailsPage from "./pages/websiteDepartments/WebSiteDepartmentDetailsPage";
import AllUsersPage from "./pages/UsersPage/AllUsersPage";
import AddUserPage from "./pages/UsersPage/AddUserPage";
import UserDetailsPage from "./pages/UsersPage/UserDetailsPage";
import AllRequiredFeesPage from "./pages/StudentRequiredFees/AllRequiredFeesPage";
import AddRequiredFeesPage from "./pages/StudentRequiredFees/AddRequiredFeesPage";
import RequiredFeeDetailsPage from "./pages/StudentRequiredFees/RequiredFeeDetailsPage";
import SubTitleDetailsPage from "./pages/websiteDepartments/SubTitleDetailsPage";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => { },
});

function App() {
  const [mode, setMode] = useState("light");
  const { i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  // إنشاء cache يدعم RTL
  const cacheRtl = createCache({
    key: "mui-rtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

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
            textField: "#E8EDF2",
            textFieldText: "#4D7399",
            gray: "#F9FAFB",
            contrastText: "#ffffff",
            tabelHeader: "#D2D6DB",
            disabled: "#384250"
          },
          secondary: {
            main: mode === "light" ? "#F39A15" : "#F39A15",
            contrastText: "#ffffff",
          },
          info: {
            main: "#22ABCE",
            secondary: "#384250",
            // title:"#384250",
            subtitle: "#9DA4AE"
          },
          background: {
            default: mode === "light" ? "#ffffff" : "#0f172a",
            paper: mode === "light" ? "#ffffff" : "#1e293b",
            secDefault: mode === "light" ? "#CFDBE8" : "#1f2937",
            gray: mode === "light" ? "#E5E5E5" : "#334155",
            green: "",
            inputBackGround: "#E8EDF2"
          },
          text: {
            primary: mode === "light" ? "#0f172a" : "#f1f5f9",
            sec: mode === "light" ? "#f1f5f9" : "#0f172a",
            secondary: mode === "light" ? "#475569" : "#CBD5E1",
          },
          whiteText: {
            primary: mode === "light" ? "#ffffff" : "#191C32",
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
                  mode === "light" ? "#ffffff" : "rgba(30, 41, 59, 0.9)",
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
                  mode === "light" ? "#ffffff" : "rgba(30, 41, 59, 0.8)",
                borderRadius: "8px",
              },
            },
          },
        },
      }),
    [mode, i18n.language]
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = getUserCookie();

  // ======= Replace the old polling block with this =======

  // read cookie once at mount to avoid unstable deps
  const initialUser = useMemo(() => getUserCookie(), []);
  const isLoggedIn = Boolean(initialUser?.id);

  // useEffect(() => {
  //   if (!isLoggedIn) return;

  //   dispatch(getAllNotifications());

  //   const interval = setInterval(() => {
  //     dispatch(getAllNotifications());
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, [dispatch, isLoggedIn]);

  const hideHeader = location.pathname != "/login";
  const hideSecandHeader =
    location.pathname == "/home" ||
    location.pathname == "/visionsArticals" ||
    location.pathname == "/news";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <CacheProvider value={cacheRtl}>
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
            {/* {isMobile && !isArabic && hideSecandHeader &&<Toolbar sx={{ width: "100%" }}>
</Toolbar>} */}
            {/* Modals */}

            <main style={{ flex: 1 }}>
              <Routes>
                {/* المسارات العامة */}
                <Route path="/" element={<Navigate to="/home" />} />
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
                    path="/VisionsArticles"
                    element={
                      <MainLayout>
                        <VisionsArticlesPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/news"
                    element={
                      <MainLayout>
                        <NewsPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <MainLayout>
                        <Home />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/ArticalDetails/:id"
                    element={
                      <MainLayout>
                        <ArticalDetails />
                      </MainLayout>
                    }
                  />

                  <Route
                    path="/Admissions"
                    element={
                      <MainLayout>
                        <Admissions />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/StudentDashboard"
                    element={
                      <MainLayout isLoggedIn={true}>
                        <StudentDashboard />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <MainLayout isLoggedIn={true}>
                        <ProfilePage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/FeePayment"
                    element={
                      <MainLayout isLoggedIn={true}>
                        <FeePaymentPage />
                      </MainLayout>
                    }
                  />

                  {/* <Route
                    path="/Users"
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
                        <UserDetails />
                      </MainLayout>
                    }
                  /> */}

                  {/* website Departments  الاقسام */}

                  <Route path="/website-departments">
                    <Route
                      index
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AllDepartmentsPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path="details/:id/add"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AddWebsiteDepartmentPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="details/:id/edit/:DepID"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <SubTitleDetailsPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="details/:id"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <WebSiteDepartmentDetailsPage />
                        </MainLayout>
                      }
                    />
                  </Route>

                  {/* المقالات */}
                  <Route path="/website-articles">
                    <Route
                      index
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AllArticlesPage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path="add"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AddArticlePage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="details/:id"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <ArticleDetailsPage />
                        </MainLayout>
                      }
                    />
                  </Route>

                  <Route path="/users">
                    <Route
                      index
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AllUsersPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="add"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AddUserPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="details/:id"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <UserDetailsPage />
                        </MainLayout>
                      }
                    />

                  </Route>

                  <Route path="/nationality">
                    <Route
                      index
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AllNationalitiesPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="add"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AddNationalityPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="details/:id"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <NationalityDetailsPage />
                        </MainLayout>
                      }
                    />

                  </Route>


                  <Route path="/countries">

                    <Route
                      index
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AllCountriesPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="add"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AddCountryPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="details/:id"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <CountryDetailsPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="cities/:id"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AllCitiesInOneCountryPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="cities/:id/add"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <AddCityPage />
                        </MainLayout>
                      }
                    />

                    <Route
                      path="cities/:id/details/:cityId"
                      element={
                        <MainLayout isLoggedIn={true}>
                          <CityDetailsPage />
                        </MainLayout>
                      }
                    />




                  </Route>

                  {/* الكليات */}
                  <Route path="/faculities">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllfaculitiesPage />
                      </MainLayout>
                    } />

                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddFaculityPage />
                      </MainLayout>
                    } />

                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <FaculityDetailsPage />
                      </MainLayout>
                    } />



                  </Route>

                  {/* الاقسام للكليات */}
                  <Route path="/departments">

                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllDepartmnentsPage />
                      </MainLayout>
                    } />

                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddDepartmentPage />
                      </MainLayout>
                    } />

                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <DepartmentDetailsPage />
                      </MainLayout>
                    } />


                  </Route>

                  {/* اسعار الكليات */}
                  <Route path="/prices">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllFaculitiesPricesPage />
                      </MainLayout>
                    } />
                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddFaculityPricePage />
                      </MainLayout>
                    } />

                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <FaculityPriceDetailsPage />
                      </MainLayout>
                    } />
                  </Route>
                  {/* المواد  (materials)*/}
                  <Route path="/materials">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllMaterialsPage />
                      </MainLayout>
                    } />

                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddMaterialPage />
                      </MainLayout>
                    } />

                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <MaterialDetailsPage />
                      </MainLayout>
                    } />

                  </Route>


                  {/* الفصول الدراسية */}
                  <Route path="/academyTerms">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllAcademyTermsPage />
                      </MainLayout>
                    } />

                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddAcademyTermPage />
                      </MainLayout>
                    } />
                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <AcademyTermDetailsPage />
                      </MainLayout>
                    } />

                  </Route>

                  {/* انواع الرسوم */}
                  <Route path="/feesTypes">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllFeesTypesPage />
                      </MainLayout>
                    } />

                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddFeesTypesPage />
                      </MainLayout>
                    } />

                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <FeeDetailsPage />
                      </MainLayout>
                    } />

                  </Route>

                  {/* المعاملات المالية */}
                  <Route path="/transactions">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllTransactionsPage />
                      </MainLayout>
                    } />
                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddTransactionPage />
                      </MainLayout>
                    } />
                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <TransactionDetailsPage />
                      </MainLayout>
                    } />
                  </Route>

                  {/* انواع المعاملات المالية */}
                  <Route path="/transactionTypes">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllTransactionTypesPage />
                      </MainLayout>
                    } />

                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddTransactionTypePage />
                      </MainLayout>
                    } />

                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <TransactionTypeDetailsPage />
                      </MainLayout>
                    } />

                  </Route>

                     {/* رسوم الطلاب */}
                  <Route path="/requiredFees">
                    <Route index element={
                      <MainLayout isLoggedIn={true}>
                        <AllRequiredFeesPage />
                      </MainLayout>
                    } />

                    <Route path="add" element={
                      <MainLayout isLoggedIn={true}>
                        <AddRequiredFeesPage />
                      </MainLayout>
                    } />

                    <Route path="details/:id" element={
                      <MainLayout isLoggedIn={true}>
                        <RequiredFeeDetailsPage />
                      </MainLayout>
                    } />

                  </Route>


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
      </CacheProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
