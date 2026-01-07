import React, { useEffect, useState } from 'react'
import ScheduleTable from '../../components/Utilities/ScheduleTableComponent'
import {
    Box,
    Grid,
    TextField,
    Typography,
    Select,
    MenuItem,
    Button,
    InputLabel,
    FormControl,
    useTheme,
    useMediaQuery,
    CircularProgress
} from "@mui/material";

import BookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Header from '../../components/PageHeader/header';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { GET_MATERIALS_BY_DEPARTMENT_ID } from '../../graphql/materialQueries';
import { VerticalTextFieldSelect } from '../../components/Utilities/VerticalTextField';
import { days } from '../../constants';
import LoadingPage from '../../components/LoadingComponent';
import notify from '../../components/notify';
import { useSelector } from 'react-redux';
import { GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID } from '../../graphql/AcademyTerms';
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from '../../graphql/facultyQuiries';
import { UPDATE_MAIN_TIME_TABLE_BY_ID } from '../../graphql/TimeTableQueries';
import * as Yup from "yup";
import { useFormik } from "formik";
import SubmitButton from '../../components/Utilities/SubmitButton';
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";

export default function EditLecturePage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    console.log("location", location);

    // const [selectedSemester, setSelectedSemester] = useState(0);
    const [selectedFaculity, setSelectedFaculity] = useState(() => location?.state?.faculty_id?.id);
    const [selectedDepartment, setSelectedDepartment] = useState(() => location?.state?.faculty_department_id?.id);
    const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(() => location?.state?.academy_term_id?.id);

    const me = useSelector(state => state.user.loggedUser);

    const [
        UpdateMainTimeTable,
        {
            loading: updating
        }
    ] = useMutation(UPDATE_MAIN_TIME_TABLE_BY_ID, {
        fetchPolicy: "network-only"
    });
    // get all faculities
    const {
        data: { faculties } = {},
        loading: faculitiesLoading,
        error
    }
        = useQuery(GET_ALL_FACULITIES, {
            fetchPolicy: "network-only"
        });
    // get departments in faculty
    const [
        GetFacultyDepartmentsByFaculty,
        {
            data: { getFacultyDepartmentsByFaculty } = {},
            loading: departmentsLoading,
            error: departmentsError,
        }
    ] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, {
        fetchPolicy: "network-only",
        variables: {
            faculty_id: location?.state?.faculty_id?.id
        }
    });

    useEffect(() => {
        GetFacultyDepartmentsByFaculty({
            variables: {
                faculty_id: location?.state?.faculty_id?.id
            },
        });

        getAcademyTermsByFacultyDepartment({
            variables: {
                faculty_department_id: location?.state?.faculty_department_id?.id
            }
        });
    }, []);
    // تجيب الترمات بتاعة القسم
    const [
        getAcademyTermsByFacultyDepartment,
        { data: { getAcademyTermsByFacultyDepartment: termsData } = {}, loading: termsLoading, error: termsError },
    ] = useLazyQuery(GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID, {
        fetchPolicy: "network-only",
    });

    const formik = useFormik({
        initialValues: {
            title_ar: location?.state?.title_ar,
            title_en: location?.state?.title_en,
            study_year: location?.state?.study_year,
            // current_year: ""
        },

        validationSchema: Yup.object({
            title_ar: Yup.string().required(t("admissions.errors.required")),
            title_en: Yup.string().required(t("admissions.errors.required")),
            // current_year: Yup.string().required(t("admissions.errors.required")),
            study_year: Yup.string().required(t("admissions.errors.required")),
            // selectedSemester: selectedSemester == 0 && Yup.string()
            //     .required(t("admissions.errors.required"))
            //     .notOneOf(["0"], t("admissions.errors.required")),
            selectedAcademicTerm: selectedAcademicTerm == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),

            selectedFaculity: selectedFaculity == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedDepartment: selectedDepartment == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),

        }),
        onSubmit: async (values) => {

            console.log("suuuubmit");


            let data = {
                title_ar: values?.title_ar,
                title_en: values?.title_en,
                study_year: values?.study_year,
                faculty_department_id: selectedDepartment,
                faculty_id: selectedFaculity,
                academy_term_id: selectedAcademicTerm,
                created_by: me?.id, //            اضيف بواسطة


            };



            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
                // console.log(data);

                //  return;
                const result = await UpdateMainTimeTable({
                    variables: {
                        id: location?.state?.id,
                        input: data
                    }
                });

                console.log('result', result);

                notify(t("success"), "success");

                navigate(location.pathname.split('/edit')[0]);

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "جدول المحاضرة" : "Lecture Schedule";
    let translateText2 = isArabic ? "تعديل" : "Edit";

    if (faculitiesLoading) return <LoadingPage />;
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
            <Header
                title={t("Dashboard.LecturesSchedule")}
                subtitle={translateText2}
                i18n={i18n}
                haveBtn={false}
                hasAddOrEditBtn={true}
                sub2={translateText2}
                hasNavigate={true}
                isExcel={false}
                isPdf={false}
                isPrinter={false}
            />

            <Box component="form"
                onSubmit={
                    formik.handleSubmit
                }
                sx={{
                    width: "100%", [theme.breakpoints.down("sm")]: {
                        width: "60%", // 👈 للموبايل
                    },
                }}
            >

                <HorizentalTextField
                    title={t("Dashboard.arabicTitle")}
                    fieldID={"title_ar"}
                    fieldName={"title_ar"}
                    placeholder={t("Dashboard.arabicTitle")}
                    value={formik.values.title_ar}
                    onChange={formik.handleChange}
                    error={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
                    helperText={formik.touched.title_ar && formik.errors.title_ar}
                />

                <HorizentalTextField
                    title={t("Dashboard.englishTitle")}
                    fieldID={"title_en"}
                    fieldName={"title_en"}
                    placeholder={t("Dashboard.englishTitle")}
                    value={formik.values.title_en}
                    onChange={formik.handleChange}
                    error={formik.touched.title_en && Boolean(formik.errors.title_en)}
                    helperText={formik.touched.title_en && formik.errors.title_en}
                />

                {/* السنة الدراسية */}
                <HorizentalTextField
                    title={t("Dashboard.studyYear", { item: translateText2 })}
                    fieldID={"study_year"}
                    fieldName={"study_year"}
                    placeholder={t("Dashboard.studyYear")}
                    value={formik.values.study_year}
                    onChange={formik.handleChange}
                    error={formik.touched.study_year && Boolean(formik.errors.study_year)}
                    helperText={formik.touched.study_year && formik.errors.study_year}
                />

                {/* العام الدراسي */}
                {/* <HorizentalTextField
                                title={t("Dashboard.AcademicYear", { item: translateText2 })}
                                fieldID={"current_year"}
                                fieldName={"current_year"}
                                placeholder={t("Dashboard.AcademicYear")}
                                value={formik.values.current_year}
                                onChange={formik.handleChange}
                                error={formik.touched.current_year && Boolean(formik.errors.current_year)}
                                helperText={formik.touched.current_year && formik.errors.current_year}
                            /> */}




                {/* الكلية */}
                <HorizentalTextFieldSelect
                    t={t}
                    title={t("admissions.faculty")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedFaculity}
                    setValue={setSelectedFaculity}
                    onChange={async (e) => {
                        await GetFacultyDepartmentsByFaculty({
                            variables: {
                                faculty_id: e.target.value,
                            },
                        });

                        setSelectedDepartment(0);
                    }}

                    onBlur={(e) => {
                        // console.log('blur',selectedSemester);
                        if (selectedFaculity != 0) formik.setFieldError("selectedFaculity", undefined);

                    }}

                    error={formik.errors.selectedFaculity && t("admissions.errors.required")}
                    helperText={formik.errors.selectedFaculity && t("admissions.errors.required")}
                // error={selectError}
                // setError={setSelectError}

                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        faculties?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </HorizentalTextFieldSelect>

                {
                    (departmentsLoading)
                    && <CircularProgress size={26}
                        thickness={8}
                        sx={{ color: "black" }} />
                }

                {/* القسم   */}
                <HorizentalTextFieldSelect
                    t={t}
                    title={t("admissions.facultyDepartment")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedDepartment}
                    setValue={setSelectedDepartment}
                    onChange={async (e) => {
                        // 44444444444444444444444444444
                        if (e.target.value != "") {
                            console.log("nnnnnnnnnnnnn", e.target.value);
                            await getAcademyTermsByFacultyDepartment({
                                variables: {
                                    faculty_department_id: e.target.value
                                }
                            });
                        }

                    }}
                    //   onChange={async (e) => {

                    //     await MaterialsByDepartment({
                    //       variables: {
                    //         faculty_department_id: e.target.value
                    //       }
                    //     });
                    //   }}
                    onBlur={(e) => {
                        // console.log('blur',selectedSemester);
                        if (selectedDepartment != 0) formik.setFieldError("selectedDepartment", undefined);

                    }}
                    error={formik.errors.selectedDepartment && t("admissions.errors.required")}
                    helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        getFacultyDepartmentsByFaculty?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </HorizentalTextFieldSelect>

                {
                    (termsLoading)
                    && <CircularProgress size={26}
                        thickness={8}
                        sx={{ color: "black" }} />
                }

                {/* الفصل الدراسي */}
                <HorizentalTextFieldSelect
                    t={t}
                    title={
                        isArabic ? "الفصل الدراسي" : "Academic Term"
                    } defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedAcademicTerm}
                    setValue={setSelectedAcademicTerm}

                    onBlur={(e) => {
                        // console.log('blur',selectedSemester);
                        if (selectedAcademicTerm != 0) formik.setFieldError("selectedAcademicTerm", undefined);

                    }}
                    error={formik.errors.selectedAcademicTerm && t("admissions.errors.required")}
                    helperText={formik.errors.selectedAcademicTerm && t("admissions.errors.required")}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        termsData?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </HorizentalTextFieldSelect>

                <SubmitButton loading={updating} t={t} />
            </Box>
        </Box>
    )
}
