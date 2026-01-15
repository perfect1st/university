import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
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
import { GET_MATERIALS_BY_DEPARTMENT_ID, GET_MATERIALS_BY_DOCTOR, GET_STUDENT_BY_MATERIAL_ID } from "../../graphql/materialQueries";
import { useSelector } from "react-redux";
import { ADD_NEW_EXAM } from "../../graphql/ExamsQueries";
import { examTypes, YES_OR_NO_ARR } from "../../constants";
import { CREATE_STUDENT_DEGREE } from "../../graphql/studentDegreeQueries";

export default function AddExamStudentDegreePage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const { id } = useParams();

    const [selectedStudent, setSelectedStudent] = useState(0);
    const [selectedExamAttendence, setSelectedExamAttendence] = useState(0);

    const {
        data: { studentsByMaterial = [] } = {},
        loading: studentsByMaterialLoading
    } = useQuery(GET_STUDENT_BY_MATERIAL_ID, {
        variables: { material_id: location?.state?.material_id }
    });

    const [
        CreateStudentDegree,
        {
            loading: createStudentDegreeLoading
        }
    ] = useMutation(CREATE_STUDENT_DEGREE, { fetchPolicy: "network-only" });

    const formik = useFormik({
        initialValues: {
            student_degree: "",
            lecture_attendance: "",
            // exam_attendance: "",
            // date_from: "",
            // date_to: "",
            // notes: "",
        },

        validationSchema: Yup.object({
            student_degree: Yup.string().required(t("admissions.errors.required")),
            lecture_attendance: Yup.string().required(t("admissions.errors.required")),
            // lecture_attendance_mark: Yup.string().required(t("admissions.errors.required")),
            // date_from: Yup.string().required(t("admissions.errors.required")),
            // date_to: Yup.string().required(t("admissions.errors.required")),
            selectedStudent: selectedStudent == 0 && Yup.string()
                .required(t("admissions.errors.required")),
            selectedExamAttendence: selectedExamAttendence == 0 && Yup.string()
                .required(t("admissions.errors.required")),
            //     .notOneOf(["0"], t("admissions.errors.required")),
            //   selectedUser: selectedUser == null && Yup.string()
            //     .required(t("admissions.errors.required"))
            //     .notOneOf(["0"], t("admissions.errors.required")),


        }),
        onSubmit: async (values) => {


            console.log('xxxxxxxxxxxxxxxxxxxxxxx');
            console.log("selectedExamAttendence",selectedExamAttendence);
          
            let data = {
                student_id: selectedStudent,
                student_degree: values?.student_degree,
                lecture_attendance: values?.lecture_attendance,
                exam_attendance:  selectedExamAttendence === "true",
                material_id:location?.state?.material_id,
                exam_id:id
                // student_id: selectedUser,
                // website_user_id: me?.id
                // amount: values?.amount,
            };

            console.log("data",data);
            //   return;

            // if(selectedFile!=null) data.payment_document_file=selectedFile;

            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);

                // return;
                const result = await CreateStudentDegree({
                    variables: {
                        input: data
                    }
                });

                console.log('result', result);

                notify(t("success"), "success");

                // navigate(location.pathname.split('/add')[0]);
                navigate(-1);

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    console.log("location", location.state);
    console.log("studentsByMaterial", studentsByMaterial);

    let translateText = isArabic ? "درجة" : "Degree";
    if (studentsByMaterialLoading) return <LoadingPage />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("Dashboard.studentDegrees")}
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

              



                <VerticalTextFieldSelect
                    t={t}
                    title={t("Dashboard.studentName")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedStudent}
                    setValue={setSelectedStudent}
                    onBlur={(e) => {
                        console.log('blur', selectedStudent);
                        if (selectedStudent != 0) formik.setFieldError("selectedStudent", undefined);

                    }}
                    error={formik.errors.selectedStudent && t("admissions.errors.required")}
                    helperText={formik.errors.selectedStudent && t("admissions.errors.required")}

                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        studentsByMaterial?.map(el => <MenuItem key={el?.user_id?.id} value={el?.user_id?.id}>
                            {el?.user_id?.fullname}
                        </MenuItem>)
                    }
                </VerticalTextFieldSelect>


                <VerticalTextField
                    type={"number"}
                    title={t("Dashboard.studentDegree")}
                    fieldID={"student_degree"}
                    fieldName={"student_degree"}
                    placeholder={t("Dashboard.studentDegree")}
                    value={formik.values.student_degree}
                    onChange={formik.handleChange}
                    error={formik.touched.student_degree && Boolean(formik.errors.student_degree)}
                    helperText={formik.touched.student_degree && formik.errors.student_degree}
                />

                <VerticalTextField
                    type={"number"}
                    title={t("Dashboard.lectureAttendence")}
                    fieldID={"lecture_attendance"}
                    fieldName={"lecture_attendance"}
                    placeholder={t("Dashboard.lectureAttendence")}
                    value={formik.values.lecture_attendance}
                    onChange={formik.handleChange}
                    error={formik.touched.lecture_attendance && Boolean(formik.errors.lecture_attendance)}
                    helperText={formik.touched.lecture_attendance && formik.errors.lecture_attendance}
                />

               


                <VerticalTextFieldSelect
                    t={t}
                    title={t("Dashboard.examAttendance")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedExamAttendence}
                    setValue={setSelectedExamAttendence}
                    onBlur={(e) => {
                        console.log('blur', selectedExamAttendence);
                        if (selectedExamAttendence != 0) formik.setFieldError("selectedExamAttendence", undefined);

                    }}
                    error={formik.errors.selectedExamAttendence && t("admissions.errors.required")}
                    helperText={formik.errors.selectedExamAttendence && t("admissions.errors.required")}

                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        YES_OR_NO_ARR?.map(el => <MenuItem key={el?.id} value={el?.id}>
                            {isArabic ? el?.labelAr : el?.labelEn}
                        </MenuItem>)
                    }
                </VerticalTextFieldSelect>

                <SubmitButton loading={createStudentDegreeLoading} t={t} />
            </Box>
        </Box>
    )
}
