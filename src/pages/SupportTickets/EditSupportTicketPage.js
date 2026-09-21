import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Divider, Grid, MenuItem, Paper, Typography, useMediaQuery, Button, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import HorizentalTextField from "../../components/Utilities/HorizentalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_SUPPORT_TICKET_BY_ID, UPDATE_SUPPORT_TICKET_BY_ID, REPLY_SUPPORT_TICKET } from "../../graphql/supportTicketQueries";
import { INITIATE_ONLINE_PAYMENT } from "../../graphql/transactionQueries";
import { ticketTypes } from "../../constants";
import logger from "../../utils/logger";
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UniversityCard from "../../components/UniversityCard";
import GraduationCertificate from "../../components/Certificates/GraduationCertificate";
import StudentAffidavit from "../../components/Certificates/StudentAffidavit";
import AcademicTranscript from "../../components/Certificates/AcademicTranscript";
import GraduationEnrollmentStatement from "../../components/Certificates/GraduationEnrollmentStatement";
import StudentFormalAffidavit from "../../components/Certificates/StudentFormalAffidavit";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import SummerCourseIcon from '@mui/icons-material/School';
import axios from "axios";
import { baseURL } from "../../Api/apolloClient";

export default function EditSupportTicketPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const { id } = useParams();
    const me = useSelector((state) => state.user.loggedUser);

    const { data, loading, error, refetch } = useQuery(GET_SUPPORT_TICKET_BY_ID, {
        variables: { id },
        fetchPolicy: "network-only"
    });

    const [UpdateSupportTicket, { loading: updatingTicket }] = useMutation(UPDATE_SUPPORT_TICKET_BY_ID);
    const [ReplySupportTicket, { loading: replyingTicket }] = useMutation(REPLY_SUPPORT_TICKET);
    const [initiateOnlinePayment, { loading: initiatingPayment }] = useMutation(INITIATE_ONLINE_PAYMENT);

    const [adminAttachmentUrl, setAdminAttachmentUrl] = useState("");
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const ticket = data?.getSupportTicketById;

    const { data: regData } = useQuery(GET_REGISTERATION_FORM_BY_USER_ID, {
        variables: { user_id: ticket?.user_id?.id },
        skip: !ticket?.user_id?.id
    });

    const registrationData = regData?.getRegisterFormByUserId;

    const handleAdminAttachmentUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        setUploadingAttachment(true);
        try {
            setUploadProgress(1);
            const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
                onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total)),
            });
            setAdminAttachmentUrl(res?.data?.url);
            notify(isArabic ? "تم رفع المستند بنجاح" : "Document uploaded successfully", "success");
        } catch (err) {
            notify(isArabic ? "فشل رفع المستند" : "Failed to upload document", "error");
        } finally {
            setUploadingAttachment(false);
            setTimeout(() => setUploadProgress(0), 2000);
        }
    };

    const formik = useFormik({
        initialValues: {
            admin_reply: ticket?.admin_reply || "",
            status: ticket?.status || "open"
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            admin_reply: me?.role === "admin" ? Yup.string().required(t("admissions.errors.required")) : Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                if (me?.role === "admin") {
                    await ReplySupportTicket({
                        variables: {
                            id,
                            admin_reply: values.admin_reply,
                            admin_attachment: adminAttachmentUrl || ticket?.admin_attachment || null
                        }
                    });
                } else {
                    await UpdateSupportTicket({
                        variables: {
                            id,
                            input: {
                                admin_reply: values.admin_reply,
                                status: "closed"
                            }
                        }
                    });
                }
                notify(t("success"), "success");
                refetch();
            } catch (err) {
                notify(t("error"), "error");
            }
        },
    });

    const handlePay = async () => {
        if (!ticket || !me) return;

        const totalAmount = ticket.fees?.reduce((sum, fee) => {
            return sum + (me?.is_inside_yemen ? fee.inside_yemen_value : fee.outside_yemen_value);
        }, 0) || ticket.fee_amount || 0;

        try {
            const paymentInput = {
                transaction_type_id: "69de135ce9799b76cf8806a8",
                user_id: me?.id,
                support_ticket_id: id,
                source_type: "SUPPORT_TICKET",
                fees_type_ids: (ticket.fees || []).map(f => f.id),
                amount: totalAmount,
                customer_name: me?.fullname,
                customer_email: me?.email,
                customer_mobile: me?.mobile,
                language: isArabic ? "ar" : "en"
            };

            const paymentResult = await initiateOnlinePayment({
                variables: { input: paymentInput }
            });

            if (paymentResult?.data?.initiateOnlinePayment?.paymentUrl) {
                window.location.href = paymentResult.data.initiateOnlinePayment.paymentUrl;
            }
        } catch (err) {
            notify(t("error"), "error");
        }
    };

    if (loading) return <LoadingPage />;
    if (error) return <Typography color="error">Error loading ticket</Typography>;

    const typeLabel = ticket?.ticket_type_id
        ? (isArabic ? (ticket.ticket_type_id.label_ar || ticket.ticket_type_id.label_en) : (ticket.ticket_type_id.label_en || ticket.ticket_type_id.label_ar))
        : (isArabic ? ticketTypes.find(el => el.id === ticket?.type)?.labelAr : ticketTypes.find(el => el.id === ticket?.type)?.labelEn) || ticket?.type;

    const typeIdentifier = (ticket?.type || ticket?.ticket_type_id?.label_en || ticket?.ticket_type_id?.label_ar || "").toLowerCase();
    const isSummerCourse = typeIdentifier.includes('summer') || typeIdentifier.includes('صيفي');
    const isMaterialEquivalence = typeIdentifier.includes('equivalence') || typeIdentifier.includes('معادلة');

    const isUnivCard = ticket?.type === 'university_card' || typeIdentifier.includes('card') || typeIdentifier.includes('بطاقة') || typeIdentifier.includes('كارنيه');
    const isGradCert = ticket?.type === 'graduation_certificate' || (typeIdentifier.includes('graduation') && typeIdentifier.includes('cert')) || typeIdentifier.includes('تخرج');
    const isSuccessStatement = ticket?.type === 'success_statement' || typeIdentifier.includes('transcript') || typeIdentifier.includes('success') || typeIdentifier.includes('نجاح') || typeIdentifier.includes('درجات');
    const isRegSuspension = ticket?.type === 'registration_suspension' || typeIdentifier.includes('suspension') || typeIdentifier.includes('إيقاف قيد');
    const isAffidavit = ticket?.type === 'university_certificate' || isSuccessStatement || isRegSuspension || ticket?.type === 'graduation_enrollment';

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper", minHeight: "100vh" }}>
            <Header
                title={t("Dashboard.support")}
                subtitle={isArabic ? `تفاصيل التذكرة #${ticket?.serial}` : `Ticket Details #${ticket?.serial}`}
                i18n={i18n}
                hasNavigate={true}
            />

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Main Ticket Info */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{ticket?.subject}</Typography>
                            <Chip
                                label={ticket?.status === 'open' ? (isArabic ? 'مفتوحة' : 'Open') : (isArabic ? 'مغلقة' : 'Closed')}
                                color={ticket?.status === 'open' ? 'success' : 'default'}
                            />
                        </Box>

                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            {isArabic ? "نوع الطلب:" : "Request Type:"} <strong>{typeLabel || "-"}</strong>
                        </Typography>
                        {isSummerCourse && me?.role === 'admin' && (
                            <Button
                                variant="contained"
                                startIcon={<SummerCourseIcon />}
                                onClick={() => navigate(`/SummerCourseAdmin/${id}/${ticket?.user_id?.id}`)}
                                sx={{ mt: 1, mb: 2 }}
                            >
                                {isArabic ? "إدارة مواد الترم الصيفي" : "Manage Summer Materials"}
                            </Button>
                        )}
                        {isMaterialEquivalence && me?.role === 'admin' && (
                            <Button
                                variant="contained"
                                startIcon={<SummerCourseIcon />}
                                onClick={() => navigate(`/MaterialEquivalence/${id}/${ticket?.user_id?.id}`)}
                                sx={{ mt: 1, mb: 2, gap: 1 }}
                            >
                                {isArabic ? "إدارة مواد المعادلة" : "Manage Materials Equivalence"}
                            </Button>
                        )}
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            {isArabic ? "تاريخ الإنشاء:" : "Created At:"} {ticket?.createdAt ? new Date(parseInt(ticket.createdAt)).toLocaleString() : "-"}
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{isArabic ? "الرسالة:" : "Message:"}</Typography>
                        <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-wrap' }}>{ticket?.message}</Typography>

                        {ticket?.attachment && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                                    {isArabic ? "مرفق الطالب:" : "Student Attachment:"}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => window.open(ticket.attachment, '_blank')}
                                >
                                    {isArabic ? "عرض مرفق الطالب" : "View Student Attachment"}
                                </Button>
                            </Box>
                        )}

                        {/* Official Document Download Card for Student / Admin */}
                        {ticket?.admin_attachment && (
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2.5,
                                    mb: 3,
                                    borderRadius: 2,
                                    bgcolor: '#f0fdf4',
                                    border: '1px solid #86efac',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <CheckCircleIcon color="success" sx={{ fontSize: 34 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'success.dark' }}>
                                            {isArabic ? "المستند الرسمي الصادر من الإدارة" : "Official Document Issued by Admin"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {isArabic ? "تم إصدار المستند المطلوب واعتماده رسمياً، يمكنك تحميل الملف الصادر الآن." : "The requested document has been issued and approved. You can download it now."}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<DownloadIcon />}
                                    href={ticket.admin_attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    sx={{ fontWeight: 700, px: 3, py: 1 }}
                                >
                                    {isArabic ? "تحميل المستند الصادر" : "Download Issued Document"}
                                </Button>
                            </Paper>
                        )}

                        <Divider sx={{ mb: 3 }} />

                        {/* Admin Reply Section */}
                        <Box component="form" onSubmit={formik.handleSubmit}>
                            <HorizentalTextField
                                isMultiline={true}
                                title={t("Dashboard.adminReply")}
                                fieldID={"admin_reply"}
                                fieldName={"admin_reply"}
                                value={formik.values.admin_reply}
                                onChange={formik.handleChange}
                                error={formik.touched.admin_reply && Boolean(formik.errors.admin_reply)}
                                helperText={formik.touched.admin_reply && formik.errors.admin_reply}
                                isDisabled={me?.role !== "admin" || ticket?.status === 'closed'}
                            />

                            {/* Admin Document Attachment Upload */}
                            {me?.role === "admin" && ticket?.status === 'open' && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachFileIcon color="primary" />
                                        {isArabic ? "إرفاق المستند / الشهادة الرسمية الصادرة للطالب:" : "Attach Issued Document / Certificate for Student:"}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<CloudUploadIcon />}
                                            disabled={uploadingAttachment}
                                        >
                                            {isArabic ? "اختيار ملف المستند (PDF / صور)" : "Choose Document (PDF / Images)"}
                                            <input
                                                type="file"
                                                hidden
                                                accept=".pdf,.png,.jpg,.jpeg,.webp"
                                                onChange={handleAdminAttachmentUpload}
                                            />
                                        </Button>
                                        {uploadingAttachment && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={20} />
                                                <Typography variant="caption">{uploadProgress}%</Typography>
                                            </Box>
                                        )}
                                        {adminAttachmentUrl && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon color="success" fontSize="small" />
                                                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                                    {isArabic ? "تم تجهيز المستند للإرسال مع الرد" : "Document ready to send with reply"}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    onClick={() => window.open(adminAttachmentUrl, '_blank')}
                                                >
                                                    {isArabic ? "معاينة" : "Preview"}
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            )}

                            {me?.role === "admin" && ticket?.status === 'open' && (
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <SubmitButton loading={updatingTicket || replyingTicket} t={t} />
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Sidebar Info: Fees and Payment */}
                <Grid item xs={12} md={4}>
                    {ticket?.has_fees && (
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <PaymentIcon color="primary" />
                                {isArabic ? "رسوم التذكرة" : "Ticket Fees"}
                            </Typography>

                            {ticket.fee_amount > 0 && (
                                <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f4f6f8', borderRadius: 1.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                        {isSummerCourse
                                            ? (isArabic ? "رسوم المواد الصيفية" : "Summer Course Fees")
                                            : (isArabic ? "إجمالي الرسوم المطلوبة" : "Total Required Fees")}
                                    </Typography>
                                    <Typography variant="h5" color="primary" sx={{ fontWeight: 800, mt: 0.5 }}>
                                        {ticket.fee_amount}
                                    </Typography>
                                </Box>
                            )}

                            {ticket.fees?.map(fee => (
                                <Box key={fee.id} sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {isArabic ? fee.title_ar : fee.title_en}
                                    </Typography>
                                    <Typography variant="body1" color="primary">
                                        {me?.is_inside_yemen ? fee.inside_yemen_value : fee.outside_yemen_value}
                                    </Typography>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {ticket.payment_status === "paid" || ticket.transaction_id?.approval_status === "APPROVED" || ticket.installment_id?.is_paid ? (
                                    <>
                                        <CheckCircleIcon color="success" />
                                        <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold' }}>
                                            {isArabic ? "تم الدفع واعتماد الرسوم" : "Paid & Approved"}
                                        </Typography>
                                    </>
                                ) : ticket.transaction_id?.approval_status === "PENDING" ? (
                                    <>
                                        <HourglassEmptyIcon color="warning" />
                                        <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                                            {isArabic ? "قيد المراجعة والتدقيق" : "Pending Review"}
                                        </Typography>
                                    </>
                                ) : ticket.transaction_id?.approval_status === "REJECTED" ? (
                                    <>
                                        <ErrorIcon color="error" />
                                        <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 'bold' }}>
                                            {isArabic ? "مرفوض" : "Rejected"}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <ErrorIcon color="error" />
                                        <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 'bold' }}>
                                            {isArabic ? "لم يتم الدفع بعد" : "Not Paid Yet"}
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            {(ticket.payment_status !== "paid" && (!ticket.transaction_id || ticket.transaction_id.approval_status === "REJECTED") && !ticket.installment_id?.is_paid) && me?.role === "student" && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={initiatingPayment ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                                    onClick={handlePay}
                                    disabled={initiatingPayment}
                                    sx={{ mt: 2 }}
                                >
                                    {isArabic ? "ادفع الآن" : "Pay Now"}
                                </Button>
                            )}

                            {ticket?.transaction_id?.approval_status === "PENDING" && ticket?.transaction_id?.myfatoorah_payment_url && me?.role === "student" && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="warning"
                                    startIcon={<PaymentIcon />}
                                    onClick={() => {
                                        window.location.href = ticket.transaction_id.myfatoorah_payment_url;
                                    }}
                                    sx={{ mt: 2 }}
                                >
                                    {isArabic ? "إكمال عملية الدفع" : "Continue Payment"}
                                </Button>
                            )}

                            {ticket.transaction_id && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                                    <Typography variant="caption" display="block">
                                        {isArabic ? "رقم المعاملة:" : "Transaction ID:"} #{ticket.transaction_id.serial}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        {isArabic ? "طريقة الدفع:" : "Payment Method:"} {ticket.transaction_id.payment_method_type}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        {isArabic ? "التاريخ:" : "Date:"} {/^\d+$/.test(ticket.transaction_id.transaction_date) ? new Date(parseInt(ticket.transaction_id.transaction_date)).toLocaleDateString() : ticket.transaction_id.transaction_date}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )}
                </Grid>

                {/* Printable Documents Section */}
                {(ticket?.transaction_id?.approval_status === "APPROVED" || ticket?.payment_status === "paid" || ticket?.installment_id?.is_paid) && (
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                                {isArabic ? "المستندات المتاحة للطباعة" : "Printable Documents"}
                            </Typography>

                            {isUnivCard && (
                                <UniversityCard studentData={ticket.user_id} registrationData={registrationData} />
                            )}

                            {isGradCert && (
                                <GraduationCertificate studentId={ticket.user_id?.id} />
                            )}

                            {isSuccessStatement && !isGradCert && (
                                <AcademicTranscript studentId={ticket.user_id?.id} registrationData={registrationData} />
                            )}

                            {isRegSuspension && (
                                <GraduationEnrollmentStatement studentData={ticket.user_id} registrationData={registrationData} />
                            )}

                            {isAffidavit && (
                                <StudentFormalAffidavit
                                    ticketType={ticket.type || "university_certificate"}
                                    studentData={ticket.user_id}
                                    registrationData={registrationData}
                                />
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
