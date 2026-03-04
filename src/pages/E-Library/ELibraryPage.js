import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// Material UI
import {
  Box, CircularProgress, Grid, Paper, Typography,
  Chip, useTheme, useMediaQuery, Divider
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

// Components & Utilities
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import { TrueOrFalseArr } from "../../constants";
import BookCard from "./components/BookCard";
import { baseURL } from "../../Api/apolloClient";

// GraphQL
import { GET_ALL_DEPARTMENTS, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { GET_ALL_FILTERED_LIBRARIES, UPDATE_Library_BY_ID, GET_ALL_LIBRARIES } from "../../graphql/eLibraryQueries";

export default function ELibraryPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";
  const { view, update } = usePermissionsByModule("materials");

  const me = useSelector(state => state.user.loggedUser);
  const isAdmin = me?.role === "admin";
  const storedStudentForm = JSON.parse(localStorage.getItem("registerForm"));
  const firstRenderRef = useRef(true);

  // Queries
  const [getFilteredLibraries, { data: filteredData, loading: librariesLoading }] = useLazyQuery(GET_ALL_FILTERED_LIBRARIES, { fetchPolicy: "network-only" });
  const { data: allLibrariesData } = useQuery(GET_ALL_LIBRARIES, { fetchPolicy: "network-only" });
  const [getFaculties, { data: facultyData }] = useLazyQuery(GET_ALL_FACULITIES);
  const [getDepartments, { data: deptData }] = useLazyQuery(GET_ALL_DEPARTMENTS);
  const [updateLibrary, { loading: updatingStatus }] = useMutation(UPDATE_Library_BY_ID);

  useEffect(() => {
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    let deptId = searchParams.get("faculty_department_id");
    let facId = searchParams.get("faculty_id");

    // Auto-filter for students based on their registered department
    if (!isAdmin && storedStudentForm?.faculty_department_id?.id) {
      deptId = storedStudentForm.faculty_department_id.id;
    }

    const variables = {
      page: Number(page),
      limit: Number(limit),
      search,
      ...(status && { status: status === "true" }),
      ...(deptId && { faculty_department_id: deptId }),
      ...(facId && { faculty_id: facId })
    };

    getFilteredLibraries({ variables });

    if (firstRenderRef.current) {
      getFaculties();
      getDepartments();
      firstRenderRef.current = false;
    }
  }, [searchParams, isAdmin, getFilteredLibraries, getFaculties, getDepartments, storedStudentForm?.faculty_department_id?.id]);

  // Table Setup
  const columns = [
    { key: "title_ar", label: t("Dashboard.NameInArabic") },
    { key: "title_en", label: t("Dashboard.NameInEnglish") },
    { key: "author_name", label: t("form.author_name") },
    { key: "faculty_id", label: t("admissions.faculty") },
    { key: "faculty_department_id", label: t("admissions.facultyDepartment") },
    { key: "status", label: t("Status") }
  ];

  const processedData = filteredData?.filteredPagedLibraries?.libraries?.map(el => ({
    ...el,
    faculty_id: el?.faculty_id
  })) || [];

  // Handlers
  const handleExport = (type) => {
    const exportData = allLibrariesData?.libraries?.map((m, i) => ({
      ID: i + 1,
      [t("Dashboard.NameInArabic")]: m.title_ar,
      [t("Dashboard.NameInEnglish")]: m.title_en,
      [t("form.author_name")]: m.author_name,
      [t("admissions.faculty")]: isArabic ? m.faculty_id?.title_ar : m.faculty_id?.title_en,
      [t("admissions.facultyDepartment")]: isArabic ? m.faculty_department_id?.title_ar : m.faculty_department_id?.title_en,
      [t("Status")]: t(m.status ? "active" : "inActive"),
    }));

    ExportExcelAndPDF({
      exportData,
      isArabic,
      reportTitle: isArabic ? "قائمة المكتبة" : "Library List",
      type
    });
  };

  const handleStatusChange = async (row, newStatus) => {
    try {
      await updateLibrary({
        variables: {
          id: row.id,
          input: {
            title_ar: row.title_ar,
            title_en: row.title_en,
            author_name: row.author_name,
            faculty_id: row.faculty_id?.id,
            faculty_department_id: row.faculty_department_id?.id,
            status: newStatus !== "inActive"
          }
        }
      });
      notify(t("success"), "success");
    } catch (error) {
      notify(t("error"), "error");
    }
  };

  if (!view) return <NoPermissionPage />;
  if (librariesLoading) return <LoadingPage />;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      {updatingStatus && (
        <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
          <CircularProgress size={30} />
        </Box>
      )}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>
        <Header
          title={t("studentDashboard.eLibrary")}
          subtitle={isAdmin ? t("Manage Educational Content") : t("Browse Study E-Library")}
          haveBtn={isAdmin}
          btn={t("addItem", { item: isArabic ? "كتاب" : "Book" })}
          btnIcon={<LibraryBooksIcon />}
          onSubmit={() => navigate("add")}
          isExcel={isAdmin} isPdf={isAdmin} isPrinter={isAdmin}
          onExcel={() => handleExport("excel")}
          onPdf={() => handleExport("pdf")}
          onPrinter={() => handleExport("print")}
          i18n={i18n}
        />

        <Divider sx={{ my: 3 }} />

        {/* Filters Section */}
        <Box sx={{ mb: 4, backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
          <DashboardFilterComponent
            placeholder={isArabic ? "بحث باسم الكتاب..." : "Search book..."}
            textSearchField="search"
            statusKey="status"
            TrueOrFalseArr={TrueOrFalseArr}
            selectKey={isAdmin ? "faculty_id" : null}
            selectOptions={facultyData?.faculties}
            select2Label={t("admissions.faculty")}
            selectKey2={isAdmin ? "faculty_department_id" : null}
            selectOptions2={deptData?.facultyDepartments}
            select2Label2={t("admissions.facultyDepartment")}
            arKey="title_ar"
            enKey="title_en"
            isAdmin={isAdmin}
            onFilterChange={(obj) => {
              if (obj.search !== undefined) searchParams.set("search", obj.search);
              if (obj.status && obj.status !== "0") searchParams.set("status", obj.status);
              if (obj.faculty_id && obj.faculty_id !== "0") searchParams.set("faculty_id", obj.faculty_id);
              if (obj.faculty_department_id && obj.faculty_department_id !== "0") searchParams.set("faculty_department_id", obj.faculty_department_id);
              setSearchParams(searchParams);
            }}
            t={t}
          />
        </Box>

        {/* Content Section */}
        <Box sx={{ width: "100%" }}>
          {isAdmin ? (
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <TableComponent
                columns={columns}
                data={processedData}
                loading={librariesLoading}
                statusKey="status"
                arPopulateKey="title_ar"
                enPopulateKey="title_en"
                nestedArPopulateKey="title_ar"
                nestedEnPopulateKey="title_en"
                nestedPopulateKey="title_en"
                handleDetailsClick={(row) => {
                  if (!update) return notify(t("no_permission.title"), "error");
                  navigate(`details/${row.id}`, { state: row });
                }}
                onStatusChange={handleStatusChange}
                showStatusChange={true}
              />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {librariesLoading ? (
                <Grid item xs={12}>
                  <LoadingPage />
                </Grid>
              ) : processedData.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">{t("noData") || (isArabic ? "لا توجد بيانات" : "No data available")}</Typography>
                  </Box>
                </Grid>
              ) : (
                processedData.map((book) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                    <BookCard book={book} baseURL={baseURL} t={t} />
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>

        {/* Pagination */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <FilterComponent
            totalPages={Math.ceil((filteredData?.filteredPagedLibraries?.total || 0) / (Number(searchParams.get("limit")) || 10))}
          />
        </Box>
      </Paper>
    </Box>
  );
}