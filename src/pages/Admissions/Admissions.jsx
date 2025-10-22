import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Divider,
  useTheme,
  FormControl,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AdmissionsHero from "../../components/AdmissionsComponents/AdmissionsHero";
import TermsConditions from "../../components/AdmissionsComponents/TermsConditions";
import { useTranslation } from "react-i18next";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client/react";
import {
  GetWebsiteArticles,
  ArticalesById,
} from "../../graphql/articleQueries.js";
import PhoneNumberInput from "../../components/PhoneInput.jsx";
import { GET_ALL_NATIONALITIES } from "../../graphql/nationalitiesQueries.js";
import {
  GET_ALL_COUNTRIES,
  GET_CITIES_BY_COUNTRY_ID,
} from "../../graphql/countriesQueries.js";
import {
  GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID,
  GET_ALL_FACULITIES,
} from "../../graphql/facultyQuiries.js";
import { CREATE_REGISTERATION_FORM } from "../../graphql/registerationFormQueries.js";

// CustomTextField wrapper (keeps placeholder support + helperText)
function CustomTextField(props) {
  const theme = useTheme();
  // const { placeholder, helperText, error, ...rest } = props;

  const { placeholder, helperText, error, children, ...rest } = props;
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      {...rest}
      sx={{
        background: theme.palette.primary?.textField ?? "transparent",
        color: theme.palette.primary?.textFieldText ?? "inherit",
        "& .MuiInputBase-input": {
          color: theme.palette.primary?.textFieldText ?? "inherit",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(0,0,0,0.12)",
        },
        "& .MuiFormHelperText-root": {
          color: "error",
          fontFamily: "Cairo, Arial, sans-serif",
          fontWeight: 400,
          fontSize: "0.75rem",
          textAlign: isArabic ? "right" : "left",
          marginTop: 0,
          marginBottom: 0,
          marginRight: 0,
          marginLeft: 0,
          background: theme.palette.background.paper, // ✅ نفس لون خلفية الـ paper
        },
        ...props.sx,
      }}
    >
      {children}
    </TextField>
  );
}

export default function Admissions() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState(1);

  const {
    data: ArticalesData,
    loading: ArticalesLoading,
    error: ArticalesError,
  } = useQuery(ArticalesById, {
    variables: { departmentId: "68f0e59da78374194a5ef3d0" },
    fetchPolicy: "network-only",
  });

  // get all nationalities
  const {
    data: nationalitiesData,
    loading: nationalitiesLoading,
    error: nationalitiesError,
  } = useQuery(GET_ALL_NATIONALITIES, {
    fetchPolicy: "network-only",
  });

  // get all countries
  const {
    data: countriesData,
    loading: countriesLoading,
    error: countriesError,
  } = useQuery(GET_ALL_COUNTRIES, { fetchPolicy: "network-only" });

  // get cities by country code
  const [
    getCitiesByCountry,
    { data: citiesInCountry, loading: citiesLoading, error: citiesError },
  ] = useLazyQuery(GET_CITIES_BY_COUNTRY_ID, { fetchPolicy: "network-only" });

  // get all faculities
  const {
    data: faculitiesData,
    loading: faculitiesLoading,
    error: faculitiesError,
  } = useQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

  // get departments in faculty
  const [
    getFacultyDepartmentsByFaculty,
    {
      data: departmentsInFaculty,
      loading: departmentsLoading,
      error: departmentsError,
    },
  ] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, {
    fetchPolicy: "network-only",
  });
  // create registeration form
  const [
    createRegisterForm,
    { data: createResponse, loading: createLoading, error: createError },
  ] = useMutation(CREATE_REGISTERATION_FORM);

  console.log("ArticalesData", ArticalesData);
  console.log("countriesData", countriesData);
  console.log("faculitiesData", faculitiesData);

  // step1 state
  const [personal, setPersonal] = useState({
    first_name: "",
    second_name: "",
    third_name: "",
    fourth_name: "",
    // fullName: "",
    gender: "",
    nationality_id: "",
    birthdate: "",
    email: "",
    home_tel: "",
    mobile: "",
    national_id: "",
    national_id_type: "",
  });
  // errors hold message string ('' or message)
  const [errors, setErrors] = useState({});

  // step2 state
  const [academic, setAcademic] = useState({
    education_year: "",
    study_place: "",
    country_id: "",
    city_id: "",
    high_school_student_number: "",
    general_grade: "",
    gpa: "",
    high_school_certificate_file: null,
    faculty_id: "",
    faculty_department_id: "",
  });
  const [acadErrors, setAcadErrors] = useState({});

  const fileInputRef = useRef(null);

  console.log("academic", academic);
  console.log("personal", personal);

  const genders = [
    { value: "male", label: t("admissions.male") },
    { value: "female", label: t("admissions.female") },
  ];
  const nationalities = nationalitiesData?.nationalities;

  console.log("nationalities", nationalities);

  const countries = countriesData?.countries ? countriesData?.countries : null;

  console.log("citiesInCountry", citiesInCountry?.getCitiesByCountry);

  const cities = citiesInCountry?.getCitiesByCountry
    ? citiesInCountry?.getCitiesByCountry
    : null;

  const faculties = faculitiesData?.faculties
    ? faculitiesData?.faculties
    : null;

  console.log("departmentsInFaculty", departmentsInFaculty);

  const departments = departmentsInFaculty?.getFacultyDepartmentsByFaculty
    ? departmentsInFaculty?.getFacultyDepartmentsByFaculty
    : null;

  // --- validation helpers (returns message or empty string) ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // phone as text: expecting local Saudi like 5XXXXXXXX (9 digits, starts with 5)
  const phoneRegex = /^5\d{8}$/;
  // idNo simple numeric check (10-12 digits)
  const idRegex = /^\d{6,12}$/;
  // gpa numeric (0.0 - 4.0) or (0-100) adjust as needed; we'll check 0-4
  const validateField = (name, value, isAcademic = false) => {
    if (!isAcademic) {
      switch (name) {
        case "first_name":
        case "second_name":
        case "third_name":
        case "fourth_name":
        // case "fullName":
        //   return value ? "" : t("admissions.errors.required") || "Required";
        case "gender":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "nationality_id":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "birthdate":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "email":
          if (!value) return t("admissions.errors.required") || "Required";
          if (!emailRegex.test(value))
            return t("admissions.errors.invalidEmail") || "Invalid email";
          return "";
        case "mobile":
          if (!value) return t("admissions.errors.required") || "Required";
          if (!phoneRegex.test(value))
            return (
              t("admissions.errors.invalidPhone") ||
              "Invalid phone format (e.g. 5XXXXXXXX)"
            );
          return "";
        case "national_id":
          if (!value) return t("admissions.errors.required") || "Required";
          if (!idRegex.test(value))
            return t("admissions.errors.invalidId") || "Invalid ID number";
          return "";

        case "national_id_type":
          return value
            ? ""
            : t("admissions.errors.nationality_select") || "Required";

        default:
          return "";
      }
    } else {
      // academic validations
      switch (name) {
        case "education_year":
        case "study_place":
        case "country_id":
        case "city_id":
        case "high_school_student_number":
        case "general_grade":
        case "faculty_id":
        case "faculty_department_id":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "gpa":
          if (!value) return t("admissions.errors.required") || "Required";
          // allow decimal like 3.25 and check range 0-4
          const num = Number(value);
          if (Number.isNaN(num))
            return t("admissions.errors.invalidNumber") || "Invalid number";
          if (num < 0 || num > 4)
            return (
              t("admissions.errors.invalidGpaRange") ||
              "GPA must be between 0 and 4"
            );
          return "";
        case "high_school_certificate_file":
        // return value
        //   ? ""
        //   : t("admissions.errors.requiredFile") ||
        //       "Please attach certificate file";
        default:
          return "";
      }
    }
  };

  const validateStep1 = () => {
    const keys = [
      "first_name",
      "second_name",
      "third_name",
      "fourth_name",
      // "fullName",
      "gender",
      "nationality_id",
      "birthdate",
      "email",
      "mobile",
      "national_id",
      "national_id_type",
    ];
    const newErrors = {};

    console.log("personal", personal);

    keys.forEach((k) => {
      const msg = validateField(k, personal[k], false);
      if (msg) newErrors[k] = msg;
    });
    setErrors(newErrors);

    console.log("personal error", newErrors);

    if (newErrors?.national_id_type) alert(newErrors?.national_id_type);

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const keys = [
      "education_year",
      "study_place",
      "country_id",
      "city_id",
      "high_school_student_number",
      "general_grade",
      "gpa",
      "high_school_certificate_file",
      "faculty_id",
      "faculty_department_id",
    ];
    const newErrors = {};
    keys.forEach((k) => {
      const msg = validateField(k, academic[k], true);
      if (msg) newErrors[k] = msg;
    });

    console.log("newErrors", newErrors);
    setAcadErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // single-field onBlur validation (for immediate feedback)
  const handlePersonalBlur = (field) => {
    console.log("field", field, "personal[field]", personal[field]);

    const msg = validateField(field, personal[field], false);

    console.log("msg personal", msg);
    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const handleAcademicBlur = (field) => {
    const msg = validateField(field, academic[field], true);
    setAcadErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      // scroll to top of step2 maybe
    }
  };

  const handleFinish = async () => {

    try {
      console.log("finish", validateStep2());
    if (validateStep2()) {
      // console.log('oooooooooooooooo');
      const formData = new FormData();

      // Append personal data
      Object.entries(personal).forEach(([key, value]) => {
        // لو قيمة Boolean زي checkboxes نخليها string
        if(key=="countryCode") return;
        formData.append(
          key,
          typeof value === "boolean" ? String(value) : value
        );
      });

      // Append academic data
      Object.entries(academic).forEach(([key, value]) => {
        if (key === "high_school_certificate_file" && value instanceof File) {
          formData.append("high_school_certificate_file", value);
        } else {
          formData.append(key, value);
        }
      });

      console.log("formData", formData);

      // ✅ مثال توضيحي: ارسال البيانات
      // axios.post("/api/admissions", formData)
      //   .then(res => console.log("Submitted successfully"))
      //   .catch(err => console.error(err));

      let objToSend={
        address:"aaaaaaaaaaaaaa"
      };
      // Debug
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
        objToSend[key] = value;
      }

      console.log('objToSend',objToSend);

       const result=await createRegisterForm({
          variables:{
            input:objToSend
          }
        });

         console.log("result",result?.data);

      alert("Application submitted (demo)");
    }
    } catch (error) {
        console.log('error',error.message) 
    }
    
  };

  // File handling
  const handlePickFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setAcademic((a) => ({ ...a, high_school_certificate_file: file }));
    // validate file right away
    const msg = validateField("high_school_certificate_file", file, true);
    setAcadErrors((prev) => ({ ...prev, high_school_certificate_file: msg }));
  };

  console.log("i18n ", i18n.language);

  console.log("academic.city", academic.city);

  return (
    <Box>
      <AdmissionsHero data={ArticalesData?.getArticlesByDepartment?.[0]} />

      {!acceptTerms && (
        <TermsConditions
          setAcceptTerms={setAcceptTerms}
          acceptTerms={acceptTerms}
          data={ArticalesData?.getArticlesByDepartment?.slice(1)}
        />
      )}

      {acceptTerms && (
        <Box sx={{ mt: 3, maxWidth: 900, margin: "auto" }}>
          {/* Step header */}
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">
              {t("admissions.step", { step })}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={step === 1 ? 50 : 100}
                sx={{
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: "#CFDBE8",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Paper with big border */}
          <Paper
            elevation={0}
            sx={{ border: `10px solid ${theme.palette.divider}`, p: 3, mb: 3 }}
          >
            {step === 1 && (
              <>
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.info?.main }}
                >
                  {t("admissions.personalInformation")}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  {[
                    { key: "first_name", label: t("admissions.firstName") },
                    { key: "second_name", label: t("admissions.secondName") },
                    { key: "third_name", label: t("admissions.thirdName") },
                    { key: "fourth_name", label: t("admissions.fourthName") },
                  ].map((field) => (
                    <Grid key={field.key} item xs={12} sm={6} md={3}>
                      <Typography
                        variant="body2"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        {field.label}
                      </Typography>
                      <CustomTextField
                        placeholder={field.label}
                        value={personal[field.key]}
                        onChange={(e) =>
                          setPersonal((p) => ({
                            ...p,
                            [field.key]: e.target.value,
                          }))
                        }
                        onBlur={() => handlePersonalBlur(field.key)}
                        error={!!errors[field.key]}
                        helperText={errors[field.key] || ""}
                      />
                    </Grid>
                  ))}

                  {/* <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.fullName")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.fullName")}
                      value={personal.fullName}
                      onChange={(e) =>
                        setPersonal((p) => ({ ...p, fullName: e.target.value }))
                      }
                      onBlur={() => handlePersonalBlur("fullName")}
                      error={!!errors.fullName}
                      helperText={errors.fullName || ""}
                    />
                  </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.gender")}
                    </Typography>
                    <CustomTextField
                      select
                      placeholder={t("admissions.gender")}
                      value={personal.gender}
                      onChange={(e) =>
                        setPersonal((p) => ({ ...p, gender: e.target.value }))
                      }
                      onBlur={() => handlePersonalBlur("gender")}
                      error={!!errors.gender}
                      helperText={errors.gender || ""}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "#aaa" }}>
                                {t("Select Type")}
                              </span>
                            );
                          }

                          // 👇 استرجاع الاسم المناسب حسب اللغة
                          const genderLabel = genders.find(
                            (g) => g.value === selected
                          )?.label;
                          return <>{genderLabel}</>;
                        },
                        MenuProps: {
                          PaperProps: { style: { maxHeight: 320 } },
                        },
                      }}
                    >
                      {genders.map((g) => (
                        <MenuItem key={g.value} value={g.value}>
                          {g.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.nationality")}
                    </Typography>
                    <CustomTextField
                      select
                      placeholder={t("admissions.nationality")}
                      value={personal.nationality_id}
                      onChange={(e) => {
                        console.log("e.target.value", e.target);
                        setPersonal((p) => ({
                          ...p,
                          nationality_id: e.target.value,
                        }));
                      }}
                      onBlur={() => handlePersonalBlur("nationality_id")}
                      error={!!errors.nationality_id}
                      helperText={errors.nationality_id || ""}
                       SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) {
                          return <>{t("Select Nationality")}</>;
                        }
                        return (
                          <>{i18n.language === "ar" ? nationalities?.find((city) => city?.id === selected)?.name_ar : cities?.find((city) => city?.id === selected)?.name_en}</>
                        );
                      },
                      MenuProps: {
                        // optional: keep menu within viewport
                        PaperProps: { style: { maxHeight: 320 } },
                      },
                    }}
                    >
                      {nationalities?.map((n) => (
                        <MenuItem key={n?.id} value={n?.id}>
                          {/* {n.label} */}
                          {i18n.language === "ar" ? n?.name_ar : n?.name_en}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.dateOfBirth")}
                    </Typography>
                    <CustomTextField
                      type="date"
                      value={personal.birthdate}
                      onChange={(e) =>
                        setPersonal((p) => ({
                          ...p,
                          birthdate: e.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                      onBlur={() => handlePersonalBlur("birthdate")}
                      error={!!errors.birthdate}
                      helperText={errors.birthdate || ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.email")}
                    </Typography>
                    <CustomTextField
                      placeholder="example@mail.com"
                      type="email"
                      value={personal.email}
                      onChange={(e) =>
                        setPersonal((p) => ({ ...p, email: e.target.value }))
                      }
                      onBlur={() => handlePersonalBlur("email")}
                      error={!!errors.email}
                      helperText={errors.email || ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.homePhone")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.homePhone")}
                      value={personal.home_tel}
                      onChange={(e) =>
                        setPersonal((p) => ({
                          ...p,
                          home_tel: e.target.value,
                        }))
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.phoneNumber")}
                    </Typography>
                    {/* phone as text but validated by regex */}
                    <PhoneNumberInput
                      personal={personal ?? { mobile: "", countryCode: "" }}
                      setPersonal={setPersonal ?? (() => {})}
                      errors={errors ?? {}}
                      handlePersonalBlur={handlePersonalBlur ?? (() => {})}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.idNo")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.idNo")}
                      type="text"
                      value={personal.national_id}
                      onChange={(e) =>
                        setPersonal((p) => ({
                          ...p,
                          national_id: e.target.value,
                        }))
                      }
                      onBlur={() => handlePersonalBlur("national_id")}
                      error={!!errors.national_id}
                      helperText={errors.national_id || ""}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{ display: "flex", gap: 2, alignItems: "end" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            personal?.national_id_type == "id_card"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPersonal((p) => ({
                                ...p,
                                national_id_type: "id_card",
                              }));
                            } else {
                              setPersonal((p) => ({
                                ...p,
                                national_id_type: "",
                              }));
                            }
                          }}
                        />
                      }
                      label={t("admissions.idCard")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            personal?.national_id_type == "passport"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPersonal((p) => ({
                                ...p,
                                national_id_type: "passport",
                              }));
                            } else {
                              setPersonal((p) => ({
                                ...p,
                                national_id_type: "",
                              }));
                            }
                          }}
                        />
                      }
                      label={t("admissions.passport")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            personal?.national_id_type == "residence_no"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPersonal((p) => ({
                                ...p,
                                national_id_type: "residence_no",
                              }));
                            } else {
                              setPersonal((p) => ({
                                ...p,
                                national_id_type: "",
                              }));
                            }
                          }}
                        />
                      }
                      label={t("admissions.residenceNo")}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {step === 2 && (
              <>
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.info?.main }}
                >
                  {t("admissions.academicInformation")}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.yearOfEducation")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.yearOfEducation")}
                      value={academic.education_year}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          education_year: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("education_year")}
                      error={!!acadErrors.education_year}
                      helperText={acadErrors.education_year || ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.placeOfStudy")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.placeOfStudy")}
                      value={academic.study_place}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          study_place: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("study_place")}
                      error={!!acadErrors.study_place}
                      helperText={acadErrors.study_place || ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.country")}
                    </Typography>
                    <CustomTextField
                      select
                      id="country"
                      placeholder={t("admissions.country")}
                      value={academic.country_id}
                      onChange={(e) => {
                        setAcademic((a) => ({ ...a, country_id: e.target.value }));
                        // get cities in selected country
                        if (e.target.value != "") {
                          // 44444444444444444444444444
                          getCitiesByCountry({
                            variables: {
                              country_id: e.target.value,
                            },
                          });
                        }
                      }}
                      onBlur={() => handleAcademicBlur("country_id")}
                      error={!!acadErrors.country_id}
                      helperText={acadErrors.country_id || ""}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <>{t("Select Country")}</>;
                          }
                          return (
                            <>
                              {i18n.language === "ar"
                                ? countries?.find(
                                    (city) => city?.id === selected
                                  )?.name_ar
                                : cities?.find((city) => city?.id === selected)
                                    ?.name_en}
                            </>
                          );
                        },
                        MenuProps: {
                          // optional: keep menu within viewport
                          PaperProps: { style: { maxHeight: 320 } },
                        },
                      }}
                    >
                      {countries?.map((country) => (
                        <MenuItem key={country?.id} value={country?.id}>
                          {i18n.language === "ar"
                            ? country?.name_ar
                            : country?.name_en}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.city")}
                    </Typography>

                    <FormControl fullWidth>
                      <CustomTextField
                        select
                        id="city"
                        placeholder={t("admissions.city")}
                        value={academic.city_id || ""}
                        onChange={(e) =>
                          setAcademic((a) => ({ ...a, city_id: e.target.value }))
                        }
                        onBlur={() => handleAcademicBlur("city_id")}
                        error={!!acadErrors.city_id}
                        helperText={acadErrors.city_id || ""}
                        SelectProps={{
                          displayEmpty: true,
                          renderValue: (selected) => {
                            if (!selected) {
                              return <>{t("Select City")}</>;
                            }
                            return (
                              <>
                                {i18n.language === "ar"
                                  ? cities?.find(
                                      (city) => city?.id === selected
                                    )?.name_ar
                                  : cities?.find(
                                      (city) => city?.id === selected
                                    )?.name_en}
                              </>
                            );
                          },
                          MenuProps: {
                            // optional: keep menu within viewport
                            PaperProps: { style: { maxHeight: 320 } },
                          },
                        }}
                      >
                        <MenuItem key="0" value="">
                          {t("Select City")}
                        </MenuItem>
                        {cities?.map((city) => (
                          <MenuItem key={city?.id} value={city?.id}>
                            {i18n.language === "ar"
                              ? city?.name_ar
                              : city?.name_en}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.studentNo")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.studentNo")}
                      value={academic.high_school_student_number}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          high_school_student_number: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("high_school_student_number")}
                      error={!!acadErrors.high_school_student_number}
                      helperText={acadErrors.high_school_student_number || ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.generalAppreciation")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.generalAppreciation")}
                      value={academic.general_grade}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          general_grade: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("general_grade")}
                      error={!!acadErrors.general_grade}
                      helperText={acadErrors.general_grade || ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.gpa")}
                    </Typography>
                    <CustomTextField
                      placeholder={t("admissions.gpa")}
                      type="text"
                      value={academic.gpa}
                      onChange={(e) =>
                        setAcademic((a) => ({ ...a, gpa: e.target.value }))
                      }
                      onBlur={() => handleAcademicBlur("gpa")}
                      error={!!acadErrors.gpa}
                      helperText={acadErrors.gpa || ""}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2">
                      {t("admissions.highSchoolCertificate")}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        border: `2px dashed ${theme.palette.secondary.main}`,
                        p: 2,
                        mt: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {t("admissions.certificateDescription")}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                          gap: 2,
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          hidden
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="contained"
                          sx={{
                            background: theme.palette.secondary.main,
                            width: "150px",
                            gap: 1,
                          }}
                          endIcon={
                            <AddCircleOutlineIcon
                              sx={{
                                transform:
                                  i18n.language === "ar"
                                    ? "rotate(180deg)"
                                    : "none",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          }
                          onClick={handlePickFile}
                        >
                          {t("admissions.addFile")}
                        </Button>
                        <Typography
                          variant="body2"
                          sx={{ alignSelf: "center" }}
                        >
                          {academic.high_school_certificate_file
                            ? academic.high_school_certificate_file.name
                            : ""}
                        </Typography>
                      </Box>
                      {acadErrors.high_school_certificate_file && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ display: "block", mt: 1 }}
                        >
                          {acadErrors.high_school_certificate_file}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>

          {step === 1 && (
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={
                  <KeyboardDoubleArrowRightIcon
                    sx={{
                      transform:
                        i18n.language === "ar" ? "rotate(180deg)" : "none",
                      transition: "transform 0.3s ease",
                    }}
                  />
                }
                sx={{ background: theme.palette.info?.main, gap: 1 }}
                onClick={handleNext}
              >
                {t("admissions.next")}
              </Button>
            </Grid>
          )}
          {/* Major Information Paper */}
          {step === 2 && (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  border: `10px solid ${theme.palette.divider}`,
                  p: 2,
                  mt: 3,
                }}
              >
                <Typography variant="h6">
                  {t("admissions.majorInformation")}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.faculty")}
                    </Typography>
                    <CustomTextField
                      select
                      placeholder={t("admissions.faculty")}
                      value={academic.faculty_id}
                      onChange={(e) => {
                        if (e.target.value != "") {
                          getFacultyDepartmentsByFaculty({
                            variables: {
                              faculty_id: e.target.value,
                            },
                          });
                          setAcademic((a) => ({
                            ...a,
                            faculty_id: e.target.value,
                          }));
                        }
                      }}
                      onBlur={() => handleAcademicBlur("faculty_id")}
                      error={!!acadErrors.faculty_id}
                      helperText={acadErrors.faculty_id || ""}
                    >
                      {faculties?.map((faculty) => (
                        <MenuItem key={faculty?.id} value={faculty?.id}>
                          {i18n.language === "ar"
                            ? faculty?.title_ar
                            : faculty?.title_en}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {t("admissions.facultyDepartment")}
                    </Typography>
                    <CustomTextField
                      select
                      placeholder={t("admissions.facultyDepartment")}
                      value={academic.faculty_department_id}
                      onChange={(e) => {
                        // 44444444444444444444444444444
                        setAcademic((a) => ({
                          ...a,
                          faculty_department_id: e.target.value,
                        }));
                      }}
                      onBlur={() => handleAcademicBlur("faculty_department_id")}
                      error={!!acadErrors.faculty_department_id}
                      helperText={acadErrors.faculty_department_id || ""}
                    >
                      <MenuItem value="">
                        {i18n.language === "ar"
                          ? "اختر القسم"
                          : "Select Faculty"}
                      </MenuItem>

                      {departments?.map((dept) => (
                        <MenuItem key={dept?.id} value={dept?.id}>
                          {i18n.language === "ar"
                            ? dept?.title_ar
                            : dept?.title_en}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                </Grid>
              </Paper>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={
                    <KeyboardDoubleArrowRightIcon
                      sx={{
                        transform:
                          i18n.language === "ar" ? "rotate(180deg)" : "none",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  }
                  sx={{ background: theme.palette.info?.main, gap: 1 }}
                  onClick={handleFinish}
                >
                  {t("admissions.finish")}
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}
