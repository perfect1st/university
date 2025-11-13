import { useTheme } from '@emotion/react';
import { Box, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from "../../i18n/i18n";
import { useMutation } from '@apollo/client/react';
import { UPDATE_COUNTRY_BY_ID } from '../../graphql/countriesQueries';
import SubmitButton from '../../components/Utilities/SubmitButton';
import HorizentalTextField from '../../components/Utilities/HorizentalTextField';
import Header from '../../components/PageHeader/header';
import notify from '../../components/notify';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { UPDATE_FACULITY_BY_ID } from '../../graphql/facultyQuiries';

export default function FaculityDetailsPage() {
        const theme = useTheme();
        const { t } = useTranslation();
        const isArabic = i18n.language === "ar";
        const navigate = useNavigate();
        const isMobile = useMediaQuery(theme.breakpoints.down("md"));
        const location = useLocation();

        const[
          UpdateFaculty,
          {
            data,
            loading,
            error
          }
        ]=useMutation(UPDATE_FACULITY_BY_ID,{fetchPolicy:"network-only"});

         const formik = useFormik({
        initialValues: {
            title_ar: location?.state?.title_ar,
            title_en: location?.state?.title_en,
            study_years_count:location?.state?.study_years_count
            // flag: "",
        },

        validationSchema: Yup.object({
            title_ar: Yup.string().required(t("admissions.errors.required")),
            title_en: Yup.string().required(t("admissions.errors.required")),
            study_years_count :Yup.string()
  .required(t("admissions.errors.required"))
  .test("is-greater-than-zero", t("admissions.errors.mustBeGreaterThanZero"), 
    (value) => Number(value) > 0
  )


        }),
        onSubmit: async (values) => {
            console.log('xxxxxxxxxxxxxxxxxxxxxxx');
            const data = {
                title_ar: values?.title_ar,
                title_en: values.title_en,
                study_years_count:values?.study_years_count,
                required_dep:false
            };
            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);

                const result = await UpdateFaculty({
                    variables: {
                        id:location?.state?.id,
                        input: data
                    }
                });

                console.log('result', result);

                notify(t("success"), "success");

                navigate('/faculities');

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "كلية" : "Faculity";
    let translateText2 = isArabic ? "الكلية" : "Faculity";
  return (
     <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("faculties")}
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

            <Box component="form" onSubmit={formik.handleSubmit} fullWidth>

                <HorizentalTextField
                    title={t("form.name_ar", { item: translateText2 })}
                    fieldID={"title_ar"}
                    fieldName={"title_ar"}
                    placeholder={t("form.name_ar", { item: translateText2 })}
                    value={formik.values.title_ar}
                    onChange={formik.handleChange}
                    error={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
                    helperText={formik.touched.title_ar && formik.errors.title_ar}
                />

                <HorizentalTextField
                    title={t("form.name_en", { item: translateText2 })}
                    fieldID={"title_en"}
                    fieldName={"title_en"}
                    placeholder={t("form.name_en", { item: translateText2 })}
                    value={formik.values.title_en}
                    onChange={formik.handleChange}
                    error={formik.touched.title_en && Boolean(formik.errors.title_en)}
                    helperText={formik.touched.title_en && formik.errors.title_en}
                />

                <HorizentalTextField
                    title={t("Dashboard.yearsofstudy", { item: translateText2 })}
                    fieldID={"study_years_count"}
                    fieldName={"study_years_count"}
                    placeholder={t("Dashboard.yearsofstudy", { item: translateText2 })}
                    value={formik.values.study_years_count}
                    onChange={formik.handleChange}
                    error={formik.touched.study_years_count && Boolean(formik.errors.study_years_count)}
                    helperText={formik.touched.study_years_count && formik.errors.study_years_count}
                />

                <SubmitButton loading={loading} t={t} />

            </Box>


        </Box>
  )
}
