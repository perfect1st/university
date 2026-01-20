import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, LinearProgress, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useRef, useState } from "react";
import { UPDATE_MATERIAL_BY_ID } from "../../graphql/materialQueries";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { FILTERED_USERS } from "../../graphql/userQueriesForAdmin";
import { baseURL } from "../../Api/apolloClient";
import axios from "axios";
import { useSelector } from "react-redux";

export default function MaterialDetailsPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const me=useSelector(state=>state.user.loggedUser);

    console.log('location', location?.state);
    //   const [selectedSemester, setSelectedSemester] = useState(0);
    const [selectedFaculity, setSelectedFaculity] = useState(() => location?.state?.faculty_id?.id);
    const [selectedDepartment, setSelectedDepartment] = useState(() => location?.state?.faculty_department_id?.id);
    const [selectedDoctor, setSelectedDoctor] = useState(() => location?.state?.doctor_id?.id || 0);

    // المكتبة الالكترونية
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
            setSelectedFile(res?.data?.url);

            formik.values.file = `${res?.data?.url}`;
            // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
        } catch (error) {
            notify(t("errorUplaod"), "error");
            console.log("error", error.message);
        }


    };

    // console.log('selectedFaculity',selectedFaculity,"selectedDepartment",selectedDepartment);

    // get all faculities
    const [
        Faculties, {
            data: { faculties } = {},
            loading: faculitiesLoading
        }
    ] = useLazyQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });


    // get departments in faculty
    const [
        GetFacultyDepartmentsByFaculty,
        {
            data: { getFacultyDepartmentsByFaculty } = {},
            loading: departmentsLoading,
            error: departmentsError,
        },
    ] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, {
        fetchPolicy: "network-only",
    });

    // get all doctors
    const [
        FilteredPagedUsers
        , {
            data: { filteredPagedUsers: {
                users
            } = {}
            } = {},
            loading: usersLoading
        }] = useLazyQuery(FILTERED_USERS, { fetchPolicy: "network-only" });

    useEffect(() => {
        Faculties();
        GetFacultyDepartmentsByFaculty({
            variables: {
                faculty_id: location?.state?.faculty_department_id?.faculty_id?.id
            },
        });
        FilteredPagedUsers({
            variables: {
                role: "doctor"
            }
        });
    }, []);

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
        link.href = `${baseURL}${input}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = input.split("/").pop();
        link.click();
        
        }
        catch(e){
            console.log("error",e.message);
        }
        
    };


    const [UpdateMaterial, {
        data,
        loading
    }] = useMutation(UPDATE_MATERIAL_BY_ID, { fetchPolicy: "network-only" });

    const formik = useFormik({
        initialValues: {
            title_ar: location?.state?.title_ar,
            title_en: location?.state?.title_en,
            fullmark_degree: location?.state?.fullmark_degree,
            success_degree: location?.state?.success_degree,
            material_hours: location?.state?.material_hours,
            file: location?.state?.file

        },

        validationSchema: Yup.object({
            title_ar: Yup.string().required(t("admissions.errors.required")),
            title_en: Yup.string().required(t("admissions.errors.required")),
            fullmark_degree: Yup.string().required(t("admissions.errors.required")),
            success_degree: Yup.string().required(t("admissions.errors.required")),
            material_hours: Yup.string().required(t("admissions.errors.required"))
                .test(
                    "greater-than-zero",
                    t("admissions.errors.required"),
                    (value) => Number(value) > 0
                ),
            selectedFaculity: selectedFaculity == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedDepartment: selectedDepartment == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedDoctor: selectedDoctor == 0 && Yup.string()
                .required(t("admissions.errors.required"))

        }),
        onSubmit: async (values) => {

            console.log("suuuubmit");

            // // ✅ التحقق اليدوي قبل الإرسال
            // selectedFaculity || selectedSemester || selectedDepartment
            // console.log('ppppppppppppp', values?.min_study_hours)


            // console.log('xxxxxxxxxxxxxxxxxxxxxxx');

            if (Number(values?.success_degree) > Number(values?.fullmark_degree)) {

                notify(t("Dashboard.greaterThanError", {
                    more: t("studentDashboard.fullmarkDegree"),
                    less: t("studentDashboard.successDegree")
                }), "error");

                return;
            }


            //  return;
            let data = {
                title_ar: values?.title_ar,
                title_en: values?.title_en,
                fullmark_degree: values?.fullmark_degree,
                faculty_department_id: selectedDepartment,
                doctor_id: selectedDoctor,
                success_degree: values?.success_degree,
                material_hours: values?.material_hours
            };

            if (selectedFile != null) data.file = selectedFile;


            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
                // console.log(data);
                // return;
                const result = await UpdateMaterial({
                    variables: {
                        id: location?.state?.id,
                        input: data
                    }
                });

                console.log('result', result);

                notify(t("success"), "success");

                navigate('/materials');

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "مادة" : "Subject";
    let translateText2 = isArabic ? "المادة" : "Subject";

    if (faculitiesLoading) return <LoadingPage />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
            <Header
                title={t("studentDashboard.subjects")}
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

            <Box component="form"
                onSubmit={
                    formik.handleSubmit
                }
                sx={{
                    width: "100%"
                }}
            >

                <HorizentalTextField
                    title={t("form.name_ar", { item: translateText2 })}
                    fieldID={"title_ar"}
                    fieldName={"title_ar"}
                    placeholder={t("form.name_ar", { item: translateText2 })}
                    value={formik.values.title_ar}
                    onChange={formik.handleChange}
                    error={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
                    helperText={formik.touched.title_ar && formik.errors.title_ar}
                    isDisabled={me?.role !== "admin"}
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
                     isDisabled={me?.role !== "admin"}
                />

                <HorizentalTextField
                    title={t("studentDashboard.fullmarkDegree", { item: translateText2 })}
                    type={"number"}
                    fieldID={"fullmark_degree"}
                    fieldName={"fullmark_degree"}
                    placeholder={t("studentDashboard.fullmarkDegree")}
                    value={formik.values.fullmark_degree}
                    onChange={formik.handleChange}
                    error={formik.touched.fullmark_degree && Boolean(formik.errors.fullmark_degree)}
                    helperText={formik.touched.fullmark_degree && formik.errors.fullmark_degree}
                     isDisabled={me?.role !== "admin"}
                />

                <HorizentalTextField
                    title={t("studentDashboard.successDegree", { item: translateText2 })}
                    type={"number"}
                    fieldID={"success_degree"}
                    fieldName={"success_degree"}
                    placeholder={t("studentDashboard.successDegree")}
                    value={formik.values.success_degree}
                    onChange={formik.handleChange}
                    error={formik.touched.success_degree && Boolean(formik.errors.success_degree)}
                    helperText={formik.touched.success_degree && formik.errors.success_degree}
                     isDisabled={me?.role !== "admin"}
                />

                <HorizentalTextField
                    title={t("studentDashboard.materialHours")}
                    type={"number"}
                    fieldID={"material_hours"}
                    fieldName={"material_hours"}
                    placeholder={t("studentDashboard.materialHours")}
                    value={formik.values.material_hours}
                    onChange={formik.handleChange}
                    error={formik.touched.material_hours && Boolean(formik.errors.material_hours)}
                    helperText={formik.touched.material_hours && formik.errors.material_hours}
                     isDisabled={me?.role !== "admin"}
                />


                {/* الكلية */}

                <HorizentalTextFieldSelect
                    t={t}
                    title={t("admissions.faculty")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedFaculity}
                    setValue={setSelectedFaculity}
                    onChange={async (e) => {
                        await GetFacultyDepartmentsByFaculty({
                            variables: {
                                faculty_id: e.target.value,
                            },
                        });
                        setSelectedDepartment(0);
                    }}

                    error={formik.errors.selectedFaculity && t("admissions.errors.required")}
                    helperText={formik.errors.selectedFaculity && t("admissions.errors.required")}
                    isDisabled={me?.role !== "admin"}
                // error={selectError}
                // setError={setSelectError}

                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        faculties?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </HorizentalTextFieldSelect>

                {
                    (departmentsLoading)
                    && <CircularProgress size={26}
                        thickness={8}
                        sx={{ color: "black" }} />
                }

                {/* القسم */}
                <HorizentalTextFieldSelect
                    t={t}
                    title={t("admissions.facultyDepartment")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedDepartment}
                    setValue={setSelectedDepartment}
                    error={formik.errors.selectedDepartment && t("admissions.errors.required")}
                    helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
                    isDisabled={me?.role !== "admin"}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        getFacultyDepartmentsByFaculty?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </HorizentalTextFieldSelect>

                {/* دكتور المادة */}
                <HorizentalTextFieldSelect
                    t={t}
                    title={t("doctorName")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedDoctor}
                    setValue={setSelectedDoctor}
                    error={formik.errors.selectedDoctor && t("admissions.errors.required")}
                    helperText={formik.errors.selectedDoctor && t("admissions.errors.required")}
                    onBlur={(e) => {

                        if (selectedDoctor != 0) formik.setFieldError("selectedDoctor", undefined);

                    }}
                    isDisabled={me?.role !== "admin"}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        users?.map(el => <MenuItem key={el?.id} value={el?.id}>{el?.fullname}</MenuItem>)
                    }
                </HorizentalTextFieldSelect>


                <HorizentalTextField
                    title={t("Dashboard.library")}
                    subTitle={t("admissions.addFile")}
                    fieldID={"file"}
                    fieldName={"file"}
                    placeholder={t("Dashboard.library")}
                    value={formik?.values?.file}
                    onChange={formik.handleChange}
                    handleChange={handleFileChange}
                    handleDownloadFile={() => handleDownloadFile(location?.state?.file)}
                    type={"file"}
                    isDisabled={me?.role !== "admin"}
                />

                {progress > 0 && (
                    <LinearProgress variant="determinate" value={progress} />
                )}

              {
                me?.role=="admin"&&<SubmitButton loading={loading} t={t} />
              }  



            </Box>
        </Box>
    )
}
