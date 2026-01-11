import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import i18n from "../../i18n/i18n";
import { GET_LECTURE_SESSION_BY_ID } from "../../graphql/LectureSessionQueries";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
// import LoadingPage from "../../../components/LoadingComponent";
// import Header from "../../../components/PageHeader/header";
// import ScheduleTable from "../../../components/Utilities/ScheduleTableComponent";
// import ToDayTimeTableComponent from "../../../components/Utilities/ToDayTimeTableComponent";

export default function LectureSessionDetails() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const isArabic = i18n.language === "ar";

    const me = useSelector(state => state.user.loggedUser);

    const {
        data: { getLectureSessionById } = {},
        loading: getSessionLoading,
    } = useQuery(GET_LECTURE_SESSION_BY_ID, {
        variables: { id },
        fetchPolicy: "network-only",
    });


    console.log("getLectureSessionById", getLectureSessionById);

    console.log("iddddddddddddd", id);

    let translateText = isArabic ? "المحاضرة" : "Lecture";
    let translateText2 = isArabic ? "مادة جديدة" : "New Subject";

  if (getSessionLoading) return <LoadingPage />;
    return (
       <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
         <Header
                title={t("detailsItem", { item: translateText })}
                subtitle={t("detailsItem", { item: translateText })}
                i18n={i18n}
                haveBtn={false}
                hasAddOrEditBtn={true}
                sub2={t("detailsItem", { item: translateText })}
                hasNavigate={true}
                isExcel={false}
                isPdf={false}
                isPrinter={false}
              />
        </Box>
    )
}
