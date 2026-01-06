import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import { useEffect, useRef } from "react";
import notify from "../../components/notify";
import { GET_ALL_DEPARTMENTS, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { GET_ALL_MATERIALS, UPDATE_MATERIAL_BY_ID, GET_ALL_FILTERED_MATERIALS } from "../../graphql/materialQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { TrueOrFalseArr } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
export default function AllLecturesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const isArabic = i18n.language === "ar";

    // get all faculities
    const {
        data: { faculties } = {},
        loading: faculitiesLoading,
        error
    }
        = useQuery(GET_ALL_FACULITIES, {
            fetchPolicy: "network-only"
        });
    // get all departments
    const
        {
            data: { facultyDepartments } = {},
            loading: departmentsLoading,
            error: departmentsError
        }
            = useQuery(GET_ALL_DEPARTMENTS, {
                fetchPolicy: "network-only"
            });

    const firstRenderRef = useRef(true);


    const fetchAndExport = async (type) => {
        try {
            //   const exportData = data?.materials?.map((user,i) => ({
            //     ID: i,
            //     [t("Dashboard.NameInArabic")]: user?.title_ar,
            //     [t("Dashboard.NameInEnglish")]: user?.title_en,
            //     [t("admissions.faculty")]: isArabic ? user?.faculty_department_id?.faculty_id?.title_ar : user?.faculty_department_id?.faculty_id?.title_en,
            //     [t("admissions.facultyDepartment")]: isArabic ? user?.faculty_department_id?.title_ar : user?.faculty_department_id?.title_en,
            //     [t("studentDashboard.fullmarkDegree")]: user?.fullmark_degree,
            //     [t("studentDashboard.successDegree")]: user?.success_degree,
            //     [t("Status")]: t(user.status),
            //   }));

            //   ExportExcelAndPDF({
            //     exportData,
            //     isArabic,
            //     reportTitle: isArabic ? "قائمة المواد الدراسية" : "Materials List",
            //     type
            //   });
        } catch (err) {
            console.error("Export error:", err);
        }
    };

    const addNavigate = () => navigate("add");

    const handleDetailsClick = (selectedRow) => {
        console.log('handleDetailsClick', selectedRow);
        navigate(`details/${selectedRow?.id}`, {
            state: selectedRow
        });
    }
    const hasViewPermission = true;
    const hasAddPermission = true;
    if (!hasViewPermission) return <Navigate to="/profile" />;

    console.log('t("Dashboard.Lectures")', t("Dashboard.Lectures"));
    // departments
    let translateText = isArabic ? "محاضرة" : "Lecture";
    const searchText = isArabic ? "بحث ب اسم المادة" : " Search by Subject Name";
    const departmentSearch = isArabic ? " اسم القسم" : "Department name";
    let searchFaculityText = isArabic ? "اسم الكلية" : "Faculity Name";


    if (departmentsLoading || faculitiesLoading) return <LoadingPage />;
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>

            <Grid container spacing={3}>
                <Grid item
                    sm={12} md={12}
                    sx={{
                        overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
                    }}
                >
                    <Header
                        title={t("Dashboard.LecturesSchedule")}
                        subtitle={`${t("Dashboard.LecturesSchedule")}`}
                        i18n={i18n}
                        haveBtn={hasAddPermission}
                        btn={t("addItem", { item: translateText })}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        onSubmit={addNavigate}
                        isExcel
                        isPdf
                        isPrinter
                        onExcel={() => fetchAndExport("excel")}
                        onPdf={() => fetchAndExport("pdf")}
                        onPrinter={() => fetchAndExport("print")}
                    />

                    <DashboardFilterComponent
                        placeholder={searchText}
                        textSearchField={"search"}
                        statusKey={"status"}
                        TrueOrFalseArr={TrueOrFalseArr}
                        selectKey={"faculty_department_id"}
                        selectOptions={facultyDepartments}
                        arKey={"title_ar"}
                        enKey={"title_en"}
                        select2Label={departmentSearch}
                        selectKey2={"faculty_id"}
                        selectOptions2={faculties}
                        select2Label2={searchFaculityText}
                        // onFilterChange={onFilterChange}
                        t={t}
                    />


                    <TableComponent
                        // columns={columns}
                        // data={getSubjectsToShow}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        // loading={materialsLoading}
                        // isUsers={true}
                        statusKey="status"
                        arPopulateKey={"title_ar"}
                        enPopulateKey={"title_en"}
                        nestedArPopulateKey={"title_ar"}
                        nestedEnPopulateKey={"title_en"}
                        nestedPopulateKey={"faculty_id"}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                        handleDetailsClick={handleDetailsClick}
                    // onStatusChange={onStatusChange}
                    />

                    {/* <FilterComponent totalPages={totalPages} /> */}
                </Grid>
            </Grid>
        </Box>
    )
}
