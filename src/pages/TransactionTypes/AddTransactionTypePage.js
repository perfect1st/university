import { CREATE_TRANSACTION_TYPE } from "../../graphql/transactionTypeQueries";
import { useLocation, useNavigate } from "react-router-dom"
import {  useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, {  VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useState } from "react";
import {  transactionTypesArr } from "../../constants";


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

      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      let data = {
        title_ar: values?.title_ar,
        title_en: values?.title_en,
        notes: values?.notes,
        operation_type: selectedOperationType
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

  // console.log("selectedOperationType",selectedOperationType);

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

        {/* نوع المعاملة */}
        <VerticalTextFieldSelect
          t={t}
          title={t("Dashboard.transactionType")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedOperationType}
          setValue={setSelectedOperationType}
          onBlur={(e) => {
            if (selectedOperationType != 0) formik.setFieldError("selectedOperationType", undefined);

          }}
          error={formik.errors.selectedOperationType && t("admissions.errors.required")}
          helperText={formik.errors.selectedOperationType && t("admissions.errors.required")}
        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            transactionTypesArr?.map((el, i) => <MenuItem key={i} value={el}>{t(`fee.transactionType.${el}`)}</MenuItem>)
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

        <SubmitButton loading={loading} t={t} />
      </Box>
    </Box>
  )
}
