import { useLocation, useNavigate } from "react-router-dom"
import { CREATE_NEW_COUNTRY } from "../../graphql/countriesQueries"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { CREATE_FACULITY_DEPARTMENT, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import logger from "../../utils/logger";


export default function AddDepartmentPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selected, setSelected] = useState(0);
    const[selectError,setSelectError]=useState("");

    const [
        Faculties, {
            data: { faculties } = {},
            loading: faculitiesLoading
        }
    ] = useLazyQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

    const [
        CreateFacultyDepartment,
        {
            data,
            loading
        }
    ] = useMutation(CREATE_FACULITY_DEPARTMENT, { fetchPolicy: "network-only" });

    useEffect(() => {
        Faculties();
    }, []);

    logger.log("faculties", faculties);

    const formik = useFormik({
        initialValues: {
            title_ar: "",
            title_en: ""
            // faculty_id: ""
            // flag: "",
        },

        validationSchema: Yup.object({
            title_ar: Yup.string().required(t("admissions.errors.required")),
            title_en: Yup.string().required(t("admissions.errors.required")),
            // faculty_id: Yup.string().required(t("admissions.errors.required")),

        }),
        onSubmit: async (values) => {

            // ✅ التحقق اليدوي قبل الإرسال
            if (selected==0) {
                // logger.log('rrrrrrrrrrrrrrrrrrrrrrr');
                // formik.setFieldError("faculty_id", t("admissions.errors.required"));

                setSelectError(t("admissions.errors.required"));
                return; // وقف الإرسال لحد ما المستخدم يختار
            }
            logger.log('xxxxxxxxxxxxxxxxxxxxxxx');
            const data = {
                title_ar: values?.title_ar,
                title_en: values.title_en,
                faculty_id: selected

            };
            try {
                logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                logger.log(data);

                // return;
                const result = await CreateFacultyDepartment({
                    variables: {
                        input: data
                    }
                });

                logger.log('result', result);

                notify(t("success"), "success");

                navigate('/departments');

            } catch (error) {
                logger.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "قسم" : "Department";
    let translateText2 = isArabic ? "القسم" : "Department";

    if (faculitiesLoading) return <LoadingPage />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("departments")}
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

            <Box component="form" onSubmit={formik.handleSubmit} fullWidth>

                <VerticalTextField
                    title={t("form.name_ar", { item: translateText2 })}
                    fieldID={"title_ar"}
                    fieldName={"title_ar"}
                    placeholder={t("form.name_ar", { item: translateText2 })}
                    value={formik.values.title_ar}
                    onChange={formik.handleChange}
                    error={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
                    helperText={formik.touched.title_ar && formik.errors.title_ar}
                />

                <VerticalTextField
                    title={t("form.name_en", { item: translateText2 })}
                    fieldID={"title_en"}
                    fieldName={"title_en"}
                    placeholder={t("form.name_en", { item: translateText2 })}
                    value={formik.values.title_en}
                    onChange={formik.handleChange}
                    error={formik.touched.title_en && Boolean(formik.errors.title_en)}
                    helperText={formik.touched.title_en && formik.errors.title_en}
                />

                <VerticalTextFieldSelect
                    t={t}
                    title={'الكلية'} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selected}
                    setValue={setSelected}
                    error={selectError}
                    setError={setSelectError}
                    
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        faculties?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </VerticalTextFieldSelect>


                <SubmitButton loading={loading} t={t} />

            </Box>


        </Box>
    )
}
