import { GET_ALL_TRANSACTION_TYPES } from "../../graphql/transactionTypeQueries"
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
import { useEffect } from "react";
import notify from "../../components/notify";

// t(`fee.transactionType.${el}
// t(`fee.transactionType.${el}`, { lng: "ar" })
export default function AllTransactionTypesPage() {

    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();

    const isArabic = i18n.language === "ar";

    const {
        data: { getTransactionTypes } = {},
        loading
    } = useQuery(GET_ALL_TRANSACTION_TYPES, { fetchPolicy: "network-only" });

    console.log("getTransactionTypes", getTransactionTypes, loading);

   

    let getTransactionTypesToShow=getTransactionTypes?.map(el=>{
        return{
            ...el,
            operation_type:t(`fee.transactionType.${el?.operation_type}`)
        }
    });

     console.log("getTransactionTypesToShow",getTransactionTypesToShow);

    let columns = [
        // { key: "ID", label: "ID" },
        { key: "title_ar", label: t("Dashboard.NameInArabic") },
        { key: "title_en", label: t("Dashboard.NameInEnglish") },
        {key:"operation_type",label:t("Dashboard.transactionType")},
        { key: "status", label: t("Status") }

    ];

    const fetchAndExport = async (type) => {
        try {
            const exportData = getTransactionTypes?.map((user) => ({
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
        navigate(`details/${selectedRow?.id}`, {
            state: selectedRow
        });
    }



    const hasViewPermission = true;
    const hasAddPermission = true;

    if (!hasViewPermission) return <Navigate to="/profile" />;

    let translateText = isArabic ? "نوع معاملة مالية" : "Transaction Type";

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
            title={t("Dashboard.transactionTypes")}
            subtitle={t("Dashboard.transactionTypes")}
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

       
          <DashboardFilterComponent t={t} />

          
          <TableComponent
            columns={columns}
            hasNavigateBtn={true}
            data={getTransactionTypesToShow}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={loading}
            // isUsers={true}
             statusKey="status"
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
