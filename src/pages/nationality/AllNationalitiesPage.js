import {
  Box,
  useTheme,
  Grid,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useNavigate, useSearchParams, Navigate, useLocation } from "react-router-dom";
import Header from "../../components/PageHeader/header";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_NATIONALITIES, GET_FILTERED_NATIONALITIES, UPDATE_NATIONALITY_BY_ID } from "../../graphql/nationalitiesQueries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import { TrueOrFalseArr } from "../../constants";
import notify from "../../components/notify";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";


export default function AllNationalitiesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // update nationality
  const [
    UpdateNationality,
    {
      loading: updatingStatus
    }
  ] = useMutation(UPDATE_NATIONALITY_BY_ID, {
    fetchPolicy: "network-only",
  });
  // get filtered nationalities
  const [
    FilteredPagedNationalities,
    {
      data: {
        filteredPagedNationalities: {
          nationalities = [],
          total
        } = {}
      } = {},
      loading: nationalitiesLoading
    }
  ] = useLazyQuery(GET_FILTERED_NATIONALITIES, {
    fetchPolicy: "network-only",
  });

  // get all nationalities
  const {
      data: {
        nationalities:allNationalities
      }={},
      loading: allNationalitiesLoading,
      error: nationalitiesError,
    } = useQuery(GET_ALL_NATIONALITIES, {
      fetchPolicy: "network-only",
    });

    // console.log("allNationalities",allNationalities);

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
    if (searchParams.get("status")) variablesObj.status = searchParams.get("status") === "true" ? true : false;


    console.log("(searchParams.get('status)", searchParams.get("status"));
    FilteredPagedNationalities({ variables: variablesObj });

    // FilteredPagedUsers({ variables: { page, limit } });
    // setLimit(parseInt(searchParams.get("limit"), 10));
  }, [searchParams]);

  console.log("nationalities", nationalities);

  // const [allUsers, setAllUsers] = useState(DUMMY_USERS);
  const isArabic = i18n.language === "ar";





  let columns = [
    { key: "name_ar", label: t("Dashboard.NameInArabic") },
    { key: "name_en", label: t("Dashboard.NameInEnglish") },
    { key: "flag", label: t("Dashboard.flag") },
    { key: "status", label: t("Status") },
  ];

  // export filtered data (all filteredUsers, not only page)
  const fetchAndExport = async (type) => {
    try {
      const exportData = allNationalities?.map((user, i) => ({
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
        reportTitle: isArabic ? "قائمة الجنسيات" : "Nationalities List",
        type
      });
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const addUserNavigate = () => navigate('add');

  const handleDetailsClick = (selectedRow) => {
    console.log('handleDetailsClick', selectedRow);
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
      const result = await UpdateNationality({
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
  // const onActionClick=()=>navigate('details')
  // Permissions: for the dummy page we allow viewing. Replace with your real permission check if needed.
  const hasViewPermission = true;
  const hasAddPermission = true;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  let translateText = isArabic ? "جنسية" : "Nationality";
  const searchText = isArabic ? "بحث ب اسم الجنسية" : " Search by Nationality Name";

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

          {
            updatingStatus && <CircularProgress
              size={26}
              thickness={8}
              sx={{ color: "black" }}
            />
          }
          <Header
            title={t("Nationalities")}
            subtitle={t("Nationalities")}
            i18n={i18n}
            haveBtn={hasAddPermission}
            btn={t("addItem", { item: translateText })}
            btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
            onSubmit={addUserNavigate}
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
            // selectKey={"role"}
            // selectOptions={userRules}
            // select2Label={"Dashboard.userType"}
            onFilterChange={onFilterChange}
            t={t}
          />


          <TableComponent
            columns={columns}
            data={nationalities}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={nationalitiesLoading}
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
