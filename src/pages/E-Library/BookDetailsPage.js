import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Material UI
import {
  Box, MenuItem, Grid, Paper, Divider,
  Typography, useTheme, Button, LinearProgress, Stack
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Internal Components
import i18n from "../../i18n/i18n";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import UploadFileField from "../../components/Utilities/UploadFileField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { baseURL } from "../../Api/apolloClient";

// Queries
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { UPDATE_Library_BY_ID } from "../../graphql/eLibraryQueries";

export default function BookDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const me = useSelector(state => state.user.loggedUser);
  const isAdmin = me?.role === "admin";

  const [selectedFaculity, setSelectedFaculity] = useState(location?.state?.faculty_id?.id || location?.state?.faculty_department_id?.faculty_id?.id || "");
  const [selectedDepartment, setSelectedDepartment] = useState(location?.state?.faculty_department_id?.id || "");
  const [progress, setProgress] = useState(0);
  const fileInputRef = React.useRef(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState("");

  // GraphQL Hooks
  const [getFaculties, { data: facultyData, loading: faculitiesLoading }] = useLazyQuery(GET_ALL_FACULITIES);
  const faculties = facultyData?.faculties || [];

  const [getDepartments, { data: deptData }] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID);
  const [updateLibrary, { loading: submitLoading }] = useMutation(UPDATE_Library_BY_ID);

  useEffect(() => {
    getFaculties();
    if (selectedFaculity) {
      getDepartments({ variables: { faculty_id: selectedFaculity } });
    }
  }, [getFaculties, getDepartments, selectedFaculity]);

  const formik = useFormik({
    initialValues: {
      title_ar: location?.state?.title_ar || "",
      title_en: location?.state?.title_en || "",
      author_name: location?.state?.author_name || "",
      status: location?.state?.status !== undefined ? Boolean(location.state.status && location.state.status !== "false") : true,
      file: location?.state?.file || ""
    },
    validationSchema: Yup.object({
      title_ar: Yup.string().required(t("admissions.errors.required")),
      title_en: Yup.string().required(t("admissions.errors.required")),
      author_name: Yup.string().required(t("admissions.errors.required")),
      status: Yup.boolean().required(t("admissions.errors.required")),
    }),
    onSubmit: async (values) => {
      const payload = {
        title_ar: values.title_ar,
        title_en: values.title_en,
        author_name: values.author_name,
        faculty_id: selectedFaculity,
        faculty_department_id: selectedDepartment,
        status: values.status,
        file: values.file
      };

      try {
        await updateLibrary({ variables: { id: location?.state?.id, input: payload } });
        notify(t("success"), "success");
        navigate(-1);
      } catch (error) {
        notify(t("error"), "error");
      }
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(1);
      const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });
      formik.setFieldValue("file", res?.data?.url);
      setSelectedToShowFile(file.name);
      notify(t("fileUploaded"), "success");
    } catch (error) {
      notify(t("errorUplaod"), "error");
    } finally {
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleDownload = () => {
    if (!formik.values.file) return notify(t("noFile"), "warning");
    const link = document.createElement("a");
    link.href = `${baseURL}${formik.values.file}`;
    link.target = "_blank";
    link.download = formik.values.file.split("/").pop();
    link.click();
  };

  if (faculitiesLoading) return <LoadingPage />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Header
            title={t("Dashboard.library")}
            subtitle={isArabic ? "تفاصيل الكتاب" : "Book Details"}
            hasNavigate={false}
            i18n={i18n}
          />
        </Box>
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={4}>
          {/* Metadata */}
          <Grid item xs={12}>
            <Stack spacing={3}>
              <HorizentalTextField
                title={t("form.name_ar", { item: "" })}
                fieldName="title_ar"
                value={formik.values.title_ar}
                onChange={formik.handleChange}
                isDisabled={!isAdmin}
              />

              <HorizentalTextField
                title={t("form.name_en", { item: "" })}
                fieldName="title_en"
                value={formik.values.title_en}
                onChange={formik.handleChange}
                isDisabled={!isAdmin}
              />

              <HorizentalTextField
                title={t("form.author_name")}
                fieldName="author_name"
                value={formik.values.author_name}
                onChange={formik.handleChange}
                isDisabled={!isAdmin}
              />

              <HorizentalTextFieldSelect
                title={t("Status")}
                value={formik.values.status}
                isDisabled={!isAdmin}
                onChange={(e) => formik.setFieldValue("status", e.target.value)}
              >
                <MenuItem value={true}>{isArabic ? "نشط" : "Active"}</MenuItem>
                <MenuItem value={false}>{isArabic ? "غير نشط" : "Inactive"}</MenuItem>
              </HorizentalTextFieldSelect>
            </Stack>
          </Grid>

          {/* Faculty & Files */}
          <Grid item xs={12}>
            <Stack spacing={3}>
              <HorizentalTextFieldSelect
                title={t("admissions.faculty")}
                value={selectedFaculity}
                isDisabled={!isAdmin}
                onChange={(e) => {
                  setSelectedFaculity(e.target.value);
                  getDepartments({ variables: { faculty_id: e.target.value } });
                }}
              >
                {faculties?.map(el => (
                  <MenuItem key={el.id} value={el.id}>{isArabic ? el.title_ar : el.title_en}</MenuItem>
                ))}
              </HorizentalTextFieldSelect>

              <HorizentalTextFieldSelect
                title={t("admissions.facultyDepartment")}
                value={selectedDepartment}
                isDisabled={!isAdmin}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {deptData?.getFacultyDepartmentsByFaculty?.map(el => (
                  <MenuItem key={el.id} value={el.id}>{isArabic ? el.title_ar : el.title_en}</MenuItem>
                ))}
              </HorizentalTextFieldSelect>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <UploadFileField
                  title={t("Attachments")}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  subTitle={t("Update File")}
                  description={""}
                  handlePickFile={() => fileInputRef.current.click()}
                  selectedToShowFile={selectedToShowFile || (formik.values.file ? formik.values.file.split("/").pop() : "")}
                  progress={progress}
                  hasDownloadBtn={!!formik.values.file}
                  handleDownloadFile={handleDownload}
                  showInput={isAdmin}
                />
              </Box>
            </Stack>
          </Grid>

          {/* Actions */}
          {isAdmin && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <SubmitButton loading={submitLoading} t={t} sx={{ minWidth: 150 }} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      {/* </Paper> */}
    </Box>
  );
}