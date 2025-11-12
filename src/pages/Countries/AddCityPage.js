import { useLocation, useNavigate, useParams } from "react-router-dom"
import { CREATE_NEW_CITY, CREATE_NEW_COUNTRY } from "../../graphql/countriesQueries"
import { useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";

export default function AddCityPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const{id}=useParams();

    console.log("id",id);
    
    const[CreateCity,{
        data,
        loading,
        error
    }]=useMutation(CREATE_NEW_CITY,{fetchPolicy:"network-only"});

     const formik = useFormik({
            initialValues: {
                name_ar: "",
                name_en: "",
                // flag: "",
            },
    
            validationSchema: Yup.object({
                name_ar: Yup.string().required(t("admissions.errors.required")),
                name_en: Yup.string().required(t("admissions.errors.required")),
            }),
            onSubmit: async (values) => {
                const data = {
                    name_ar: values?.name_ar,
                    name_en: values.name_en,
                    country_id:id
                };
                try {
                    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                    console.log(data);
    
                    const result = await CreateCity({
                        variables: {
                            input: data
                        }
                    });
    
                    console.log('result', result);
    
                    notify(t("success"), "success");
    
                    navigate(`/countries/cities/${id}`);
    
                } catch (error) {
                    console.error("Error logging in:", error);
                    notify(t("error"), "error");
    
                } finally {
                    //  setIsLoading(false);
                }
            },
        });

     let translateText = isArabic ? "مدينة" : "City";
    let translateText2 = isArabic ? "المدينة" : "City";

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
              <Header
                title={t("cities")}
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
                                    fieldID={"name_ar"}
                                    fieldName={"name_ar"}
                                    placeholder={t("form.name_ar", { item: translateText2 })}
                                    value={formik.values.name_ar}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
                                    helperText={formik.touched.name_ar && formik.errors.name_ar}
                                />
                
                                <VerticalTextField
                                    title={t("form.name_en", { item: translateText2 })}
                                    fieldID={"name_en"}
                                    fieldName={"name_en"}
                                    placeholder={t("form.name_en", { item: translateText2 })}
                                    value={formik.values.name_en}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name_en && Boolean(formik.errors.name_en)}
                                    helperText={formik.touched.name_en && formik.errors.name_en}
                                />
                
                                <SubmitButton loading={loading} t={t} />
            </Box>
        </Box>
    )
}
