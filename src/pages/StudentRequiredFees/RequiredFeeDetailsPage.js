import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { useState } from "react";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { GET_ALL_USERES_FOR_ADMIN, GET_STUDENTS_BY_FACULTY_DEPARTMENT } from "../../graphql/userQueriesForAdmin";
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import { UPDATE_USER_REQUIRED_FEES, GET_USERS_REQUIRED_FEES_BY_ID } from "../../graphql/requiredFeesQueries";
import { GET_ALL_FACULITIES, GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID } from "../../graphql/facultyQuiries";
import { GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID } from "../../graphql/AcademyTerms";
import { useSelector } from "react-redux";
import LoadingPage from "../../components/LoadingComponent";
import { SearchByTypingSelect } from "../../components/Utilities/VerticalTextField";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import MaterialArrComponent from "../AcademyTerms/MaterialArrComponent";
import RequiredFeesTable from "./RequiredFeesTable";
import { useEffect } from "react";


export default function RequiredFeeDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();



  const [
    UpdateUsersRequiredFees,
    {
      loading: updating
    }
  ] = useMutation(UPDATE_USER_REQUIRED_FEES, { fetchPolicy: "network-only" });
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

  // get required fee details
  const {
      data: { getUsersRequiredFeesById: feeDetails } = {},
      loading: detailsLoading
  } = useQuery(GET_USERS_REQUIRED_FEES_BY_ID, {
      variables: { id: location?.state?.id },
      skip: !location?.state?.id,
      fetchPolicy: "network-only"
  });

  const me = useSelector(state => state.user.loggedUser);

  const [selectedFeeType, setSelectedFeeType] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAcademyTerm, setSelectedAcademyTerm] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (feeDetails) {
        setSelectedFeeType(feeDetails?.fees_types_ids?.map(el => el?.id) ?? []);
        setSelectedUser(feeDetails?.student_id?.id);
        setSelectedAcademyTerm(feeDetails?.academy_term_id?.id);
        setSelectedFaculty(feeDetails?.academy_term_id?.faculty_department_id?.faculty_id?.id);
        setSelectedDepartment(feeDetails?.academy_term_id?.faculty_department_id?.id);
        setRows(feeDetails?.fees_types_ids ?? []);

        if (feeDetails?.academy_term_id?.faculty_department_id?.faculty_id?.id) {
            GetDepartmentsByFaculty({ variables: { faculty_id: feeDetails?.academy_term_id?.faculty_department_id?.faculty_id?.id } });
        }
        if (feeDetails?.academy_term_id?.faculty_department_id?.id) {
            GetAcademyTermsByDept({ variables: { faculty_department_id: feeDetails?.academy_term_id?.faculty_department_id?.id } });
            GetStudentsByDept({ variables: { faculty_department_id: feeDetails?.academy_term_id?.faculty_department_id?.id } });
        }
    }
  }, [feeDetails]);

  const timestamp = Number(location?.state?.createdAt); // نتأكد إنه رقم
  const date = new Date(timestamp);

  let isInSideYemen = feeDetails?.student_id?.is_inside_yemen;

  const formik = useFormik({
   
    initialValues: {
      transaction_serial: feeDetails?.transactions_id?.transaction_serial ?? t("dataNotFound"),
      createDate: feeDetails?.createdAt ? formatDateToString(new Date(Number(feeDetails?.createdAt))) : ""
    },
    enableReinitialize: true,

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
        const result = await UpdateUsersRequiredFees({
          variables: {
            id: location?.state?.id,
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



  let translateText = isArabic ? "رسوم الطلاب" : "Student Required Fees";
  let translateText2 = isArabic ? "رسوم الطلاب" : "Student Required Fees";

  if (gettingFees || facultiesLoading || detailsLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>

      <Header
        title={t("Dashboard.requiredFees")}
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

        <HorizentalTextField
          title={t("Dashboard.createdAt", { item: translateText2 })}
          fieldID={"createDate"}
          fieldName={"createDate"}
          placeholder={t("Dashboard.createdAt", { item: translateText2 })}
          value={formik.values.createDate}
          isDisabled={true}
        />

        <HorizentalTextField
          title={t("fee.transactionSerial", { item: translateText2 })}
          fieldID={"transaction_serial"}
          fieldName={"transaction_serial"}
          placeholder={t("fee.transactionSerial", { item: translateText2 })}
          value={formik.values.transaction_serial}
          isDisabled={true}
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
          onChangeFn={(newIDS) => {
            console.log("newIDS", newIDS);
            let rows = [];
            rows = getFeesTypes?.filter(m => newIDS?.find(el => el == m?.id));
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

        <RequiredFeesTable rows={rows} setRows={setRows} isInSideYemen={isInSideYemen} />
        
        {/* <SubmitButton loading={updating} t={t} /> */}
      </Box>
    </Box>
  )
}
