import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { CREATE_ACADEMY_TERM } from "../../graphql/AcademyTerms";

export default function AddAcademyTermPage() {

  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  // get all faculities
  const [
    Faculties, {
      data: { faculties } = {},
      loading: faculitiesLoading
    }
  ] = useLazyQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

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

    const[
      CreateAcademyTerm,
      {
        data,
        loading:creatingAcademyTerm
      }
    ]=useMutation(CREATE_ACADEMY_TERM,{fetchPolicy:"network-only"});

  useEffect(() => {
    Faculties();
  }, []);

   const formik = useFormik({
          initialValues: {
              title_ar: "",
              title_en: ""
              // faculty_id: ""
              // flag: "",
          },
  
          validationSchema: Yup.object({
              title_ar: Yup.string().required(t("admissions.errors.required")),
              title_en: Yup.string().required(t("admissions.errors.required")),
              // faculty_id: Yup.string().required(t("admissions.errors.required")),
  
          }),
          onSubmit: async (values) => {
  
              // // ✅ التحقق اليدوي قبل الإرسال
              // if (selected==0) {
              //     // console.log('rrrrrrrrrrrrrrrrrrrrrrr');
              //     // formik.setFieldError("faculty_id", t("admissions.errors.required"));
  
              //     setSelectError(t("admissions.errors.required"));
              //     return; // وقف الإرسال لحد ما المستخدم يختار
              // }
              // console.log('xxxxxxxxxxxxxxxxxxxxxxx');
              const data = {
                  title_ar: values?.title_ar,
                  title_en: values.title_en,
                  // faculty_id: selected
  
              };
              try {
                  console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                  console.log(data);
  
                  // return;
                  const result = await CreateAcademyTerm({
                      variables: {
                          input: data
                      }
                  });
  
                  console.log('result', result);
  
                  notify(t("success"), "success");
  
                  navigate('/academyTerms');
  
              } catch (error) {
                  console.error("Error logging in:", error);
                  notify(t("error"), "error");
  
              } finally {
                  //  setIsLoading(false);
              }
          },
      });


  let translateText = isArabic ? "فصل دراسي" : "AcademyTerm";
  let translateText2 = isArabic ? "الفصل الدراسي" : "AcademyTerm";

    if (faculitiesLoading) return <LoadingPage />;
  return (
    <div>AddAcademyTermPage</div>
  )
}
