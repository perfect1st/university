import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Header from "../../components/PageHeader/header";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import i18n from "../../i18n/i18n";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import notify from "../../components/notify";
import { UPDATE_REGISTER_FORM } from "../../graphql/registerationFormQueries";

export default function RegisterFormDetailsPage() {
    const { t } = useTranslation();
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isArabic = i18n.language === "ar";

    const formData = location.state;

    const [updateRegisterForm, { loading: updating }] = useMutation(UPDATE_REGISTER_FORM);

    const formik = useFormik({
        initialValues: {
            first_name: formData?.first_name || "",
            second_name: formData?.second_name || "",
            third_name: formData?.third_name || "",
            fourth_name: formData?.fourth_name || "",
            email: formData?.email || "",
            mobile: formData?.mobile || "",
            home_tel: formData?.home_tel || "",
            gender: formData?.gender || "male",
            birthdate: formData?.birthdate || "",
            address: formData?.address || "",
            education_year: formData?.education_year || "",
            study_place: formData?.study_place || "",
            high_school_student_number: formData?.high_school_student_number || "",
            general_grade: formData?.general_grade || "",
            gpa: formData?.gpa || "",
            national_id_type: formData?.national_id_type || "id_card",
            national_id: formData?.national_id || "",
            is_inside_yemen: formData?.is_inside_yemen ?? true,
            status: formData?.status || "pending",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            first_name: Yup.string().required(t("admissions.errors.required")),
            email: Yup.string().email(t("admissions.errors.email")).required(t("admissions.errors.required")),
            mobile: Yup.string().required(t("admissions.errors.required")),
        }),
        onSubmit: async (values) => {
            try {
                const input = {
                    ...values,
                    is_inside_yemen: values.is_inside_yemen === "true" || values.is_inside_yemen === true,
                };
                
                delete input.id;
                delete input.__typename;

                await updateRegisterForm({
                    variables: {
                        id: id,
                        input: input
                    }
                });
                notify(t("success"), "success");
                navigate("/registerForms");
            } catch (error) {
                console.error("Update error:", error);
                notify(error.message || t("error"), "error");
            }
        }
    });

    if (!formData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    {t("No data found")}
                </Typography>
            </Box>
        );
    }

    const fullName = `${formik.values.first_name || ""} ${formik.values.second_name || ""} ${formik.values.third_name || ""} ${formik.values.fourth_name || ""}`.trim();
    const facultyTitle = isArabic ? formData?.faculty_id?.title_ar : formData?.faculty_id?.title_en;
    const departmentTitle = isArabic ? formData?.faculty_department_id?.title_ar : formData?.faculty_department_id?.title_en;
    const academyTermTitle = isArabic ? formData?.academyTerm_id?.title_ar : formData?.academyTerm_id?.title_en;
    const createdAtDate = formData?.createdAt ? formatDateToString(new Date(Number(formData.createdAt))) : "";

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("registerForms.editTitle") || t("Edit Registration Form")}
                subtitle={fullName}
                i18n={i18n}
                haveBtn={false}
            />

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 1, backgroundColor: theme.palette.background.default }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
                            {t("registerForms.personalInfo")}
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("admissions.firstName")} fieldName="first_name" value={formik.values.first_name} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("admissions.secondName")} fieldName="second_name" value={formik.values.second_name} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("admissions.thirdName")} fieldName="third_name" value={formik.values.third_name} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("admissions.fourthName")} fieldName="fourth_name" value={formik.values.fourth_name} onChange={formik.handleChange} />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("Email")} fieldName="email" value={formik.values.email} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("Mobile")} fieldName="mobile" value={formik.values.mobile} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.homeTel")} fieldName="home_tel" value={formik.values.home_tel} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextFieldSelect 
                            t={t}
                            title={t("admissions.gender")} 
                            fieldName="gender" 
                            value={formik.values.gender} 
                            onChange={formik.handleChange}
                            setValue={(val) => formik.setFieldValue("gender", val)}
                        >
                            <MenuItem value="male">{t("admissions.male")}</MenuItem>
                            <MenuItem value="female">{t("admissions.female")}</MenuItem>
                        </HorizentalTextFieldSelect>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.birthDate")} fieldName="birthdate" type="date" value={formik.values.birthdate} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <HorizentalTextField title={t("registerForms.address")} fieldName="address" value={formik.values.address} onChange={formik.handleChange} />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
                            {t("registerForms.academicInfo")}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("Dashboard.faculty")} value={facultyTitle || ""} isDisabled={true} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("Dashboard.facultyDepartment")} value={departmentTitle || ""} isDisabled={true} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.academyTerm")} value={academyTermTitle || ""} isDisabled={true} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.educationYear")} fieldName="education_year" value={formik.values.education_year} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.studyPlace")} fieldName="study_place" value={formik.values.study_place} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.highSchoolNumber")} fieldName="high_school_student_number" value={formik.values.high_school_student_number} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.generalGrade")} fieldName="general_grade" value={formik.values.general_grade} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.gpa")} fieldName="gpa" value={formik.values.gpa} onChange={formik.handleChange} />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
                            {t("registerForms.identificationStatus")}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <HorizentalTextFieldSelect 
                            t={t}
                            title={t("registerForms.idType")} 
                            fieldName="national_id_type" 
                            value={formik.values.national_id_type} 
                            onChange={formik.handleChange}
                            setValue={(val) => formik.setFieldValue("national_id_type", val)}
                        >
                            <MenuItem value="id_card">{t("registerForms.idTypeOpts.id_card") || "ID Card"}</MenuItem>
                            <MenuItem value="passport">{t("registerForms.idTypeOpts.passport") || "Passport"}</MenuItem>
                            <MenuItem value="residence_permit">{t("registerForms.idTypeOpts.residence_permit") || "Residence Permit"}</MenuItem>
                        </HorizentalTextFieldSelect>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField title={t("registerForms.idNumber")} fieldName="national_id" value={formik.values.national_id} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                         <HorizentalTextFieldSelect 
                            t={t}
                            title={t("registerForms.insideYemen")} 
                            fieldName="is_inside_yemen" 
                            value={formik.values.is_inside_yemen} 
                            onChange={formik.handleChange}
                            setValue={(val) => formik.setFieldValue("is_inside_yemen", val)}
                        >
                            <MenuItem value={true}>{t("Dashboard.trueOrFalse.true")}</MenuItem>
                            <MenuItem value={false}>{t("Dashboard.trueOrFalse.false")}</MenuItem>
                        </HorizentalTextFieldSelect>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextFieldSelect 
                            t={t}
                            title={t("Status")} 
                            fieldName="status" 
                            value={formik.values.status} 
                            onChange={formik.handleChange}
                            setValue={(val) => formik.setFieldValue("status", val)}
                        >
                            <MenuItem value="pending">{t("registerForms.status.pending")}</MenuItem>
                            <MenuItem value="accepted">{t("registerForms.status.accepted")}</MenuItem>
                            <MenuItem value="rejected">{t("registerForms.status.rejected")}</MenuItem>
                        </HorizentalTextFieldSelect>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
                            {t("registerForms.documents")}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <HorizentalTextField 
                            title={t("registerForms.highSchoolCertificate")} 
                            value={formData?.high_school_certificate_file} 
                            fieldName="high_school_certificate_file"
                            type="file" 
                            isDisabled={true} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField 
                            title={t("registerForms.paidDocument")} 
                            value={formData?.paid_document_file} 
                            fieldName="paid_document_file"
                            type="file" 
                            isDisabled={true} 
                            placeholder={t("registerForms.noFile")}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                        <SubmitButton loading={updating} t={t} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
