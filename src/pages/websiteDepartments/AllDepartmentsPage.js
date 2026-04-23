import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {  useMutation, useQuery } from "@apollo/client/react";
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
import { GET_WEBSITE_DEPARTMENTS_BY_ADMIN, UPDATE_WEBSITE_DEPARTMENT_BY_ID } from "../../graphql/departmentsQueries";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import { useState } from "react";
import logger from "../../utils/logger";

export default function AllDepartmentsPage() {
    const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
const { view, create, update, delete: canDelete } = usePermissionsByModule("websiteDepartments");

  const isArabic = i18n.language === "ar";
  const {
    data: { websiteDepartments } = {},
    loading
  } = useQuery(GET_WEBSITE_DEPARTMENTS_BY_ADMIN, { fetchPolicy: "network-only" });

  const[UpdateWebsiteDepartment,{
    loading:updatingStatus
  }]=useMutation(UPDATE_WEBSITE_DEPARTMENT_BY_ID,{fetchPolicy:"network-only"});

  logger.log("websiteDepartments",websiteDepartments);

  let columns = [
    { key: "serial", label: t("Serial") },
    { key: "title_ar", label: t("Dashboard.NameInArabic") },
    { key: "title_en", label: t("Dashboard.NameInEnglish") },
    { key: "status", label: t("Status") }
  ];
  const fetchAndExport = async (type) => {
      try {
        const exportData = websiteDepartments?.map((user) => ({
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
        logger.error("Export error:", err);
      }
    };
  
    const addNavigate = () => navigate('add');
  
    const handleDetailsClick = (selectedRow) => {

      
      if(!update) return notify(t("no_permission.title"),"error");
      navigate(`details/${selectedRow?.id}`, {
        state: selectedRow
      });
    }
  
    const onStatusChange = async (selectedRow, newStatus) => {
      try {
        // logger.log("selectedRow", selectedRow, newStatus);
        // let row=getTransactionTypes?.find(el=>el?.id==selectedRow?.id);
  
        // // return;
        let data = {
          status: newStatus == "inActive" ? false : true,
        //   operation_type:row?.operation_type
        }
        const result = await UpdateWebsiteDepartment({
          variables: {
            id: selectedRow?.id,
            input: data
          }
        });
  
       logger.log("reeesult", result);
  
        notify(t("success"), "success");
  
      } catch (error) {
        notify(t("error"), "error");
      }
    }


    const [filters, setFilters] = useState({});


const onFilterChange = (filterOBJ) => {
  setFilters(filterOBJ);
};

let filteredData = websiteDepartments?.filter(el => el?.father_id == null) || [];

if (filters.title) {
  const s = filters.title.toLowerCase();
  filteredData = filteredData.filter(el => 
    el.title_ar?.toLowerCase().includes(s) || 
    el.title_en?.toLowerCase().includes(s)
  );
}

if (filters.status && filters.status !== "0") {
  // Make sure this logic matches your "active"/"inActive" strings
  const isActive = filters.status === "active";
  filteredData = filteredData.filter(el => el.status === isActive);
}

  
    if (!view) return <NoPermissionPage />;
  
    let translateText = isArabic ? "قسم موقع" : "Website Department";
  
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
              {
            updatingStatus && <CircularProgress
              size={26}
              thickness={8}
              sx={{ color: "black" }}
            />
          }
           <Header
            title={t("Dashboard.WebsiteDepartments")}
            subtitle={t("Dashboard.WebsiteDepartments")}
            i18n={i18n}
            haveBtn={false}
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
        t={t} 
        onFilterChange={onFilterChange}
        textSearchField="title" 
        placeholder={t("Search by Name")}
        statusKey="status"
        select1Label="Status"
        TrueOrFalseArr={["active", "inActive"]} // These keys should match your translation files
      />

         <TableComponent
            columns={columns}
            hasNavigateBtn={true}
            data={filteredData}
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
            onStatusChange={onStatusChange}
          />

        </Grid> 
        </Grid>
    </Box>
  )
}
