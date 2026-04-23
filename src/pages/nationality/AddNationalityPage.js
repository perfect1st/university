import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  LinearProgress,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../../components/PageHeader/header";
import i18n from "../../i18n/i18n";
import SaveIcon from '@mui/icons-material/Save';
import { useRef, useState } from "react";
import notify from "../../components/notify";
import { baseURL } from "../../Api/apolloClient";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import { CREATE_NEW_NATIONALITY } from "../../graphql/nationalitiesQueries";
import { useMutation } from "@apollo/client/react";
import VerticalTextField from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import UploadFileField from "../../components/Utilities/UploadFileField";
import logger from "../../utils/logger";



export default function AddNationalityPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [
    createNationality,
    {
      data,
      loading,
      error
    }
  ] = useMutation(
    CREATE_NEW_NATIONALITY,
    {
      fetchPolicy: "network-only"
    }
  );
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState(null);
  const [progress, setProgress] = useState(0);

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
      setSelectedFile(res?.data?.url);
      // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      logger.log("error", error.message);
    }


  };

  logger.log('selectedFile', selectedFile);

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
        flag: selectedFile
      };
      try {
        logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        logger.log(data);

        const result = await createNationality({
          variables: {
            input: data
          }
        });

        logger.log('result', result);

        notify(t("success"), "success");

        navigate('/nationality');

      } catch (error) {
        logger.error("Error logging in:", error);
        notify(t("error"), "error");

      } finally {
        //  setIsLoading(false);
      }
    },
  });

  let translateText = isArabic ? "الجنسية" : "Nationality";

  // logger.log("fileInputRef",fileInputRef);

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Nationalities")}
        subtitle={t("addItem", { item: translateText })}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={t("addItem", { item: translateText })}
        hasNavigate={true}
        // btn={t("addItem", { item: translateText })}
        // btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        //  onSubmit={addUserNavigate}
        isExcel={false}
        isPdf={false}
        isPrinter={false}
      />
      <Box component="form" onSubmit={formik.handleSubmit} fullWidth>


        <VerticalTextField
          title={t("form.name_ar", { item: translateText })}
          fieldID={"name_ar"}
          fieldName={"name_ar"}
          placeholder={t("form.name_ar", { item: translateText })}
          value={formik.values.name_ar}
          onChange={formik.handleChange}
          error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
          helperText={formik.touched.name_ar && formik.errors.name_ar}
        />

        <VerticalTextField
          title={t("form.name_en", { item: translateText })}
          fieldID={"name_en"}
          fieldName={"name_en"}
          placeholder={t("form.name_en", { item: translateText })}
          value={formik.values.name_en}
          onChange={formik.handleChange}
          error={formik.touched.name_en && Boolean(formik.errors.name_en)}
          helperText={formik.touched.name_en && formik.errors.name_en}
        />


      

        <UploadFileField
          title={t("admissions.addFile")}
          subTitle={t("admissions.addFile")}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handlePickFile={handlePickFile}
          selectedToShowFile={selectedToShowFile}
          progress={progress}
        />

        <SubmitButton loading={loading} t={t} />


      </Box>
    </Box>
  );
}
