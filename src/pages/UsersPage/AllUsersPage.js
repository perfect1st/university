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
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";

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

  console.log("filteredPagedUsers", filteredPagedUsers);

  const [UpdateUser, { loading: updatingStatus }] = useMutation(
    UPDATE_USER_BY_ADMIN,
    { fetchPolicy: "network-only" },
  );

  let columns = [
    // { key: "ID", label: "ID" },
    { key: "fullname", label: t("admissions.fullName") },
    { key: "email", label: t("admissions.email") },
    { key: "mobile", label: t("Mobile") },
    { key: "role", label: t("Dashboard.userType") },
    { key: "status", label: t("Status") },
  ];
  const fetchAndExport = async (type) => {
    try {
      const exportData = users?.map((user, i) => ({
        "#": i,
        [t("admissions.fullName")]: user.fullname,
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
      console.error("Export error:", err);
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
      // console.log("selectedRow", selectedRow, newStatus);
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

      console.log("reeesult", result);

      notify(t("success"), "success");
    } catch (error) {
      notify(t("error"), "error");
    }
  };

  const onFilterChange = async (filterOBJ) => {
    console.log("filterOBJ", filterOBJ);
    if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
    if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0")
      searchParams.set("status", filterOBJ.status);
    if (filterOBJ.role != "0") searchParams.set("role", filterOBJ.role);
    // searchParams.get("search", e.target.value);
    setSearchParams(searchParams);
  };

  // const usersToShow=[];
  const usersToShow = filteredPagedUsers?.users?.map((el) => {
    console.log("el", el);
    return {
      ...el,
      role: t(`Dashboard.${el.role}`),
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

  console.log("pageLimit", pageLimit);

  const totalPages = parseInt(filteredPagedUsers?.total / pageLimit) + 1;

  console.log("totalPages", totalPages);



    if (!view) return <NoPermissionPage />;

  let translateText = isArabic ? "مستخدم" : "User";

  if (usersLoading) return <LoadingPage />;

  // console.log("users", users);
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
