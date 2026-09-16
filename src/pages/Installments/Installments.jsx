import React, { useEffect } from "react";
import { Box, Grid, Tabs, Tab, Paper, Chip, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client/react";

import Header from "../../components/PageHeader/header";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import LoadingPage from "../../components/LoadingComponent";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import formatDateToString from "../../components/Utilities/FormatDateToString";

import { FILTERED_PAGED_INSTALLMENTS } from "../../graphql/installmentsQueries";
import { isPaidArr } from "../../constants";
import logger from "../../utils/logger";

const Installments = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  const { view, create, update, delete: canDelete } = usePermissionsByModule("installments");

  const [
    FilteredPagedInstallments,
    {
      data: {
        filteredPagedInstallments: {
          installments = [],
          total = 0,
        } = {
          installments: [],
          total: 0,
        },
      } = {},
      loading: pageLoading,
      error,
    },
  ] = useLazyQuery(FILTERED_PAGED_INSTALLMENTS, {
    fetchPolicy: "network-only",
  });

  const currentStatus = searchParams.get("status") || "ALL";

  useEffect(() => {
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 10;
    let searchText = searchParams.get("search") || "";

    let variablesObj = { page, limit, search: searchText };

    if (searchParams.get("status") && searchParams.get("status") !== "ALL") {
      variablesObj.status = searchParams.get("status");
    }

    if (searchParams.get("is_paid") && searchParams.get("is_paid") !== "0") {
      variablesObj.is_paid = searchParams.get("is_paid") === "true";
    }

    FilteredPagedInstallments({ variables: variablesObj });
  }, [searchParams]);

  if (error) {
    logger.error("Error fetching installments", error);
  }

  const onFilterChange = async (filterOBJ) => {
    let newParams = new URLSearchParams(searchParams);

    if (filterOBJ.search) {
      newParams.set("search", filterOBJ.search);
    } else {
      newParams.delete("search");
    }

    if (filterOBJ.hasOwnProperty("is_paid") && filterOBJ.is_paid !== "0") {
      newParams.set("is_paid", filterOBJ.is_paid);
    } else {
      newParams.delete("is_paid");
    }

    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleStatusTabChange = (event, newValue) => {
    let newParams = new URLSearchParams(searchParams);
    if (newValue === "ALL") {
      newParams.delete("status");
    } else {
      newParams.set("status", newValue);
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const columns = [
    { key: "serial", label: t("Serial") },
    { key: "studentName", label: isArabic ? "اسم الطالب" : "Student Name" },
    { key: "amount", label: t("Amount") },
    { key: "studyYear", label: t("Study Year") },
    { key: "termNumber", label: t("Term") },
    { key: "createDate", label: t("CreatedAt") },
    {
      key: "status",
      label: t("Status"),
      render: (row) => {
        const st = row.status || (row.is_paid ? "ACCEPTED" : "PENDING");
        if (st === "ACCEPTED") {
          return (
            <Chip
              label={isArabic ? "معتمد ومسدد" : "Accepted"}
              color="success"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          );
        }
        if (st === "UNDER_REVIEW") {
          return (
            <Chip
              label={isArabic ? "قيد المراجعة" : "Under Review"}
              color="warning"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          );
        }
        if (st === "CANCELLED") {
          return (
            <Chip
              label={isArabic ? "مرفوض" : "Cancelled"}
              color="error"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          );
        }
        return (
          <Chip
            label={isArabic ? "قيد الانتظار" : "Pending"}
            color="info"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        );
      },
    },
  ];

  const installmentsToShow = installments?.map((inst) => {
    const timestamp = Number(inst?.createdAt);
    const date = !isNaN(timestamp) && timestamp > 0 ? new Date(timestamp) : new Date(inst?.createdAt);

    return {
      id: inst.id,
      serial: inst.serial || "-",
      studentName: inst.student_id?.fullname || inst.student_id?.username || "-",
      amount: `${inst.amount} ${t("SAR")}`,
      studyYear: inst.study_year || "-",
      termNumber: inst.term_number === 1 ? t("First Term") : inst.term_number === 2 ? t("Second Term") : inst.term_number || "-",
      createDate: formatDateToString(date),
      is_paid: inst.is_paid,
      status: inst.status || (inst.is_paid ? "ACCEPTED" : "PENDING"),
      ...inst,
    };
  });

  const pageLimit = Number(searchParams.get("limit")) || 10;
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageLimit));

  if (!view) return <NoPermissionPage />;
  if (pageLoading) return <LoadingPage />;

  return (
    <Box sx={{ p: isSmall ? 2 : 3, backgroundColor: "background.paper", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} sx={{ overflowX: "auto" }}>
          <Header
            title={t("Installments")}
            subtitle={t("Installments Details")}
            i18n={i18n}
            haveBtn={false}
          />

          {/* Status Filter Tabs */}
          <Paper sx={{ mb: 2.5, borderRadius: 1.5, boxShadow: 1 }}>
            <Tabs
              value={currentStatus}
              onChange={handleStatusTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={isArabic ? "جميع الأقساط" : "All"} value="ALL" sx={{ fontWeight: 700 }} />
              <Tab label={isArabic ? "قيد المراجعة" : "Under Review"} value="UNDER_REVIEW" sx={{ fontWeight: 700 }} />
              <Tab label={isArabic ? "المعتمدة" : "Accepted"} value="ACCEPTED" sx={{ fontWeight: 700 }} />
              <Tab label={isArabic ? "المرفوضة" : "Cancelled"} value="CANCELLED" sx={{ fontWeight: 700 }} />
              <Tab label={isArabic ? "قيد الانتظار" : "Pending"} value="PENDING" sx={{ fontWeight: 700 }} />
            </Tabs>
          </Paper>

          <DashboardFilterComponent
            placeholder={isArabic ? "البحث برقم السيريال أو اسم الطالب أو السنة" : "Search by Serial, Student Name, or Study Year"}
            textSearchField="search"
            selectOptions={isPaidArr}
            arKey="arKey"
            enKey="enKey"
            selectKey="is_paid"
            select2Label="Status"
            onFilterChange={onFilterChange}
            t={t}
          />

          <TableComponent
            columns={columns}
            data={installmentsToShow}
            hasDetailsBtn={true}
            DetailsBtnLabel={t("Details")}
            onClickDetails={(row) => navigate(`/installments/details/${row.id}`, { state: { row } })}
            handleDetailsClick={(row) => navigate(`/installments/details/${row.id}`, { state: { row } })}
            statusKey="status"
            showStatusChange={false}
            sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1, width: "100%" }}
          />

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Installments;
