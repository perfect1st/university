import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import formatDateToString from "../../components/Utilities/FormatDateToString";
import { useEffect } from "react";
import { GET_FILTERED_EXAMS } from "../../graphql/ExamsQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import { examTypes } from "../../constants";
import { GET_STUDENT_DEGRESS_BY_STUDENT_ID } from "../../graphql/studentDegreeQueries";

export default function AllDegreesForStudentPage() {
  const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const{id}=useParams();
    
    const{
      data:{
        studentDegreeByStudent
      }={},
      loading
    }=useQuery(GET_STUDENT_DEGRESS_BY_STUDENT_ID,
      {
        variables:{student_id:id}
      }
    );

    console.log("studentDegreeByStudent",studentDegreeByStudent);
    
    const isArabic = i18n.language === "ar";

    if(loading) return <LoadingPage />;
  return (
    <div>AllDegreesForStudentPage</div>
  )
}
