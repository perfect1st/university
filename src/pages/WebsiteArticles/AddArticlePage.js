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

  console.log("websiteDepartments", websiteDepartments);

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


    console.log("ppppppppppppppppppppppp", file);

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

      console.log("res", res?.data?.url);
      setSelectedFile(`${baseURL}${res?.data?.url}`);
      // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      console.log("error", error.message);
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

      console.log("res", res?.data?.urls);
      let urlsToSend=res?.data?.urls?.map(el=>`${baseURL}${el}`);

      console.log("urlsToSend",urlsToSend);

      setFiles(urlsToSend);
      //  setSelectedFile(`${baseURL}${res?.data?.url}`);
      // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      console.log("error", error.message);
    }

  }




  const formik = useFormik({
    initialValues: {
      title_ar: "",
      title_en: "",
      desc_ar: "",
      desc_en: ""
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
        users_id:me?.id
        // notes: values?.notes,
        // operation_type: selectedOperationType
      };

      if (selectedFile != null) data.main_image = selectedFile;

      if(files?.length>0) data.images_array=files;

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        // return;
        const result = await CreateWebsiteArticle({
          variables: {
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

        <VerticalTextFieldSelect
          t={t}
          title={t("Dashboard.Article")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedDepartment}
          setValue={setSelectedDepartment}
          onBlur={(e) => {
            console.log('blur', selectedDepartment);
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
