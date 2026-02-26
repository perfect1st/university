import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { GET_ALL_COUNTRIES, GET_FILTERED_COUNTRIES, UPDATE_COUNTRY_BY_ID } from "../../graphql/countriesQueries";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import { useEffect, useState } from "react";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { TrueOrFalseArr } from "../../constants";
import notify from "../../components/notify";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import NoPermissionPage from "../../components/NoPermissionPage";




export default function AllCountriesPage() {

  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
const { view, create, update, delete: canDelete } = usePermissionsByModule("countries");

  const isArabic = i18n.language === "ar";

  // get filtered countries
  const [
    FilteredPagedCountries,
    {
      data: {
        filteredPagedCountries: {
          countries = [],
          total
        } = {}
      }
      = {},
      loading: countriesLoading,

    }
  ] = useLazyQuery(GET_FILTERED_COUNTRIES, { fetchPolicy: "network-only" });

  // get all countries
    const {
      data: {
        countries: countriesData
      }={},
      loading: countriesDataLoading,
      error: countriesError,
    } = useQuery(GET_ALL_COUNTRIES, { fetchPolicy: "network-only" });

  const [
    UpdateCountry,
    {
      loading: updatingStatus
    }
  ] = useMutation(
    UPDATE_COUNTRY_BY_ID,
    {
      fetchPolicy: "network-only"
    }
  );

  useEffect(() => {
    let page;
    let limit;
    if (!searchParams.get("page")) {
      page = 1;
    }
    else {
      page = Number(searchParams.get("page"));
    }
    if (!searchParams.get("limit")) {
      limit = 10;
    }
    else {
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
    if (searchParams.get("status") && searchParams.get("status") !== "0") variablesObj.status = searchParams.get("status") === "true" ? true : false;


    FilteredPagedCountries({ variables: variablesObj });

    // FilteredPagedUsers({ variables: { page, limit } });
    // setLimit(parseInt(searchParams.get("limit"), 10));
  }, [searchParams]);



  let columns = [
    // { key: "ID", label: "ID" },
    { key: "name_ar", label: t("Dashboard.NameInArabic") },
    { key: "name_en", label: t("Dashboard.NameInEnglish") },
    { key: "navigate", label: t("cities") },
    //  { key: "userType", label: t("User Type") }
    { key: "status", label: t("Status") }
  ];
  // const location=useLocation();
  const fetchAndExport = async (type) => {
    try {
      const exportData = countriesData?.map((user, i) => ({
        "#": i,
        [t("Dashboard.NameInArabic")]: user.name_ar,
        [t("Dashboard.NameInEnglish")]: user.name_en,
        // Mobile: user.mobile,
        // "User Type": user.userType,
        [t("Status")]: t(user.status),
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "قائمة الدول" : "Countries List",
        type
      });

    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const addCountryNavigate = () => navigate('add');

  const handleDetailsClick = (selectedRow) => {
      if(!update) return notify(t("no_permission.title"),"error");
    navigate(`details/${selectedRow?.id}`, {
      state: selectedRow
    });
  }

  const onStatusChange = async (selectedRow, newStatus) => {
    try {
      // console.log("selectedRow", selectedRow, newStatus);
      // let row=getTransactionTypes?.find(el=>el?.id==selectedRow?.id);

      // // return;
      let data = {
        status: newStatus == "inActive" ? false : true,
        //   operation_type:row?.operation_type
      }
      const result = await UpdateCountry({
        variables: {
          id: selectedRow?.id,
          input: data
        }
      });

      console.log("reeesult", result);

      notify(t("success"), "success");

    } catch (error) {
      notify(t("error"), "error");
    }
  }


  // const onActionClick=()=>navigate('details')
  // Permissions: for the dummy page we allow viewing. Replace with your real permission check if needed.
  const onFilterChange = async (filterOBJ) => {
    console.log("filterOBJ", filterOBJ);
    if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
    if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0") searchParams.set("status", filterOBJ.status);
    // searchParams.get("search", e.target.value);
    setSearchParams(searchParams);
  }

  let pageLimit;
  if (!searchParams.get("limit")) {
    pageLimit = 10;
  }
  else {
    pageLimit = Number(searchParams.get("limit"));
  }

  console.log("pageLimit", pageLimit);

  const totalPages = parseInt(total / pageLimit) + 1;

  console.log("totalPages", totalPages);
    if (!view) return <NoPermissionPage />;


  let translateText = isArabic ? "دولة" : "Country";
  const searchText = isArabic ? "ابحث ب  اسم الدولة" : "Search by Country Name";

  if (countriesLoading) return <LoadingPage />;

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
            title={t("countries")}
            subtitle={t("countries")}
            i18n={i18n}
            haveBtn={create}
            btn={t("addItem", { item: translateText })}
            btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
            onSubmit={addCountryNavigate}
            isExcel
            isPdf
            isPrinter
            onExcel={() => fetchAndExport("excel")}
            onPdf={() => fetchAndExport("pdf")}
            onPrinter={() => fetchAndExport("print")}
          />


          <DashboardFilterComponent
            placeholder={searchText}
            textSearchField={"search"}
            statusKey={"status"}
            TrueOrFalseArr={TrueOrFalseArr}

            onFilterChange={onFilterChange}
            t={t}
          />


          <TableComponent
            columns={columns}
            hasNavigateBtn={true}
            navigateTo={'cities'}
            navigateBtnTitle={t("cities")}
            data={countries}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={countriesLoading}
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
  )
}
