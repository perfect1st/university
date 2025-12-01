import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {  useMutation, useQuery } from "@apollo/client/react";
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
import { GET_WEBSITE_DEPARTMENTS_BY_ADMIN, UPDATE_WEBSITE_DEPARTMENT_BY_ID } from "../../graphql/departmentsQueries";

export default function AllArticlesPage() {
    const theme = useTheme();
      const { t } = useTranslation();
      const navigate = useNavigate();
      const isMobile = useMediaQuery(theme.breakpoints.down("md"));
      const [searchParams, setSearchParams] = useSearchParams();
      const isArabic = i18n.language === "ar";
      
  return (
    <div>AllArticlesPage</div>
  )
}
