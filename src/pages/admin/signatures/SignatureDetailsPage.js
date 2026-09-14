import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client/react";
import i18n from "../../../i18n/i18n";
import { Box, MenuItem, useTheme } from "@mui/material";
import Header from "../../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../../components/Utilities/VerticalTextField";
import UploadFileField from "../../../components/Utilities/UploadFileField";
import SubmitButton from "../../../components/Utilities/SubmitButton";
import { UPDATE_SIGNATURE } from "../../../graphql/signatures";
import { GET_ALL_FACULITIES, GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID } from "../../../graphql/facultyQuiries";
import axios from "axios";
import { baseURL } from "../../../Api/apolloClient";
import logger from "../../../utils/logger";
import { useState, useEffect, useRef } from "react";

const ROLE_TITLES = [
  { id: "university_president", ar: "رئيس الجامعة", en: "University President" },
  { id: "vice_president", ar: "نائب رئيس الجامعة", en: "Vice President" },
  { id: "secretary_general", ar: "أمين عام", en: "Secretary General" },
  { id: "dean", ar: "عميد", en: "Dean" },
  { id: "vice_dean", ar: "وكيل", en: "Vice Dean" },
  { id: "registrar", ar: "أمين السجل", en: "Registrar" },
  { id: "academic_affairs", ar: "شؤون أكاديمية", en: "Academic Affairs" },
  { id: "student_affairs", ar: "شؤون الطلاب", en: "Student Affairs" },
  { id: "department_head", ar: "رئيس القسم", en: "Department Head" },
];

export default function SignatureDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [roleTitle, setRoleTitle] = useState("0");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [initialImage, setInitialImage] = useState("");
  const fileInputRef = useRef(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState("");

  const { data: facultiesData } = useQuery(GET_ALL_FACULITIES, {
    fetchPolicy: "network-only",
  });

  const [getDepartments, { data: deptsData }] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID);

  const [UpdateSignature, { loading: UpdateSignatureLoading }] = useMutation(
    UPDATE_SIGNATURE,
    { fetchPolicy: "network-only" }
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      faculty_id: "",
      department_id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("admissions.errors.required")),
      roleTitle: roleTitle === "0" && Yup.string().required(t("admissions.errors.required")),
    }),
    onSubmit: async (values) => {
      if (roleTitle === "0") {
        notify(t("admissions.errors.required"), "error");
        return;
      }
      
      let imagePath = initialImage;

      if (imageFile) {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", imageFile);
          const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imagePath = res.data.path || res.data.url;
        } catch (error) {
          setUploading(false);
          notify(t("error"), "error");
          return;
        }
        setUploading(false);
      }

      if (!imagePath) {
        notify(isArabic ? "الصورة مطلوبة" : "Image is required", "error");
        return;
      }

      const input = {
        name: values.name,
        role_title: roleTitle,
        signature_image: imagePath,
      };

      if (["dean", "vice_dean", "registrar", "academic_affairs", "student_affairs", "department_head"].includes(roleTitle)) {
        input.faculty_id = values.faculty_id;
      }
      if (roleTitle === "department_head") {
        input.department_id = values.department_id;
      }

      try {
        await UpdateSignature({ variables: { id, input } });
        notify(t("success"), "success");
        navigate(location.pathname.split(`/details/${id}`)[0]);
      } catch (error) {
        logger.error("Error:", error);
        notify(error?.message || t("error"), "error");
      }
    },
  });

  useEffect(() => {
    if (location.state) {
      const sig = location.state;
      formik.setValues({
        name: sig.name || "",
        faculty_id: sig.faculty_id?.id || "",
        department_id: sig.department_id?.id || "",
      });
      setRoleTitle(sig.role_title || "0");
      setInitialImage(sig.signature_image || "");
      
      if (sig.faculty_id?.id) {
        getDepartments({ variables: { faculty_id: sig.faculty_id.id } });
      }
    }
  }, [location.state]);

  const facultiesOptions = facultiesData?.faculties || [];
  const departmentsOptions = deptsData?.getFacultyDepartmentsByFaculty || [];

  const requiresFaculty = ["dean", "vice_dean", "registrar", "academic_affairs", "student_affairs", "department_head"].includes(roleTitle);
  const requiresDepartment = roleTitle === "department_head";

  const handleRoleChange = (val) => {
    setRoleTitle(val);
    formik.setFieldValue("faculty_id", "");
    formik.setFieldValue("department_id", "");
  };

  const handleFacultyChange = (newId) => {
    formik.setFieldValue("faculty_id", newId);
    formik.setFieldValue("department_id", "");
    if (newId) {
      getDepartments({ variables: { faculty_id: newId } });
    }
  };

  const handlePickFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
      setSelectedToShowFile(file.name);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={isArabic ? "التوقيعات" : "Signatures"}
        subtitle={isArabic ? "تعديل توقيع" : "Edit Signature"}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={isArabic ? "تعديل توقيع" : "Edit Signature"}
        hasNavigate={true}
      />
      <Box onSubmit={formik.handleSubmit} component="form">
        <VerticalTextField
          title={isArabic ? "الاسم" : "Name"}
          fieldID={"name"}
          fieldName={"name"}
          placeholder={isArabic ? "الاسم" : "Name"}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <VerticalTextFieldSelect
          t={t}
          title={isArabic ? "المسمى الوظيفي" : "Role Title"}
          defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={roleTitle}
          setValue={handleRoleChange}
        >
          <MenuItem value={"0"} disabled>{t("select")}</MenuItem>
          {ROLE_TITLES.map((el) => (
            <MenuItem key={el.id} value={el.id}>
              {isArabic ? el.ar : el.en}
            </MenuItem>
          ))}
        </VerticalTextFieldSelect>

        {requiresFaculty && (
          <SearchByTypingSelect
            title={isArabic ? "الكلية" : "Faculty"}
            options={facultiesOptions}
            multiple={false}
            findKey="id"
            labelToShow={(option) => (isArabic ? option.title_ar : option.title_en)}
            value={formik.values.faculty_id}
            setValue={handleFacultyChange}
          />
        )}

        {requiresDepartment && (
          <SearchByTypingSelect
            title={isArabic ? "القسم" : "Department"}
            options={departmentsOptions}
            multiple={false}
            findKey="id"
            labelToShow={(option) => (isArabic ? option.title_ar : option.title_en)}
            value={formik.values.department_id}
            setValue={(newId) => formik.setFieldValue("department_id", newId)}
          />
        )}

        <UploadFileField
          title={isArabic ? "تغيير صورة التوقيع" : "Change Signature Image"}
          subTitle={isArabic ? "رفع صورة" : "Upload Image"}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handlePickFile={handlePickFile}
          selectedToShowFile={selectedToShowFile}
          progress={0}
        />
        
        {initialImage && !imageFile && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <img 
              src={`${baseURL}${initialImage}`} 
              alt="Current signature" 
              style={{ maxHeight: 150, objectFit: "contain", borderRadius: 8 }} 
            />
          </Box>
        )}

        <SubmitButton loading={UpdateSignatureLoading || uploading} t={t} />
      </Box>
    </Box>
  );
}
