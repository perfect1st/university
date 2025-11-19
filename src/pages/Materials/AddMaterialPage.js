import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import { CREATE_NEW_MATERIAL } from "../../graphql/materialQueries";
 //import MaterialArrComponent from "./MaterialArrComponent";

export default function AddMaterialPage() {
    const theme = useTheme();
      const { t } = useTranslation();
      const isArabic = i18n.language === "ar";
      const navigate = useNavigate();
      const isMobile = useMediaQuery(theme.breakpoints.down("md"));
      const location = useLocation();
    
    //   const [selectedSemester, setSelectedSemester] = useState(0);
      const [selectedFaculity, setSelectedFaculity] = useState(0);
      const [selectedDepartment, setSelectedDepartment] = useState(0);

      // get all faculities
  const [
    Faculties, {
      data: { faculties } = {},
      loading: faculitiesLoading
    }
  ] = useLazyQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

  useEffect(()=>{
    Faculties();
  },[]);

  // get departments in faculty
  const [
    GetFacultyDepartmentsByFaculty,
    {
      data: { getFacultyDepartmentsByFaculty } = {},
      loading: departmentsLoading,
      error: departmentsError,
    },
  ] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, {
    fetchPolicy: "network-only",
  });

  // create new material
  const[CreateMaterial,{
    data,
    loading
  }]=useMutation(CREATE_NEW_MATERIAL,{fetchPolicy:"network-only"});

  const formik = useFormik({
      initialValues: {
        title_ar: "",
        title_en: "",
        fullmark_degree: "", 
        success_degree: "",   
        material_hours: "",
      
      },
  
      validationSchema: Yup.object({
        title_ar: Yup.string().required(t("admissions.errors.required")),
        title_en: Yup.string().required(t("admissions.errors.required")),
        fullmark_degree: Yup.string().required(t("admissions.errors.required")),
        success_degree: Yup.string().required(t("admissions.errors.required")),
        material_hours: Yup.string().required(t("admissions.errors.required"))
          .test(
            "greater-than-zero",
            t("admissions.errors.required"),
            (value) => Number(value) > 0
          ),
        selectedFaculity: selectedFaculity==0&& Yup.string()
          .required(t("admissions.errors.required"))
          .notOneOf(["0"], t("admissions.errors.required")),
        selectedDepartment: selectedDepartment==0&& Yup.string()
          .required(t("admissions.errors.required"))
          .notOneOf(["0"], t("admissions.errors.required")),
  
      }),
      onSubmit: async (values) => {
  
        console.log("suuuubmit");
  
        // // ✅ التحقق اليدوي قبل الإرسال
        // selectedFaculity || selectedSemester || selectedDepartment
        // console.log('ppppppppppppp', values?.min_study_hours)
  
       
        // console.log('xxxxxxxxxxxxxxxxxxxxxxx');
        
        if(Number(values?.success_degree)  > Number(values?.fullmark_degree)){

            notify(t("Dashboard.greaterThanError", {
                      more: t("studentDashboard.fullmarkDegree"),
                      less: t("studentDashboard.successDegree")
                    }), "error");

            return;
        }
      
       
        //  return;
        let data = {
          title_ar: values?.title_ar,
          title_en: values?.title_en,
            fullmark_degree: values?.fullmark_degree,
          faculty_department_id: selectedDepartment,
          success_degree: values?.success_degree,
          material_hours: values?.material_hours
        };
  
       
  
  
        try {
          console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu",data);
          // console.log(data);
           // return;
          const result = await CreateMaterial({
            variables: {
              input: data
            }
          });
  
          console.log('result', result);
  
          notify(t("success"), "success");
  
          navigate('/materials');
  
        } catch (error) {
          console.error("Error logging in:", error);
          notify(t("error"), "error");
  
        } finally {
          //  setIsLoading(false);
        }
      },
    });
    
    let translateText = isArabic ? "مادة" : "Subject";
    let translateText2 = isArabic ? "المادة" : "Subject";

  if (faculitiesLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
        <Header
        title={t("studentDashboard.subjects")}
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

        <Box component="form"
              onSubmit={
                formik.handleSubmit
              }
              sx={{
                width: "100%"
              }}
            >
      
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
      
              <VerticalTextField
                title={t("studentDashboard.fullmarkDegree", { item: translateText2 })}
                type={"number"}
                fieldID={"fullmark_degree"}
                fieldName={"fullmark_degree"}
                placeholder={t("studentDashboard.fullmarkDegree")}
                value={formik.values.fullmark_degree}
                onChange={formik.handleChange}
                error={formik.touched.fullmark_degree && Boolean(formik.errors.fullmark_degree)}
                helperText={formik.touched.fullmark_degree && formik.errors.fullmark_degree}
              />
      
              <VerticalTextField
                title={t("studentDashboard.successDegree", { item: translateText2 })}
                type={"number"}
                fieldID={"success_degree"}
                fieldName={"success_degree"}
                placeholder={t("studentDashboard.successDegree")}
                value={formik.values.success_degree}
                onChange={formik.handleChange}
                error={formik.touched.success_degree && Boolean(formik.errors.success_degree)}
                helperText={formik.touched.success_degree && formik.errors.success_degree}
              />
      
              <VerticalTextField
                title={t("studentDashboard.materialHours")}
                type={"number"}
                fieldID={"material_hours"}
                fieldName={"material_hours"}
                placeholder={t("studentDashboard.materialHours")}
                value={formik.values.material_hours}
                onChange={formik.handleChange}
                error={formik.touched.material_hours && Boolean(formik.errors.material_hours)}
                helperText={formik.touched.material_hours && formik.errors.material_hours}
              />
      
            
              {/* الكلية */}
      
              <VerticalTextFieldSelect
                t={t}
                title={t("admissions.faculty")} defaultOptionLabel={t("select")}
                backgroundColor={theme.palette.background.inputBackGround}
                value={selectedFaculity}
                setValue={setSelectedFaculity}
                onChange={async (e) => {
                  await GetFacultyDepartmentsByFaculty({
                    variables: {
                      faculty_id: e.target.value,
                    },
                  });

                  setSelectedDepartment(0);
                }}
      
                error={formik.errors.selectedFaculity && t("admissions.errors.required")}
                helperText={formik.errors.selectedFaculity && t("admissions.errors.required")}
              // error={selectError}
              // setError={setSelectError}
      
              >
                <MenuItem value={0} selected>{t("select")}</MenuItem>
                {
                  faculties?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                }
              </VerticalTextFieldSelect>
      
              {
                (departmentsLoading)
                && <CircularProgress size={26}
                  thickness={8}
                  sx={{ color: "black" }} />
              }
      
              {/* القسم */}
      
              <VerticalTextFieldSelect
                t={t}
                title={t("admissions.facultyDepartment")} defaultOptionLabel={t("select")}
                backgroundColor={theme.palette.background.inputBackGround}
                value={selectedDepartment}
                setValue={setSelectedDepartment}
                error={formik.errors.selectedDepartment && t("admissions.errors.required")}
                helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
              >
                <MenuItem value={0} selected>{t("select")}</MenuItem>
                {
                  getFacultyDepartmentsByFaculty?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                }
              </VerticalTextFieldSelect>
      
             
              {/* <MaterialArrComponent rows={rows} setRows={setRows} /> */}
      
              <SubmitButton loading={loading} t={t} />
      
      
      
            </Box>
    </Box>
  )
}
