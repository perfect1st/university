import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme, MenuItem, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Header from "../../components/PageHeader/header";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import i18n from "../../i18n/i18n";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import notify from "../../components/notify";
import { UPDATE_REGISTER_FORM } from "../../graphql/registerationFormQueries";
import { GET_TRANSACTIONS_BY_USER } from "../../graphql/transactionQueries";
import { baseURL } from '../../Api/apolloClient';
import { Button } from '@mui/material';

export default function RegisterFormDetailsPage() {
    const { t } = useTranslation();
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isArabic = i18n.language === "ar";

    const formData = location.state;
    console.log("formData", formData);
    const [updateRegisterForm, { loading: updating }] = useMutation(UPDATE_REGISTER_FORM);

    const { data: transactionsData, loading: loadingTransactions } = useQuery(GET_TRANSACTIONS_BY_USER, {
        variables: { user_id: formData?.user_id?.id },
        skip: !formData?.user_id?.id
    });

    const transactions = transactionsData?.getTransactionsByUser || [];

    const [uploadStates, setUploadStates] = useState({
        high_school_certificate_file: { isUploading: false, progress: 0 },
        paid_document_file: { isUploading: false, progress: 0 }
    });

    const handleFileUpload = (e, fieldName) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadStates(prev => ({
            ...prev,
            [fieldName]: { isUploading: true, progress: 0 }
        }));

        const uploadData = new FormData();
        uploadData.append("file", file);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadStates(prev => ({
                    ...prev,
                    [fieldName]: { ...prev[fieldName], progress: percent }
                }));
            }
        });

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    formik.setFieldValue(fieldName, `${baseURL}${data?.url}`);
                    notify(t("admissions.uploadSuccess") || "Uploaded successfully", "success");
                } catch (error) {
                    notify(t("admissions.errorUplaod") || "Upload failed", "error");
                }
            } else {
                notify(t("admissions.errorUplaod") || "Upload failed", "error");
            }
            setUploadStates(prev => ({
                ...prev,
                [fieldName]: { isUploading: false, progress: 0 }
            }));
        });

        xhr.addEventListener("error", () => {
            notify(t("admissions.errorUplaod") || "Upload failed", "error");
            setUploadStates(prev => ({
                ...prev,
                [fieldName]: { isUploading: false, progress: 0 }
            }));
        });

        xhr.open("POST", `${baseURL}/api/forms/single`);
        xhr.send(uploadData);
    };

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
            gpa: String(formData?.gpa || ""),
            national_id_type: formData?.national_id_type || "id_card",
            national_id: formData?.national_id || "",
            is_inside_yemen: formData?.is_inside_yemen ?? true,
            status: formData?.status || "pending",
            user_id: formData?.user_id?.id || "",
            nationality_id: formData?.nationality_id?.id || "",
            faculty_id: formData?.faculty_id?.id || "",
            faculty_department_id: formData?.faculty_department_id?.id || "",
            country_id: formData?.country_id?.id || "",
            city_id: formData?.city_id?.id || "",
            academyTerm_id: formData?.academyTerm_id?.id || "",
            paid_document_file: formData?.paid_document_file || "null",
            high_school_certificate_file: formData?.high_school_certificate_file || "null",
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
                
                // Remove helper/noise fields if any, though formik values are mostly clean here
                // We must ensure that we don't send objects, only strings/booleans as expected by the type
                // The current input object constructed from values should be correct now
                
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
                            value={formik.values.high_school_certificate_file} 
                            fieldName="high_school_certificate_file"
                            type="file" 
                            isDisabled={false} 
                            handleChange={(e) => handleFileUpload(e, "high_school_certificate_file")}
                        />
                        {uploadStates.high_school_certificate_file.isUploading && (
                            <Box sx={{ width: '100%', mt: -2, mb: 2 }}>
                                <LinearProgress variant="determinate" value={uploadStates.high_school_certificate_file.progress} />
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <HorizentalTextField 
                            title={t("registerForms.paidDocument")} 
                            value={formik.values.paid_document_file} 
                            fieldName="paid_document_file"
                            type="file" 
                            isDisabled={false} 
                            handleChange={(e) => handleFileUpload(e, "paid_document_file")}
                            placeholder={t("registerForms.noFile")}
                        />
                        {uploadStates.paid_document_file.isUploading && (
                            <Box sx={{ width: '100%', mt: -2, mb: 2 }}>
                                <LinearProgress variant="determinate" value={uploadStates.paid_document_file.progress} />
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
                            {t("transactions.title")}
                        </Typography>
                    </Grid>

                    {loadingTransactions ? (
                        <Grid item xs={12}>
                            <LinearProgress />
                        </Grid>
                    ) : transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <Grid item xs={12} key={transaction.id} sx={{ mb: 3 }}>
                                <Box sx={{ 
                                    p: 3, 
                                    border: '1px solid', 
                                    borderColor: 'divider', 
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                            {t("transactions.transaction")} #{transaction.transaction_serial}
                                        </Typography>
                                        <Box sx={{ 
                                            px: 1.5, 
                                            py: 0.5, 
                                            borderRadius: 1, 
                                            backgroundColor: transaction.approval_status === 'APPROVED' ? 'success.light' : transaction.approval_status === 'REJECTED' ? 'error.light' : 'warning.light',
                                            color: '#fff',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {transaction.approval_status}
                                        </Box>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t("transactions.amount")}</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>{transaction.amount} {t("transactions.currency")}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t("transactions.date")}</Typography>
                                            <Typography variant="body1">{transaction.transaction_date}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t("transactions.paymentMethod")}</Typography>
                                            <Typography variant="body1">{transaction.payment_method_type}</Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t("transactions.type")}</Typography>
                                            <Typography variant="body1">
                                                {isArabic ? transaction.transaction_type_snapshot?.title_ar : transaction.transaction_type_snapshot?.title_en}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t("transactions.fees")}</Typography>
                                            <Box sx={{ mt: 0.5 }}>
                                                {transaction.fees_type_snapshot?.map((fee, fIdx) => (
                                                    <Typography key={fee.id} variant="body2" sx={{ backgroundColor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', mr: 1, mb: 1 }}>
                                                        {isArabic ? fee.title_ar : fee.title_en}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Grid>

                                        {transaction.rejection_reason && (
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="error" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t("transactions.rejectionReason")}</Typography>
                                                <Typography variant="body2" color="error">{transaction.rejection_reason}</Typography>
                                            </Grid>
                                        )}

                                        {transaction.payment_document_file && (
                                            <Grid item xs={12}>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small"
                                                    href={transaction.payment_document_file} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    sx={{ mt: 1 }}
                                                >
                                                    {t("transactions.viewDocument")}
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, textAlign: "center", border: '1px dashed', borderColor: 'error.main', borderRadius: 1 }}>
                                <Typography color="error" sx={{ mb: 2, fontWeight: "bold" }}>
                                    {t("transactions.notPaidMessage")}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => navigate("/transactions/add", { state: { user_id: formData.user_id, register_form_id: formData.id } })}
                                >
                                    {t("transactions.goToAdd")}
                                </Button>
                            </Box>
                        </Grid>
                    )}

                    <Grid item xs={12} sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                        <SubmitButton loading={updating} t={t} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
