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
import { GET_FILTERED_MAIN_TABLES } from "../../graphql/TimeTableQueries";
export default function AllLecturesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const isArabic = i18n.language === "ar";

    // all main tables with filter
    const [
        GetMainTimeTablesFiltered,
        {
            data: {
                getMainTimeTablesFiltered: {
                    mainTimeTables,
                    total
                } = {}
            } = {},
            loading: mainTablesLoading,

        }
    ] = useLazyQuery(GET_FILTERED_MAIN_TABLES, {
        fetchPolicy: "network-only"
    });

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

    useEffect(() => {
        let page;
        let limit;
        if (!searchParams.get("page")) {
            page = 1;
        }
        else {
            page = Number(searchParams.get("page"));
        }
        if (!searchParams.get("limit")) {
            limit = 10;
        }
        else {
            limit = Number(searchParams.get("limit"));
        }

        let searchText = "";

        if (searchParams.get("search")) {
            searchText = searchParams.get("search");
        }

        let variablesObj = {};
        if (page) variablesObj.page = page;
        if (limit) variablesObj.limit = limit;
        if (searchText) variablesObj.search = searchText;
        if (searchParams.get("status") && searchParams.get("status") !== "0") variablesObj.status = searchParams.get("status") === "true" ? true : false;
        if (searchParams.get("faculty_department_id")) variablesObj.faculty_department_id = searchParams.get("faculty_department_id");
        if (searchParams.get("faculty_id")) variablesObj.faculty_id = searchParams.get("faculty_id");

        // if(searchParams.get("role")) variablesObj.role=searchParams.get("role");

        GetMainTimeTablesFiltered({ variables: variablesObj });
    }, [searchParams]);

    console.log("mainTimeTables", mainTimeTables);

    let columns = [
        // { key: "ID", label: "ID" },
        { key: "title_ar", label: t("Dashboard.NameInArabic") },
        { key: "title_en", label: t("Dashboard.NameInEnglish") },
        { key: "study_year", label: t("Dashboard.studyYear") },
        { key: "faculty_id", label: t("admissions.faculty") },
        { key: "faculty_department_id", label: t("admissions.facultyDepartment") },
        { key: "academy_term_id", label: t("Dashboard.semester") },
        { key: "status", label: t("Status") }
        //  { key: "userType", label: t("User Type") }

    ];

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

    const onFilterChange = async (filterOBJ) => {
        console.log("filterOBJ", filterOBJ);
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
        if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0") searchParams.set("status", filterOBJ.status);
        if (filterOBJ.hasOwnProperty("faculty_department_id") && filterOBJ.faculty_department_id !== "0") searchParams.set("faculty_department_id", filterOBJ.faculty_department_id);
        if (filterOBJ.hasOwnProperty("faculty_id") && filterOBJ.faculty_id !== "0") searchParams.set("faculty_id", filterOBJ.faculty_id);

        // faculty_id
        setSearchParams(searchParams);
    }
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
    const searchText = isArabic ? "بحث ب بالاسم" : " Search by Name";
    const departmentSearch = isArabic ? " اسم القسم" : "Department name";
    let searchFaculityText = isArabic ? "اسم الكلية" : "Faculity Name";


    if (departmentsLoading || faculitiesLoading || mainTablesLoading) return <LoadingPage />;
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
                        onFilterChange={onFilterChange}
                        t={t}
                    />


                    <TableComponent
                        columns={columns}
                        data={mainTimeTables}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        // loading={materialsLoading}
                        // isUsers={true}
                        statusKey="status"
                        arPopulateKey={"title_ar"}
                        enPopulateKey={"title_en"}
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
