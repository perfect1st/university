import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
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
import { useEffect, useRef } from "react";
import notify from "../../components/notify";
import { GET_ALL_DEPARTMENTS, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { GET_ALL_MATERIALS, UPDATE_MATERIAL_BY_ID, GET_ALL_FILTERED_MATERIALS } from "../../graphql/materialQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { TrueOrFalseArr } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import { useSelector } from "react-redux";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import NoPermissionPage from "../../components/NoPermissionPage";


export default function AllMaterialsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";
const { view, create, update, delete: canDelete } = usePermissionsByModule("materials");

  console.log("location",location.pathname);
  
  const me=useSelector(state=>state.user.loggedUser);
  const storedStudentForm = JSON.parse(localStorage.getItem("registerForm"));

  const firstRenderRef = useRef(true);

  // get all mateerials with filter
  const [
    FilteredPagedMaterials, {
      data: {
        filteredPagedMaterials: {
          materials = [],
          total
        } = {}
      } = {},
      loading: materialsLoading
    }
  ] = useLazyQuery(GET_ALL_FILTERED_MATERIALS, { fetchPolicy: "network-only" });

  // get all materials 
  const{
    data
  }=useQuery(GET_ALL_MATERIALS, { fetchPolicy: "network-only" });

  // update subject status
  const [UpdateMaterial, {
    data: updatedMaterial,
    loading: updatingStatus
  }] = useMutation(UPDATE_MATERIAL_BY_ID, { fetchPolicy: "network-only" });

  // get all faculities
  const [
    Faculties,
    {
      data: { faculties } = {},
      loading: faculitiesLoading,
      error
    }
  ] = useLazyQuery(GET_ALL_FACULITIES, {
    fetchPolicy: "network-only"
  });

  // get all departments
  const [
    FacultyDepartments,
    {
      data: { facultyDepartments } = {},
      loading: departmentsLoading,
      error: departmentsError
    }
  ] = useLazyQuery(GET_ALL_DEPARTMENTS, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    // Materials();
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
    // faculty_department_id
    if (searchParams.get("faculty_department_id")) variablesObj.faculty_department_id = searchParams.get("faculty_department_id");

    if(storedStudentForm?.faculty_department_id?.id){
      variablesObj.faculty_department_id = storedStudentForm?.faculty_department_id?.id;
      searchParams.set("faculty_department_id", storedStudentForm?.faculty_department_id?.id);

      setSearchParams(searchParams);
    } 
    
    FilteredPagedMaterials({ variables: variablesObj });

    if (firstRenderRef) {
      Faculties();
      FacultyDepartments();
      firstRenderRef.current = false;
    }

  }, [searchParams]);

  // console.log("departments",facultyDepartments);

  let getSubjectsToShow = materials?.map(el => {
    return {
      ...el,
      faculty_id: el?.faculty_department_id?.faculty_id
    }
  });

  console.log("getSubjectsToShow",getSubjectsToShow);
  
  let columns = [
    // { key: "ID", label: "ID" },
    { key: "title_ar", label: t("Dashboard.NameInArabic") },
    { key: "title_en", label: t("Dashboard.NameInEnglish") },
    { key: "faculty_id", label: t("admissions.faculty") },
    { key: "faculty_department_id", label: t("admissions.facultyDepartment") },
    { key: "fullmark_degree", label: t("studentDashboard.fullmarkDegree") },
    { key: "success_degree", label: t("studentDashboard.successDegree") },
    { key: "status", label: t("Status") }
    //  { key: "userType", label: t("User Type") }

  ];
  const fetchAndExport = async (type) => {
    try {
      const exportData = data?.materials?.map((user,i) => ({
        ID: i,
        [t("Dashboard.NameInArabic")]: user?.title_ar,
        [t("Dashboard.NameInEnglish")]: user?.title_en,
        [t("admissions.faculty")]: isArabic ? user?.faculty_department_id?.faculty_id?.title_ar : user?.faculty_department_id?.faculty_id?.title_en,
        [t("admissions.facultyDepartment")]: isArabic ? user?.faculty_department_id?.title_ar : user?.faculty_department_id?.title_en,
        [t("studentDashboard.fullmarkDegree")]: user?.fullmark_degree,
        [t("studentDashboard.successDegree")]: user?.success_degree,
        [t("Status")]: t(user.status),
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "قائمة المواد الدراسية" : "Materials List",
        type
      });
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const addNavigate = () => navigate("add");

  const handleDetailsClick = (selectedRow) => {
      if(!update) return notify(t("no_permission.title"),"error");
    navigate(`details/${selectedRow?.id}`, {
      state: selectedRow
    });
  }

  const onStatusChange = async (selectedRow, newStatus) => {
    try {
      //  console.log("selectedRow", selectedRow, newStatus);
      // return;
      // let row={...selectedRow}:{faculty_department_id,faculty_id}
      //    let { faculty_department_id, faculty_id,__typename,id ,...row } = selectedRow;
      //     console.log('row',row);

      let data = {
        // ...row,
        title_ar: selectedRow?.title_ar,
        title_en: selectedRow?.title_en,
        fullmark_degree: selectedRow?.fullmark_degree,
        success_degree: selectedRow?.success_degree,
        material_hours: selectedRow?.material_hours,
        faculty_department_id: selectedRow?.faculty_department_id?.id,
        status: newStatus == "inActive" ? false : true
      }
      const result = await UpdateMaterial({
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
    if (filterOBJ.hasOwnProperty("faculty_department_id") && filterOBJ.faculty_department_id !== "0") searchParams.set("faculty_department_id", filterOBJ.faculty_department_id);
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

  // departments
  let translateText = isArabic ? "مادة" : "Subject";
  const searchText = isArabic ? "بحث ب اسم المادة" : " Search by Subject Name";
  const departmentSearch=isArabic?" اسم القسم":"Department name";

  if (materialsLoading || faculitiesLoading) return <LoadingPage />;

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      {
        updatingStatus && <CircularProgress
          size={26}
          thickness={8}
          sx={{ color: "black" }}
        />
      }

      <Grid container spacing={3}>
        <Grid item
          sm={12} md={12}
          sx={{
            overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
          }}
        >
          <Header
            title={ me?.role=="admin" ? t("studentDashboard.subjects") : t("Dashboard.library") }
            subtitle={me?.role=="admin" ? t("studentDashboard.subjects") : t("Dashboard.library")}
            i18n={i18n}
            haveBtn={ me?.role=="admin" ? true : false}
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
            me?.role=="admin" ?
              <DashboardFilterComponent
            placeholder={searchText}
            textSearchField={"search"}
            statusKey={"status"}
            TrueOrFalseArr={TrueOrFalseArr}
            selectKey={"faculty_department_id"}
            selectOptions={facultyDepartments}
            arKey={"title_ar"}
            enKey={"title_en"}
            select2Label={departmentSearch}
            onFilterChange={onFilterChange}
            t={t}
          />
            :

            <DashboardFilterComponent
            placeholder={searchText}
            textSearchField={"search"}
            statusKey={"status"}
            TrueOrFalseArr={TrueOrFalseArr}
            // selectKey={"faculty_department_id"}
            // selectOptions={facultyDepartments}
            // arKey={"title_ar"}
            // enKey={"title_en"}
            // select2Label={departmentSearch}
            onFilterChange={onFilterChange}
            t={t}
          />

          }
          


          <TableComponent
            columns={columns}
            data={getSubjectsToShow}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={materialsLoading}
            // isUsers={true}
            statusKey="status"
            arPopulateKey={"title_ar"}
            enPopulateKey={"title_en"}
            nestedArPopulateKey={"title_ar"}
            nestedEnPopulateKey={"title_en"}
            nestedPopulateKey={"faculty_id"}
            sx={{
              flex: 1,
              overflow: "auto",
              boxShadow: 1,
              borderRadius: 1,
              width: "100%",
            }}
            handleDetailsClick={handleDetailsClick}
            onStatusChange={onStatusChange}
            
            showStatusChange={me?.role=="admin" ? true : false}
          />

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>
    </Box>
  )
}
