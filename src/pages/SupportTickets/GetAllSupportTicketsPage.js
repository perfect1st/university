import { useSelector } from "react-redux";
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
import { examTypes, isOpen, ticketTypes } from "../../constants";
import { GET_SUPPORT_TICKETS_BY_USER_ID } from "../../graphql/supportTicketQueries";




export default function GetAllSupportTicketsPage() {

    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();

    const isArabic = i18n.language === "ar";
    const me = useSelector((state) => state.user.loggedUser);

    const [
        GetSupportTicketsByUser,
        {
            data: { getSupportTicketsByUser } = {},
            loading: pageLoading,
        },
    ] = useLazyQuery(GET_SUPPORT_TICKETS_BY_USER_ID, {
        fetchPolicy: "network-only",
    });


    useEffect(() => {
        console.log("me", me);

        if (me?.id) {
            GetSupportTicketsByUser({
                variables: {
                    userId: me.id,
                },
            });
        }

    }, [me]);

    const columns = [
    { key: "subject", label: t("title") },
    { key: "type", label: t("profile.Gender") },
    { key: "status", label: t("Status") },
    // { key: "is_paid", label: t("Status") }
  ];

    let ticketsToShow=getSupportTicketsByUser?.map((ticket) => {
        return {
            subject: ticket?.subject,
            type: isArabic ? ticketTypes.find((type) => type.id === ticket?.type)?.labelAr : ticketTypes.find((type) => type.id === ticket?.type)?.labelEn,
            status: ticket?.status=="open" ? true :false
        }
    });

    console.log("ticketsToShow",ticketsToShow);

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

     const handleDetailsClick = (selectedRow) => {
    console.log('handleDetailsClick', selectedRow);
    let row = getSupportTicketsByUser?.find(el => el?.id == selectedRow?.id);
    navigate(`details/${selectedRow?.id}`, {
      state: row
    });
  }

    console.log("getSupportTicketsByUser", getSupportTicketsByUser);

    let translateText = isArabic ? "تذكرة" : "Ticket";

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

                    <Header
                        title={t("Dashboard.support")}
                        subtitle={t("Dashboard.support")}
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

                    <TableComponent
                                columns={columns}
                                data={ticketsToShow}
                                // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                                loading={pageLoading}
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
                </Grid>
            </Grid>
        </Box>
    )
}
