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
import { GET_SUPPORT_TICKET_BY_ID, UPDATE_SUPPORT_TICKET_BY_ID } from "../../graphql/supportTicketQueries";
import { INITIATE_ONLINE_PAYMENT } from "../../graphql/transactionQueries";
import { ticketTypes } from "../../constants";
import logger from "../../utils/logger";
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UniversityCard from "../../components/UniversityCard";
import GraduationCertificate from "../../components/Certificates/GraduationCertificate";
import StudentAffidavit from "../../components/Certificates/StudentAffidavit";
import AcademicTranscript from "../../components/Certificates/AcademicTranscript";
import GraduationEnrollmentStatement from "../../components/Certificates/GraduationEnrollmentStatement";
import StudentFormalAffidavit from "../../components/Certificates/StudentFormalAffidavit";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import SummerCourseIcon from '@mui/icons-material/School';

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
    const [initiateOnlinePayment, { loading: initiatingPayment }] = useMutation(INITIATE_ONLINE_PAYMENT);

    const ticket = data?.getSupportTicketById;

    const { data: regData } = useQuery(GET_REGISTERATION_FORM_BY_USER_ID, {
        variables: { user_id: ticket?.user_id?.id },
        skip: !ticket?.user_id?.id
    });

    const registrationData = regData?.getRegisterFormByUserId;

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
                await UpdateSupportTicket({
                    variables: {
                        id,
                        input: {
                            admin_reply: values.admin_reply,
                            status: "closed"
                        }
                    }
                });
                notify(t("success"), "success");
                refetch();
            } catch (err) {
                notify(t("error"), "error");
            }
        },
    });

    const handlePay = async () => {
        if (!ticket || !me) return;

        const totalAmount = ticket.fees.reduce((sum, fee) => {
            return sum + (me?.is_inside_yemen ? fee.inside_yemen_value : fee.outside_yemen_value);
        }, 0);

        try {
            const paymentInput = {
                transaction_type_id: "69de135ce9799b76cf8806a8",
                user_id: me?.id,
                support_ticket_id: id,
                source_type: "SUPPORT_TICKET",
                fees_type_ids: ticket.fees.map(f => f.id),
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

    const typeLabel = isArabic ? ticketTypes.find(el => el.id === ticket?.type)?.labelAr : ticketTypes.find(el => el.id === ticket?.type)?.labelEn;

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
                            {isArabic ? "النوع:" : "Type:"} {typeLabel || ticket?.type}
                        </Typography>
                        {ticket?.type === 'summer_course' && me?.role === 'admin' && (
                            <Button
                                variant="contained"
                                startIcon={<SummerCourseIcon />}
                                onClick={() => navigate(`/SummerCourseAdmin/${id}/${ticket?.user_id?.id}`)}
                                sx={{ mt: 1, mb: 2 }}
                            >
                                {isArabic ? "إدارة موادsummer" : "Manage Summer Materials"}
                            </Button>
                        )}
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            {isArabic ? "تاريخ الإنشاء:" : "Created At:"} {new Date(parseInt(ticket?.createdAt)).toLocaleString()}
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{isArabic ? "الرسالة:" : "Message:"}</Typography>
                        <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-wrap' }}>{ticket?.message}</Typography>

                        {ticket?.attachment && (
                            <Box sx={{ mb: 4 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => window.open(ticket.attachment, '_blank')}
                                >
                                    {isArabic ? "عرض المرفق" : "View Attachment"}
                                </Button>
                            </Box>
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
                            {me?.role === "admin" && ticket?.status === 'open' && (
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <SubmitButton loading={updatingTicket} t={t} />
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
                                {ticket.transaction_id ? (
                                    <>
                                        <CheckCircleIcon color="success" />
                                        <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold' }}>
                                            {isArabic ? "تم الدفع" : "Paid"}
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

                            {!ticket.transaction_id && me?.role === "student" && (
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

                            {ticket.transaction_id && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                                    <Typography variant="caption" display="block">
                                        {isArabic ? "رقم المعاملة:" : "Transaction ID:"} #{ticket.transaction_id.serial}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        {isArabic ? "طريقة الدفع:" : "Payment Method:"} {ticket.transaction_id.payment_method_type}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        {isArabic ? "التاريخ:" : "Date:"} {new Date(parseInt(ticket.transaction_id.transaction_date)).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )}
                    :
                </Grid>

                {/* Printable Documents Section */}
                {(ticket?.transaction_id?.approval_status === "APPROVED" || ticket?.payment_status === "paid") && (
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                                {isArabic ? "المستندات المتاحة للطباعة" : "Printable Documents"}
                            </Typography>

                            {ticket?.type === 'university_card' && (
                                <UniversityCard studentData={ticket.user_id} registrationData={registrationData} />
                            )}

                            {ticket?.type === 'graduation_certificate' && (
                                <GraduationCertificate studentId={ticket.user_id?.id} />
                            )}

                            {ticket?.type === 'university_certificate' && (
                                <StudentAffidavit studentData={ticket.user_id} registrationData={registrationData} />
                            )}

                            {ticket?.type === 'success_statement' && (
                                <AcademicTranscript studentId={ticket.user_id?.id} registrationData={registrationData} />
                            )}

                            {ticket?.type === 'registration_suspension' && (
                                <GraduationEnrollmentStatement studentData={ticket.user_id} registrationData={registrationData} />
                               )}
                               {/* <GraduationEnrollmentStatement
                                    studentData={ticket.user_id}
                                    registrationData={registrationData}
                                /> */}
                            {(ticket?.type === 'university_certificate' || ticket?.type === 'success_statement' || ticket?.type === 'registration_suspension' || ticket?.type === 'graduation_enrollment') && (
                                <StudentFormalAffidavit 
                                    ticketType={ticket.type} 
                                    studentData={ticket.user_id} 
                                    registrationData={registrationData}  />
                               
                            )}

                            {(ticket?.type === 'university_certificate' ||
                                ticket?.type === 'success_statement' ||
                                ticket?.type === 'registration_suspension' ||
                                ticket?.type === 'graduation_enrollment') && (
                                    <StudentFormalAffidavit
                                        ticketType={ticket.type}
                                        studentData={ticket.user_id}
                                        registrationData={registrationData}
                                    />
                                )}

                            {/* Special case for the new one "قيد تخرج" - usually mapped to a type */}
                            {/* If the subject contains "تخرج" or similar, or just based on type */}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
