import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../../components/PageHeader/header";
import i18n from "../../i18n/i18n";
import SaveIcon from '@mui/icons-material/Save';

export default function AddNationalityPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const formik = useFormik({
    initialValues: {
      name_ar: "",
      name_en: "",
      flag: "",
    },
    // t("admissions.errors.required")
    validationSchema: Yup.object({
      name_ar: Yup.string().required(t("admissions.errors.required")),
      name_en: Yup.string().required(t("admissions.errors.required")),
      //  password: Yup.string()
      //    .min(6, t("validation.passwordMin"))
      //    .required(t("validation.passwordRequired")),
    }),
    onSubmit: async (values) => {
      const data = {
        identifier: values.username,
        password: values.password,
      };
      try {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
      } catch (error) {
        console.error("Error logging in:", error);
      } finally {
        //  setIsLoading(false);
      }
    },
  });

   let translateText = isArabic ? "جنسية" : "Nationality";
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("Nationalities")}
        subtitle={t("addItem", { item: translateText })}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={t("addItem", { item: translateText })}
        hasNavigate={true}
        // btn={t("addItem", { item: translateText })}
        // btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        //  onSubmit={addUserNavigate}
        isExcel={false}
        isPdf={false}
        isPrinter={false}
        // onExcel={() => fetchAndExport("excel")}
        // onPdf={() => fetchAndExport("pdf")}
        // onPrinter={() => fetchAndExport("print")}
      />
      <Box component="form" onSubmit={formik.handleSubmit} fullWidth>
        {/* <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            {t("form.login")}
          </Typography> */}

        {/* Username */}
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
          {t("form.name_ar")}
        </Typography>
        <TextField
          fullWidth
          id="name_ar"
          name="name_ar"
          placeholder={t("form.name_ar")}
          value={formik.values.name_ar}
          onChange={formik.handleChange}
          error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
          helperText={formik.touched.name_ar && formik.errors.name_ar}
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
          {t("form.name_en")}
        </Typography>
        <TextField
          fullWidth
          id="name_en"
          name="name_en"
          placeholder={t("form.name_en")}
          value={formik.values.name_en}
          onChange={formik.handleChange}
          error={formik.touched.name_en && Boolean(formik.errors.name_en)}
          helperText={formik.touched.name_en && formik.errors.name_en}
          variant="outlined"
          sx={{ mb: 3 }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 1, mb: 2, py: 1.5 , display: "flex", gap: 0.5 }}
        >
          {/* {isLoading ? (
              <CircularProgress
                size={26}
                thickness={8}
                sx={{ color: "#fff" }}
              />
            ) : (
              t("form.loginButton")
            )} */}
          {t("form.save")}
          <SaveIcon sx={{  }} />
        </Button>

        {/* Forgot Password */}
        {/* <Link
            href="#"
            variant="body2"
            underline="hover"
            sx={{ display: 'block', textAlign: 'center' }}
          >
            {t('form.forgotPassword')}
          </Link> */}
      </Box>
    </Box>
  );
}
