import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { CREATE_ACADEMY_TERM } from "../../graphql/AcademyTerms";
import { GET_MATERIALS_BY_DEPARTMENT_ID, GET_MATERIALS_BY_DOCTOR } from "../../graphql/materialQueries";
import { useSelector } from "react-redux";
import { ADD_NEW_EXAM } from "../../graphql/ExamsQueries";
import { examTypes } from "../../constants";
export default function AddExamPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selectedExamType, setSelectedExamType] = useState(0);
    const [selectedMaterial, setSelectedMaterial] = useState(0);

    const me = useSelector(state => state.user.loggedUser);
    // get doctors materials
    const [
        MaterialsByDoctor,
        {
            data: { materialsByDoctor = [] } = {},
            loading: loadingMaterialsByDoctor
        }
    ] = useLazyQuery(GET_MATERIALS_BY_DOCTOR, { fetchPolicy: "network-only" });

    // add new exam
    const [
        CreateExam,
        {
            loading: creatingExam
        }
    ] = useMutation(ADD_NEW_EXAM, { fetchPolicy: "network-only" });

    useEffect(() => {
        if (me?.id) {
            MaterialsByDoctor({ variables: { doctor_id: me?.id } });
        }
    }, [me]);

    const formik = useFormik({
        initialValues: {
            exam_name: "",
            full_mark_degree: "",
            lecture_attendance_mark: "",
            date_from: "",
            date_to: "",
            notes: "",
        },

        validationSchema: Yup.object({
            exam_name: Yup.string().required(t("admissions.errors.required")),
            full_mark_degree: Yup.string().required(t("admissions.errors.required")),
            lecture_attendance_mark: Yup.string().required(t("admissions.errors.required")),
            date_from: Yup.string().required(t("admissions.errors.required")),
            date_to: Yup.string().required(t("admissions.errors.required")),
            selectedExamType: selectedExamType == 0 && Yup.string()
                .required(t("admissions.errors.required")),
            selectedMaterial: selectedMaterial == 0 && Yup.string()
                .required(t("admissions.errors.required")),
            //     .notOneOf(["0"], t("admissions.errors.required")),
            //   selectedUser: selectedUser == null && Yup.string()
            //     .required(t("admissions.errors.required"))
            //     .notOneOf(["0"], t("admissions.errors.required")),


        }),
        onSubmit: async (values) => {


            console.log('xxxxxxxxxxxxxxxxxxxxxxx');
            let data = {
                exam_name: values?.exam_name,
                full_mark_degree: values?.full_mark_degree,
                lecture_attendance_mark: values?.lecture_attendance_mark,
                notes: values?.notes,
                date_from: values?.date_from,
                date_to: values?.date_to,
                material_id: selectedMaterial,
                exam_type: selectedExamType
                // fees_types_ids: selectedFeeType,
                // student_id: selectedUser,
                // website_user_id: me?.id
                // amount: values?.amount,
            };

            // if(selectedFile!=null) data.payment_document_file=selectedFile;

            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);

                // return;
                const result = await CreateExam({
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

    console.log("formik", formik.values);

    // material_id ??  ------ academy_term_id->(api) ?????

    console.log("materialsByDoctor", materialsByDoctor);

    let translateText = isArabic ? "امتحان" : "Exam";
    let translateText2 = isArabic ? "الامتحان" : "Exam";

    if (loadingMaterialsByDoctor) return <LoadingPage />

    // studentDashboard.chooseMaterial
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("Dashboard.exams")}
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
                component="form"

            >

                <VerticalTextField
                    title={t("profile.Name", { item: translateText2 })}
                    fieldID={"exam_name"}
                    fieldName={"exam_name"}
                    placeholder={t("profile.Name", { item: translateText2 })}
                    value={formik.values.exam_name}
                    onChange={formik.handleChange}
                    error={formik.touched.exam_name && Boolean(formik.errors.exam_name)}
                    helperText={formik.touched.exam_name && formik.errors.exam_name}
                />

                <VerticalTextField
                    type={"number"}
                    title={t("studentDashboard.fullmarkDegree", { item: translateText2 })}
                    fieldID={"full_mark_degree"}
                    fieldName={"full_mark_degree"}
                    placeholder={t("studentDashboard.fullmarkDegree", { item: translateText2 })}
                    value={formik.values.full_mark_degree}
                    onChange={formik.handleChange}
                    error={formik.touched.full_mark_degree && Boolean(formik.errors.full_mark_degree)}
                    helperText={formik.touched.full_mark_degree && formik.errors.full_mark_degree}
                />

                <VerticalTextField
                    type={"number"}
                    title={t("Dashboard.lectureAttendence", { item: translateText2 })}
                    fieldID={"lecture_attendance_mark"}
                    fieldName={"lecture_attendance_mark"}
                    placeholder={t("Dashboard.lectureAttendence", { item: translateText2 })}
                    value={formik.values.lecture_attendance_mark}
                    onChange={formik.handleChange}
                    error={formik.touched.lecture_attendance_mark && Boolean(formik.errors.lecture_attendance_mark)}
                    helperText={formik.touched.lecture_attendance_mark && formik.errors.lecture_attendance_mark}
                />

                <VerticalTextFieldSelect
                    t={t}
                    title={t("profile.Gender")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedExamType}
                    setValue={setSelectedExamType}
                    onBlur={(e) => {
                        console.log('blur', selectedExamType);
                        if (selectedExamType != 0) formik.setFieldError("selectedExamType", undefined);

                    }}
                    error={formik.errors.selectedSemester && t("admissions.errors.required")}
                    helperText={formik.errors.selectedSemester && t("admissions.errors.required")}

                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        examTypes?.map(el => <MenuItem key={el?.id} value={el?.id}>
                            {isArabic ? el?.labelAr : el?.labelEn}
                        </MenuItem>)
                    }
                </VerticalTextFieldSelect>


                <VerticalTextField
                    type="date"
                    title={t("from", { item: translateText2 })}
                    fieldID={"date_from"}
                    fieldName={"date_from"}
                    placeholder={t("from", { item: translateText2 })}
                    value={formik.values.date_from}
                    onChange={formik.handleChange}
                    error={formik.touched.date_from && Boolean(formik.errors.date_from)}
                    helperText={formik.touched.date_from && formik.errors.date_from}
                />

                <VerticalTextField
                    type="date"
                    title={t("to", { item: translateText2 })}
                    fieldID={"date_to"}
                    fieldName={"date_to"}
                    placeholder={t("to", { item: translateText2 })}
                    value={formik.values.date_to}
                    onChange={formik.handleChange}
                    error={formik.touched.date_to && Boolean(formik.errors.date_to)}
                    helperText={formik.touched.date_to && formik.errors.date_to}
                />

                {/* المادة */}
                <VerticalTextFieldSelect
                    t={t}
                    title={t("studentDashboard.chooseMaterial")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedMaterial}
                    setValue={setSelectedMaterial}
                    onBlur={(e) => {
                        console.log('blur', selectedMaterial);
                        if (selectedMaterial != 0) formik.setFieldError("selectedMaterial", undefined);

                    }}
                    error={formik.errors.selectedMaterial && t("admissions.errors.required")}
                    helperText={formik.errors.selectedMaterial && t("admissions.errors.required")}

                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        materialsByDoctor?.map(el => <MenuItem key={el?.id} value={el?.id}>
                            {isArabic ? el?.title_ar : el?.title_en}
                        </MenuItem>)
                    }
                </VerticalTextFieldSelect>

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
                />
                {/* <VerticalTextField
          isMultiline={true}
          title={t("Dashboard.arDescription", { item: translateText2 })}
          fieldID={"description_ar"}
          fieldName={"description_ar"}
          placeholder={t("Dashboard.arDescription", { item: translateText2 })}
          value={formik.values.description_ar}
          onChange={formik.handleChange}
          error={formik.touched.description_ar && Boolean(formik.errors.description_ar)}
          helperText={formik.touched.description_ar && formik.errors.description_ar}
        />

        <VerticalTextField
          isMultiline={true}
          title={t("Dashboard.enDescription", { item: translateText2 })}
          fieldID={"description_en"}
          fieldName={"description_en"}
          placeholder={t("Dashboard.enDescription", { item: translateText2 })}
          value={formik.values.description_en}
          onChange={formik.handleChange}
          error={formik.touched.description_en && Boolean(formik.errors.description_en)}
          helperText={formik.touched.description_en && formik.errors.description_en}
        /> */}




                <SubmitButton loading={creatingExam} t={t} />
            </Box>
        </Box>
    )
}
