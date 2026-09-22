import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { baseURL } from "../../Api/apolloClient";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import {
  GET_ALL_USERES_FOR_ADMIN,
  UPDATE_USER_BY_ADMIN,
  FILTERED_USERS,
} from "../../graphql/userQueriesForAdmin";
import { useEffect, useState } from "react";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { TrueOrFalseArr, userRules } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import NoPermissionPage from "../../components/NoPermissionPage";
import logger from "../../utils/logger";

export default function AllUsersPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
const { view, create, update, delete: canDelete } = usePermissionsByModule("users");

  const isArabic = i18n.language === "ar";
  // const totalPages = 10;

  const { data: { users } = {}, loading: allUsersLoading } = useQuery(
    GET_ALL_USERES_FOR_ADMIN,
    { fetchPolicy: "network-only" },
  );

  const [
    FilteredPagedUsers,
    { data: { filteredPagedUsers } = {}, loading: usersLoading },
  ] = useLazyQuery(FILTERED_USERS, { fetchPolicy: "network-only" });

  useEffect(() => {
    let page;
    let limit;
    if (!searchParams.get("page")) {
      page = 1;
    } else {
      page = Number(searchParams.get("page"));
    }
    if (!searchParams.get("limit")) {
      limit = 10;
    } else {
      limit = Number(searchParams.get("limit"));
    }

    let searchText = "";

    if (searchParams.get("search")) {
      searchText = searchParams.get("search");
    }

    let variablesObj = {};
    if (page) variablesObj.page = page;
    if (limit) variablesObj.limit = limit;
    if (searchText) variablesObj.search = searchText;
    if (searchParams.get("status") && searchParams.get("status") !== "0")
      variablesObj.status =
        searchParams.get("status") === "true" ? true : false;
    if (searchParams.get("role")) variablesObj.role = searchParams.get("role");

    FilteredPagedUsers({ variables: variablesObj });
  }, [searchParams]);

  logger.log("filteredPagedUsers", filteredPagedUsers);

  const [UpdateUser, { loading: updatingStatus }] = useMutation(
    UPDATE_USER_BY_ADMIN,
    { fetchPolicy: "network-only" },
  );

  let columns = [
    { key: "serial", label: t("Serial") },
    { key: "fullname", label: t("admissions.fullName") },
    { key: "job_title_label", label: isArabic ? "المسمى الوظيفي" : "Job Title" },
    // {
    //   key: "signature",
    //   label: isArabic ? "التوقيع" : "Signature",
    //   render: (row) => {
    //     if (!row.signature) {
    //       return (
    //         <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
    //           -
    //         </Typography>
    //       );
    //     }
    //     const fullUrl = row.signature.startsWith("http")
    //       ? row.signature
    //       : `${baseURL}${row.signature.startsWith("/") ? "" : "/"}${row.signature}`;
    //     return (
    //       <Box
    //         component="img"
    //         src={fullUrl}
    //         alt="signature"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           window.open(fullUrl, "_blank");
    //         }}
    //         sx={{
    //           maxHeight: 36,
    //           maxWidth: 75,
    //           objectFit: "contain",
    //           cursor: "pointer",
    //           borderRadius: 1,
    //           border: "1px solid #e0e0e0",
    //           backgroundColor: "#fff",
    //           p: 0.5,
    //           transition: "transform 0.2s",
    //           "&:hover": {
    //             transform: "scale(1.1)",
    //             boxShadow: 2,
    //           },
    //         }}
    //       />
    //     );
    //   },
    // },
    { key: "email", label: t("admissions.email") },
    { key: "mobile", label: t("Mobile") },
    { key: "role", label: t("Dashboard.userType") },
    { key: "status", label: t("Status") },
  ];
  const fetchAndExport = async (type) => {
    try {
      const exportData = users?.map((user, i) => ({
        "#": user.serial || i + 1,
        [t("admissions.fullName")]: user.fullname,
        [isArabic ? "المسمى الوظيفي" : "Job Title"]: user.job_title_id
          ? isArabic
            ? user.job_title_id.name_ar || user.job_title_id.name_en
            : user.job_title_id.name_en || user.job_title_id.name_ar
          : "-",
        [t("admissions.email")]: user.email,
        [t("Mobile")]: user.mobile,
        [t("Dashboard.userType")]: t(`Dashboard.${user.role}`),
        [t("Status")]: t(user.status),
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "قائمة المستخدمين" : "Users List",
        type,
      });
    } catch (err) {
      logger.error("Export error:", err);
    }
  };

  const addNavigate = () => navigate("add");

  const handleDetailsClick = (selectedRow) => {
      if(!update) return notify(t("no_permission.title"),"error");
    let row = filteredPagedUsers?.users?.find(
      (el) => el?.id == selectedRow?.id,
    );

    navigate(`details/${selectedRow?.id}`, {
      state: row,
    });
  };

  const onStatusChange = async (selectedRow, newStatus) => {
    try {
      // logger.log("selectedRow", selectedRow, newStatus);
      // let row=getTransactionTypes?.find(el=>el?.id==selectedRow?.id);

      // // return;
      let data = {
        status: newStatus == "inActive" ? false : true,
        //   operation_type:row?.operation_type
      };
      const result = await UpdateUser({
        variables: {
          id: selectedRow?.id,
          input: data,
        },
      });

      logger.log("reeesult", result);

      notify(t("success"), "success");
    } catch (error) {
      notify(t("error"), "error");
    }
  };

  const onFilterChange = async (filterOBJ) => {
    logger.log("filterOBJ", filterOBJ);
    let newParams = new URLSearchParams(searchParams);

    if (filterOBJ.search) {
      newParams.set("search", filterOBJ.search);
    } else {
      newParams.delete("search");
    }

    if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0") {
      newParams.set("status", filterOBJ.status);
    } else {
      newParams.delete("status");
    }

    if (filterOBJ.role && filterOBJ.role !== "0") {
      newParams.set("role", filterOBJ.role);
    } else {
      newParams.delete("role");
    }

    newParams.delete("page"); // Reset page to 1 when filters change
    setSearchParams(newParams);
  };

  // const usersToShow=[];
  const usersToShow = filteredPagedUsers?.users?.map((el) => {
    logger.log("el", el);
    const jtName = el.job_title_id
      ? isArabic
        ? el.job_title_id.name_ar || el.job_title_id.name_en
        : el.job_title_id.name_en || el.job_title_id.name_ar
      : "-";
    return {
      ...el,
      role: t(`Dashboard.${el.role}`),
      job_title_label: jtName,
    };
  });

  // let limit;
  //  if(!searchParams.get("limit")){
  //         limit=10;
  //     }
  let pageLimit;
  if (!searchParams.get("limit")) {
    pageLimit = 10;
  } else {
    pageLimit = Number(searchParams.get("limit"));
  }

  logger.log("pageLimit", pageLimit);

  const totalPages = parseInt(filteredPagedUsers?.total / pageLimit) + 1;

  logger.log("totalPages", totalPages);



    if (!view) return <NoPermissionPage />;

  let translateText = isArabic ? "مستخدم" : "User";

  if (usersLoading) return <LoadingPage />;

  // logger.log("users", users);
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container spacing={3}>
        <Grid item
          sx={{
            overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
          }}
        xs={12}
        md={12}
        >
          {updatingStatus && (
            <CircularProgress size={26} thickness={8} sx={{ color: "black" }} />
          )}

          <Header
            title={t("Users")}
            subtitle={t("Users")}
            i18n={i18n}
            haveBtn={create}
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
            placeholder={t("Dashboard.userSearchField")}
            textSearchField={"search"}
            statusKey={"status"}
            TrueOrFalseArr={TrueOrFalseArr}
            selectKey={"role"}
            selectOptions={userRules}
            select2Label={"Dashboard.userType"}
            onFilterChange={onFilterChange}
            t={t}
          />

          <TableComponent
            columns={columns}
            hasNavigateBtn={true}
            data={usersToShow}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={usersLoading}
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

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>
    </Box>
  );
}
