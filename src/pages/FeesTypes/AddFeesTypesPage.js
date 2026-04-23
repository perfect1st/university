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
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { CREATE_NEW_FEES_TYPE } from "../../graphql/feeTypesQueries";
import logger from "../../utils/logger";

export default function AddFeesTypesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [CreateFeesType, {
        data,
        loading
    }] = useMutation(CREATE_NEW_FEES_TYPE, { fetchPolicy: "network-only" })

    const formik = useFormik({
        initialValues: {
            title_ar: "",
            title_en: "",
            inside_yemen_value: "",
            outside_yemen_value: ""
        },

        validationSchema: Yup.object({
            title_ar: Yup.string().required(t("admissions.errors.required")),
            title_en: Yup.string().required(t("admissions.errors.required")),
            inside_yemen_value: Yup.string().required(t("admissions.errors.required")),
            outside_yemen_value: Yup.string().required(t("admissions.errors.required")),
            // faculty_id: Yup.string().required(t("admissions.errors.required")),

        }),
        onSubmit: async (values) => {


            logger.log('xxxxxxxxxxxxxxxxxxxxxxx');
            const data = {
                title_ar: values?.title_ar,
                title_en: values.title_en,
                inside_yemen_value: values?.inside_yemen_value,
                outside_yemen_value: values?.outside_yemen_value

            };
            try {
                logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                logger.log(data);

                // return;
                const result = await CreateFeesType({
                    variables: {
                        input: data
                    }
                });

                logger.log('result', result);

                notify(t("success"), "success");

                navigate('/feesTypes');

            } catch (error) {
                logger.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "نوع رسوم" : "Fee Type";
    let translateText2 = isArabic ? "نوع الرسوم" : "Fee Type";



    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("Dashboard.feesTypes")}
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

                <VerticalTextField
                    type={"number"}
                    title={t("Dashboard.inside_yemen", { item: translateText2 })}
                    fieldID={"inside_yemen_value"}
                    fieldName={"inside_yemen_value"}
                    placeholder={t("Dashboard.inside_yemen", { item: translateText2 })}
                    value={formik.values.inside_yemen_value}
                    onChange={formik.handleChange}
                    error={formik.touched.inside_yemen_value && Boolean(formik.errors.inside_yemen_value)}
                    helperText={formik.touched.inside_yemen_value && formik.errors.inside_yemen_value}
                />

                <VerticalTextField
                    type={"number"}
                    title={t("Dashboard.outside_yemen", { item: translateText2 })}
                    fieldID={"outside_yemen_value"}
                    fieldName={"outside_yemen_value"}
                    placeholder={t("Dashboard.outside_yemen", { item: translateText2 })}
                    value={formik.values.outside_yemen_value}
                    onChange={formik.handleChange}
                    error={formik.touched.outside_yemen_value && Boolean(formik.errors.outside_yemen_value)}
                    helperText={formik.touched.outside_yemen_value && formik.errors.outside_yemen_value}
                />




                <SubmitButton loading={loading} t={t} />

            </Box>


        </Box>
    )
}
