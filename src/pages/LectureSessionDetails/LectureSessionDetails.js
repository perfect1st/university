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
import { GET_LECTURE_SESSION_BY_ID, UPDATE_LECTURE_SESSION_BY_ID } from "../../graphql/LectureSessionQueries";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
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

    const [
        UpdateLectureSession,
        {
            loading
        }
    ] = useMutation(UPDATE_LECTURE_SESSION_BY_ID, { fetchPolicy: "network-only" });

    const formik = useFormik({
        initialValues: {
            // title_ar: "",
            // title_en: "",
            notes: getLectureSessionById?.notes,
            session_task: getLectureSessionById?.session_task,
        },

        validationSchema: Yup.object({
            //   selectedOperationType: selectedOperationType == 0 && Yup.string()
            //     .required(t("admissions.errors.required"))
            //     .notOneOf(["0"], t("admissions.errors.required")),
            // title_ar: Yup.string().required(t("admissions.errors.required")),
            // title_en: Yup.string().required(t("admissions.errors.required"))

        }),
        onSubmit: async (values) => {

            console.log('xxxxxxxxxxxxxxxxxxxxxxx');
            let data = {
                // title_ar: values?.title_ar,
                // title_en: values?.title_en,
                notes: values?.notes,
                session_task: values?.session_task
                // operation_type: selectedOperationType
            };

            // if(selectedFile!=null) data.payment_document_file=selectedFile;

            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);

                // return;
                const result = await UpdateLectureSession({
                    variables: {
                        input: data,
                        id: getLectureSessionById?.id
                    }
                });

                // console.log('result', result);

                notify(t("success"), "success");

                // navigate(location.pathname.split('/add')[0]);

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
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

            <Box
                onSubmit={formik.handleSubmit}
                sx={{ width: isMobile ? "90%" : "100%" }}
                component="form">

                <VerticalTextField
                    isMultiline={true}
                    title={t("Dashboard.notes", { item: translateText2 })}
                    fieldID={"notes"}
                    fieldName={"notes"}
                    placeholder={t("Dashboard.notes", { item: translateText2 })}
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    error={formik.touched.notes && Boolean(formik.errors.notes)}
                    helperText={formik.touched.notes && formik.errors.notes}
                />

                <VerticalTextField
                    isMultiline={true}
                    title={t("Dashboard.session_task", { item: translateText2 })}
                    fieldID={"session_task"}
                    fieldName={"session_task"}
                    placeholder={t("Dashboard.session_task", { item: translateText2 })}
                    value={formik.values.session_task}
                    onChange={formik.handleChange}
                    error={formik.touched.session_task && Boolean(formik.errors.session_task)}
                    helperText={formik.touched.session_task && formik.errors.session_task}
                />


                <SubmitButton loading={loading} t={t} />
            </Box>
        </Box>
    )
}
