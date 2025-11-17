import { useLocation, useNavigate } from "react-router-dom"
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
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { CREATE_ACADEMY_TERM } from "../../graphql/AcademyTerms";
import MaterialArrComponent from "./MaterialArrComponent";

export default function AddAcademyTermPage() {

  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [selectedSemester, setSelectedSemester] = useState(0);
  const [selectedFaculity, setSelectedFaculity] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(0);

  const [selectError, setSelectError] = useState("");

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

  const [
    CreateAcademyTerm,
    {
      data,
      loading: creatingAcademyTerm
    }
  ] = useMutation(CREATE_ACADEMY_TERM, { fetchPolicy: "network-only" });

  useEffect(() => {
    Faculties();
  }, []);

  console.log("getFacultyDepartmentsByFaculty", getFacultyDepartmentsByFaculty);
  // useEffect(()=>{
  //   if(selectedFaculity && selectedFaculity!=0){

  //   }
  // },[selectedFaculity]);

  const formik = useFormik({
    initialValues: {
      title_ar: "",
      title_en: "",
      current_year: "", // -> academic year
      study_year: "",   // -> study year
      //  term_number: "0",
      min_study_hours: "",
      max_study_hours: "",
      // faculty_id: ""
      // flag: "",
    },

  //   validationSchema: Yup.object({
  //     title_ar: Yup.string().required(t("admissions.errors.required")),
  //     title_en: Yup.string().required(t("admissions.errors.required")),
  //     current_year: Yup.string().required(t("admissions.errors.required")),
  //     study_year: Yup.string().required(t("admissions.errors.required")),
  //     term_number: Yup.string().required(t("admissions.errors.required")),
  //     min_study_hours: Yup.string().required(t("admissions.errors.required"))
  // .test(
  //   "greater-than-zero",
  //   t("admissions.errors.required"),
  //   (value) => Number(value) > 0
  // ),
  //     max_study_hours: Yup.string()
  // .required(t("admissions.errors.required"))
  // .test(
  //   "greater-than-zero",
  //   t("admissions.errors.required"),
  //   (value) => Number(value) > 0
  // ),
  //     selectedFaculity: Yup.string()
  //       .required(t("admissions.errors.required"))
  //       .notOneOf(["0"], t("admissions.errors.required")),
  //     selectedSemester: Yup.string()
  //       .required(t("admissions.errors.required"))
  //       .notOneOf(["0"], t("admissions.errors.required")),
  //     selectedDepartment: Yup.string()
  //       .required(t("admissions.errors.required"))
  //       .notOneOf(["0"], t("admissions.errors.required")),
  //     // faculty_id: Yup.string().required(t("admissions.errors.required")),

  //   }),
    onSubmit: async (values) => {

      console.log("suuuubmit");
     
      // // ✅ التحقق اليدوي قبل الإرسال
      // selectedFaculity || selectedSemester || selectedDepartment
      console.log('ppppppppppppp',values?.min_study_hours)
      if ( Number(values?.min_study_hours)  > Number(values?.max_study_hours) ) {
        console.log('rrrrrrrrrrrrrrrrrrrrrrr');
        
        notify(t("Dashboard.greaterThanError",{
          more:t("studentDashboard.maxAcademyHours"),
          less:t("studentDashboard.minAcademyHours")
        }),"error");
       
        return; // وقف الإرسال لحد ما المستخدم يختار
      }
      // console.log('xxxxxxxxxxxxxxxxxxxxxxx');

      //  return;
      const data = {
        title_ar: values?.title_ar,
        title_en: values?.title_en,
        term_number:selectedSemester,
        faculty_department_id:selectedDepartment,
        current_year:values?.current_year,
        study_year:values?.study_year,
        min_study_hours:values?.min_study_hours,
        max_study_hours:values?.max_study_hours
        // faculty_id: selected

      };
      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        // return;
        const result = await CreateAcademyTerm({
          variables: {
            input: data
          }
        });

        console.log('result', result);

        notify(t("success"), "success");

        navigate('/academyTerms');

      } catch (error) {
        console.error("Error logging in:", error);
        notify(t("error"), "error");

      } finally {
        //  setIsLoading(false);
      }
    },
  });


  const terms_optionsArr = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];
  let translateText = isArabic ? "فصل دراسي" : "AcademyTerm";
  let translateText2 = isArabic ? "الفصل الدراسي" : "AcademyTerm";

  console.log('formik.touched.selectedFaculity', formik.touched);
  if (faculitiesLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("admissions.departmentTerm")}
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

      <Box component="form" 
      onSubmit={(e)=>{
        e.preventDefault();
        // console.log('sssssssssssssss',e);
         formik.handleSubmit();
      }} 
      // sx={{
      //   width: "100%", [theme.breakpoints.down("sm")]: {
      //     width: "60%", // 👈 للموبايل
      //   },
      // }}
      >

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
          title={t("Dashboard.AcademicYear", { item: translateText2 })}
          fieldID={"current_year"}
          fieldName={"current_year"}
          placeholder={t("Dashboard.AcademicYear")}
          value={formik.values.current_year}
          onChange={formik.handleChange}
          error={formik.touched.current_year && Boolean(formik.errors.current_year)}
          helperText={formik.touched.current_year && formik.errors.current_year}
        />

        <VerticalTextField
          title={t("Dashboard.studyYear", { item: translateText2 })}
          fieldID={"study_year"}
          fieldName={"study_year"}
          placeholder={t("Dashboard.studyYear")}
          value={formik.values.study_year}
          onChange={formik.handleChange}
          error={formik.touched.study_year && Boolean(formik.errors.study_year)}
          helperText={formik.touched.study_year && formik.errors.study_year}
        />

        <VerticalTextField
          title={t("studentDashboard.minAcademyHours")}
          // type={"number"}
          fieldID={"min_study_hours"}
          fieldName={"min_study_hours"}
          placeholder={t("studentDashboard.minAcademyHours")}
          value={formik.values.min_study_hours}
          onChange={formik.handleChange}
          error={formik.touched.min_study_hours && Boolean(formik.errors.min_study_hours)}
          helperText={formik.touched.min_study_hours && formik.errors.min_study_hours}
        />

        <VerticalTextField
          title={t("studentDashboard.maxAcademyHours")}
          // type={"number"}
          fieldID={"max_study_hours"}
          fieldName={"max_study_hours"}
          placeholder={t("studentDashboard.maxAcademyHours")}
          value={formik.values.max_study_hours}
          onChange={formik.handleChange}
          error={formik.touched.max_study_hours && Boolean(formik.errors.max_study_hours)}
          helperText={formik.touched.max_study_hours && formik.errors.max_study_hours}
        />

        {/* الترم */}

        <VerticalTextFieldSelect
          t={t}
          title={t("Dashboard.semester")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedSemester}
           setValue={setSelectedSemester}
         // onChange={setSelectedSemester}
          // onBlur={formik.handleBlur}
          error={ formik.errors.selectedSemester && t("admissions.errors.required")}
          helperText={ formik.errors.selectedSemester && t("admissions.errors.required")}

        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            terms_optionsArr?.map(el => <MenuItem key={el?.id} value={el?.id}>{el?.value}</MenuItem>)
          }
        </VerticalTextFieldSelect>

        {/* الكلية */}

        <VerticalTextFieldSelect
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
          }}

          error={formik.errors.selectedFaculity && t("admissions.errors.required")}
          helperText={formik.errors.selectedFaculity && t("admissions.errors.required")}
        // error={selectError}
        // setError={setSelectError}

        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            faculties?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
          }
        </VerticalTextFieldSelect>

        {/* القسم */}
        <VerticalTextFieldSelect
          t={t}
          title={t("admissions.facultyDepartment")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedDepartment}
          setValue={setSelectedDepartment}
           error={formik.errors.selectedDepartment && t("admissions.errors.required")}
          helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            getFacultyDepartmentsByFaculty?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
          }
        </VerticalTextFieldSelect>

        <MaterialArrComponent />

        <SubmitButton loading={creatingAcademyTerm} t={t} />

        {
          (departmentsLoading)
          && <CircularProgress size={26}
            thickness={8}
            sx={{ color: "black" }} />
        }

      </Box>


    </Box>
  )
}
