import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useState } from "react";
import { CREATE_USER_REQUIRED_FEES } from "../../graphql/requiredFeesQueries";
import { GET_STUDENTS_BY_FACULTY_DEPARTMENT } from "../../graphql/userQueriesForAdmin";
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import { GET_ALL_FACULITIES, GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID } from "../../graphql/facultyQuiries";
import { GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID } from "../../graphql/AcademyTerms";
import { useSelector } from "react-redux";


export default function AddRequiredFeesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [
    CreateUsersRequiredFees,
    {
      loading: creating
    }
  ] = useMutation(CREATE_USER_REQUIRED_FEES, { fetchPolicy: "network-only" });

  // get students by department
  const [
    GetStudentsByDept,
    {
      data: { studentsByFacultyDepartment: rawStudents } = {},
      loading: studentsLoading
    }
  ] = useLazyQuery(GET_STUDENTS_BY_FACULTY_DEPARTMENT, { fetchPolicy: "network-only" });

  const students = rawStudents?.map(student => ({
    ...student,
    userId: student?.user_id?.id
  })) || [];

  // get fees ids
  const {
    data: { getFeesTypes } = {},
    loading: gettingFees
  } = useQuery(GET_ALL_FEES_TYPES, { fetchPolicy: "network-only" });

  // get academy terms
  // const {
  //   data: { getAcademyTerms } = {},
  //   loading: termsLoading
  // } = useQuery(GET_ALL_ACADEMY_TERMS, { fetchPolicy: "network-only" });

  // get all faculties
  const {
    data: { faculties } = {},
    loading: facultiesLoading
  } = useQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

  // get departments in faculty
  const [
    GetDepartmentsByFaculty,
    {
      data: { getFacultyDepartmentsByFaculty: departments } = {},
      loading: departmentsLoading
    }
  ] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, { fetchPolicy: "network-only" });

  // get academy terms by department
  const [
    GetAcademyTermsByDept,
    {
      data: { getAcademyTermsByFacultyDepartment: academyTerms } = {},
      loading: academyTermsLoading
    }
  ] = useLazyQuery(GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID, { fetchPolicy: "network-only" });
  console.log("academyTerms",academyTerms)

  const me = useSelector(state => state.user.loggedUser);

  const [selectedFeeType, setSelectedFeeType] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAcademyTerm, setSelectedAcademyTerm] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // console.log("users",users);



  const formik = useFormik({
    initialValues: {},

    validationSchema: Yup.object({
      selectedFeeType: selectedFeeType == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      selectedUser: selectedUser == null && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      selectedAcademyTerm: selectedAcademyTerm == null && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
    }),
    onSubmit: async (values) => {


      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      let data = {
        academy_term_id: selectedAcademyTerm,
        fees_types_ids: selectedFeeType,
        student_id: selectedUser,
        website_user_id: me?.id
        // amount: values?.amount,
      };

      // if(selectedFile!=null) data.payment_document_file=selectedFile;

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        // return;
        const result = await CreateUsersRequiredFees({
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

  console.log("getFeesTypes", getFeesTypes);

  let translateText = isArabic ? "رسوم الطلاب" : "Student Required Fees";
  let translateText2 = isArabic ? "رسوم الطلاب" : "Student Required Fees";
  if (gettingFees || facultiesLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Dashboard.requiredFees")}
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
        // sx={{ width: isMobile ? "90%" : "100%" }}
        component="form"

      >

        {/* Faculty selection */}
        <SearchByTypingSelect
          title={t("Dashboard.faculty")}
          labelToShow={(option) => {
            return isArabic ? option?.title_ar : option?.title_en;
          }}
          findKey={"id"}
          isArabic={isArabic}
          options={faculties ? faculties : []}
          value={selectedFaculty}
          setValue={(val) => {
            setSelectedFaculty(val);
            setSelectedDepartment(null);
            setSelectedAcademyTerm(null);
            if (val) GetDepartmentsByFaculty({ variables: { faculty_id: val } });
          }}
        />

        {/* Department selection */}
        <SearchByTypingSelect
          title={t("Dashboard.facultyDepartment")}
          labelToShow={(option) => {
            return isArabic ? option?.title_ar : option?.title_en;
          }}
          findKey={"id"}
          isArabic={isArabic}
          options={departments ? departments : []}
          value={selectedDepartment}
          setValue={(val) => {
            setSelectedDepartment(val);
            setSelectedAcademyTerm(null);
            if (val) {
                GetAcademyTermsByDept({ variables: { faculty_department_id: val } });
                GetStudentsByDept({ variables: { faculty_department_id: val } });
            }
          }}
          isDisabled={!selectedFaculty}
        />

        {/* Academy Term */}
        <SearchByTypingSelect
          title={t("Dashboard.academyTerm")}
          labelToShow={(option) => {
            return isArabic ? option?.title_ar : option?.title_en;
          }}
          findKey={"id"}
          isArabic={isArabic}
          options={academyTerms ? academyTerms : []}
          value={selectedAcademyTerm}
          setValue={setSelectedAcademyTerm}
          error={formik.errors.selectedAcademyTerm && t("admissions.errors.required")}
          onBlur={(e) => {
            if (selectedAcademyTerm != null) formik.setFieldError("selectedAcademyTerm", undefined);

          }}
          isDisabled={!selectedDepartment}
        />

        {/* المستخدم */}
        <SearchByTypingSelect
          title={t("Dashboard.user")}
          labelToShow={(option) => {
            return `${option?.first_name} ${option?.second_name} ${option?.third_name} ${option?.fourth_name} - ${option?.email}`
          }}
          findKey={"userId"}
          isArabic={isArabic}
          options={students}
          value={selectedUser}
          setValue={setSelectedUser}
          error={formik.errors.selectedUser && t("admissions.errors.required")}
          onBlur={(e) => {
            if (selectedUser != null) formik.setFieldError("selectedUser", undefined);

          }}
          isDisabled={!selectedDepartment}
        />

        {/*   getTransactionTypes
                                  نوع الرسوم
                                  labelToShow-> الل انت عاوزه يتكتب جوة كل option
                                   */}

        <SearchByTypingSelect
          multiple={true}
          title={t("Dashboard.feeType")}
          labelToShow={(option) => {
            return `${isArabic ? option?.title_ar : option?.title_en}- [${t("Dashboard.inside_yemen")} : ${option?.inside_yemen_value}] - [${t("Dashboard.outside_yemen")} : ${option?.outside_yemen_value}]`
          }}
          findKey={"id"}
          isArabic={isArabic}
          options={getFeesTypes ? getFeesTypes : []}
          value={selectedFeeType}
          setValue={setSelectedFeeType}
          error={formik.errors.selectedFeeType && t("admissions.errors.required")}
          onBlur={(e) => {
            // validation check
            if (selectedFeeType != 0) formik.setFieldError("selectedFeeType", undefined);

          }}
        />

        <SubmitButton loading={creating} t={t} />
      </Box>
    </Box>
  )
}
