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
import { useNavigate, Navigate, useLocation, useSearchParams } from "react-router-dom";
import Header from "../../components/PageHeader/header";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import LoadingPage from "../../components/LoadingComponent";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import {  GET_ALL_FACULITY_PRICES_FILTERED, UPDATE_FACULITY_PRICE_BY_ID , GET_ALL_FACULITY_PRICES } from "../../graphql/faculityPricesQueries";
import { useEffect } from "react";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { transactionTypesArr, TrueOrFalseArr } from "../../constants";
import notify from "../../components/notify";
import { GET_ALL_DEPARTMENTS_FOR_FILTER, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";


export default function AllFaculitiesPricesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isArabic = i18n.language === "ar";

  // get all faculities
  const{
    data:{faculties}={},
    loading:facultiesLoading
  }=useQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

  // get all departments
  const{
    data:{facultyDepartments}={},
    loading:facultyDepartmentsLoading
  }=useQuery(GET_ALL_DEPARTMENTS_FOR_FILTER, { fetchPolicy: "network-only" });

  // console.log("facultyDepartments",facultyDepartments);

  // all faculity prices
  const{
    data
  }=useQuery(GET_ALL_FACULITY_PRICES, { fetchPolicy: "network-only" });

 // console.log("data",data);

  // faculity prices with filter
  const [
    FilteredPagedFacultyPrices
    ,
    {
      data: {
        filteredPagedFacultyPrices: {
          facultyPrices,
          total
        } = {}
      }
      = {},
      loading: facultyPricesLoading
    }] = useLazyQuery(GET_ALL_FACULITY_PRICES_FILTERED, {
      fetchPolicy: "network-only",
    });

  const [
    UpdateFacultyPrice,
    {
      loading: updatingStatus
    }
  ] = useMutation(UPDATE_FACULITY_PRICE_BY_ID, { fetchPolicy: "network-only" });

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
   // faculty_department_id
    if (searchParams.get("faculty_id")) variablesObj.faculty_id = searchParams.get("faculty_id");
    if (searchParams.get("faculty_department_id")) variablesObj.faculty_department_id = searchParams.get("faculty_department_id");
    if (searchParams.get("level_year")) variablesObj.level_year = Number(searchParams.get("level_year"));
    // if(searchParams.get("status")&&searchParams.get("status") !=="0") variablesObj.status= searchParams.get("status") === "true" ? true : false;

    FilteredPagedFacultyPrices({
      variables: variablesObj
    });
  }, [searchParams]);

  console.log("facultyPrices", facultyPrices);

  let columns = [
    // { key: "ID", label: "ID" },
    { key: "faculty_id", label: t("admissions.faculty") },
    { key: "faculty_department_id", label: t("admissions.facultyDepartment") },
    { key: "level_year", label: t("Dashboard.studyYear") },
    { key: "price_inside_yemen", label: t("Dashboard.inside_yemen") },
    { key: "price_outside_yemen", label: t("Dashboard.outside_yemen") },
    { key: "status", label: t("Status") }
  ];

  const fetchAndExport = async (type) => {
    try {
      console.log("data?.facultyPrices",data?.facultyPrices);

      const exportData = data?.facultyPrices?.map((user,i) => ({
        ID: i,
        [t("admissions.faculty")]: isArabic ? user?.faculty_id?.title_ar : user?.faculty_id?.title_en,
        [t("admissions.facultyDepartment")]: isArabic ? user?.faculty_department_id?.title_ar : user?.faculty_department_id?.title_en,
        [t("Dashboard.studyYear")]: user?.level_year,
        [t("Dashboard.inside_yemen")]: user?.price_inside_yemen,
        [t("Dashboard.outside_yemen")]: user?.price_outside_yemen,
        [t("Status")]: t(user.status),
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "قائمة اسعار الكليات" : "Faculity Prices List",
        type
      });

     
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const addNavigate = () => navigate('add');

  const handleDetailsClick = (selectedRow) => {
    console.log('handleDetailsClick', selectedRow);
    navigate(`details/${selectedRow?.id}`, {
      state: selectedRow
    });
  }

  const onFilterChange = async (filterOBJ) => {
    console.log("filterOBJ", filterOBJ);
    if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
   // if (filterOBJ.hasOwnProperty("operation_type") && filterOBJ.operation_type !== "0") searchParams.set("operation_type", filterOBJ.operation_type);
    if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0") searchParams.set("status", filterOBJ.status);
    if (filterOBJ.hasOwnProperty("faculty_id") && filterOBJ.faculty_id !== "0") searchParams.set("faculty_id", filterOBJ.faculty_id);
    if (filterOBJ.hasOwnProperty("faculty_department_id") && filterOBJ.faculty_department_id !== "0") searchParams.set("faculty_department_id", filterOBJ.faculty_department_id);
    //level_year
    if(filterOBJ.hasOwnProperty("level_year")) searchParams.set("level_year",filterOBJ.level_year);
    setSearchParams(searchParams);
  }

  const onStatusChange = async (selectedRow, newStatus) => {
    try {
      // console.log("selectedRow", selectedRow, newStatus);
      // let row=getTransactionTypes?.find(el=>el?.id==selectedRow?.id);

      // // return;
      let data = {
        status: newStatus == "inActive" ? false : true,
        level_year:selectedRow?.level_year,
        price_inside_yemen:selectedRow?.price_inside_yemen,
        price_outside_yemen:selectedRow?.price_outside_yemen,
        faculty_id:selectedRow?.faculty_id?.id,
        faculty_department_id:selectedRow?.faculty_department_id?.id
        //   operation_type:row?.operation_type
      }
      const result = await UpdateFacultyPrice({
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

  // console.log("facultyPrices",facultyPrices);
  // const onActionClick=()=>navigate('details')
  // Permissions: for the dummy page we allow viewing. Replace with your real permission check if needed.
  const hasViewPermission = true;
  const hasAddPermission = true;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  let translateText = isArabic ? "رسوم كلية" : "Faculity Price";
  let searchText = isArabic ? "رسوم الكلية" : "Faculity Price";
  let searchFaculityText = isArabic ? "اسم الكلية" : "Faculity Name";
  let searchFaculityDepartmentText = isArabic ? "قسم الكلية" : "Faculity Dep.";

  if (facultyPricesLoading || facultiesLoading || facultyDepartmentsLoading) return <LoadingPage />;

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
            title={t("Dashboard.facultyPrices")}
            subtitle={t("Dashboard.facultyPrices")}
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
          {
            !facultiesLoading&&<DashboardFilterComponent
            placeholder={t("Dashboard.searchWith", { search: searchText })}
            textSearchField={"search"}
            textSearchField2={"level_year"}
            placeholder2={t("Dashboard.studyYear")}
            statusKey={"status"}
            select1Label={"Status"}
            TrueOrFalseArr={TrueOrFalseArr}
            select2Label={searchFaculityText}
            selectKey={"faculty_id"}
            selectOptions={faculties}
            arKey={"title_ar"}
            enKey={"title_en"}
            selectKey2={"faculty_department_id"}
            selectOptions2={facultyDepartments}
            select2Label2={searchFaculityDepartmentText}
            onFilterChange={onFilterChange}
            t={t}
          />
          }
          

          <TableComponent
            columns={columns}
            data={facultyPrices}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={facultyPricesLoading}
            // isUsers={true}
            statusKey="status"
            arPopulateKey={"title_ar"}
            enPopulateKey={"title_en"}
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
