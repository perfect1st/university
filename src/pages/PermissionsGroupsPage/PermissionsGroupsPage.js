import React, { useState } from "react";
import { Box, Grid, CircularProgress, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";

// Icons & Components
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import LoadingPage from "../../components/LoadingComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";

// GraphQL Queries
import { GET_GROUPS } from "../../graphql/groupQueries";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

export default function PermissionsGroupsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";
const { view, create, update, delete: canDelete } = usePermissionsByModule("groups");

  // 1. Fetch Groups Data
  const { data, loading, error } = useQuery(GET_GROUPS, {
    fetchPolicy: "network-only",
  });

  // 2. Define Table Columns
  const columns = [
    { key: "name_ar", label: t("Name (Arabic)") },
    { key: "name_en", label: t("Name (English)") },
    { key: "formattedDate", label: t("Created At") },
  ];

  // 3. Filter and Prepare Data
  // This logic runs every time the searchParams or data changes
  const groupsToShow = data?.groups
    ?.filter((group) => {
      const searchTerm = searchParams.get("search")?.toLowerCase() || "";
      if (!searchTerm) return true;

      return (
        group.name_ar?.toLowerCase().includes(searchTerm) ||
        group.name_en?.toLowerCase().includes(searchTerm)
      );
    })
    .map((group) => {
      // Parse the string timestamp to a Date object
      const dateObj = new Date(parseInt(group.createdAt));
      return {
        ...group,
        formattedDate: dateObj.toLocaleDateString(isArabic ? "ar-EG" : "en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
    });

  // 4. Action Handlers
  const onFilterChange = (filterOBJ) => {
    const newParams = {};
    if (filterOBJ.search) {
      newParams.search = filterOBJ.search;
    }
    // Updating searchParams triggers a re-render and filters the list
    setSearchParams(newParams);
  };

  const handleDetailsClick = (selectedRow) => {
      if(!update) return notify(t("no_permission.title"),"error");
    navigate(`details/${selectedRow.id}`, {
      state: selectedRow,
    });
  };

  const addNavigate = () => navigate("add");

  // 5. Export Logic
  const fetchAndExport = (type) => {
    try {
      const exportData = groupsToShow?.map((group, i) => ({
        "#": i + 1,
        [t("Name (Arabic)")]: group.name_ar,
        [t("Name (English)")]: group.name_en,
        [t("Created At")]: group.formattedDate,
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "قائمة مجموعات الصلاحيات" : "Permissions Groups List",
        type,
      });
    } catch (err) {
      console.error("Export error:", err);
    }
  };
    if (!view) return <NoPermissionPage />;

  // 6. Conditional Rendering
  if (loading) return <LoadingPage />;
  if (error) return <Box sx={{ p: 3 }}>Error loading groups: {error.message}</Box>;

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ overflowX: "auto" }}>
          
          <Header
            title={t("Permissions Groups")}
            subtitle={t("Manage system access groups")}
            i18n={i18n}
            haveBtn={create}
            btn={t("addItem", { item: isArabic ? "مجموعة" : "Group" })}
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
            placeholder={t("Search by name...")}
            textSearchField={"search"}
            onFilterChange={onFilterChange}
          />

          <TableComponent
            columns={columns}
            hasNavigateBtn={true}
            data={groupsToShow || []}
            loading={loading}
            handleDetailsClick={handleDetailsClick}
            sx={{
              mt: 2,
              flex: 1,
              boxShadow: 1,
              borderRadius: 1,
              width: "100%",
            }}
          />

          {/* If your backend eventually supports pagination, uncomment below */}
          {/* <FilterComponent totalPages={1} /> */}
          
        </Grid>
      </Grid>
    </Box>
  );
}