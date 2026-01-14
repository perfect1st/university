import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
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
import { useEffect } from "react";
import notify from "../../components/notify";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { days } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import { GET_LECTURE_SESSIONS_FOR_DOCTOR } from "../../graphql/LectureSessionQueries";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import { useSelector } from "react-redux";

// GET_LECTURE_SESSIONS_FOR_DOCTOR
export default function DoctorComponent() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();

    const me = useSelector((state) => state.user.loggedUser);
    const isArabic = i18n.language === "ar";

    // LectureSessionsByDoctor with filter
    const [LectureSessionsByDoctor, {
        data: {
            lectureSessionsByDoctor: {
                total = 0,
                lectureSessions = []
            } = {}
        }
        = {},
        loading: gettingSessionsLoading
    }] = useLazyQuery(GET_LECTURE_SESSIONS_FOR_DOCTOR, { fetchPolicy: "network-only" });


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
        // if (filterOBJ.lecture_date) searchParams.set("lecture_date", filterOBJ.lecture_date);
        // if (searchParams.get("is_paid") && searchParams.get("is_paid") !== "0") variablesObj.is_paid = searchParams.get("is_paid") === "true" ? true : false;
        if (searchParams.get("lecture_date")) variablesObj.lecture_date = searchParams.get("lecture_date");

        LectureSessionsByDoctor({ variables: variablesObj });

    }, [searchParams]);

    let columns = [
        // { key: "ID", label: "ID" },
        { key: "material_id_ar", label: t("studentDashboard.subjectTitleAr") },
        { key: "material_id_en", label: t("studentDashboard.subjectTitleEn") },
        { key: "lecture_date_2", label: t("Date") },
        { key: "day", label: t("day") },
        { key: "time", label: t("Time") },
        // { key: "transaction_serial", label: t("fee.transactionSerial") },
        // { key: "website_user_id", label: t("Dashboard.createdBy") },
         { key: "lecture_status", label: t("Status") }

    ];

    const lectureSessionsByDoctorToShow = lectureSessions?.map(item => {
        const timestamp = Number(item?.lecture_date); // نتأكد إنه رقم
        const date = new Date(timestamp);
        let lecture_day = "";
        if (isArabic) {
            lecture_day = days?.find(day => day.key == item?.timetable_id?.day)?.labelAr
        }
        else {
            lecture_day = days?.find(day => day.key == item?.timetable_id?.day)?.labelEn
        }
        return {
            ...item,
            material_id_ar: item?.material_id?.title_ar,
            material_id_en: item?.material_id?.title_en,
            lecture_date_2: formatDateToString(date),
            day: lecture_day,
            time: `${item?.timetable_id?.start_time} - ${item?.timetable_id?.end_time}`,
            lecture_status: t(`lectures.${item?.status}`)
            // create_date:item.create_date,
            // amount:item.amount,
            // transaction_serial:item.transaction_serial,
            // website_user_id:item.website_user_id,
            // is_paid:item.is_paid,
        }
    });

    console.log("lectureSessionsByDoctorToShow", lectureSessionsByDoctorToShow);

    // let daysSelect=days?.map(el=>{
    //     return {
    //         id:el?.key,
    //         ...el
    //     }
    // });

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

    const handleDetailsClick = (selectedRow) => {
        console.log('handleDetailsClick', selectedRow);
        let row = lectureSessions?.find(el => el?.id == selectedRow?.id);

        navigate(`/LectureSessionDetails/${selectedRow?.id}`, {
            state: row
        });
    }

    const onFilterChange = async (filterOBJ) => {
        console.log("filterOBJ", filterOBJ);
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
        // if (filterOBJ.hasOwnProperty("is_paid") && filterOBJ.is_paid !== "0") searchParams.set("is_paid", filterOBJ.is_paid);
        if (filterOBJ.lecture_date) searchParams.set("lecture_date", filterOBJ.lecture_date);
        // searchParams.get("search", e.target.value);
        setSearchParams(searchParams);
    }

    // console.log("lectureSessions",lectureSessions);

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

    if (!hasViewPermission) return <Navigate to="/profile" />;

    let translateText = isArabic ? " اسم المادة" : "Subject Name";
    let translateText2 = isArabic ? " التاريخ" : "Date";
    //    const searchText=is
    if (gettingSessionsLoading) return <LoadingPage />;
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
                        title={t("Dashboard.lectureSchedules")}
                        subtitle={t("Dashboard.lectureSchedules")}
                        i18n={i18n}
                        haveBtn={false}
                        // btn={t("addItem", { item: translateText })}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        // onSubmit={addNavigate}
                        isExcel
                        isPdf
                        isPrinter
                        onExcel={() => fetchAndExport("excel")}
                        onPdf={() => fetchAndExport("pdf")}
                        onPrinter={() => fetchAndExport("print")}
                    />

                    <DashboardFilterComponent
                        placeholder={t("Dashboard.searchWith", { search: translateText })}
                        textSearchField={"search"}
                        textSearchField2={"lecture_date"}
                        placeholder2={t("Dashboard.searchWith", { search: translateText2 })}
                        statusKey={"status"}
                        // TrueOrFalseArr={TrueOrFalseArr}
                        //    selectKey={"role"}
                        //  selectOptions={daysSelect}
                        //  arKey={"labelAr"}
                        //  enKey={"labelEn"}
                        // // selectKey={"is_paid"}
                        //  select2Label={t("days")}
                        onFilterChange={onFilterChange}
                        t={t}
                    />

                    <TableComponent
                        columns={columns}
                        hasNavigateBtn={true}
                        data={lectureSessionsByDoctorToShow}
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
                        showStatusChange={false}
                    // onStatusChange={onStatusChange}
                    // arPopulateKey={"fullname"}
                    // enPopulateKey={"fullname"}
                    // activeStatusLabel={"paid"}
                    // inActiveStatusLabel={"unpaid"}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    )
}
