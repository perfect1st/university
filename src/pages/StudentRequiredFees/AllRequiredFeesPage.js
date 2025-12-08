import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
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
import { GET_USERS_REQUIRED_FEES, UPDATE_USER_REQUIRED_FEES } from "../../graphql/requiredFeesQueries";
import formatDateToString from "../../components/Utilities/FormatDateToString";

export default function AllRequiredFeesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();

    const isArabic = i18n.language === "ar";

    const {
        data: { getUsersRequiredFees } = {},
        loading: pageLoading
    } = useQuery(GET_USERS_REQUIRED_FEES, { fetchPolicy: "network-only" });

    const [
        UpdateUsersRequiredFees,
        {
            loading: updatingStatus
        }
    ] = useMutation(UPDATE_USER_REQUIRED_FEES, { fetchPolicy: "network-only" });

    let columns = [
        // { key: "ID", label: "ID" },
        { key: "student_id", label: t("Dashboard.studentName") },
        { key: "createDate", label: t("Dashboard.createdAt") },
        { key: "amount", label: t("fee.table.amount") },
        { key: "transaction_serial", label: t("fee.transactionSerial") },
        { key: "website_user_id", label: t("Dashboard.createdBy") },
        { key: "is_paid", label: t("Status") }

    ];

    let getUsersRequiredFeesToShow = getUsersRequiredFees?.map(el => {
        const timestamp = Number(el?.createdAt); // نتأكد إنه رقم
        const date = new Date(timestamp);

        let total = 0;

        el?.fees_types_ids?.map(fee => {
            if (el?.student_id?.is_inside_yemen == true) total += fee?.inside_yemen_value
            else total += fee?.outside_yemen_value
        })

        return {
            ...el,
            createDate: formatDateToString(date),
            amount: total,
            transaction_serial: el?.transactions_id?.transaction_serial,
            // is_paid:el?.is_paid==true ? "paid" :"unpaid"
        }
    })

    console.log("getUsersRequiredFeesToShow", getUsersRequiredFeesToShow);

    const fetchAndExport = async (type) => {
        try {
            const exportData = getUsersRequiredFees?.map((user) => ({
                ID: user.serial_num,
                "Full Name": user.name,
                Email: user.email,
                Mobile: user.mobile,
                "User Type": user.userType,
                Status: user.status,
            }));

            if (type === "excel") {
                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Users");
                const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                const data = new Blob([excelBuffer], {
                    type: "application/octet-stream",
                });
                saveAs(data, `Users_${new Date().toISOString()}.xlsx`);
            } else if (type === "pdf") {
                const doc = new jsPDF();
                doc.text("Users Report", 14, 10);
                autoTable(doc, {
                    startY: 20,
                    head: [Object.keys(exportData[0] || {})],
                    body: exportData.map((row) => Object.values(row)),
                });
                doc.save(`Users_${new Date().toISOString()}.pdf`);
            } else if (type === "print") {
                const printableWindow = window.open("", "_blank");
                const htmlContent = `
                                           <html>
                                             <head>
                                               <title>Users Report</title>
                                               <style>
                                                 table { width: 100%; border-collapse: collapse; }
                                                 th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                                                 th { background-color: #f2f2f2; }
                                               </style>
                                             </head>
                                             <body>
                                               <h2>Users Report</h2>
                                               <table>
                                                 <thead><tr>${Object.keys(exportData[0] || {})
                        .map((k) => `<th>${k}</th>`)
                        .join("")}</tr></thead>
                                                 <tbody>${exportData
                        .map(
                            (row) =>
                                `<tr>${Object.values(row)
                                    .map((v) => `<td>${v}</td>`)
                                    .join("")}</tr>`
                        )
                        .join("")}</tbody>
                                               </table>
                                             </body>
                                           </html>
                                         `;
                printableWindow.document.write(htmlContent);
                printableWindow.document.close();
                printableWindow.print();
            }
        } catch (err) {
            console.error("Export error:", err);
        }
    };

    const addNavigate = () => navigate('add');

    const handleDetailsClick = (selectedRow) => {
        console.log('handleDetailsClick', selectedRow);
        let row = getUsersRequiredFees?.find(el => el?.id == selectedRow?.id);

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
            const result = await UpdateUsersRequiredFees({
                variables: {
                    id: selectedRow?.id,
                    input: data
                }
            });

            console.log("reeesult", result);

            notify(t("success"), "success");

        } catch (error) {
            notify(t("error"), "error");
        }
    }

    const hasViewPermission = true;
    const hasAddPermission = true;

    if (!hasViewPermission) return <Navigate to="/profile" />;

    let translateText = isArabic ? "رسوم مطلوبة" : "Required Fees";

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
                    {
                        updatingStatus && <CircularProgress
                            size={26}
                            thickness={8}
                            sx={{ color: "black" }}
                        />
                    }

                    <Header
                        title={t("Dashboard.requiredFees")}
                        subtitle={t("Dashboard.requiredFees")}
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

                    <DashboardFilterComponent t={t} />

                    <TableComponent
                        columns={columns}
                        hasNavigateBtn={true}
                        data={getUsersRequiredFeesToShow}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        loading={pageLoading}
                        // isUsers={true}
                        statusKey="is_paid"
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                        handleDetailsClick={handleDetailsClick}
                        onStatusChange={onStatusChange}
                        arPopulateKey={"fullname"}
                        enPopulateKey={"fullname"}
                        activeStatusLabel={"paid"}
                        inActiveStatusLabel={"unpaid"}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
