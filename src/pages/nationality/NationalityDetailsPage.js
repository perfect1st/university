import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/PageHeader/header";
import i18n from "../../i18n/i18n";
import SaveIcon from '@mui/icons-material/Save';
import { useRef, useState } from "react";
import notify from "../../components/notify";
import { baseURL } from "../../Api/apolloClient";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import { CREATE_NEW_NATIONALITY, UPDATE_NATIONALITY_BY_ID } from "../../graphql/nationalitiesQueries";
import { useMutation } from "@apollo/client/react";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from '@mui/icons-material/Create';
import HorizentalTextField from "../../components/Utilities/HorizentalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";

export default function NationalityDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  console.log("location", location);

  const [
    UpdateNationality,
    {
      data,
      loading,
      error
    }
  ] = useMutation(
    UPDATE_NATIONALITY_BY_ID,
    {
      fetchPolicy: "network-only"
    }
  );
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState(null);
  const [progress, setProgress] = useState(0);



 

  // const handleChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     console.log("Selected file:", file);
  //   }
  // };

  console.log('selectedFile', selectedFile);

  const formik = useFormik({
    initialValues: {
      name_ar: location?.state?.name_ar,
      name_en: location?.state?.name_en,
      flag: location?.state?.flag,
    },

    validationSchema: Yup.object({
      name_ar: Yup.string().required(t("admissions.errors.required")),
      name_en: Yup.string().required(t("admissions.errors.required")),
    }),
    onSubmit: async (values) => {
      const data = {
        name_ar: values?.name_ar,
        name_en: values.name_en,
        flag: values?.flag
      };
      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        const result = await UpdateNationality(
          {
            variables: {
              id: location?.state?.id,
              input: data
            }
          });

        console.log('result', result);

        notify(t("success"), "success");

        setTimeout(() => navigate('/nationality'), 2000);

      } catch (error) {
        console.error("Error logging in:", error);
        notify(t("error"), "error");

      } finally {
        //  setIsLoading(false);
      }
    },
  });

   const handleFileChange = async (e) => {
    const file = e.target.files?.[0] ?? null;


    console.log("ppppppppppppppppppppppp", file);

    // fileInputRef.current=file?.name;

   // setSelectedToShowFile(file?.name);

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
      setSelectedFile(res?.data?.url);
      formik.values.flag=res?.data?.url;

      setTimeout(()=>setProgress(0),1000);

      // setBankTr=>setPransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      console.log("error", error.message);
    }


  };


    console.log('formik.values',formik.values);

  let translateText = isArabic ? "الجنسية" : "Nationality";

 

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Nationalities")}
        subtitle={t("detailsItem", { item: translateText })}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={t("detailsItem", { item: translateText })}
        hasNavigate={true}
        // btn={t("addItem", { item: translateText })}
        // btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        //  onSubmit={addUserNavigate}
        isExcel={false}
        isPdf={false}
        isPrinter={false}
      />
      <Box component="form" onSubmit={formik.handleSubmit} fullWidth>

        <HorizentalTextField
          title={t("form.name_ar", { item: translateText })}
          fieldID={"name_ar"}
          fieldName={"name_ar"}
          placeholder={t("form.name_ar", { item: translateText })}
          value={formik.values.name_ar}
          onChange={formik.handleChange}
          error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
          helperText={formik.touched.name_ar && formik.errors.name_ar}
        />


        <HorizentalTextField
          title={t("form.name_en" , { item: translateText })}
          fieldID={"name_en"}
          fieldName={"name_en"}
          placeholder={t("form.name_en" , { item: translateText })}
          value={formik.values.name_en}
          onChange={formik.handleChange}
          error={formik.touched.name_en && Boolean(formik.errors.name_en)}
          helperText={formik.touched.name_en && formik.errors.name_en}
        />

        <HorizentalTextField
          title={t("form.flag")}
          fieldID={"flag"}
          fieldName={"flag"}
          placeholder={t("form.flag")}
          value={formik.values.flag}
          onChange={formik.handleChange}
          handleChange={handleFileChange}
          type={"file"}
        />

        {progress > 0 && (
          <LinearProgress variant="determinate" value={progress} />
        )}

        <SubmitButton t={t} loading={loading} />

      </Box>
    </Box>
  );
}
