import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { useEffect, useState } from "react";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { GET_WEBSITE_DEPARTMENTS_BY_ADMIN } from "../../graphql/departmentsQueries";
import { useSelector } from "react-redux";
import { UPDATE_WEBSITE_ARTICLE_BY_ID } from "../../graphql/articleQueries";

export default function ArticleDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [selectedDepartment, setSelectedDepartment] = useState(location?.state?.website_department_id);

  const [UpdateWebsiteArticle, { loading: updating }] = useMutation(UPDATE_WEBSITE_ARTICLE_BY_ID, { fetchPolicy: "network-only" });

  const [
    WebsiteDepartments
    ,
    {
      data: { websiteDepartments } = {},
      loading: websiteDepartmentsLoading
    }
  ] = useLazyQuery(GET_WEBSITE_DEPARTMENTS_BY_ADMIN, { fetchPolicy: "network-only" });



  const me = useSelector(state => state.user.loggedUser);

  useEffect(() => {
    WebsiteDepartments();
  }, []);

  const formik = useFormik({
    initialValues: {
      title_ar: location?.state?.title_ar,
      title_en: location?.state?.title_en,
      desc_ar: location?.state?.desc_ar,
      desc_en: location?.state?.desc_en
      // notes: ""
    },

    validationSchema: Yup.object({
      selectedDepartment: selectedDepartment == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      title_ar: Yup.string().required(t("admissions.errors.required")),
      title_en: Yup.string().required(t("admissions.errors.required"))

    }),
    onSubmit: async (values) => {

      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      let data = {
        title_ar: values?.title_ar,
        title_en: values?.title_en,
        desc_ar: values?.desc_ar,
        desc_en: values?.desc_en,
        website_department_id: selectedDepartment,
        article_date: String(Date.now()),
        users_id: me?.id
        // notes: values?.notes,
        // operation_type: selectedOperationType
      };

      // if (selectedFile != null) data.main_image = selectedFile;

      // if(files?.length>0) data.images_array=files;

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        // return;
        const result = await UpdateWebsiteArticle({
          variables: {
            id: location?.state?.id,
            input: data
          }
        });

        console.log('result', result);

        notify(t("success"), "success");

        navigate(location.pathname.split('/add')[0]);

      } catch (error) {
        console.error("Error logging in:", error);
        notify(t("error"), "error");

      } finally {
        //  setIsLoading(false);
      }
    },
  });

  console.log("location", location?.state);

  let translateText = isArabic ? "مقالة" : "Article";
  let translateText2 = isArabic ? "المقالة" : "Article";
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("Dashboard.ArticleDepartment")}
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
      </Box>

    </Box>
  )
}
