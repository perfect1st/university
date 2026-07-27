import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useState } from "react";
import { paymentMethodsArr, TrueOrFalseArr } from "../../constants";
import { GET_ALL_USERES_FOR_ADMIN } from "../../graphql/userQueriesForAdmin";
import axios from "axios";
import ConfirmModal from "../../components/Utilities/ConfirmModal";
import { baseURL } from "../../Api/apolloClient";
import UploadFileField from "../../components/Utilities/UploadFileField";
import { CREATE_WEBSITE_ARTICLE } from "../../graphql/articleQueries";
import { GET_WEBSITE_DEPARTMENTS_BY_ADMIN } from "../../graphql/departmentsQueries";
import { useSelector } from "react-redux";
import logger from "../../utils/logger";

export default function AddArticlePage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [CreateWebsiteArticle, {
    loading: creatingArticle
  }] = useMutation(CREATE_WEBSITE_ARTICLE, { fetchPolicy: "network-only" });

  const [
    WebsiteDepartments
    ,
    {
      data: { websiteDepartments } = {},
      loading: websiteDepartmentsLoading
    }
  ] = useLazyQuery(GET_WEBSITE_DEPARTMENTS_BY_ADMIN, { fetchPolicy: "network-only" });

   const me=useSelector(state=>state.user.loggedUser);
  useEffect(() => {
    WebsiteDepartments();
  }, []);

  logger.log("websiteDepartments", websiteDepartments);

  const [selectedDepartment, setSelectedDepartment] = useState(0);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const fileInputRef2 = useRef(null);
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState([]);
  const [progress2, setProgress2] = useState(0);
  // File handling
  const handlePickFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0] ?? null;


    logger.log("ppppppppppppppppppppppp", file);

    // fileInputRef.current=file?.name;

    setSelectedToShowFile(file?.name);

    const formData = new FormData();
    formData.append("file", file);

    try {

      setProgress(0);

      const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      logger.log("res", res?.data?.url);
      setSelectedFile(`${baseURL}${res?.data?.url}`);
      // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      logger.log("error", error.message);
    }


  };

  const handlePickFile2 = () => {
    if (fileInputRef2.current) fileInputRef2.current.click();
  };
  const handleImagesChange = async (e) => {

    const files = Array.from(e.target.files || []);
    setShowFiles(files.map(f => f.name)); // لو عايز تعرض الأسماء فقط

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // اسم key اللي السيرفر متوقعه
    });
    // formData.append("file", file);

    try {

      setProgress2(0);

      const res = await axios.post(`${baseURL}/api/forms/multiple`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress2(percent);
        },
      });

      logger.log("res", res?.data?.urls);
      let urlsToSend=res?.data?.urls?.map(el=>`${baseURL}${el}`);

      logger.log("urlsToSend",urlsToSend);

      setFiles(urlsToSend);
      //  setSelectedFile(`${baseURL}${res?.data?.url}`);
      // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      logger.log("error", error.message);
    }

  }




  const isSpecialDept = selectedDepartment === "6a4e08cf262780da7d29616e" || selectedDepartment === "6a4e1ac7262780da7d296338"|| selectedDepartment === "6a4e34d5262780da7d296a6e";
  const isThreeFieldsDept = selectedDepartment === "6a4e1ac7262780da7d296338";

  const formik = useFormik({
    initialValues: {
      title_ar: "",
      title_en: "",
      title_ar_main: "",
      title_ar_sub: "",
      title_en_main: "",
      title_en_sub: "",
      rate: "",
      desc_ar: "",
      desc_en: ""
      // notes: ""
    },

    validationSchema: Yup.object({
      selectedDepartment: selectedDepartment == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      ...(isSpecialDept ? {
        title_ar_main: Yup.string().required(t("admissions.errors.required")),
        title_ar_sub: Yup.string().required(t("admissions.errors.required")),
        title_en_main: Yup.string().required(t("admissions.errors.required")),
        title_en_sub: Yup.string().required(t("admissions.errors.required")),
        ...(isThreeFieldsDept ? {
          rate: Yup.string().required(t("admissions.errors.required"))
        } : {})
      } : {
        title_ar: Yup.string().required(t("admissions.errors.required")),
        title_en: Yup.string().required(t("admissions.errors.required"))
      })
    }),
    onSubmit: async (values) => {

      logger.log('xxxxxxxxxxxxxxxxxxxxxxx');
      let finalTitleAr = values.title_ar;
      let finalTitleEn = values.title_en;

      if (isSpecialDept) {
        if (isThreeFieldsDept) {
          finalTitleAr = `${values.title_ar_main}#$${values.title_ar_sub}#$${values.rate}`;
          finalTitleEn = `${values.title_en_main}#$${values.title_en_sub}#$${values.rate}`;
        } else {
          finalTitleAr = `${values.title_ar_main}#$${values.title_ar_sub}`;
          finalTitleEn = `${values.title_en_main}#$${values.title_en_sub}`;
        }
      }

      let data = {
        title_ar: finalTitleAr,
        title_en: finalTitleEn,
        desc_ar: values?.desc_ar,
        desc_en: values?.desc_en,
        website_department_id: selectedDepartment,
        article_date: String(Date.now()),
        users_id:me?.id
        // notes: values?.notes,
        // operation_type: selectedOperationType
      };

      if (selectedFile != null) data.main_image = selectedFile;

      if(files?.length>0) data.images_array=files;

      try {
        logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        logger.log(data);

        // return;
        const result = await CreateWebsiteArticle({
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

  let translateText = isArabic ? "مقالة" : "Article";
  let translateText2 = isArabic ? "مقالة" : "Article";

  if (websiteDepartmentsLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Dashboard.ArticleDepartment")}
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
      <Box
        onSubmit={formik.handleSubmit}
        // sx={{ width: isMobile ? "90%" : "100%" }}
        component="form">
        <VerticalTextFieldSelect
          t={t}
          title={t("Dashboard.Article")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedDepartment}
          setValue={setSelectedDepartment}
          onBlur={(e) => {
            logger.log('blur', selectedDepartment);
            if (selectedDepartment != 0) formik.setFieldError("selectedDepartment", undefined);

          }}
          error={formik.errors.selectedDepartment && t("admissions.errors.required")}
          helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            websiteDepartments?.map((el, i) => <MenuItem key={i} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
          }
        </VerticalTextFieldSelect>

        {isSpecialDept ? (
          <>
            <VerticalTextField
              title={isArabic ? "العنوان (عربي)" : "Title (Arabic)"}
              fieldID={"title_ar_main"}
              fieldName={"title_ar_main"}
              placeholder={isArabic ? "العنوان (عربي)" : "Title (Arabic)"}
              value={formik.values.title_ar_main}
              onChange={formik.handleChange}
              error={formik.touched.title_ar_main && Boolean(formik.errors.title_ar_main)}
              helperText={formik.touched.title_ar_main && formik.errors.title_ar_main}
            />
            <VerticalTextField
              title={isArabic ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}
              fieldID={"title_ar_sub"}
              fieldName={"title_ar_sub"}
              placeholder={isArabic ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}
              value={formik.values.title_ar_sub}
              onChange={formik.handleChange}
              error={formik.touched.title_ar_sub && Boolean(formik.errors.title_ar_sub)}
              helperText={formik.touched.title_ar_sub && formik.errors.title_ar_sub}
            />
            <VerticalTextField
              title={isArabic ? "العنوان (إنجليزي)" : "Title (English)"}
              fieldID={"title_en_main"}
              fieldName={"title_en_main"}
              placeholder={isArabic ? "العنوان (إنجليزي)" : "Title (English)"}
              value={formik.values.title_en_main}
              onChange={formik.handleChange}
              error={formik.touched.title_en_main && Boolean(formik.errors.title_en_main)}
              helperText={formik.touched.title_en_main && formik.errors.title_en_main}
            />
            <VerticalTextField
              title={isArabic ? "العنوان الفرعي (إنجليزي)" : "Subtitle (English)"}
              fieldID={"title_en_sub"}
              fieldName={"title_en_sub"}
              placeholder={isArabic ? "العنوان الفرعي (إنجليزي)" : "Subtitle (English)"}
              value={formik.values.title_en_sub}
              onChange={formik.handleChange}
              error={formik.touched.title_en_sub && Boolean(formik.errors.title_en_sub)}
              helperText={formik.touched.title_en_sub && formik.errors.title_en_sub}
            />
            {isThreeFieldsDept && (
              <VerticalTextField
                title={isArabic ? "التقييم" : "Rate"}
                fieldID={"rate"}
                fieldName={"rate"}
                placeholder={isArabic ? "التقييم" : "Rate"}
                value={formik.values.rate}
                onChange={formik.handleChange}
                error={formik.touched.rate && Boolean(formik.errors.rate)}
                helperText={formik.touched.rate && formik.errors.rate}
              />
            )}
          </>
        ) : (
          <>
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
          </>
        )}

        <VerticalTextField
          isMultiline={true}
          title={t("Dashboard.arDescription", { item: translateText2 })}
          fieldID={"desc_ar"}
          fieldName={"desc_ar"}
          placeholder={t("Dashboard.arDescription", { item: translateText2 })}
          value={formik.values.desc_ar}
          onChange={formik.handleChange}
          error={formik.touched.desc_ar && Boolean(formik.errors.desc_ar)}
          helperText={formik.touched.desc_ar && formik.errors.desc_ar}
        />

        <VerticalTextField
          isMultiline={true}
          title={t("Dashboard.enDescription", { item: translateText2 })}
          fieldID={"desc_en"}
          fieldName={"desc_en"}
          placeholder={t("Dashboard.enDescription", { item: translateText2 })}
          value={formik.values.desc_en}
          onChange={formik.handleChange}
          error={formik.touched.desc_en && Boolean(formik.errors.desc_en)}
          helperText={formik.touched.desc_en && formik.errors.desc_en}
        />

        <UploadFileField
          title={t("Dashboard.mainImage")}
          subTitle={t("admissions.addFile")}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handlePickFile={handlePickFile}
          selectedToShowFile={selectedToShowFile}
          progress={progress}
        />

        <UploadFileField
          title={t("Dashboard.images")}
          subTitle={t("admissions.addFile")}
          fileInputRef={fileInputRef2}
          handleFileChange={handleImagesChange}
          handlePickFile={handlePickFile2}
          selectedToShowFile={showFiles}
          progress={progress2}
          isMultiple={true}
        />

        <SubmitButton loading={creatingArticle} t={t} />
      </Box>
    </Box>
  )
}
