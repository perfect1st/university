import React, { useEffect, useMemo, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useQuery } from "@apollo/client/react";
import { GET_USERS } from "../../graphql/queries/usersQueries.js";

// Dummy data for second project
const DUMMY_USERS = [
  { _id: "u001", serial_num: "001", name: "Ali Hassan", email: "ali@example.com", mobile: "01000000001", userType: "Admin", status: "active", super_admin: false },
  { _id: "u002", serial_num: "002", name: "Salma Farouk", email: "salma@example.com", mobile: "01000000002", userType: "Customer", status: "inActive", super_admin: false },
  { _id: "u003", serial_num: "003", name: "Omar Nabil", email: "omar@example.com", mobile: "01000000003", userType: "Driver", status: "active", super_admin: false },
  { _id: "u004", serial_num: "004", name: "Mona Khalid", email: "mona@example.com", mobile: "01000000004", userType: "Customer", status: "active", super_admin: false },
  { _id: "u005", serial_num: "005", name: "Hany Adel", email: "hany@example.com", mobile: "01000000005", userType: "Admin", status: "inActive", super_admin: true },
  { _id: "u006", serial_num: "006", name: "Rana Mahmoud", email: "rana@example.com", mobile: "01000000006", userType: "Customer", status: "active", super_admin: false },
  { _id: "u007", serial_num: "007", name: "Karim Said", email: "karim@example.com", mobile: "01000000007", userType: "Driver", status: "inActive", super_admin: false },
  { _id: "u008", serial_num: "008", name: "Dina Sami", email: "dina@example.com", mobile: "01000000008", userType: "Customer", status: "active", super_admin: false },
  { _id: "u009", serial_num: "009", name: "Walid Fathy", email: "walid@example.com", mobile: "01000000009", userType: "Admin", status: "active", super_admin: false },
  { _id: "u010", serial_num: "010", name: "Nada Yasser", email: "nada@example.com", mobile: "01000000010", userType: "Customer", status: "inActive", super_admin: false },
  // add more dummy rows as you like
];

const UsersPage = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";


  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const userTypeParam = searchParams.get("userType") || "";
  const statusParam = searchParams.get("status") || "";
  const { data, loading, error } = useQuery(GET_USERS, {
    // variables: { page, limit: 10, keyword, status: statusParam },
    fetchPolicy: "network-only",
  });
  console.log("data",data)

  // local "server" state
  const [allUsers, setAllUsers] = useState(DUMMY_USERS);

  // derive filtered list
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const matchesKeyword =
        !keyword ||
        u.name.toLowerCase().includes(keyword.toLowerCase()) ||
        u.email.toLowerCase().includes(keyword.toLowerCase()) ||
        u.mobile.toLowerCase().includes(keyword.toLowerCase()) ||
        (u.serial_num && String(u.serial_num).includes(keyword));
      const matchesType = !userTypeParam || userTypeParam === "" || String(u.userType) === String(userTypeParam);
      const matchesStatus = !statusParam || statusParam === "" || String(u.status) === String(statusParam);
      return matchesKeyword && matchesType && matchesStatus;
    });
  }, [allUsers, keyword, userTypeParam, statusParam]);

  // pagination calculations
  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredUsers.slice(start, start + limit);
  }, [filteredUsers, currentPage, limit]);

  // columns requested: ID, Full Name, Email, Mobile, User Type, Status
  const rows = paginatedUsers.map((u) => ({
    id: u._id,
    ID: u.serial_num,
    fullName: u.name,
    email: u.email,
    mobile: u.mobile,
    userType: u.userType,
    status: u.status,
    superAdmin: u.super_admin ? t("Yes") : t("No"),
  }));

  const columns = [
    { key: "ID", label: "ID" },
    { key: "fullName", label: t("Full Name") },
    { key: "email", label: t("Email") },
    { key: "mobile", label: t("Mobile") },
    { key: "userType", label: t("User Type") },
    { key: "status", label: t("Status") },
  ];

  // helper to update URL search params and keep the other params intact
  const updateParams = (updates) => {
    const params = Object.fromEntries(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params[key] = value;
      else delete params[key];
    });
    setSearchParams(params);
  };
  const handleSearch = (filters) => updateParams({ ...filters, page: 1 });
  const handleLimitChange = (e) => updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, value) => updateParams({ page: value });

  const addUserSubmit = () => {
    navigate("/users/addUser"); // keep same navigation
  };

  // update a user's status locally (simulates edit)
  const onStatusChange = (row, newStatusLabel) => {
    // map label to value used in dummy: accept "active" or "inActive"
    const mappedStatus = newStatusLabel === "Active" || newStatusLabel === "active" ? "active" : "inActive";
    setAllUsers((prev) => prev.map((u) => (u._id === row.id ? { ...u, status: mappedStatus } : u)));
  };

  // export filtered data (all filteredUsers, not only page)
  const fetchAndExport = async (type) => {
    try {
      const exportData = filteredUsers.map((user) => ({
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
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
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
                <thead><tr>${Object.keys(exportData[0] || {}).map((k) => `<th>${k}</th>`).join("")}</tr></thead>
                <tbody>${exportData.map((row) => `<tr>${Object.values(row).map((v) => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody>
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

  return (
    <Box component="main" sx={{ p: isSmall ? 2 : 3, width: "100%", maxWidth: "100vw", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header
        title={t("Users")}
        subtitle={t("Users Details")}
        i18n={i18n}
        haveBtn={hasAddPermission}
        btn={t("Add User")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addUserSubmit}
        isExcel
        isPdf
        isPrinter
        onExcel={() => fetchAndExport("excel")}
        onPdf={() => fetchAndExport("pdf")}
        onPrinter={() => fetchAndExport("print")}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={(filters) => {
            // FilterComponent expected to provide { keyword, userType, status }
            handleSearch(filters);
          }}
          initialFilters={{ keyword, userType: userTypeParam, status: statusParam }}
          statusOptions={["active", "inActive"]}
          userTypeOptions={["Admin", "student", "accountant"]}
          isUsers={true}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
        loading={loading}
        isUsers={true}
        statusKey="status"
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        onStatusChange={onStatusChange}
      />

      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </Box>
  );
};

export default UsersPage;
