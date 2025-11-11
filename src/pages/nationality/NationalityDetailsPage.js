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
import { CREATE_NEW_NATIONALITY } from "../../graphql/nationalitiesQueries";
import { useMutation } from "@apollo/client/react";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from '@mui/icons-material/Create';

export default function NationalityDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  console.log("location", location);

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
      setSelectedFile(res?.data?.url);
      // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      console.log("error", error.message);
    }


  };

  console.log('selectedFile', selectedFile);

  const formik = useFormik({
    initialValues: {
      name_ar: location?.state?.name_ar,
      name_en: location?.state?.name_en,
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
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        const result = await createNationality({
          variables: {
            input: data
          }
        });

        console.log('result', result);

        notify(t("success"), "success");

        navigate('/nationality');

      } catch (error) {
        console.error("Error logging in:", error);
        notify(t("error"), "error");

      } finally {
        //  setIsLoading(false);
      }
    },
  });

  let translateText = isArabic ? "الجنسية" : "Nationality";

  // console.log("fileInputRef",fileInputRef);

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
      // onExcel={() => fetchAndExport("excel")}
      // onPdf={() => fetchAndExport("pdf")}
      // onPrinter={() => fetchAndExport("print")}
      />
      <Box component="form" onSubmit={formik.handleSubmit} fullWidth>


        <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4, alignItems: "center", backgroundColor: theme.palette.primary?.gray, gap: 3 ,p:1 }}>

          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {t("form.name_ar")}
          </Typography>

          <TextField
            id="name_ar"
            name="name_ar"
            placeholder={t("form.name_ar")}
            value={formik.values.name_ar}
            onChange={formik.handleChange}
            error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
            helperText={formik.touched.name_ar && formik.errors.name_ar}
            variant="outlined"
            InputProps={{
              disableUnderline: true, // يشيل الـ border

              endAdornment: (
                <InputAdornment position="start">
                  <CreateIcon color="action" />
                </InputAdornment>
              )
            }}
            sx={{
              backgroundColor: theme.palette.primary?.gray,
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" }, // يشيل الـ border
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4, alignItems: "center", backgroundColor: theme.palette.primary?.gray, gap: 3 ,p:1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {t("form.name_en")}
          </Typography>
            <TextField
            id="name_en"
            name="name_en"
            placeholder={t("form.name_en")}
            value={formik.values.name_en}
            onChange={formik.handleChange}
            error={formik.touched.name_en && Boolean(formik.errors.name_en)}
            helperText={formik.touched.name_en && formik.errors.name_en}
            variant="outlined"
            InputProps={{
              disableUnderline: true, // يشيل الـ border

              endAdornment: (
                <InputAdornment position="start">
                  <CreateIcon color="action" />
                </InputAdornment>
              )
            }}
            sx={{
              backgroundColor: theme.palette.primary?.gray,
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" }, // يشيل الـ border
              },
            }}
          />
        </Box>


        <Grid item xs={12} sx={{ my: 5 }}>
          <Typography variant="subtitle2">
            {t("admissions.addFile")}
          </Typography>

          <Box
            sx={{
              width: "100%",
              border: `2px dashed ${theme.palette.secondary.main}`,
              p: 2,
              mt: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              {/* {t("admissions.certificateDescription")} */}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                gap: 2,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
              // value={selectedFile}
              />
              <Button
                variant="contained"
                sx={{
                  background: theme.palette.secondary.main,
                  width: "150px",
                  gap: 1,
                }}
                endIcon={
                  <AddCircleOutlineIcon
                    sx={{
                      transform:
                        i18n.language === "ar"
                          ? "rotate(180deg)"
                          : "none",
                      transition: "transform 0.3s ease",
                    }}
                  />
                }
                onClick={handlePickFile}
              >
                {t("admissions.addFile")}
              </Button>
              <Typography
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                {selectedToShowFile ? selectedToShowFile : ""}
              </Typography>

            </Box>

            {progress > 0 && (
              <LinearProgress variant="determinate" value={progress} />
            )}

          </Box>
        </Grid>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 1, mb: 2, py: 1.5, display: "flex", gap: 0.5 }}
        >
          {/* {isLoading ? (
              <CircularProgress
                size={26}
                thickness={8}
                sx={{ color: "#fff" }}
              />
            ) : (
              t("form.loginButton")
            )} */}
          {
            loading ? <CircularProgress
              size={26}
              thickness={8}
              sx={{ color: "#fff" }}
            />
              :
              <>
                {t("form.save")} <SaveIcon sx={{}} />
              </>
          }

        </Button>

        {/* Forgot Password */}
        {/* <Link
            href="#"
            variant="body2"
            underline="hover"
            sx={{ display: 'block', textAlign: 'center' }}
          >
            {t('form.forgotPassword')}
          </Link> */}
      </Box>
    </Box>
  );
}
