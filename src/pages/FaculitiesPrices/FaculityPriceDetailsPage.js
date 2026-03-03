import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { UPDATE_FACULITY_DEPARTMENT_BY_ID } from "../../graphql/facultyQuiries"
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { UPDATE_FACULITY_PRICE_BY_ID } from "../../graphql/faculityPricesQueries";

export default function FaculityPriceDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [selectedFaculity, setSelectedFaculity] = useState(location?.state?.faculty_id?.id);
  const [selectedDepartment, setSelectedDepartment] = useState(location?.state?.faculty_department_id?.id);

  const [UpdateFacultyPrice, {
    loading: UpdateFacultyPriceLoading
  }] = useMutation(UPDATE_FACULITY_PRICE_BY_ID, { fetchPolicy: "network-only" });
  // get all faculities
  const [
    Faculties, {
      data: { faculties } = {},
      loading: faculitiesLoading
    }
  ] = useLazyQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

  // get departments in faculty
  const [
    GetFacultyDepartmentsByFaculty,
    {
      data: { getFacultyDepartmentsByFaculty } = {},
      loading: departmentsLoading,

    },
  ] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, {
    fetchPolicy: "network-only",
  });


  useEffect(() => {
    Faculties();
    GetFacultyDepartmentsByFaculty({
      variables: {
        faculty_id: location?.state?.faculty_id?.id,
      },
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      level_year: Number(location?.state?.level_year),
      price_inside_yemen: Number(location?.state?.price_inside_yemen),
      price_outside_yemen: Number(location?.state?.price_outside_yemen),
    },

    validationSchema: Yup.object({
      price_outside_yemen: Yup.string().required(t("admissions.errors.required"))
        .test(
          "greater-than-zero",
          t("admissions.errors.required"),
          (value) => Number(value) > 0
        ),
      price_inside_yemen: Yup.string().required(t("admissions.errors.required"))
        .test(
          "greater-than-zero",
          t("admissions.errors.required"),
          (value) => Number(value) > 0
        ),
      level_year: Yup.string()
        .required(t("admissions.errors.required"))
        .test(
          "greater-than-zero",
          t("admissions.errors.required"),
          (value) => Number(value) > 0
        ),
      selectedFaculity: selectedFaculity == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),
      selectedDepartment: selectedDepartment == 0 && Yup.string()
        .required(t("admissions.errors.required"))
        .notOneOf(["0"], t("admissions.errors.required")),

    }),
    onSubmit: async (values) => {

      console.log("suuuubmit");


      let data = {
        level_year: values?.level_year,
        price_inside_yemen: Number(values?.price_inside_yemen),
        price_outside_yemen: Number(values?.price_outside_yemen),
        faculty_department_id: selectedDepartment,
        faculty_id: selectedFaculity
      };



      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
        // console.log(data);

        //  return;
        const result = await UpdateFacultyPrice({
          variables: {
            id:location?.state?.id,
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

  let translateText = isArabic ? "رسوم الكلية" : "Faculity Price";
  let translateText2 = isArabic ? "رسوم الكلية" : "Faculity Price";

  if (faculitiesLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("Dashboard.facultyPrices")}
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

      <Box component="form" onSubmit={formik.handleSubmit} fullWidth>

        {/* الكلية */}

        <HorizentalTextFieldSelect
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

          onBlur={(e) => {
            // console.log('blur',selectedSemester);
            if (selectedFaculity != 0) formik.setFieldError("selectedFaculity", undefined);

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
        </HorizentalTextFieldSelect>

        {
          (departmentsLoading)
          && <CircularProgress size={26}
            thickness={8}
            sx={{ color: "black" }} />
        }

        {/* القسم */}

        <HorizentalTextFieldSelect
          t={t}
          title={t("admissions.facultyDepartment")} defaultOptionLabel={t("select")}
          backgroundColor={theme.palette.background.inputBackGround}
          value={selectedDepartment}
          setValue={setSelectedDepartment}
          //   onChange={async (e) => {

          //     await MaterialsByDepartment({
          //       variables: {
          //         faculty_department_id: e.target.value
          //       }
          //     });
          //   }}
          onBlur={(e) => {
            // console.log('blur',selectedSemester);
            if (selectedDepartment != 0) formik.setFieldError("selectedDepartment", undefined);

          }}
          error={formik.errors.selectedDepartment && t("admissions.errors.required")}
          helperText={formik.errors.selectedDepartment && t("admissions.errors.required")}
        >
          <MenuItem value={0} selected>{t("select")}</MenuItem>
          {
            getFacultyDepartmentsByFaculty?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
          }
        </HorizentalTextFieldSelect>

        <HorizentalTextField
          title={t("Dashboard.studyYear", { item: translateText2 })}
          type={"number"}
          fieldID={"level_year"}
          fieldName={"level_year"}
          placeholder={t("Dashboard.studyYear", { item: translateText2 })}
          value={formik.values.level_year}
          onChange={formik.handleChange}
          error={formik.touched.level_year && Boolean(formik.errors.level_year)}
          helperText={formik.touched.level_year && formik.errors.level_year}
        />

        <HorizentalTextField
          type={"number"}
          title={t("Dashboard.inside_yemen", { item: translateText2 })}
          fieldID={"price_inside_yemen"}
          fieldName={"price_inside_yemen"}
          placeholder={t("Dashboard.inside_yemen", { item: translateText2 })}
          value={formik.values.price_inside_yemen}
          onChange={formik.handleChange}
          error={formik.touched.price_inside_yemen && Boolean(formik.errors.price_inside_yemen)}
          helperText={formik.touched.price_inside_yemen && formik.errors.price_inside_yemen}
        />

        <HorizentalTextField
          type={"number"}
          title={t("Dashboard.outside_yemen", { item: translateText2 })}
          fieldID={"price_outside_yemen"}
          fieldName={"price_outside_yemen"}
          placeholder={t("Dashboard.outside_yemen", { item: translateText2 })}
          value={formik.values.price_outside_yemen}
          onChange={formik.handleChange}
          error={formik.touched.price_outside_yemen && Boolean(formik.errors.price_outside_yemen)}
          helperText={formik.touched.price_outside_yemen && formik.errors.price_outside_yemen}
        />

        <SubmitButton loading={UpdateFacultyPriceLoading} t={t} />
      </Box>
    </Box>
  )
}
