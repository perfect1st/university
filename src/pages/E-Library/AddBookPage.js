import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Material UI
import { Box, MenuItem, Grid, Divider, Paper, Typography, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Internal Components
import i18n from "../../i18n/i18n";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import UploadFileField from "../../components/Utilities/UploadFileField";
import { baseURL } from "../../Api/apolloClient";

// Queries
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { CREATE_NEW_BOOK } from "../../graphql/eLibraryQueries";

export default function AddBookPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const [getFaculties, { data: facultyData, loading: faculitiesLoading }] = useLazyQuery(GET_ALL_FACULITIES);
  const [getDepartments, { data: deptData }] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID);
  const [createLibrary, { loading: submitLoading }] = useMutation(CREATE_NEW_BOOK);

  useEffect(() => {
    getFaculties();
  }, [getFaculties]);

  const formik = useFormik({
    initialValues: {
      title_ar: "",
      title_en: "",
      author_name: "",
      status: "active",
      faculty_id: "",
      department_id: "",
    },
    validationSchema: Yup.object({
      title_ar: Yup.string().required(t("admissions.errors.required")),
      title_en: Yup.string().required(t("admissions.errors.required")),
      author_name: Yup.string().required(t("admissions.errors.required")),
      status: Yup.string().required(t("admissions.errors.required")),
      faculty_id: Yup.string().required(t("admissions.errors.required")),
      department_id: Yup.string().required(t("admissions.errors.required")),
    }),
    onSubmit: async (values) => {
      if (!selectedFile) return notify(t("noFile"), "warning");

      const payload = {
        title_ar: values.title_ar,
        title_en: values.title_en,
        author_name: values.author_name,
        faculty_id: values.faculty_id,
        faculty_department_id: values.department_id,
        file: selectedFile,
        status: values.status
      };

      try {
        await createLibrary({ variables: { input: payload } });
        notify(t("success"), "success");
        navigate('/materials');
      } catch (error) {
        notify(t("error"), "error");
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
      setSelectedFile(res?.data?.url);
      notify(t("fileUploaded"), "success");
    } catch (error) {
      notify(t("errorUplaod"), "error");
    } finally {
      setTimeout(() => setProgress(0), 2000);
    }
  };

  if (faculitiesLoading) return <LoadingPage />;

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 4 }, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Header
            title={t("studentDashboard.eLibrary")}
            subtitle={t("addItem", { item: isArabic ? "كتاب" : "Book" })}
            hasNavigate={false}
            i18n={i18n}
          />
        </Box>
      </Box>

      {/* <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}> */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
        {isArabic ? "اضافة كتاب " : "Add Book"}
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
        <Grid container spacing={3}>
          {/* Arabic Title */}
          <Grid item xs={12}>
            <VerticalTextField
              title={t("form.name_ar", { item: "" })}
              fieldName="title_ar"
                value={formik.values.title_ar}
                onChange={formik.handleChange}
                error={formik.touched.title_ar && !!formik.errors.title_ar}
                helperText={formik.touched.title_ar && formik.errors.title_ar}
              />
            </Grid>

            {/* English Title */}
            <Grid item xs={12}>
              <VerticalTextField
                title={t("form.name_en", { item: "" })}
                fieldName="title_en"
                value={formik.values.title_en}
                onChange={formik.handleChange}
                error={formik.touched.title_en && !!formik.errors.title_en}
                helperText={formik.touched.title_en && formik.errors.title_en}
              />
            </Grid>

            {/* Author Name */}
            <Grid item xs={12}>
              <VerticalTextField
                title={t("form.author_name")}
                fieldName="author_name"
                value={formik.values.author_name}
                onChange={formik.handleChange}
                error={formik.touched.author_name && !!formik.errors.author_name}
                helperText={formik.touched.author_name && formik.errors.author_name}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <VerticalTextFieldSelect
                title={t("Status")}
                value={formik.values.status}
                onChange={(e) => formik.setFieldValue("status", e.target.value)}
                error={formik.touched.status && !!formik.errors.status}
              >
                <MenuItem value={true}>{isArabic ? "نشط" : "Active"}</MenuItem>
                <MenuItem value={false}>{isArabic ? "غير نشط" : "Inactive"}</MenuItem>
              </VerticalTextFieldSelect>
            </Grid>

            {/* Faculty */}
            <Grid item xs={12}>
              <VerticalTextFieldSelect
                title={t("admissions.faculty")}
                value={formik.values.faculty_id}
                onChange={(e) => {
                  formik.setFieldValue("faculty_id", e.target.value);
                  formik.setFieldValue("department_id", "");
                  getDepartments({ variables: { faculty_id: e.target.value } });
                }}
                error={formik.touched.faculty_id && !!formik.errors.faculty_id}
              >
                {facultyData?.faculties?.map(el => (
                  <MenuItem key={el.id} value={el.id}>{isArabic ? el.title_ar : el.title_en}</MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </Grid>

            {/* Department */}
            <Grid item xs={12}>
              <VerticalTextFieldSelect
                title={t("admissions.facultyDepartment")}
                value={formik.values.department_id}
                disabled={!formik.values.faculty_id}
                onChange={(e) => formik.setFieldValue("department_id", e.target.value)}
                error={formik.touched.department_id && !!formik.errors.department_id}
              >
                {deptData?.getFacultyDepartmentsByFaculty?.map(el => (
                  <MenuItem key={el.id} value={el.id}>{isArabic ? el.title_ar : el.title_en}</MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12} sx={{width:"100%"}}>
                <UploadFileField
                  title={t("Dashboard.library")}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handlePickFile={() => fileInputRef.current.click()}
                  selectedToShowFile={selectedToShowFile}
                  progress={progress}
                  showInput={true}
                />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <SubmitButton
              loading={submitLoading}
              t={t}
              sx={{ minWidth: 150 }}
            />
          </Box>
        </Box>
      {/* </Paper> */}
    </Box>
  );
}
