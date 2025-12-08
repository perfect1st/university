import { useLocation, useNavigate, useParams } from "react-router-dom"
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
import { useEffect, useRef, useState } from "react";
import { CREATE_WEBSITE_DEPARTMENT_BY_ADMIN } from "../../graphql/departmentsQueries";
import { baseURL } from "../../Api/apolloClient";
import axios from "axios";
import UploadFileField from "../../components/Utilities/UploadFileField";


export default function AddWebsiteDepartmentPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const{id}=useParams();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState(null);
  const [progress, setProgress] = useState(0);

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

  const [
    CreateWebsiteDepartment,
    {
      loading: creating
    }
  ] = useMutation(CREATE_WEBSITE_DEPARTMENT_BY_ADMIN, { fetchPolicy: "network-only" });

  console.log("id",id);
  
  const formik = useFormik({
    initialValues: {
      title_ar: "",
      title_en: "",
      desc_ar: "",
      desc_en: ""
    },

    validationSchema: Yup.object({
      title_ar: Yup.string().required(t("admissions.errors.required")),
      title_en: Yup.string().required(t("admissions.errors.required"))

    }),
    onSubmit: async (values) => {

      console.log("suuuubmit");


      let data = {
        title_ar: values?.title_ar,
        title_en: values?.title_en,
        desc_ar: values?.desc_ar,
        desc_en: values?.desc_en,
        father_id:id
      };

      if (selectedFile != null) data.image = selectedFile;

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
        // console.log(data);

        //  return;
        const result = await CreateWebsiteDepartment({
          variables: {
            input: data
          }
        });

        console.log('result', result);

        notify(t("success"), "success");

       // navigate(`/website-departments/details/${id}`);
        navigate(location.pathname.split('/add')[0]);

      } catch (error) {
        console.error("Error logging in:", error);
        notify(t("error"), "error");

      } finally {
        //  setIsLoading(false);
      }
    },
  });

  let translateText = isArabic ? "عنوان فرعي" : "Sub Title";
  let translateText2 = isArabic ? "العنوان الفرعي" : "Sub Title";
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("Dashboard.subtitle")}
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
        sx={{ width: isMobile ? "90%" : "100%" }}
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

        <UploadFileField
          title={t("Dashboard.mainImage")}
          subTitle={t("admissions.addFile")}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handlePickFile={handlePickFile}
          selectedToShowFile={selectedToShowFile}
          progress={progress}
        />

        <SubmitButton loading={creating} t={t} />
      </Box>
    </Box>
  )
}
