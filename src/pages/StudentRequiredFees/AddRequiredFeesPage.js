import { useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client/react";
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
import { GET_ALL_USERES_FOR_ADMIN } from "../../graphql/userQueriesForAdmin";
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
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

  const [selectedFeeType, setSelectedFeeType] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // console.log("users",users);

  let students = users?.filter(el => el?.role == "student");

  const formik = useFormik({
    initialValues: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
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
  if (usersLoading || gettingFees) return <LoadingPage />;
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
