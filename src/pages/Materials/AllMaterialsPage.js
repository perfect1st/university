import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
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
import { GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { GET_ALL_MATERIALS, UPDATE_MATERIAL_BY_ID, GET_ALL_FILTERED_MATERIALS } from "../../graphql/materialQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { TrueOrFalseArr } from "../../constants";


export default function AllMaterialsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";

  const firstRenderRef = useRef(true);

  // get all subjects
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

    FilteredPagedMaterials({ variables: variablesObj });

    if (firstRenderRef) {
      Faculties();
      firstRenderRef.current = false;
    }

  }, []);

  let getSubjectsToShow = materials?.map(el => {
    return {
      ...el,
      faculty_id: el?.faculty_department_id?.faculty_id
    }
  });

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
      const exportData = materials?.map((user) => ({
        ID: user.serial_num,
        "Full Name": user.name,
        Email: user.email,
        Mobile: user.mobile,
        "User Type": user.userType,
        Status: user.status,
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(data, `Users_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Users Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0] || {})],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`Users_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
                                     <html>
                                       <head>
                                         <title>Users Report</title>
                                         <style>
                                           table { width: 100%; border-collapse: collapse; }
                                           th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                                           th { background-color: #f2f2f2; }
                                         </style>
                                       </head>
                                       <body>
                                         <h2>Users Report</h2>
                                         <table>
                                           <thead><tr>${Object.keys(exportData[0] || {})
            .map((k) => `<th>${k}</th>`)
            .join("")}</tr></thead>
                                           <tbody>${exportData
            .map(
              (row) =>
                `<tr>${Object.values(row)
                  .map((v) => `<td>${v}</td>`)
                  .join("")}</tr>`
            )
            .join("")}</tbody>
                                         </table>
                                       </body>
                                     </html>
                                   `;
        printableWindow.document.write(htmlContent);
        printableWindow.document.close();
        printableWindow.print();
      }
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const addNavigate = () => navigate("add");

  const handleDetailsClick = (selectedRow) => {
    console.log('handleDetailsClick', selectedRow);
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

  const hasViewPermission = true;
  const hasAddPermission = true;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  // departments
  let translateText = isArabic ? "مادة" : "Subject";
  const searchText = isArabic ? "بحث ب اسم المادة" : " Search by Subject Name";

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
            title={t("studentDashboard.subjects")}
            subtitle={`${t("studentDashboard.subjects")}`}
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
          />

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>
    </Box>
  )
}
