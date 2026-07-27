import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, IconButton, LinearProgress, MenuItem, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useRef, useState } from "react";
import { CREATE_WEBSITE_DEPARTMENT_BY_ADMIN, UPDATE_WEBSITE_DEPARTMENT_BY_ID } from "../../graphql/departmentsQueries";
import { baseURL } from "../../Api/apolloClient";
import axios from "axios";
import UploadFileField from "../../components/Utilities/UploadFileField";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import logger from "../../utils/logger";


export default function SubTitleDetailsPage() {

    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const { id, DepID } = useParams();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedToShowFile, setSelectedToShowFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const isAccreditationDept = DepID === "6a4e3fc8262780da7d296e39";

    const parsedAr = (location?.state?.desc_ar || "").split("#$");
    const parsedEn = (location?.state?.desc_en || "").split("#$");
    const mainDescAr = isAccreditationDept ? (parsedAr[0] || "") : (location?.state?.desc_ar || "");
    const mainDescEn = isAccreditationDept ? (parsedEn[0] || "") : (location?.state?.desc_en || "");

    const initialPoints = isAccreditationDept
        ? parsedAr.slice(1).map((ar, i) => ({ ar: ar || "", en: parsedEn[i + 1] || "" }))
        : [];
    const [points, setPoints] = useState(initialPoints);

    const handlePointChange = (index, field, value) => {
        setPoints((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    };
    const handleAddPoint = () => setPoints((prev) => [...prev, { ar: "", en: "" }]);
    const handleRemovePoint = (index) => setPoints((prev) => prev.filter((_, i) => i !== index));

    logger.log("location",location?.state);
    const [
        UpdateWebsiteDepartment,
        {
            data,
           loading: updating
        }
    ] = useMutation(UPDATE_WEBSITE_DEPARTMENT_BY_ID, { fetchPolicy: "network-only" });

    logger.log("updating",updating);

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

      formik.values.image=`${res?.data?.url}`;

      // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      logger.log("error", error.message);
    }


  };

    const formik = useFormik({
        initialValues: {
            title_ar: location?.state?.title_ar,
            title_en: location?.state?.title_en,
            desc_ar: mainDescAr,
            desc_en: mainDescEn,
            image:location?.state?.image?.split(baseURL)[1]
        },

        validationSchema: Yup.object({
            title_ar: Yup.string().required(t("admissions.errors.required")),
            title_en: Yup.string().required(t("admissions.errors.required"))

        }),
        onSubmit: async (values) => {

            logger.log("suuuubmit");


            let finalDescAr = values?.desc_ar || "";
            let finalDescEn = values?.desc_en || "";

            if (isAccreditationDept && points.length > 0) {
                const arPts = points.map((p) => p.ar).filter((v) => v && v.trim());
                const enPts = points.map((p) => p.en).filter((v) => v && v.trim());
                if (arPts.length) finalDescAr = values?.desc_ar ? `${values.desc_ar}#$${arPts.join("#$")}` : arPts.join("#$");
                if (enPts.length) finalDescEn = values?.desc_en ? `${values.desc_en}#$${enPts.join("#$")}` : enPts.join("#$");
            }

            let data = {
                title_ar: values?.title_ar,
                title_en: values?.title_en,
                desc_ar: finalDescAr,
                desc_en: finalDescEn,
            };

            if (selectedFile != null) data.image = selectedFile;

            try {
                logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
                // logger.log(data);

                //  return;
                const result = await UpdateWebsiteDepartment({
                    variables: {
                        id: DepID,
                        input: data
                    }
                });

                logger.log('result', result);

                notify(t("success"), "success");

               
                navigate(location.pathname.split('/edit')[0]);

            } catch (error) {
                logger.error("Error logging in:", error);
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
             <Box component="form" onSubmit={formik.handleSubmit} sx={{
                width: isMobile ? "50%" : "100%"
            }}>
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

                <HorizentalTextField
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

                {isAccreditationDept && (
                    <Box sx={{ mb: 4, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                {isArabic ? "النقاط / الاعتمادات" : "Points / Accreditations"}
                            </Typography>
                            <IconButton color="primary" onClick={handleAddPoint} size="small" sx={{ border: `1px solid ${theme.palette.primary.main}` }}>
                                <AddIcon />
                            </IconButton>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                            {isArabic ? "تُضاف كل نقطة إلى الوصف عند الحفظ باستخدام الفاصل #$" : "Each point is appended to the description on save using the #$ delimiter"}
                        </Typography>

                        {points.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                                {isArabic ? "لا توجد نقاط بعد. اضغط + لإضافة نقطة." : "No points yet. Click + to add a point."}
                            </Typography>
                        )}

                        {points.map((point, index) => (
                            <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2, p: 1.5, backgroundColor: theme.palette.primary?.gray, borderRadius: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                                        {isArabic ? `نقطة ${index + 1}` : `Point ${index + 1}`}
                                    </Typography>
                                    <IconButton color="error" onClick={() => handleRemovePoint(index)} size="small">
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label={isArabic ? "النقطة (عربي)" : "Point (Arabic)"}
                                    value={point.ar}
                                    onChange={(e) => handlePointChange(index, "ar", e.target.value)}
                                    sx={{
                                        backgroundColor: "background.paper",
                                        "& .MuiOutlinedInput-root": { "& fieldset": { border: "none" } },
                                    }}
                                />
                                <TextField
                                    size="small"
                                    fullWidth
                                    label={isArabic ? "النقطة (إنجليزي)" : "Point (English)"}
                                    value={point.en}
                                    onChange={(e) => handlePointChange(index, "en", e.target.value)}
                                    sx={{
                                        backgroundColor: "background.paper",
                                        "& .MuiOutlinedInput-root": { "& fieldset": { border: "none" } },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                 <HorizentalTextField
                          title={t("Dashboard.mainImage")}
                          subTitle={t("admissions.addFile")}
                          fieldID={"image"}
                          fieldName={"image"}
                          placeholder={t("Dashboard.mainImage")}
                          value={formik?.values?.image}
                          onChange={formik.handleChange}
                          handleChange={handleFileChange}
                          type={"file"}
                        />
                
                         {progress > 0 && (
                                  <LinearProgress variant="determinate" value={progress} />
                                )}


                <SubmitButton loading={updating} t={t} />
            </Box>
        </Box>
    )
}
