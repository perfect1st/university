import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import UniversityCard from "../../components/UniversityCard";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UploadFileField from "../../components/Utilities/UploadFileField";
import { baseURL } from "../../Api/apolloClient";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { SearchByTypingSelect2 } from "../../components/Utilities/VerticalTextField"; // Import your Search component
import { userRules } from "../../constants";
import { UPDATE_USER_BY_ADMIN } from "../../graphql/userQueriesForAdmin";
import { GET_GROUPS } from "../../graphql/groupQueries";
import logger from "../../utils/logger";
import GraduationCertificate from "../../components/Certificates/GraduationCertificate";

export default function UserDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location?.state;
  logger.log("location", location);

  // Fetch Groups for the selection list
  const { data: groupsData } = useQuery(GET_GROUPS);

  const [selectedRule, setSelectedRule] = useState(userData?.role || 0);

  const [UpdateUser, { loading: updating }] = useMutation(UPDATE_USER_BY_ADMIN);

  const fileInputRef = useRef(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState(userData?.profile_image || null);
  const [progress, setProgress] = useState(0);

  const [
    GetRegisterFormByUserId,
    {
      data: regData,
      loading: regLoading,
    },
  ] = useLazyQuery(GET_REGISTERATION_FORM_BY_USER_ID, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (userData?.id && userData?.role === "student") {
      GetRegisterFormByUserId({ variables: { user_id: userData.id } });
    }
  }, [userData]);

  const formik = useFormik({
    initialValues: {
      username: userData?.username || "",
      fullname: userData?.fullname || "",
      email: userData?.email || "",
      mobile: userData?.mobile || "",
      password: "",
      profile_image: userData?.profile_image || "",
      // Initialize groupIds from location state (assuming the API returns objects, we map to IDs)
      groupIds: userData?.groups?.map((g) => g.id) || userData?.groupIds || [],
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
        profile_image: values.profile_image,
        // تأكد أن القيم هنا IDs فقط (Strings) وليس Objects
        groups: values.groupIds.map((id) => (typeof id === "object" ? id.id : id)),
      };

      if (values.password && values.password.trim() !== "") {
        input.password = values.password;
      }
      try {
        await UpdateUser({
          variables: {
            id: userData?.id,
            input: input,
          },
        });

        notify(t("updatedSuccessfully"), "success");
        navigate(location.pathname.split("/details")[0]);
      } catch (error) {
        notify(error.message || t("error"), "error");
      }
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedToShowFile(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(1);
      const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });
      formik.setFieldValue("profile_image", res?.data?.url);
      notify(t("fileUploaded"), "success");
    } catch (error) {
      notify(t("errorUplaod"), "error");
    } finally {
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const userRulesWithOutStudent = userRules;

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

        <Box sx={{ my: 2 }}>
          <UploadFileField
            title={t("profile.profile_image", "Profile Image")}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handlePickFile={() => fileInputRef.current.click()}
            selectedToShowFile={selectedToShowFile}
            progress={progress}
            showInput={true}
          />
        </Box>

        {/* Group Multi-Select Integration */}
        <SearchByTypingSelect2
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

        <HorizentalTextField
          title={t("form.password", "Password")}
          fieldName="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
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
            <MenuItem key={i} value={el}>
              {t(`Dashboard.${el}`)}
            </MenuItem>
          ))}
        </HorizentalTextFieldSelect>

        <SubmitButton loading={updating} t={t} />
      </Box>

      {userData?.role === "student" && (
        <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid #eee" }}>
          <UniversityCard studentData={userData} registrationData={regData?.getRegisterFormByUserId} />
        </Box>
      )}

      {/* Certificates */}
      {userData?.role === "student" && (
        <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid #eee" }}>
          <GraduationCertificate studentId={userData?.id} />
        </Box>
      )}
    </Box>
  );
}