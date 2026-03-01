import { useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client/react";
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
import { GET_ALL_USERES_FOR_ADMIN } from "../../graphql/userQueriesForAdmin";
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import { UPDATE_USER_REQUIRED_FEES } from "../../graphql/requiredFeesQueries";
import { useSelector } from "react-redux";
import LoadingPage from "../../components/LoadingComponent";
import { SearchByTypingSelect } from "../../components/Utilities/VerticalTextField";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import MaterialArrComponent from "../AcademyTerms/MaterialArrComponent";
import RequiredFeesTable from "./RequiredFeesTable";

export default function RequiredFeeDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  console.log("location", location?.state);

  const [
    UpdateUsersRequiredFees,
    {
      loading: updating
    }
  ] = useMutation(UPDATE_USER_REQUIRED_FEES, { fetchPolicy: "network-only" });
  // get all users
  const {
    data: { users } = {},
    loading: usersLoading
  } = useQuery(GET_ALL_USERES_FOR_ADMIN, { fetchPolicy: "network-only" });

  // get fees ids
  const {
    data: { getFeesTypes } = {},
    loading: gettingFees
  } = useQuery(GET_ALL_FEES_TYPES, { fetchPolicy: "network-only" });

  const me = useSelector(state => state.user.loggedUser);

  // let materialsIDS = getAcademyTermById?.materials_array?.map(el => el?.id);
  //  setSelectedMaterials(materialsIDS);

  const [selectedFeeType, setSelectedFeeType] = useState(() => location?.state?.fees_types_ids?.map(el => el?.id) ?? []);
  const [selectedUser, setSelectedUser] = useState(() => location?.state?.student_id?.id);
  const [rows, setRows] = useState(()=>location?.state?.fees_types_ids ?? []);

  const timestamp = Number(location?.state?.createdAt); // نتأكد إنه رقم
  const date = new Date(timestamp);

  let isInSideYemen=location?.state?.student_id?.is_inside_yemen;

  const formik = useFormik({
   
    initialValues: {
      title_ar: location?.state?.title_ar,
      title_en: location?.state?.title_en,
      description_ar: location?.state?.description_ar,
      description_en: location?.state?.description_en,
      transaction_serial:location?.state?.transactions_id?.transaction_serial ?? t("dataNotFound"),
      createDate: formatDateToString(date)
    },

    validationSchema: Yup.object({
      title_ar: Yup.string().required(t("admissions.errors.required")),
      title_en: Yup.string().required(t("admissions.errors.required")),
      selectedFeeType: selectedFeeType == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      selectedUser: selectedUser == null && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),


    }),
    onSubmit: async (values) => {


      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      let data = {
        title_ar: values?.title_ar,
        title_en: values?.title_en,
        description_ar: values?.description_ar,
        description_en: values?.description_en,
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


  let students = users?.filter(el => el?.role == "student");

  console.log("students", students);
  let translateText = isArabic ? "رسوم الطلاب" : "Student Required Fees";
  let translateText2 = isArabic ? "رسوم الطلاب" : "Student Required Fees";

  if (usersLoading || gettingFees) return <LoadingPage />;
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
          fieldID={"description_ar"}
          fieldName={"description_ar"}
          placeholder={t("Dashboard.arDescription", { item: translateText2 })}
          value={formik.values.description_ar}
          onChange={formik.handleChange}
          error={formik.touched.description_ar && Boolean(formik.errors.description_ar)}
          helperText={formik.touched.description_ar && formik.errors.description_ar}
        />

        <HorizentalTextField
          isMultiline={true}
          title={t("Dashboard.enDescription", { item: translateText2 })}
          fieldID={"description_en"}
          fieldName={"description_en"}
          placeholder={t("Dashboard.enDescription", { item: translateText2 })}
          value={formik.values.description_en}
          onChange={formik.handleChange}
          error={formik.touched.description_en && Boolean(formik.errors.description_en)}
          helperText={formik.touched.description_en && formik.errors.description_en}
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
            return `${option?.fullname} - ${option?.email}`
          }}
          findKey={"id"}
          isArabic={isArabic}
          options={students}
          value={selectedUser}
          setValue={setSelectedUser}
          error={formik.errors.selectedUser && t("admissions.errors.required")}
          onBlur={(e) => {
            if (selectedUser != null) formik.setFieldError("selectedUser", undefined);

          }}
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
        
        <SubmitButton loading={updating} t={t} />
      </Box>
    </Box>
  )
}
