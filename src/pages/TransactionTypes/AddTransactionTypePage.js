import { CREATE_NEW_TRANSACTION_BY_ADMIN } from "../../graphql/transactionQueries"
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import { useEffect, useRef } from "react";
import { CREATE_TRANSACTION_TYPE, GET_ALL_TRANSACTION_TYPES } from "../../graphql/transactionTypeQueries";
import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
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
import { paymentMethodsArr, TrueOrFalseArr } from "../../constants";


export default function AddTransactionTypePage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [selectedOperationType, setSelectedOperationType] = useState(0);

  const [CreateTransactionType, {
    data,
    loading
  }] = useMutation(CREATE_TRANSACTION_TYPE, { fetchPolicy: "network-only" });

  const formik = useFormik({
    initialValues: {
      title_ar: "",
      title_en: "",
      notes: ""
    },

    validationSchema: Yup.object({
      selectedOperationType: selectedOperationType == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      title_ar: Yup.string().required(t("admissions.errors.required")),
      title_en: Yup.string().required(t("admissions.errors.required"))

    }),
    onSubmit: async (values) => {

      // ✅ التحقق اليدوي قبل الإرسال
      // if (selected==0) {
      //     // console.log('rrrrrrrrrrrrrrrrrrrrrrr');
      //     // formik.setFieldError("faculty_id", t("admissions.errors.required"));

      //     setSelectError(t("admissions.errors.required"));
      //     return; // وقف الإرسال لحد ما المستخدم يختار
      // }
      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      let data = {
        // payment_method_type: selectedPaymentMethod,
        // transaction_type_id: selectedTransactionType,
        // fees_type_ids: selectedFeeType,
        // user_id: selectedUser,
        // amount: values?.amount,
      };

      // if(selectedFile!=null) data.payment_document_file=selectedFile;

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        // return;
        const result = await CreateTransactionType({
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

  let translateText = isArabic ? "نوع معاملة مالية" : "Transaction Type";
  let translateText2 = isArabic ? "نوع المعاملة المالية" : "Transaction Type";

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Dashboard.transactionTypes")}
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
        component="form">
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

         <SubmitButton loading={loading} t={t} />
      </Box>
    </Box>
  )
}
