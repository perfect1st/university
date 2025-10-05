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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AdmissionsHero from "../../components/AdmissionsComponents/AdmissionsHero";
import TermsConditions from "../../components/AdmissionsComponents/TermsConditions";
import { useTranslation } from "react-i18next";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

// CustomTextField wrapper (keeps placeholder support + helperText)
function CustomTextField(props) {
  const theme = useTheme();
  const { placeholder, helperText, error, ...rest } = props;
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
    />
  );
}

export default function Admissions() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState(1);

  // step1 state
  const [personal, setPersonal] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
    fullName: "",
    gender: "",
    nationality: "",
    dob: "",
    email: "",
    homePhone: "",
    phoneNumber: "",
    idNo: "",
    idCard: false,
    passport: false,
    residence: false,
  });
  // errors hold message string ('' or message)
  const [errors, setErrors] = useState({});

  // step2 state
  const [academic, setAcademic] = useState({
    yearOfEducation: "",
    placeOfStudy: "",
    country: "",
    city: "",
    studentNo: "",
    generalAppreciation: "",
    gpa: "",
    highSchoolFile: null,
    faculty: "",
    facultyDepartment: "",
  });
  const [acadErrors, setAcadErrors] = useState({});

  const fileInputRef = useRef(null);

  const nationalities = [
    { value: "saudi", label: t("admissions.saudi") },
    { value: "egypt", label: t("admissions.egypt") },
    { value: "jordan", label: t("admissions.jordan") },
    { value: "other", label: t("admissions.other") },
  ];

  const genders = [
    { value: "male", label: t("admissions.male") },
    { value: "female", label: t("admissions.female") },
  ];

  const countries = [
    { value: "saudi", label: t("admissions.saudi") },
    { value: "egypt", label: t("admissions.egypt") },
    { value: "other", label: t("admissions.other") },
  ];

  const cities = [
    { value: "riyadh", label: t("admissions.riyadh") },
    { value: "jeddah", label: t("admissions.jeddah") },
    { value: "dammam", label: t("admissions.dammam") },
    { value: "other", label: t("admissions.other") },
  ];

  const faculties = [
    { value: "engineering", label: t("admissions.engineering") },
    { value: "medicine", label: t("admissions.medicine") },
    { value: "business", label: t("admissions.business") },
    { value: "law", label: t("admissions.law") },
  ];

  const departments = [
    { value: "computer", label: t("admissions.computer") },
    { value: "civil", label: t("admissions.civil") },
    { value: "electrical", label: t("admissions.electrical") },
    { value: "mechanical", label: t("admissions.mechanical") },
  ];

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
        case "firstName":
        case "secondName":
        case "thirdName":
        case "fourthName":
        case "fullName":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "gender":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "nationality":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "dob":
          return value ? "" : t("admissions.errors.required") || "Required";
        case "email":
          if (!value) return t("admissions.errors.required") || "Required";
          if (!emailRegex.test(value))
            return t("admissions.errors.invalidEmail") || "Invalid email";
          return "";
        case "phoneNumber":
          if (!value) return t("admissions.errors.required") || "Required";
          if (!phoneRegex.test(value))
            return (
              t("admissions.errors.invalidPhone") ||
              "Invalid phone format (e.g. 5XXXXXXXX)"
            );
          return "";
        case "idNo":
          if (!value) return t("admissions.errors.required") || "Required";
          if (!idRegex.test(value))
            return t("admissions.errors.invalidId") || "Invalid ID number";
          return "";
        default:
          return "";
      }
    } else {
      // academic validations
      switch (name) {
        case "yearOfEducation":
        case "placeOfStudy":
        case "country":
        case "city":
        case "studentNo":
        case "generalAppreciation":
        case "faculty":
        case "facultyDepartment":
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
        case "highSchoolFile":
          return value
            ? ""
            : t("admissions.errors.requiredFile") ||
                "Please attach certificate file";
        default:
          return "";
      }
    }
  }

  const validateStep1 = () => {
    const keys = [
      "firstName",
      "secondName",
      "thirdName",
      "fourthName",
      "fullName",
      "gender",
      "nationality",
      "dob",
      "email",
      "phoneNumber",
      "idNo",
    ];
    const newErrors = {};
    keys.forEach((k) => {
      const msg = validateField(k, personal[k], false);
      if (msg) newErrors[k] = msg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateStep2 = () => {
    const keys = [
      "yearOfEducation",
      "placeOfStudy",
      "country",
      "city",
      "studentNo",
      "generalAppreciation",
      "gpa",
      "highSchoolFile",
      "faculty",
      "facultyDepartment",
    ];
    const newErrors = {};
    keys.forEach((k) => {
      const msg = validateField(k, academic[k], true);
      if (msg) newErrors[k] = msg;
    });
    setAcadErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // single-field onBlur validation (for immediate feedback)
  const handlePersonalBlur = (field) => {
    const msg = validateField(field, personal[field], false);
    setErrors((prev) => ({ ...prev, [field]: msg }));
  }

  const handleAcademicBlur = (field) => {
    const msg = validateField(field, academic[field], true);
    setAcadErrors((prev) => ({ ...prev, [field]: msg }));
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      // scroll to top of step2 maybe
    }
  }

  const handleFinish = () => {
    if (validateStep2()) {
      const formData = new FormData();
  
      // Append personal data
      Object.entries(personal).forEach(([key, value]) => {
        // لو قيمة Boolean زي checkboxes نخليها string
        formData.append(key, typeof value === "boolean" ? String(value) : value);
      });
  
      // Append academic data
      Object.entries(academic).forEach(([key, value]) => {
        if (key === "highSchoolFile" && value instanceof File) {
          formData.append("highSchoolFile", value);
        } else {
          formData.append(key, value);
        }
      });
  
      // ✅ مثال توضيحي: ارسال البيانات
      // axios.post("/api/admissions", formData)
      //   .then(res => console.log("Submitted successfully"))
      //   .catch(err => console.error(err));
  
      // Debug
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      alert("Application submitted (demo)");
    }
  }
  

  // File handling
  const handlePickFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  }
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setAcademic((a) => ({ ...a, highSchoolFile: file }));
    // validate file right away
    const msg = validateField("highSchoolFile", file, true);
    setAcadErrors((prev) => ({ ...prev, highSchoolFile: msg }));
  }

  return (
    <Box>
      <AdmissionsHero />

      {!acceptTerms && (
        <TermsConditions
          setAcceptTerms={setAcceptTerms}
          acceptTerms={acceptTerms}
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
                    { key: "firstName", label: t("admissions.firstName") },
                    { key: "secondName", label: t("admissions.secondName") },
                    { key: "thirdName", label: t("admissions.thirdName") },
                    { key: "fourthName", label: t("admissions.fourthName") },
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

                  <Grid item xs={12}>
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
                  </Grid>

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
                      value={personal.nationality}
                      onChange={(e) =>
                        setPersonal((p) => ({
                          ...p,
                          nationality: e.target.value,
                        }))
                      }
                      onBlur={() => handlePersonalBlur("nationality")}
                      error={!!errors.nationality}
                      helperText={errors.nationality || ""}
                    >
                      {nationalities.map((n) => (
                        <MenuItem key={n.value} value={n.value}>
                          {n.label}
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
                      value={personal.dob}
                      onChange={(e) =>
                        setPersonal((p) => ({ ...p, dob: e.target.value }))
                      }
                      InputLabelProps={{ shrink: true }}
                      onBlur={() => handlePersonalBlur("dob")}
                      error={!!errors.dob}
                      helperText={errors.dob || ""}
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
                      value={personal.homePhone}
                      onChange={(e) =>
                        setPersonal((p) => ({
                          ...p,
                          homePhone: e.target.value,
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
                    <CustomTextField
                      placeholder="5XXXXXXXX"
                      type="text"
                      value={personal.phoneNumber}
                      onChange={(e) =>
                        setPersonal((p) => ({
                          ...p,
                          phoneNumber: e.target.value,
                        }))
                      }
                      onBlur={() => handlePersonalBlur("phoneNumber")}
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber || ""}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+966</InputAdornment>
                        ),
                      }}
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
                      value={personal.idNo}
                      onChange={(e) =>
                        setPersonal((p) => ({ ...p, idNo: e.target.value }))
                      }
                      onBlur={() => handlePersonalBlur("idNo")}
                      error={!!errors.idNo}
                      helperText={errors.idNo || ""}
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
                          checked={personal.idCard}
                          onChange={(e) =>
                            setPersonal((p) => ({
                              ...p,
                              idCard: e.target.checked,
                            }))
                          }
                        />
                      }
                      label={t("admissions.idCard")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={personal.passport}
                          onChange={(e) =>
                            setPersonal((p) => ({
                              ...p,
                              passport: e.target.checked,
                            }))
                          }
                        />
                      }
                      label={t("admissions.passport")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={personal.residence}
                          onChange={(e) =>
                            setPersonal((p) => ({
                              ...p,
                              residence: e.target.checked,
                            }))
                          }
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
                      value={academic.yearOfEducation}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          yearOfEducation: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("yearOfEducation")}
                      error={!!acadErrors.yearOfEducation}
                      helperText={acadErrors.yearOfEducation || ""}
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
                      value={academic.placeOfStudy}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          placeOfStudy: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("placeOfStudy")}
                      error={!!acadErrors.placeOfStudy}
                      helperText={acadErrors.placeOfStudy || ""}
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
                      placeholder={t("admissions.country")}
                      value={academic.country}
                      onChange={(e) =>
                        setAcademic((a) => ({ ...a, country: e.target.value }))
                      }
                      onBlur={() => handleAcademicBlur("country")}
                      error={!!acadErrors.country}
                      helperText={acadErrors.country || ""}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.value} value={country.value}>
                          {country.label}
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
                    <CustomTextField
                      select
                      placeholder={t("admissions.city")}
                      value={academic.city}
                      onChange={(e) =>
                        setAcademic((a) => ({ ...a, city: e.target.value }))
                      }
                      onBlur={() => handleAcademicBlur("city")}
                      error={!!acadErrors.city}
                      helperText={acadErrors.city || ""}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.value} value={city.value}>
                          {city.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
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
                      value={academic.studentNo}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          studentNo: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("studentNo")}
                      error={!!acadErrors.studentNo}
                      helperText={acadErrors.studentNo || ""}
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
                      value={academic.generalAppreciation}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          generalAppreciation: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("generalAppreciation")}
                      error={!!acadErrors.generalAppreciation}
                      helperText={acadErrors.generalAppreciation || ""}
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
                            gap:1,
                          }}
                          endIcon={
                            <AddCircleOutlineIcon
                              sx={{
                                transform:
                                  i18n.language === "ar" ? "rotate(180deg)" : "none",
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
                          {academic.highSchoolFile
                            ? academic.highSchoolFile.name
                            : ""}
                        </Typography>
                      </Box>
                      {acadErrors.highSchoolFile && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ display: "block", mt: 1 }}
                        >
                          {acadErrors.highSchoolFile}
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
                sx={{ background: theme.palette.info?.main, gap: 1 , mx:2 }}
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
                      value={academic.faculty}
                      onChange={(e) =>
                        setAcademic((a) => ({ ...a, faculty: e.target.value }))
                      }
                      onBlur={() => handleAcademicBlur("faculty")}
                      error={!!acadErrors.faculty}
                      helperText={acadErrors.faculty || ""}
                    >
                      {faculties.map((faculty) => (
                        <MenuItem key={faculty.value} value={faculty.value}>
                          {faculty.label}
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
                      value={academic.facultyDepartment}
                      onChange={(e) =>
                        setAcademic((a) => ({
                          ...a,
                          facultyDepartment: e.target.value,
                        }))
                      }
                      onBlur={() => handleAcademicBlur("facultyDepartment")}
                      error={!!acadErrors.facultyDepartment}
                      helperText={acadErrors.facultyDepartment || ""}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.value} value={dept.value}>
                          {dept.label}
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
                  sx={{ background: theme.palette.info?.main , gap:1, mx:2}}
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
