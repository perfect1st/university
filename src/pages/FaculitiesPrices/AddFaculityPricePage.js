import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { paymentMethodsArr, transactionTypesArr, TrueOrFalseArr } from "../../constants";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { CREATE_NEW_FACULTY_PRICE } from "../../graphql/faculityPricesQueries";
import logger from "../../utils/logger";


export default function AddFaculityPricePage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selectedFaculity, setSelectedFaculity] = useState(0);
    const [selectedDepartment, setSelectedDepartment] = useState(0);

    // create faculity price
    const [CreateFacultyPrice, {
        loading: createLoading
    }] = useMutation(CREATE_NEW_FACULTY_PRICE, { fetchPolicy: "network-only" })
    // get all faculities
    const [
        Faculties, {
            data: { faculties } = {},
            loading: faculitiesLoading
        }
    ] = useLazyQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

    useEffect(() => {
        Faculties();
    }, []);

    // get departments in faculty
    const [
        GetFacultyDepartmentsByFaculty,
        {
            data: { getFacultyDepartmentsByFaculty } = {},
            loading: departmentsLoading,
            error: departmentsError,
        },
    ] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, {
        fetchPolicy: "network-only",
    });

    const formik = useFormik({
        initialValues: {
            level_year: "",
            price_inside_yemen: "",
            price_outside_yemen: "",
        },

        validationSchema: Yup.object({
            price_outside_yemen: Yup.string().required(t("admissions.errors.required"))
                .test(
                    "greater-than-zero",
                    t("admissions.errors.required"),
                    (value) => Number(value) > 0
                ),
            price_inside_yemen: Yup.string().required(t("admissions.errors.required"))
                .test(
                    "greater-than-zero",
                    t("admissions.errors.required"),
                    (value) => Number(value) > 0
                ),
            level_year: Yup.string()
                .required(t("admissions.errors.required"))
                .test(
                    "greater-than-zero",
                    t("admissions.errors.required"),
                    (value) => Number(value) > 0
                ),
            selectedFaculity: selectedFaculity == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedDepartment: selectedDepartment == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),

        }),
        onSubmit: async (values) => {

            logger.log("suuuubmit");


            let data = {
                level_year: values?.level_year,
                price_inside_yemen: Number(values?.price_inside_yemen),
                price_outside_yemen:Number(values?.price_outside_yemen),
                faculty_department_id: selectedDepartment,
                faculty_id: selectedFaculity
            };



            try {
                logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
                // logger.log(data);

                //  return;
                const result = await CreateFacultyPrice({
                    variables: {
                        input: data
                    }
                });

                logger.log('result', result);

                notify(t("success"), "success");

                navigate(location.pathname.split('/add')[0]);

            } catch (error) {
                logger.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "رسوم الكلية" : "Faculity Price";
    let translateText2 = isArabic ? "رسوم الكلية" : "Faculity Price";

    if (faculitiesLoading) return <LoadingPage />;
    return (
        <Box sx={{p: { xs: 2, md: 3 },backgroundColor: "background.paper", maxWidth: "100%" }}>
            <Header
                title={t("Dashboard.facultyPrices")}
                subtitle={t("addItem", { item: translateText })}
                i18n={i18n}
                haveBtn={false}
                hasAddOrEditBtn={true}
                sub2={t("addItem", { item: translateText })}
                hasNavigate={true}
                isExcel={false}
                isPdf={false}
                isPrinter={false}
            />
            <Box component="form"
                onSubmit={
                    formik.handleSubmit
                }
            >

                {/* الكلية */}
                <VerticalTextFieldSelect
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
                        // logger.log('blur',selectedSemester);
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
                </VerticalTextFieldSelect>

                {
                    (departmentsLoading)
                    && <CircularProgress size={26}
                        thickness={8}
                        sx={{ color: "black" }} />
                }

                {/* القسم */}

                <VerticalTextFieldSelect
                    t={t}
                    title={t("admissions.facultyDepartment")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedDepartment}
                    setValue={setSelectedDepartment}
                    //   onChange={async (e) => {

                    //     await MaterialsByDepartment({
                    //       variables: {
                    //         faculty_department_id: e.target.value
                    //       }
                    //     });
                    //   }}
                    onBlur={(e) => {
                        // logger.log('blur',selectedSemester);
                        if (selectedDepartment != 0) formik.setFieldError("selectedDepartment", undefined);

                    }}
                    error={formik.errors.selectedDepartment && t("admissions.errors.required")}
                    helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        getFacultyDepartmentsByFaculty?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </VerticalTextFieldSelect>

                <VerticalTextField
                    title={t("Dashboard.studyYear", { item: translateText2 })}
                    type={"number"}
                    fieldID={"level_year"}
                    fieldName={"level_year"}
                    placeholder={t("Dashboard.studyYear")}
                    value={formik.values.level_year}
                    onChange={formik.handleChange}
                    error={formik.touched.level_year && Boolean(formik.errors.level_year)}
                    helperText={formik.touched.level_year && formik.errors.level_year}
                />

                <VerticalTextField
                    type={"number"}
                    title={t("Dashboard.inside_yemen", { item: translateText2 })}
                    fieldID={"price_inside_yemen"}
                    fieldName={"price_inside_yemen"}
                    placeholder={t("Dashboard.inside_yemen", { item: translateText2 })}
                    value={formik.values.price_inside_yemen}
                    onChange={formik.handleChange}
                    error={formik.touched.price_inside_yemen && Boolean(formik.errors.price_inside_yemen)}
                    helperText={formik.touched.price_inside_yemen && formik.errors.price_inside_yemen}
                />

                <VerticalTextField
                    type={"number"}
                    title={t("Dashboard.outside_yemen", { item: translateText2 })}
                    fieldID={"price_outside_yemen"}
                    fieldName={"price_outside_yemen"}
                    placeholder={t("Dashboard.outside_yemen", { item: translateText2 })}
                    value={formik.values.price_outside_yemen}
                    onChange={formik.handleChange}
                    error={formik.touched.price_outside_yemen && Boolean(formik.errors.price_outside_yemen)}
                    helperText={formik.touched.price_outside_yemen && formik.errors.price_outside_yemen}
                />




                <SubmitButton loading={createLoading} t={t} />
            </Box>
        </Box>
    )
}
