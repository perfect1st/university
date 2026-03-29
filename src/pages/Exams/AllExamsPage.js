import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
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


export default function AllExamsPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();

    const isArabic = i18n.language === "ar";

    // all filtered exams 
    const [
        FilteredPagedExams,
        {
            data = {},
            loading: pageLoading
        } = {},
    ] = useLazyQuery(GET_FILTERED_EXAMS, { fetchPolicy: "network-only" });

    const {
        filteredPagedExams: {
            exams = [],
            total = 0
        } = {}
    } = data;

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
        if (searchParams.get("exam_type") && searchParams.get("exam_type") !== "0") variablesObj.exam_type = searchParams.get("exam_type");


        // if(searchParams.get("role")) variablesObj.role=searchParams.get("role");

        FilteredPagedExams({ variables: variablesObj });

    }, [searchParams]);

    console.log("exams", exams);

    const columns = [
        { key: "serial", label: t("Serial") },
        { key: "exam_name", label: t("profile.Name") },
        { key: "type", label: t("profile.Gender") },
        { key: "full_mark_degree", label: t("studentDashboard.fullmarkDegree") },
        { key: "lecture_attendance_mark", label: t("Dashboard.lectureAttendence") },
        { key: "date_of_exam", label: t("Date") },
    ];

    const examsToShow = exams.map((exam, i) => {
        // let fromDate=null;
        const timestamp_from = Number(exam?.date_from); // نتأكد إنه رقم
        const date_from = new Date(timestamp_from);

        const timestamp_to = Number(exam?.date_to); // نتأكد إنه رقم
        const date_to = new Date(timestamp_to);
        return {
            ...exam,
            date_of_exam: `${formatDateToString(date_from)} - ${formatDateToString(date_to)}`,
            type: isArabic ? examTypes?.find(el => el?.id == exam?.exam_type)?.labelAr
                :
                examTypes?.find(el => el?.id == exam?.exam_type)?.labelEn
        }
    })
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

    const addNavigate = () => navigate('add');

    const studentDegreesNavigate=(row) => {
        console.log("row",row);

        navigate(`examStudentDegrees/${row?.id}`,{
            state:row
        });
    };

    const handleDetailsClick = (selectedRow) => {
        console.log('handleDetailsClick', selectedRow);
        let row = exams?.find(el => el?.id == selectedRow?.id);

        navigate(`details/${selectedRow?.id}`, {
            state: row
        });
    }

    const onStatusChange = async (selectedRow, newStatus) => {
        try {
            // console.log("selectedRow", selectedRow, newStatus);
            // let row=getTransactionTypes?.find(el=>el?.id==selectedRow?.id);

            // // return;
            let data = {
                is_paid: newStatus == "inActive" ? false : true,
                student_id: selectedRow?.student_id?.id,
                fees_types_ids: selectedRow?.fees_types_ids?.map(el => el?.id),
                title_ar: selectedRow?.title_ar,
                title_en: selectedRow?.title_en
                //   operation_type:row?.operation_type
            }
            // const result = await UpdateUsersRequiredFees({
            //     variables: {
            //         id: selectedRow?.id,
            //         input: data
            //     }
            // });

            // console.log("reeesult", result);

            notify(t("success"), "success");

        } catch (error) {
            notify(t("error"), "error");
        }
    }

    const onFilterChange = async (filterOBJ) => {
        console.log("filterOBJ", filterOBJ);
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
        if (filterOBJ.hasOwnProperty("exam_type") && filterOBJ.exam_type !== "0") searchParams.set("exam_type", filterOBJ.exam_type);
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

    let translateText = isArabic ? "امتحان" : "Exam";
    let searchText=isArabic ? "اسم الامتحان" : "Exam Name";

    if (!hasViewPermission) return <Navigate to="/profile" />;

    if (pageLoading) return <LoadingPage />;

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
                        title={t("Dashboard.exams")}
                        subtitle={t("Dashboard.exams")}
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
                        data={examsToShow}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        loading={pageLoading}
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
                        onStatusChange={onStatusChange}
                        onClickDetails={studentDegreesNavigate}

                        arPopulateKey={"fullname"}
                        enPopulateKey={"fullname"}
                        showStatusChange={false}
                        hasDetailsBtn={true}
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
