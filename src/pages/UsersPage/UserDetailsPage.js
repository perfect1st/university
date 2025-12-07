import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client/react";
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
import { UPDATE_TRANSACTION_TYPE } from "../../graphql/transactionTypeQueries"
import { transactionTypesArr, userRules } from "../../constants";
import { UPDATE_USER_BY_ADMIN } from "../../graphql/userQueriesForAdmin";

export default function UserDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [selectedRule, setSelectedRule] = useState(location?.state?.role);

  const [UpdateUser, {
    loading: updating
  }] = useMutation(UPDATE_USER_BY_ADMIN, { fetchPolicy: "network-only" });

  const formik = useFormik({
    initialValues: {
      username: location?.state?.username,
      fullname: location?.state?.fullname,
      email: location?.state?.email,
      mobile: location?.state?.mobile,
      // password:""
    },

    validationSchema: Yup.object({
      selectedRule: selectedRule == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      username: Yup.string().required(t("admissions.errors.required")),
      fullname: Yup.string().required(t("admissions.errors.required")),
      email: Yup.string().email(t("admissions.errors.invalidEmail"))
        .required(t("admissions.errors.required")),
      mobile: Yup.string().required(t("admissions.errors.required"))

    }),
    onSubmit: async (values) => {

      console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      let data = {
        username: values?.username,
        fullname: values?.fullname,
        email: values?.email,
        mobile: values?.mobile,
        // password:values?.password
      };

      data.role = selectedRule;

      // if(selectedFile!=null) data.payment_document_file=selectedFile;

      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(data);

        // return;
        const result = await UpdateUser({
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

  let translateText = isArabic ? "مستخدم" : "User";
  let translateText2 = isArabic ? "المستخدم" : "User";


  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Users")}
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
          width: "100%"
        }}
      >

        <HorizentalTextField
          title={t("Dashboard.userName", { item: translateText2 })}
          fieldID={"username"}
          fieldName={"username"}
          placeholder={t("Dashboard.userName", { item: translateText2 })}
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <HorizentalTextField
          title={t("admissions.fullName", { item: translateText2 })}
          fieldID={"fullname"}
          fieldName={"fullname"}
          placeholder={t("admissions.fullName", { item: translateText2 })}
          value={formik.values.fullname}
          onChange={formik.handleChange}
          error={formik.touched.fullname && Boolean(formik.errors.fullname)}
          helperText={formik.touched.fullname && formik.errors.fullname}
        />

        <HorizentalTextField
          title={t("admissions.email", { item: translateText2 })}
          fieldID={"email"}
          fieldName={"email"}
          placeholder={t("admissions.email", { item: translateText2 })}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <HorizentalTextField
          title={t("Mobile", { item: translateText2 })}
          fieldID={"mobile"}
          fieldName={"mobile"}
          placeholder={t("Mobile", { item: translateText2 })}
          value={formik.values.mobile}
          onChange={formik.handleChange}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />

        <HorizentalTextField
          title={t("form.password", { item: translateText2 })}
          fieldID={"password"}
          fieldName={"password"}
          placeholder={t("form.password", { item: translateText2 })}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <HorizentalTextFieldSelect
          t={t}
          title={t("Dashboard.userType")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedRule}
          setValue={setSelectedRule}
          onBlur={(e) => {
            if (selectedRule != 0) formik.setFieldError("selectedRule", undefined);

          }}
          error={formik.errors.selectedRule && t("admissions.errors.required")}
          helperText={formik.errors.selectedRule && t("admissions.errors.required")}
        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            userRules?.map((el, i) => <MenuItem key={i} value={el}>{t(`Dashboard.${el}`)}</MenuItem>)
          }
        </HorizentalTextFieldSelect>




        <SubmitButton loading={updating} t={t} />

      </Box>
    </Box>
  )
}
