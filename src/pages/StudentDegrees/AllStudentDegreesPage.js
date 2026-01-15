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
import { GET_ALL_STUDENT_DEGREES, GET_STUDENT_DEGRESS_BY_STUDENT_ID } from "../../graphql/studentDegreeQueries";
import { useSelector } from "react-redux";

export default function AllStudentDegreesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const location = useLocation();

    const isArabic = i18n.language === "ar";

    const me=useSelector(state=>state.user.loggedUser);

    const [
        StudentDegreesAll,
        {
            data: {
                studentDegreesAll
            } = {},
            loading
        }
    ] = useLazyQuery(GET_ALL_STUDENT_DEGREES,
        {
            fetchPolicy: "network-only"
        }
    );

    useEffect(()=>{
            if(me?.id){
              console.log('meeeee');
              StudentDegreesAll({variables:{doctor_id:me?.id}});
            }
          },[me]);

    const columns = [
    { key: "exam_name", label: t("profile.Name") },
    { key: "type", label: t("profile.Gender") },
    { key: "full_mark_degree", label: t("studentDashboard.fullmarkDegree") },

    { key: "lecture_attendance", label: t("Dashboard.lectureAttendance") },
    { key: "exam_attendance", label: t("Dashboard.examAttendance") },
    { key: "total_exam_degree", label: t("studentDashboard.fullmarkDegree") },
    // { key: "is_paid", label: t("Status") }
  ];

  let total_full_mark_degree = 0;
  let total_lecture_attendance = 0;

  let total_total_exam_degree = 0;

//    let studentDegreesToShow = studentDegreesAll?.map((degree) => {

//     console.log("degree?.exams", degree);
//     let exam = degree?.exams[0];

//     total_full_mark_degree+=degree?.totals?.total_full_mark;
//     total_lecture_attendance+=degree?.totals?.total_lecture_attendance;
   
//     total_total_exam_degree+=degree?.totals?.total_exam_degree;

//     return {
//       ...exam,
//       exam_name: exam?.exam_id?.exam_name,
//       type: isArabic ? examTypes?.find(el => el?.id == exam?.exam_id?.exam_type)?.labelAr
//         :
//         examTypes?.find(el => el?.id == exam?.exam_type)?.labelEn,
//       exam_attendance: exam?.exam_attendance ? t("yes") : t("no"),
//       full_mark_degree: exam?.full_mark,
//       student_degree: exam?.student_degree,
//       lecture_attendance: exam?.lecture_attendance,
//       total_exam_degree: degree?.totals?.total_exam_degree
//     }
//   });

    const result = studentDegreesAll?.flatMap(student =>
  student?.subjects?.flatMap(subject =>
    subject?.exams?.map(exam => ({
      exam_name: exam?.exam_id?.exam_name,
      type: isArabic
        ? examTypes?.find(el => el?.id == exam?.exam_id?.exam_type)?.labelAr
        : examTypes?.find(el => el?.id == exam?.exam_id?.exam_type)?.labelEn,
      exam_attendance: exam?.exam_attendance ? t("yes") : t("no"),
      full_mark_degree: exam?.full_mark,
      student_degree: exam?.student_degree,
      lecture_attendance: exam?.lecture_attendance,
      total_exam_degree: subject?.totals?.total_exam_degree,
      student_name: student?.student?.fullname, // لو حابب تضيفه
      student_email: student?.student?.email   // اختياري
    }))
  )
);

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

    console.log("studentDegreesToShow",result);

    console.log("location.state", location.state);

    console.log("studentDegreesAll",studentDegreesAll);




     if (loading) return <LoadingPage />;
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
                        title={t("Dashboard.studentDegrees")}
                        subtitle={t("Dashboard.studentDegrees")}
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
                        hasNavigate={true}
                    />

                    {/* <DashboardFilterComponent
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
                    /> */}

                    <TableComponent
                        columns={columns}
                        hasNavigateBtn={true}
                        data={result}
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
                    //  handleDetailsClick={handleDetailsClick}
                    // // onStatusChange={onStatusChange}
                    //  onClickDetails={studentDegreesNavigate}

                    // arPopulateKey={"fullname"}
                    // enPopulateKey={"fullname"}
                    //  showStatusChange={false}
                     dontShowActions={true}
                    //  hasDetailsBtn={true}
                    //  DetailsNavigate={t("detailsItem", { item: translateText2 })}
                    // hasEditBtn={true}
                    // activeStatusLabel={"paid"}
                    // inActiveStatusLabel={"unpaid"}
                    />

                    {/* <FilterComponent totalPages={totalPages} /> */}
                </Grid>
            </Grid>
        </Box>
    )
}
