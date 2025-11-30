import {
  Box,
  Typography,
  useTheme,
  Grid,
  Paper,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { useMemo, useState } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useNavigate, useSearchParams, Navigate, useLocation } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "../../components/PageHeader/header";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useQuery } from "@apollo/client/react";
import LoadingPage from "../../components/LoadingComponent";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextFieldAdmin, { CustomSelect } from "../../components/Utilities/CustomTextField";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import { GET_ALL_FACULITY_PRICES } from "../../graphql/faculityPricesQueries";

// GET_ALL_FACULITY_PRICES
export default function AllFaculitiesPricesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location=useLocation();
  const isArabic = i18n.language === "ar";

  const {
      data: { facultyPrices } = {},
      loading: facultyPricesLoading
    } = useQuery(GET_ALL_FACULITY_PRICES, {
      fetchPolicy: "network-only",
    });

     let columns = [
    // { key: "ID", label: "ID" },
    { key: "level_year", label: t("Dashboard.studyYear") },
    { key: "faculty_id", label: t("admissions.faculty") },
    { key: "faculty_department_id", label: t("admissions.facultyDepartment") },
    { key: "price_inside_yemen", label: t("Dashboard.inside_yemen") },
     { key: "price_outside_yemen", label: t("Dashboard.outside_yemen") },
  ];

    const fetchAndExport = async (type) => {
        try {
          const exportData = facultyPrices?.map((user) => ({
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

    const addNavigate=()=>navigate('add');
    
      const handleDetailsClick=(selectedRow)=>{
        console.log('handleDetailsClick',selectedRow);
        navigate(`details/${selectedRow?.id}`,{
          state:selectedRow
        });
      }
    
      console.log("facultyPrices",facultyPrices);
      // const onActionClick=()=>navigate('details')
      // Permissions: for the dummy page we allow viewing. Replace with your real permission check if needed.
      const hasViewPermission = true;
      const hasAddPermission = true;
      if (!hasViewPermission) return <Navigate to="/profile" />;
    
      let translateText = isArabic ? "سعر كلية" : "Faculity Price";

    if (facultyPricesLoading) return <LoadingPage />;
    
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
            title={t("Dashboard.facultyPrices")}
            subtitle={t("Dashboard.facultyPrices")}
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
                        data={facultyPrices}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        loading={facultyPricesLoading}
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
