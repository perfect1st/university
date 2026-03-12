import { useTheme } from '@emotion/react';
import { Box, useMediaQuery, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from "../../i18n/i18n";
import { useMutation } from '@apollo/client/react';
import { UPDATE_COUNTRY_BY_ID } from '../../graphql/countriesQueries';
import SubmitButton from '../../components/Utilities/SubmitButton';
import HorizentalTextField from '../../components/Utilities/HorizentalTextField';
import Header from '../../components/PageHeader/header';
import notify from '../../components/notify';
import * as Yup from "yup";
import { useFormik } from 'formik';



export default function CountryDetailsPage() {
    const theme = useTheme();
      const { t } = useTranslation();
      const isArabic = i18n.language === "ar";
      const navigate = useNavigate();
      const isMobile = useMediaQuery(theme.breakpoints.down("md"));
      const location = useLocation();

      const [
          UpdateCountry,
          {
            data,
            loading,
            error
          }
        ] = useMutation(
          UPDATE_COUNTRY_BY_ID,
          {
            fetchPolicy: "network-only"
          }
        );

         const formik = useFormik({
            initialValues: {
              name_ar: location?.state?.name_ar,
              name_en: location?.state?.name_en,
              is_local: location?.state?.is_local || false,
            },
        
            validationSchema: Yup.object({
              name_ar: Yup.string().required(t("admissions.errors.required")),
              name_en: Yup.string().required(t("admissions.errors.required")),
              is_local: Yup.boolean(),
            }),
            onSubmit: async (values) => {
              const data = {
                name_ar: values?.name_ar,
                name_en: values.name_en,
                is_local: values.is_local
              };
              try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);
        
                const result = await UpdateCountry(
                  {
                    variables: {
                      id: location?.state?.id,
                      input: data
                    }
                  });
        
                console.log('result', result);
        
                notify(t("success"), "success");
        
                setTimeout(() => navigate('/countries'), 2000);
        
              } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");
        
              } finally {
                //  setIsLoading(false);
              }
            },
          });
      console.log("location", location);

      let translateText = isArabic ? "دولة" : "Country";
    let translateText2 = isArabic ? "الدولة" : "Country";
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={t("countries")}
        subtitle={t("detailsItem", { item: translateText2 })}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={t("detailsItem", { item: translateText2 })}
        hasNavigate={true}
        // btn={t("addItem", { item: translateText })}
        // btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        //  onSubmit={addUserNavigate}
        isExcel={false}
        isPdf={false}
        isPrinter={false}
      />
      <Box component="form" onSubmit={formik.handleSubmit} fullWidth>

        <HorizentalTextField
          title={t("form.name_ar", { item: translateText2 })}
          fieldID={"name_ar"}
          fieldName={"name_ar"}
          placeholder={t("form.name_ar", { item: translateText2 })}
          value={formik.values.name_ar}
          onChange={formik.handleChange}
          error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
          helperText={formik.touched.name_ar && formik.errors.name_ar}
        />


        <HorizentalTextField
          title={t("form.name_en" , { item: translateText2 })}
          fieldID={"name_en"}
          fieldName={"name_en"}
          placeholder={t("form.name_en" , { item: translateText2 })}
          value={formik.values.name_en}
          onChange={formik.handleChange}
          error={formik.touched.name_en && Boolean(formik.errors.name_en)}
          helperText={formik.touched.name_en && formik.errors.name_en}
        />

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          px: isMobile ? 0 : 1
        }}>
          <FormControlLabel
            control={
              <Checkbox
                id="is_local"
                name="is_local"
                checked={formik.values.is_local}
                onChange={formik.handleChange}
                color="primary"
              />
            }
            label={t("isLocalCountry")}
            sx={{
              flexDirection: "row",
              "& .MuiFormControlLabel-label": {
                fontWeight: 500,
                color: theme.palette.text.secondary
              }
            }}
          />
        </Box>

        

       

        <SubmitButton t={t} loading={loading} />

      </Box>
    </Box>
  )
}
