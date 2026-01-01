import { GET_ALL_TRANSACTION_TYPES_FILTERED, GET_ALL_TRANSACTION_TYPES, UPDATE_TRANSACTION_TYPE } from "../../graphql/transactionTypeQueries"
import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
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
import { useEffect } from "react";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { paymentMethodsArr, transactionTypesArr, TrueOrFalseArr } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";

// t(`fee.transactionType.${el}
// t(`fee.transactionType.${el}`, { lng: "ar" })
export default function AllTransactionTypesPage() {

  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();

  const isArabic = i18n.language === "ar";

  // getTransactionTypes with filter
  const [
    GetTransactionTypesFiltered,
    {
      data: {
        getTransactionTypesFiltered: {
          total = 0,
          transactionTypes: getTransactionTypes = []
        } = {}
      }
      = {},
      loading
    }
  ] = useLazyQuery(GET_ALL_TRANSACTION_TYPES_FILTERED, {
    fetchPolicy: "network-only"
  });

  // get all transaction types
  const {
    data
  } = useQuery(GET_ALL_TRANSACTION_TYPES, { fetchPolicy: "network-only" });



  const [
    UpdateTransactionType, {
      loading: updatingStatus
    }
  ] = useMutation(UPDATE_TRANSACTION_TYPE, { fetchPolicy: "network-only" });

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
    if (searchParams.get("operation_type")) variablesObj.operation_type = searchParams.get("operation_type");
    if (searchParams.get("status") && searchParams.get("status") !== "0") variablesObj.status = searchParams.get("status") === "true" ? true : false;

    GetTransactionTypesFiltered({
      variables: variablesObj
    });

  }, [searchParams]);

  console.log("getTransactionTypes", getTransactionTypes);



  let getTransactionTypesToShow = getTransactionTypes?.map(el => {
    return {
      ...el,
      operation_type: t(`fee.transactionType.${el?.operation_type}`)
    }
  });

  console.log("getTransactionTypesToShow", getTransactionTypesToShow);

  let columns = [
    // { key: "ID", label: "ID" },
    { key: "title_ar", label: t("Dashboard.NameInArabic") },
    { key: "title_en", label: t("Dashboard.NameInEnglish") },
    { key: "operation_type", label: t("Dashboard.transactionType") },
    { key: "status", label: t("Status") }

  ];

  const fetchAndExport = async (type) => {
    try {
      const exportData = getTransactionTypes?.map((user, i) => ({
        ID: i,
        [t("Dashboard.NameInArabic")]: user?.title_ar,
        [t("Dashboard.NameInEnglish")]: user?.title_en,
        [t("Dashboard.transactionType")]: t(`fee.transactionType.${user?.operation_type}`),
        [t("Status")]: t(user.status),
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "قائمة انواع المعاملات المالية" : "Transaction Types List",
        type
      });
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const addNavigate = () => navigate('add');

  const handleDetailsClick = (selectedRow) => {
    console.log('handleDetailsClick', selectedRow);
    let row = getTransactionTypes?.find(el => el?.id == selectedRow?.id);

    navigate(`details/${selectedRow?.id}`, {
      state: row
    });
  }

  const onStatusChange = async (selectedRow, newStatus) => {
    try {
      console.log("selectedRow", selectedRow, newStatus);
      let row = getTransactionTypes?.find(el => el?.id == selectedRow?.id);

      // return;
      let data = {
        status: newStatus == "inActive" ? false : true,
        operation_type: row?.operation_type
      }
      const result = await UpdateTransactionType({
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

  let pageLimit;
  if (!searchParams.get("limit")) {
    pageLimit = 10;
  }
  else {
    pageLimit = Number(searchParams.get("limit"));
  }

  console.log("pageLimit", pageLimit);

  const totalPages = parseInt(total / pageLimit) + 1;

  const onFilterChange = async (filterOBJ) => {
    console.log("filterOBJ", filterOBJ);
    if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
    if (filterOBJ.hasOwnProperty("operation_type") && filterOBJ.operation_type !== "0") searchParams.set("operation_type", filterOBJ.operation_type);
    if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0") searchParams.set("status", filterOBJ.status);

    setSearchParams(searchParams);
  }


  const hasViewPermission = true;
  const hasAddPermission = true;

  if (!hasViewPermission) return <Navigate to="/profile" />;

  let translateText = isArabic ? "نوع معاملة مالية" : "Transaction Type";

  let searchText = isArabic ? "اسم المعاملة المالية" : "Fee Types Name"

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
            title={t("Dashboard.transactionTypes")}
            subtitle={t("Dashboard.transactionTypes")}
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


          <DashboardFilterComponent
            placeholder={t("Dashboard.searchWith", { search: searchText })}
            textSearchField={"search"}
            statusKey={"status"}
            select1Label={"Status"}
            TrueOrFalseArr={TrueOrFalseArr}
            select2Label={"Dashboard.transactionType"}
            selectKey={"operation_type"}
            selectOptions={transactionTypesArr}
            onFilterChange={onFilterChange}
            t={t}
          />


          <TableComponent
            columns={columns}
            hasNavigateBtn={true}
            data={getTransactionTypesToShow}
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

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>
    </Box>
  )
}
