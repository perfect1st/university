import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { useEffect, useState } from "react";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { GET_ONE_ACADEMY_TERM_BY_ID, UPDATE_ACADEMY_TERM_BY_ID } from "../../graphql/AcademyTerms";
import LoadingPage from "../../components/LoadingComponent";
import { useSelector } from "react-redux";
import { GET_MATERIALS_BY_DOCTOR, GET_STUDENT_BY_MATERIAL_ID } from "../../graphql/materialQueries";
import { UPDATE_EXAM_BY_ID } from "../../graphql/ExamsQueries";
import { examTypes, YES_OR_NO_ARR } from "../../constants";
import VerticalTextField from "../../components/Utilities/VerticalTextField";
import FormatHTMLDate from "../../components/Utilities/FormatHTMLDate";
import { UPDATE_STUDENT_DEGREE } from "../../graphql/studentDegreeQueries";

export default function StudentDegreesDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { id, studentDegreeId } = useParams();

  const location = useLocation();
  console.log("location", location.state);

  // const [selectedStudent, setSelectedStudent] = useState(() => location?.state?.student_id?.id);
  const [selectedExamAttendence, setSelectedExamAttendence] = useState(() => location?.state?.exam_attendance === true);

  // const {
  //   data: { studentsByMaterial = [] } = {},
  //   loading: studentsByMaterialLoading
  // } = useQuery(GET_STUDENT_BY_MATERIAL_ID, {
  //   variables: { material_id: location?.state?.material_id }
  // });

  const [
    UpdateStudentDegree,
    {
      loading: updatingStudentDegreeLoading
    }
  ] = useMutation(UPDATE_STUDENT_DEGREE, { fetchPolicy: "network-only" });

  const formik = useFormik({
    initialValues: {
      student_degree: location?.state?.student_degree,
      lecture_attendance: location?.state?.lecture_attendance,
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
    
      selectedExamAttendence: selectedExamAttendence == 0 && Yup.string()
        .required(t("admissions.errors.required")),
      //     .notOneOf(["0"], t("admissions.errors.required")),
      //   selectedUser: selectedUser == null && Yup.string()
      //     .required(t("admissions.errors.required"))
      //     .notOneOf(["0"], t("admissions.errors.required")),


    }),
    onSubmit: async (values) => {


      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      console.log("selectedExamAttendence", selectedExamAttendence);

      let data = {
        // student_id: selectedStudent,
        student_degree: values?.student_degree,
        lecture_attendance: values?.lecture_attendance,
        exam_attendance: selectedExamAttendence === "true",
        // material_id: location?.state?.material_id,
        // exam_id: id
        // student_id: selectedUser,
        // website_user_id: me?.id
        // amount: values?.amount,
      };

      console.log("data", data);
      //   return;

      // if(selectedFile!=null) data.payment_document_file=selectedFile;

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        // return;
        const result = await UpdateStudentDegree({
          variables: {
            input: data,
            id: studentDegreeId
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

   console.log("location?.state?.student_id", location?.state?.student_id?.fullname);

  let translateText = isArabic ? "درجة" : "Degree";
  // if (studentsByMaterialLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Dashboard.studentDegrees")}
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
        component="form"

      >

       

         <HorizentalTextField
          title={t("Dashboard.studentName")}
          fieldID={"student_id"}
          fieldName={"student_id"}
          placeholder={t("Dashboard.studentName")}
          value={location?.state?.student_id?.fullname}
          isDisabled={true}
        />

        <HorizentalTextField
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

        <HorizentalTextField
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

        <HorizentalTextFieldSelect
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
        </HorizentalTextFieldSelect>

       


        <SubmitButton loading={updatingStudentDegreeLoading} t={t} />
      </Box>
    </Box>
  )
}
