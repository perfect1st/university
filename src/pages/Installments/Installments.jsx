import React, { useEffect } from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
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

  useEffect(() => {
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 10;
    let searchText = searchParams.get("search") || "";

    let variablesObj = { page, limit, search: searchText };

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

  const columns = [
    { key: "serial", label: t("Serial") },
    { key: "amount", label: t("Amount") },
    { key: "studyYear", label: t("Study Year") },
    { key: "termNumber", label: t("Term") },
    { key: "createDate", label: t("CreatedAt") },
    { key: "is_paid", label: t("Status") },
  ];

  const installmentsToShow = installments?.map((inst) => {
    const timestamp = Number(inst?.createdAt);
    const date = !isNaN(timestamp) && timestamp > 0 ? new Date(timestamp) : new Date(inst?.createdAt);

    return {
      id: inst.id,
      serial: inst.serial || "-",
      amount: `${inst.amount} ${t("SAR")}`,
      studyYear: inst.study_year || "-",
      termNumber: inst.term_number === 1 ? t("First Term") : inst.term_number === 2 ? t("Second Term") : inst.term_number || "-",
      createDate: formatDateToString(date),
      is_paid: inst.is_paid,
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

          <DashboardFilterComponent
            placeholder={t("Search by Serial or Study Year")}
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
            statusKey="is_paid"
            activeStatusLabel="paid"
            inActiveStatusLabel="unpaid"
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
