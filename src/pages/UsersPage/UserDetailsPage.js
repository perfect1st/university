import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react"; // Added useQuery
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
import { SearchByTypingSelect } from "../../components/Utilities/VerticalTextField"; // Import your Search component
import { userRules } from "../../constants";
import { UPDATE_USER_BY_ADMIN } from "../../graphql/userQueriesForAdmin";
import { GET_GROUPS } from "../../graphql/groupQueries";

export default function UserDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location?.state;

  // Fetch Groups for the selection list
  const { data: groupsData } = useQuery(GET_GROUPS);

  const [selectedRule, setSelectedRule] = useState(userData?.role || 0);

  const [UpdateUser, { loading: updating }] = useMutation(UPDATE_USER_BY_ADMIN);

  const formik = useFormik({
    initialValues: {
      username: userData?.username || "",
      fullname: userData?.fullname || "",
      email: userData?.email || "",
      mobile: userData?.mobile || "",
      password: "",
      // Initialize groupIds from location state (assuming the API returns objects, we map to IDs)
      groupIds: userData?.groups?.map(g => g.id) || userData?.groupIds || [],
    },

    validationSchema: Yup.object({
      username: Yup.string().required(t("admissions.errors.required")),
      fullname: Yup.string().required(t("admissions.errors.required")),
      email: Yup.string().email(t("admissions.errors.invalidEmail")).required(t("admissions.errors.required")),
      mobile: Yup.string().required(t("admissions.errors.required")),
      groupIds: Yup.array().min(1, t("admissions.errors.required")), // Optional: require at least one group
    }),

    onSubmit: async (values) => {
      const input = {
        username: values.username,
        fullname: values.fullname,
        email: values.email,
        mobile: values.mobile,
        role: selectedRule,
        // تأكد أن القيم هنا IDs فقط (Strings) وليس Objects
        group_id: values.groupIds.map(id => (typeof id === 'object' ? id.id : id))
      };

if (values.password && values.password.trim() !== "") {
    input.password = values.password;
  }
      try {
        await UpdateUser({
          variables: {
            id: userData?.id,
            input: input
          }
        });

        notify(t("updatedSuccessfully"), "success");
        navigate(location.pathname.split('/details')[0]);
      } catch (error) {
        notify(error.message || t("error"), "error");
      }
    },
  });

  const userRulesWithOutStudent = userRules.filter(item => item !== "student");

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Users")}
        subtitle={t("detailsItem", { item: isArabic ? "مستخدم" : "User" })}
        i18n={i18n}
        hasNavigate={true}
      />

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>

        {/* Basic Fields */}
        <HorizentalTextField
          title={t("Dashboard.userName")}
          fieldName="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <HorizentalTextField
          title={t("admissions.fullName")}
          fieldName="fullname"
          value={formik.values.fullname}
          onChange={formik.handleChange}
          error={formik.touched.fullname && Boolean(formik.errors.fullname)}
          helperText={formik.touched.fullname && formik.errors.fullname}
        />

        <HorizentalTextField
          title={t("admissions.email")}
          fieldName="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {/* Group Multi-Select Integration */}
        <SearchByTypingSelect
          title={t("Groups")}
          options={groupsData?.groups || []}
          multiple={true}
          findKey="id"
          labelToShow={(opt) => (isArabic ? opt.name_ar : opt.name_en)}
          value={formik.values.groupIds}
          setValue={(val) => formik.setFieldValue("groupIds", val)}
          onBlur={() => formik.setFieldTouched("groupIds", true)}
          error={formik.touched.groupIds && formik.errors.groupIds}
        />

        <HorizentalTextFieldSelect
          t={t}
          title={t("Dashboard.userType")}
          value={selectedRule}
          setValue={setSelectedRule}
          backgroundColor={theme.palette.background.inputBackGround}
        >
          <MenuItem value={0}>{t("select")}</MenuItem>
          {userRulesWithOutStudent.map((el, i) => (
            <MenuItem key={i} value={el}>{t(`Dashboard.${el}`)}</MenuItem>
          ))}
        </HorizentalTextFieldSelect>

        <SubmitButton loading={updating} t={t} />
      </Box>
    </Box>
  );
}