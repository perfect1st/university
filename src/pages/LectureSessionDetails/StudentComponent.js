import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
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
import { useEffect } from "react";
import notify from "../../components/notify";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { days } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import { GET_LECTURE_SESSIONS_FOR_DOCTOR, GET_LECTURE_SESSIONS_FOR_STUDENT } from "../../graphql/LectureSessionQueries";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import { useSelector } from "react-redux";

export default function StudentComponent() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const storedStudentForm = JSON.parse(localStorage.getItem("registerForm"));
    const me = useSelector((state) => state.user.loggedUser);
    const isArabic = i18n.language === "ar";

     // LectureSessionsByDoctor with filter
    const [LectureSessionsByStudent, {
        data: {
            lectureSessionsByStudent: {
                total = 0,
                lectureSessions = []
            } = {}
        }
        = {},
        loading: gettingSessionsLoading
    }] = useLazyQuery(GET_LECTURE_SESSIONS_FOR_STUDENT, { fetchPolicy: "network-only" });


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
        variablesObj.academy_term_id=storedStudentForm?.academyTerm_id?.id;
        variablesObj.study_year=storedStudentForm?.academyTerm_id?.study_year;

        if (page) variablesObj.page = page;
        if (limit) variablesObj.limit = limit;
        if (searchText) variablesObj.search = searchText;
        // if (filterOBJ.lecture_date) searchParams.set("lecture_date", filterOBJ.lecture_date);
        // if (searchParams.get("is_paid") && searchParams.get("is_paid") !== "0") variablesObj.is_paid = searchParams.get("is_paid") === "true" ? true : false;
        if (searchParams.get("lecture_date")) variablesObj.lecture_date = searchParams.get("lecture_date");

        LectureSessionsByStudent({ variables: variablesObj });

    }, [searchParams]);

    if(gettingSessionsLoading) return <LoadingPage />
  return (
    <div>StudentComponent</div>
  )
}
