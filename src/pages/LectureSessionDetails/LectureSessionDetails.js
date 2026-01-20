import { useTheme } from "@emotion/react";
import { Box, CircularProgress, FormControlLabel, Grid, Switch, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import i18n from "../../i18n/i18n";
import { GET_LECTURE_SESSION_BY_ID, UPDATE_LECTURE_SESSION_BY_ID } from "../../graphql/LectureSessionQueries";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import axios from "axios";
import { baseURL } from "../../Api/apolloClient";
import UploadFileField from "../../components/Utilities/UploadFileField";

// import LoadingPage from "../../../components/LoadingComponent";
// import Header from "../../../components/PageHeader/header";
// import ScheduleTable from "../../../components/Utilities/ScheduleTableComponent";
// import ToDayTimeTableComponent from "../../../components/Utilities/ToDayTimeTableComponent";

export default function LectureSessionDetails() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const isArabic = i18n.language === "ar";

    // المرفقات start
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [showFiles, setShowFiles] = useState([]);
    const [progress, setProgress] = useState(0);

    const [switchStatus, setSwitchStatus] = useState(false);

    const handlePickFile = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFilesChange = async (e) => {

        const files = Array.from(e.target.files || []);
        setShowFiles(files.map(f => f.name)); // لو عايز تعرض الأسماء فقط

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file); // اسم key اللي السيرفر متوقعه
        });
        // formData.append("file", file);

        try {

            setProgress(0);

            const res = await axios.post(`${baseURL}/api/forms/multiple`, formData, {
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

            console.log("res", res?.data?.urls);
            let urlsToSend = res?.data?.urls?.map(el => `${baseURL}${el}`);

            console.log("urlsToSend", urlsToSend);

            setFiles(urlsToSend);
            //  setSelectedFile(`${baseURL}${res?.data?.url}`);
            // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
        } catch (error) {
            notify(t("errorUplaod"), "error");
            console.log("error", error.message);
        }

    }

    // نهاية المرفقات

    // videos start
    const fileInputRef2 = useRef(null);
    const [files2, setFiles2] = useState([]);
    const [showFiles2, setShowFiles2] = useState([]);
    const [progress2, setProgress2] = useState(0);

    const handlePickFile2 = () => {
        if (fileInputRef2.current) fileInputRef2.current.click();
    };
    const handleImagesChange = async (e) => {

        const files = Array.from(e.target.files || []);
        setShowFiles2(files.map(f => f.name)); // لو عايز تعرض الأسماء فقط

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
            let urlsToSend = res?.data?.urls?.map(el => `${baseURL}${el}`);

            console.log("urlsToSend", urlsToSend);

            setFiles2(urlsToSend);
            //  setSelectedFile(`${baseURL}${res?.data?.url}`);
            // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
        } catch (error) {
            notify(t("errorUplaod"), "error");
            console.log("error", error.message);
        }

    }
    // videos end

    const me = useSelector(state => state.user.loggedUser);

    const {
        data: { getLectureSessionById } = {},
        loading: getSessionLoading,
    } = useQuery(GET_LECTURE_SESSION_BY_ID, {
        variables: { id },
        fetchPolicy: "network-only",
    });

    const [
        UpdateLectureSession,
        {
            loading
        }
    ] = useMutation(UPDATE_LECTURE_SESSION_BY_ID, { fetchPolicy: "network-only" });

    useEffect(() => {
        if (getLectureSessionById?.id) {
            formik.setValues({
                notes: getLectureSessionById?.notes,
                session_task: getLectureSessionById?.session_task
            });
            // setSwitchStatus(getLectureSessionById?.status=="ended" ? true : false);
            // location?.state?.images_array?.map(el => el?.split(baseURL)[1])
        }
    }, [getLectureSessionById]);

    //  const handleOpenFile = (url) => window.open(url, "_blank");

    // const handleDownloadFile = (url) => {
    //     const link = document.createElement("a");
    //     link.href = url;

    //     console.log("url",url);

    //     link.download = url.split("/").pop();
    //     link.click();
    // };

    const handleDownloadFile = (input) => {
        try{
             // لو input array اعمل loop
        if (Array.isArray(input)) {
            input.forEach((url, index) => {
                setTimeout(() => {
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = url.split("/").pop();
                    link.click();
                }, index * 800); // عشان المتصفح ما يمنعش multi downloads
            });
            return;
        }

        // لو input رابط واحد فقط
        const link = document.createElement("a");
        link.href = input;
        link.download = input.split("/").pop();
        link.click();
        }
        catch(e){
            console.error("error",e.message);
        }
       
    };


    const formik = useFormik({
        initialValues: {
            // getLectureSessionById?.notes,
            // getLectureSessionById?.session_task,
            notes: "",
            session_task: "",
            attachments: ""
        },

        validationSchema: Yup.object({
            //   selectedOperationType: selectedOperationType == 0 && Yup.string()
            //     .required(t("admissions.errors.required"))
            //     .notOneOf(["0"], t("admissions.errors.required")),
            // title_ar: Yup.string().required(t("admissions.errors.required")),
            // title_en: Yup.string().required(t("admissions.errors.required"))

        }),
        onSubmit: async (values) => {

            console.log('xxxxxxxxxxxxxxxxxxxxxxx');
            let data = {
                // title_ar: values?.title_ar,
                // title_en: values?.title_en,
                notes: values?.notes,
                session_task: values?.session_task,
                // status: switchStatus
                // operation_type: selectedOperationType
            };

            if(switchStatus==true) data.status= "ended" ;

            if (files?.length > 0) data.attachments = files;
            // lecture_videos
            if (files2?.length > 0) data.lecture_videos = files2;

            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);

                // return;
                const result = await UpdateLectureSession({
                    variables: {
                        input: data,
                        id: getLectureSessionById?.id
                    }
                });

                console.log('result', result);

                notify(t("success"), "success");

                // navigate(location.pathname.split('/add')[0]);

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });


    console.log("getLectureSessionById", getLectureSessionById);

    console.log("iddddddddddddd", id);

    let translateText = isArabic ? "المحاضرة" : "Lecture";
    let translateText2 = isArabic ? "مادة جديدة" : "New Subject";

    if (getSessionLoading) return <LoadingPage />;
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
            <Header
                title={t("detailsItem", { item: translateText })}
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
                {/* الفيديوهات */}
                <UploadFileField
                    title={t("Dashboard.videos")}
                    subTitle={t("admissions.addFile")}
                    fileInputRef={fileInputRef2}
                    handleFileChange={handleImagesChange}
                    handlePickFile={handlePickFile2}
                    selectedToShowFile={showFiles2}
                    progress={progress2}
                    isMultiple={true}
                    hasDownloadBtn={true}
                    handleDownloadFile={() => handleDownloadFile(getLectureSessionById?.lecture_videos)}
                    showInput={me?.role == "student" ? false : true}
                />

                <VerticalTextField
                    isMultiline={true}
                    title={t("Dashboard.notes", { item: translateText2 })}
                    fieldID={"notes"}
                    fieldName={"notes"}
                    placeholder={t("Dashboard.notes", { item: translateText2 })}
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    error={formik.touched.notes && Boolean(formik.errors.notes)}
                    helperText={formik.touched.notes && formik.errors.notes}
                    isReadOnly={me?.role == "student" ? true : false}
                />

                <VerticalTextField
                    isMultiline={true}
                    title={t("Dashboard.session_task", { item: translateText2 })}
                    fieldID={"session_task"}
                    fieldName={"session_task"}
                    placeholder={t("Dashboard.session_task", { item: translateText2 })}
                    value={formik.values.session_task}
                    onChange={formik.handleChange}
                    error={formik.touched.session_task && Boolean(formik.errors.session_task)}
                    helperText={formik.touched.session_task && formik.errors.session_task}
                    isReadOnly={me?.role == "student" ? true : false}
                />

                {/* المرفقات */}
                <UploadFileField
                    title={t("Dashboard.attachments")}
                    subTitle={t("admissions.addFile")}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFilesChange}
                    handlePickFile={handlePickFile}
                    selectedToShowFile={showFiles}
                    progress={progress}
                    isMultiple={true}
                    hasDownloadBtn={true}
                    handleDownloadFile={() => handleDownloadFile(getLectureSessionById?.lecture_videos)}
                    showInput={me?.role == "student" ? false : true}
                />


                {
                    me?.role == "doctor" &&getLectureSessionById?.status!="ended" && <Box sx={{my:2}}>

                         <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                انهاء المحاضرة
                        </Typography>
                        <Switch
                        checked={switchStatus}
                        onChange={() => setSwitchStatus(!switchStatus)}
                        sx={{
                            width: 80,
                            height: 45,
                            padding: 0,
                            '& .MuiSwitch-switchBase': {
                                padding: 1,
                                '&.Mui-checked': {
                                    transform: 'translateX(38px)',
                                },
                            },
                            '& .MuiSwitch-thumb': {
                                width: 28,
                                height: 28,
                            },
                            '& .MuiSwitch-track': {
                                borderRadius: 20,
                            },
                        }}
                    />
                    </Box>
                }


                {
                    me?.role == "doctor" &&<SubmitButton loading={loading} t={t} />
                }

                
            </Box>
        </Box>
    )
}
