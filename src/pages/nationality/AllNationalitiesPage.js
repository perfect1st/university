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
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "../../components/PageHeader/header";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_NATIONALITIES } from "../../graphql/nationalitiesQueries";
import LoadingPage from "../../components/LoadingComponent";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextFieldAdmin, { CustomSelect } from "../../components/Utilities/CustomTextField";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
// import CustomTextField from "../RTLTextField";



export default function AllNationalitiesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // get all nationalities
  const {
    data: { nationalities } = {},
    loading: nationalitiesLoading,
    error: nationalitiesError,
  } = useQuery(GET_ALL_NATIONALITIES, {
    fetchPolicy: "network-only",
  });

  console.log("nationalities", nationalities);

  // const [allUsers, setAllUsers] = useState(DUMMY_USERS);
  const isArabic = i18n.language === "ar";
  const me = useSelector((state) => state.user.loggedUser);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const userTypeParam = searchParams.get("userType") || "";
  const statusParam = searchParams.get("status") || "";

  // derive filtered list
  // const filteredUsers = useMemo(() => {
  //   return allUsers.filter((u) => {
  //     const matchesKeyword =
  //       !keyword ||
  //       u.name.toLowerCase().includes(keyword.toLowerCase()) ||
  //       u.email.toLowerCase().includes(keyword.toLowerCase()) ||
  //       u.mobile.toLowerCase().includes(keyword.toLowerCase()) ||
  //       (u.serial_num && String(u.serial_num).includes(keyword));
  //     const matchesType =
  //       !userTypeParam ||
  //       userTypeParam === "" ||
  //       String(u.userType) === String(userTypeParam);
  //     const matchesStatus =
  //       !statusParam ||
  //       statusParam === "" ||
  //       String(u.status) === String(statusParam);
  //     return matchesKeyword && matchesType && matchesStatus;
  //   });
  // }, [allUsers, keyword, userTypeParam, statusParam]);

  // pagination calculations
  // const totalUsers = filteredUsers.length;
  // const totalPages = Math.max(1, Math.ceil(totalUsers / limit));
  // const currentPage = Math.min(Math.max(1, page), totalPages);

  // const paginatedUsers = useMemo(() => {
  //   const start = (currentPage - 1) * limit;
  //   return filteredUsers.slice(start, start + limit);
  // }, [filteredUsers, currentPage, limit]);

  // columns requested: ID, Full Name, Email, Mobile, User Type, Status
  // const rows = paginatedUsers.map((u) => ({
  //   id: u.id,
  //   ID: u.id,
  //   name_ar: u.name_ar,
  //   name_en: u.name_en,
  //   flag: u.flag,
  // }));

  let columns = [
    // { key: "ID", label: "ID" },
    { key: "name_ar", label: t("Dashboard.NameInArabic") },
    { key: "name_en", label: t("Dashboard.NameInEnglish") },
    { key: "flag", label: t("Dashboard.flag") },
    // { key: "userType", label: t("User Type") },
    { key: "status", label: t("Status") },
  ];

  // export filtered data (all filteredUsers, not only page)
  const fetchAndExport = async (type) => {
    try {
      const exportData = nationalities.map((user) => ({
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

  // Permissions: for the dummy page we allow viewing. Replace with your real permission check if needed.
  const hasViewPermission = true;
  const hasAddPermission = true;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  let translateText = isArabic ? "جنسية" : "Nationality";

  if (nationalitiesLoading) return <LoadingPage />;
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
            title={t("Nationalities")}
            subtitle={t("Nationalities")}
            i18n={i18n}
            haveBtn={hasAddPermission}
            btn={t("addItem", { item: translateText })}
            btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
            // onSubmit={addUserSubmit}
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
            data={nationalities}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={nationalitiesLoading}
            // isUsers={true}
            // statusKey="status"
            sx={{
              flex: 1,
              overflow: "auto",
              boxShadow: 1,
              borderRadius: 1,
              width: "100%",
            }}
            // onStatusChange={onStatusChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
