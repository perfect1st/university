import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
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
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { GET_MATERIALS_BY_DEPARTMENT_ID } from "../../graphql/materialQueries";
import { SearchByTypingSelect } from "../../components/Utilities/VerticalTextField";
import MaterialArrComponent from "./MaterialArrComponent";

// GET_ONE_ACADEMY_TERM_BY_ID
export default function AcademyTermDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [selectedSemester, setSelectedSemester] = useState(() => location?.state?.term_number);
  const [selectedFaculity, setSelectedFaculity] = useState(() => location?.state?.faculty_id?.id);
  const [selectedDepartment, setSelectedDepartment] = useState(() => location?.state?.faculty_department_id?.id);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [pageLoaded, setPageLoaded] = useState(false);
  const [rows, setRows] = useState([]);

  console.log("location", location?.state);

  const terms_optionsArr = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];

  // get term by id
  const [GetAcademyTermById, {
    data: { getAcademyTermById } = {},
    loading: gettingTermLoading
  }] = useLazyQuery(GET_ONE_ACADEMY_TERM_BY_ID, { fetchPolicy: "network-only" });

  // update term
  const [UpdateAcademyTerm, {
    data,
    loading: updatingTerm
  }] = useMutation(UPDATE_ACADEMY_TERM_BY_ID, { fetchPolicy: "network-only" });

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

  // get materials in Department
  const [
    MaterialsByDepartment,
    {
      data: { materialsByDepartment } = {},
      loading: DepartmentMaterialsLoading

    }
  ] = useLazyQuery(GET_MATERIALS_BY_DEPARTMENT_ID, { fetchPolicy: "network-only" });

  useEffect(() => {

    GetAcademyTermById({
      variables: {
        id: location?.state?.id
      }
    });
    Faculties();
    GetFacultyDepartmentsByFaculty({
      variables: {
        faculty_id: location?.state?.faculty_id?.id
      },
    });
    MaterialsByDepartment({
      variables: {
        faculty_department_id: location?.state?.faculty_department_id?.id
      }
    });

  }, []);

  useEffect(() => {
    if (getAcademyTermById?.materials_array) {
      setRows(getAcademyTermById?.materials_array);
      let materialsIDS = getAcademyTermById?.materials_array?.map(el => el?.id);
      setSelectedMaterials(materialsIDS);
    }
  }, [getAcademyTermById]);

  console.log("getAcademyTermById", getAcademyTermById);
  console.log("getFacultyDepartmentsByFaculty", getFacultyDepartmentsByFaculty);

  const formik = useFormik({
    initialValues: {
      title_ar: location?.state?.title_ar,
      title_en: location?.state?.title_en,
      current_year: location?.state?.current_year, // -> academic year
      study_year: location?.state?.study_year,   // -> study year
      //  term_number: "0",
      min_study_hours: location?.state?.min_study_hours,
      max_study_hours: location?.state?.max_study_hours,
      // faculty_id: ""
      // flag: "",
    },

    validationSchema: Yup.object({
      title_ar: Yup.string().required(t("admissions.errors.required")),
      title_en: Yup.string().required(t("admissions.errors.required")),
      current_year: Yup.string().required(t("admissions.errors.required")),
      study_year: Yup.string().required(t("admissions.errors.required")),
      min_study_hours: Yup.string().required(t("admissions.errors.required"))
        .test(
          "greater-than-zero",
          t("admissions.errors.required"),
          (value) => Number(value) > 0
        ),
      max_study_hours: Yup.string()
        .required(t("admissions.errors.required"))
        .test(
          "greater-than-zero",
          t("admissions.errors.required"),
          (value) => Number(value) > 0
        ),
      selectedFaculity: selectedFaculity == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      selectedSemester: selectedSemester == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      selectedDepartment: selectedDepartment == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),

    }),
    onSubmit: async (values) => {

      console.log("suuuubmit");

      // // ✅ التحقق اليدوي قبل الإرسال
      // selectedFaculity || selectedSemester || selectedDepartment
      // console.log('ppppppppppppp', values?.min_study_hours)

      if (Number(values?.min_study_hours) > Number(values?.max_study_hours)) {
        console.log('rrrrrrrrrrrrrrrrrrrrrrr');

        notify(t("Dashboard.greaterThanError", {
          more: t("studentDashboard.maxAcademyHours"),
          less: t("studentDashboard.minAcademyHours")
        }), "error");

        return; // وقف الإرسال لحد ما المستخدم يختار
      }
      // console.log('xxxxxxxxxxxxxxxxxxxxxxx');

      let MaterialHours = 0;
      let hoursError = false;
      // let maxMaterialHours=0;

      if (rows?.length > 0) {
        MaterialHours = rows?.reduce(
          (sum, el) => sum + (el.material_hours || 0) + MaterialHours,
          0
        );

        // لازم مجموع المواد المختارة اكبر من اقل عدد ساعات ف الترم
        // واقل من اقصي عدد ساعات للترم

        if (Number(MaterialHours) < Number(values?.min_study_hours) || Number(MaterialHours) > Number(values?.max_study_hours)) {
          console.log("MaterialHours error", MaterialHours);
          hoursError = true;
        }
      }

      console.log("MaterialHours", MaterialHours);

      if (hoursError) {
        notify(t("Dashboard.termHoursError"), "error");
        return;
      }


      let data = {
        title_ar: values?.title_ar,
        title_en: values?.title_en,
        term_number: selectedSemester,
        faculty_department_id: selectedDepartment,
        current_year: values?.current_year,
        study_year: values?.study_year,
        min_study_hours: values?.min_study_hours,
        max_study_hours: values?.max_study_hours
      };

      if (selectedMaterials?.length > 0) data.materials_array = selectedMaterials;


      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
        // console.log(data);

        //  return;
        const result = await UpdateAcademyTerm({
          variables: {
            input: data
          }
        });

        console.log('result', result);

        notify(t("success"), "success");

        navigate(location.pathname.split('/details')[0]);

      } catch (error) {
        console.error("Error logging in:", error);
        notify(t("error"), "error");

      } finally {
        //  setIsLoading(false);
      }
    },
  });

  let translateText = isArabic ? "فصل دراسي" : "AcademyTerm";
  let translateText2 = isArabic ? "الفصل الدراسي" : "AcademyTerm";

  if (!pageLoaded && (gettingTermLoading || faculitiesLoading || departmentsLoading)) return <LoadingPage />
  //  if (isLoading) return <LoadingPage />
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("admissions.departmentTerm")}
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
          width: "100%", [theme.breakpoints.down("sm")]: {
            width: "60%", // 👈 للموبايل
          },
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
          title={t("Dashboard.AcademicYear", { item: translateText2 })}
          fieldID={"current_year"}
          fieldName={"current_year"}
          placeholder={t("Dashboard.AcademicYear")}
          value={formik.values.current_year}
          onChange={formik.handleChange}
          error={formik.touched.current_year && Boolean(formik.errors.current_year)}
          helperText={formik.touched.current_year && formik.errors.current_year}
        />

        <HorizentalTextField
          title={t("Dashboard.studyYear", { item: translateText2 })}
          fieldID={"study_year"}
          fieldName={"study_year"}
          placeholder={t("Dashboard.studyYear")}
          value={formik.values.study_year}
          onChange={formik.handleChange}
          error={formik.touched.study_year && Boolean(formik.errors.study_year)}
          helperText={formik.touched.study_year && formik.errors.study_year}
        />

        <HorizentalTextField
          title={t("studentDashboard.minAcademyHours")}
          type={"number"}
          fieldID={"min_study_hours"}
          fieldName={"min_study_hours"}
          placeholder={t("studentDashboard.minAcademyHours")}
          value={formik.values.min_study_hours}
          onChange={formik.handleChange}
          error={formik.touched.min_study_hours && Boolean(formik.errors.min_study_hours)}
          helperText={formik.touched.min_study_hours && formik.errors.min_study_hours}
        />

        <HorizentalTextField
          title={t("studentDashboard.maxAcademyHours")}
          type={"number"}
          fieldID={"max_study_hours"}
          fieldName={"max_study_hours"}
          placeholder={t("studentDashboard.maxAcademyHours")}
          value={formik.values.max_study_hours}
          onChange={formik.handleChange}
          error={formik.touched.max_study_hours && Boolean(formik.errors.max_study_hours)}
          helperText={formik.touched.max_study_hours && formik.errors.max_study_hours}
        />

        {/* الترم */}

        <HorizentalTextFieldSelect
          t={t}
          title={t("Dashboard.semester")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedSemester}
          setValue={setSelectedSemester}
          //  onChange={()=>selectedSemester !=0 &&formik.setFieldError("selectedSemester", undefined)}
          onBlur={(e) => {
            console.log('blur', selectedSemester);
            if (selectedSemester != 0) formik.setFieldError("selectedSemester", undefined);

          }}
          error={formik.errors.selectedSemester && t("admissions.errors.required")}
          helperText={formik.errors.selectedSemester && t("admissions.errors.required")}

        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            terms_optionsArr?.map(el => <MenuItem key={el?.id} value={el?.id}>{el?.value}</MenuItem>)
          }
        </HorizentalTextFieldSelect>

        {/* الكلية */}

        <HorizentalTextFieldSelect
          t={t}
          title={t("admissions.faculty")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedFaculity}
          setValue={setSelectedFaculity}
          onChange={async (e) => {
            setPageLoaded(() => true);
            await GetFacultyDepartmentsByFaculty({
              variables: {
                faculty_id: e.target.value,
              },
            });

            setSelectedDepartment(0);
            setSelectedMaterials([]);
            setRows([]);

          }}

          onBlur={(e) => {
            // console.log('blur',selectedSemester);
            if (selectedFaculity != 0) formik.setFieldError("selectedFaculity", undefined);

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
          onChange={async (e) => {
            setRows([]);
            
            await MaterialsByDepartment({
              variables: {
                faculty_department_id: e.target.value
              }
            });

             
          }}
          onBlur={(e) => {
            // console.log('blur',selectedSemester);
            if (selectedDepartment != 0) formik.setFieldError("selectedDepartment", undefined);

          }}
          error={formik.errors.selectedDepartment && t("admissions.errors.required")}
          helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            getFacultyDepartmentsByFaculty?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
          }
        </HorizentalTextFieldSelect>

        {
          (DepartmentMaterialsLoading)
          && <CircularProgress size={26}
            thickness={8}
            sx={{ color: "black" }} />
        }

        <SearchByTypingSelect
          multiple={true}
          title={t("studentDashboard.subjects")}
          labelToShow={(option) => {
            return `${isArabic ? option?.title_ar : option?.title_en}`
          }}
          findKey={"id"}
          isArabic={isArabic}
          options={materialsByDepartment ? materialsByDepartment : []}
          value={selectedMaterials}
          setValue={setSelectedMaterials}
          onChangeFn={(newIDS) => {
            console.log("newIDS", newIDS);
            let rows = [];
            rows = materialsByDepartment?.filter(m => newIDS?.find(el => el == m?.id));
            console.log("rows", rows);
            setRows(rows);
          }
          }
          // error={formik.errors.selectedFeeType && t("admissions.errors.required")}
          onBlur={(e) => {
            // console.log("selectedFeeType blur",selectedFeeType);
            // let totalAmount = 0;

            // materialsByDepartment?.map(fee => {
            //   let feeObj = selectedFeeType?.find(el => el == fee?.id);
            //   console.log("feeObj", feeObj);
            //   if (feeObj) {
            //     if (isInSideYemen == true) totalAmount += Number(fee?.inside_yemen_value)
            //     else totalAmount += Number(fee?.outside_yemen_value)
            //   }
            // });

            // console.log('total amount',totalAmount);

            // formik.values.amount = totalAmount;

            // validation check
            //  if (selectedFeeType != 0) formik.setFieldError("selectedFeeType", undefined);

          }}
        />

        <MaterialArrComponent rows={rows} setRows={setRows} />

        <SubmitButton loading={updatingTerm} t={t} />
      </Box>
    </Box>
  )
}
