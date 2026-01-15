import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import { useEffect } from "react";
import { GET_FILTERED_EXAMS } from "../../graphql/ExamsQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import { examTypes } from "../../constants";
import { GET_STUDENT_BY_MATERIAL_ID } from "../../graphql/materialQueries";
import { GET_EXAM_DEGREES } from "../../graphql/studentDegreeQueries";

export default function ExamStudentDegreesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const{id}=useParams();

    const isArabic = i18n.language === "ar";

    const location = useLocation();

    console.log("location", location.state);

   
    const [
        StudentDegrees,
        {
            data: {
                studentDegrees: { studentDegrees, total } = {}
            } = {},
            loading: studentsByMaterialLoading,
        },
    ] = useLazyQuery(GET_EXAM_DEGREES, {
        fetchPolicy: "network-only",
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
    
            console.log('searchParams.get("search")',searchParams.get("search"));

            if (searchParams.get("search")) {
                searchText = searchParams.get("search");
            }
    
            let variablesObj = {
                exam_id:id
            };
            if (page) variablesObj.page = page;
            if (limit) variablesObj.limit = limit;
            if (searchText) variablesObj.search = searchText;
            // if (searchParams.get("exam_type") && searchParams.get("exam_type") !== "0") variablesObj.exam_type = searchParams.get("exam_type");
    
    
            // if(searchParams.get("role")) variablesObj.role=searchParams.get("role");
    
            StudentDegrees({ variables: variablesObj });
    
        }, [searchParams]);


    const columns = [
        { key: "name", label: t("profile.Name") },
        { key: "student_degree", label: t("Dashboard.studentDegree") },
        { key: "lecture_attendance", label: t("Dashboard.lectureAttendance") },
        { key: "exam_attendance", label: t("Dashboard.examAttendance") },
        // { key: "date_of_exam", label: t("Date") },
        // { key: "action", label: t("Action") },
        // { key: "is_paid", label: t("Status") }
    ];

    const addNavigate = () => navigate("add",{
        state:{
            ...location?.state,
            material_id:location?.state?.material_id?.id
        }
    });

    let studentDegreesToShow=studentDegrees?.map(material=>{
        return{
            ...material,
            student_degree:String(material?.student_degree),
            lecture_attendance: String(material?.lecture_attendance),
            exam_attendance: material?.exam_attendance ? t("yes") : t("no"),
            name:material?.student_id?.fullname
        }
    });

     const studentDegreesNavigate=(row) => {
        console.log("row",row);

        navigate(`examStudentDegrees/${row?.id}`,{
            state:row
        });
    };
     const handleDetailsClick = (selectedRow) => {
        console.log('handleDetailsClick', selectedRow);
        let row = studentDegrees?.find(el => el?.id == selectedRow?.id);

        navigate(`details/${selectedRow?.id}`, {
            state: {
                ...row,
                material_id:location?.state?.material_id?.id
            }
        });
    }

    const fetchAndExport = async (type) => {
        try {
            // const exportData = data?.getUsersRequiredFees?.map((user, i) => {
            //     const timestamp = Number(user?.createdAt); // نتأكد إنه رقم
            //     const date = new Date(timestamp);
            //     let total = 0;

            //     user?.fees_types_ids?.map(fee => {
            //         if (user?.student_id?.is_inside_yemen == true) total += fee?.inside_yemen_value
            //         else total += fee?.outside_yemen_value
            //     })
            //     return {
            //         ID: i,
            //         [t("Dashboard.studentName")]: user?.student_id?.fullname,
            //         [t("Dashboard.createdAt")]: formatDateToString(date),
            //         [t("fee.table.amount")]: total,
            //         [t("fee.transactionSerial")]: user?.transactions_id?.transaction_serial,
            //         [t("Dashboard.createdBy")]: user?.website_user_id?.fullname,
            //         [t("Status")]: t(user?.is_paid == true ? "paid" : "unpaid"),

            //     }
            // }
            // );

            // ExportExcelAndPDF({
            //     exportData,
            //     isArabic,
            //     reportTitle: isArabic ? "قائمة رسوم الطلاب" : "Student  Required Fees List",
            //     type
            // });
        } catch (err) {
            console.error("Export error:", err);
        }
    };

    console.log("studentDegrees", studentDegrees);

      const onFilterChange = async (filterOBJ) => {
        console.log("filterOBJ", filterOBJ);
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
       // if (filterOBJ.hasOwnProperty("exam_type") && filterOBJ.exam_type !== "0") searchParams.set("exam_type", filterOBJ.exam_type);
        // if (filterOBJ.role) searchParams.set("role", filterOBJ.role);
        // searchParams.get("search", e.target.value);
        setSearchParams(searchParams);
    }

     const hasViewPermission = true;
    const hasAddPermission = true;

    let pageLimit;
    if (!searchParams.get("limit")) {
        pageLimit = 10;
    }
    else {
        pageLimit = Number(searchParams.get("limit"));
    }

    console.log("pageLimit", pageLimit);

    const totalPages = parseInt(total / pageLimit) + 1;

    console.log("totalPages", totalPages);

    let translateText = isArabic ? "درجة" : "Degree";
    let searchText = isArabic ? "اسم الطالب" : "Student Name";
    
    let translateText2=isArabic ? "درجات الطالب":"Student Degrees"

    if (studentsByMaterialLoading) return <LoadingPage />;
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid item
                    sm={12} md={12}
                    sx={{
                        overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
                    }}
                >
                    {/* {
                        updatingStatus && <CircularProgress
                            size={26}
                            thickness={8}
                            sx={{ color: "black" }}
                        />
                    } */}

                    <Header
                        title={t("Dashboard.studentDegrees")}
                        subtitle={t("Dashboard.studentDegrees")}
                        i18n={i18n}
                        haveBtn={true}
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
                        placeholder={t("Dashboard.searchWith", { search: searchText })}
                        textSearchField={"search"}
                        //  statusKey={"exam_type"}
                        //  TrueOrFalseArr={examTypes}
                        //    selectKey={"role"}
                        selectOptions={examTypes}
                        arKey={"labelAr"}
                        enKey={"labelEn"}
                        selectKey={"exam_type"}
                        select2Label={"profile.Gender"}
                        onFilterChange={onFilterChange}
                        t={t}
                    />

                    <TableComponent
                        columns={columns}
                        hasNavigateBtn={true}
                        data={studentDegreesToShow}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        // loading={pageLoading}
                        // isUsers={true}
                        // statusKey="is_paid"
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                     handleDetailsClick={handleDetailsClick}
                    // onStatusChange={onStatusChange}
                     onClickDetails={studentDegreesNavigate}

                    // arPopulateKey={"fullname"}
                    // enPopulateKey={"fullname"}
                     showStatusChange={false}
                     hasDetailsBtn={true}
                     DetailsNavigate={t("detailsItem", { item: translateText2 })}
                    // hasEditBtn={true}
                    // activeStatusLabel={"paid"}
                    // inActiveStatusLabel={"unpaid"}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    )
}
