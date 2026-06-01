import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { GET_SUPPORT_TICKET_TYPES_CONFIG, CREATE_SUPPORT_TICKET } from "../../graphql/supportTicketQueries";
import { INITIATE_ONLINE_PAYMENT } from "../../graphql/transactionQueries";
import { baseURL } from "../../Api/apolloClient";
import UploadFileField from "../../components/Utilities/UploadFileField";
import logger from "../../utils/logger";

export default function AddSupportTicketPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();


    const fileInputRef = useRef(null);
    const [selectedToShowFile, setSelectedToShowFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const { data: configData, loading: configLoading } = useQuery(GET_SUPPORT_TICKET_TYPES_CONFIG, {
        fetchPolicy: "network-only"
    });

    const ticketTypes = configData?.getSupportTicketTypesConfig || [];
    console.log("ticketTypes",ticketTypes);

    const me = useSelector((state) => state.user.loggedUser);

    const [
        CreateSupportTicket, {
            loading: creatingTicket
        }

    ] = useMutation(CREATE_SUPPORT_TICKET, { fetchPolicy: "network-only" });

    const [initiateOnlinePayment, { loading: initiatingPayment }] = useMutation(INITIATE_ONLINE_PAYMENT);

    const formik = useFormik({
        initialValues: {
            subject: "",
            message: "",
            attachment: "",
            fees: []
        },

        validationSchema: Yup.object({
            message: Yup.string().required(t("admissions.errors.required")),
            subject: Yup.string().required(t("admissions.errors.required")),
            selectedType: Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
        }),
        onSubmit: async (values) => {
            let data = {
                subject: values?.subject,
                message: values?.message,
                type: values.selectedType,
                user_id: me?.id,
                attachment: values.attachment,
                fees: values.fees
            };



            try {
                logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
                // logger.log(data);

                //  return;
                const result = await CreateSupportTicket({
                    variables: {
                        input: data
                    }
                });

                logger.log('result', result);

                if (selectedTypeData?.requires_fee) {
                    const totalAmount = selectedTypeData.fees.reduce((sum, fee) => {
                        return sum + (me?.is_inside_yemen ? fee.inside_yemen_value : fee.outside_yemen_value);
                    }, 0);

                    const paymentInput = {
                        transaction_type_id: "69de135ce9799b76cf8806a8",
                        user_id: me?.id,
                        support_ticket_id: result.data.createSupportTicket.id,
                        source_type: "SUPPORT_TICKET",
                        fees_type_ids: values.fees,
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
                        return; // Stop further navigation
                    }
                }

                notify(t("success"), "success");
                navigate(location.pathname.split('/add')[0]);

            } catch (error) {
                logger.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedToShowFile(file.name);
        const formData = new FormData();
        formData.append("file", file);

        try {
            setProgress(1);
            const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
                onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
            });
            formik.setFieldValue("attachment", res?.data?.url);
            notify(t("fileUploaded"), "success");
        } catch (error) {
            notify(t("errorUplaod"), "error");
        } finally {
            setTimeout(() => setProgress(0), 2000);
        }
    };

    const selectedTypeData = ticketTypes.find(el => el.type === formik.values.selectedType);

    useEffect(() => {
        if (selectedTypeData?.requires_fee) {
            const feeIds = selectedTypeData.fees.map(f => f.id);
            formik.setFieldValue("fees", feeIds);
        } else {
            formik.setFieldValue("fees", []);
        }
    }, [formik.values.selectedType, selectedTypeData]);

    if (configLoading) return <LoadingPage />;

    let translateText = isArabic ? "تذكرة" : "Ticket";
    let translateText2 = isArabic ? "تذكرة" : "Ticket";
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
            <Header
                title={t("Dashboard.support")}
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
                    width: "100%", [theme.breakpoints.down("sm")]: {
                        width: "60%", // 👈 للموبايل
                    },
                }}
            >


                <VerticalTextField
                    title={t("title", { item: translateText2 })}
                    fieldID={"subject"}
                    fieldName={"subject"}
                    placeholder={t("title")}
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                />

                {/* الكلية */}

                <VerticalTextFieldSelect
                    t={t}
                    title={t("type")}
                    defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={formik.values.selectedType}
                    setValue={(val) => formik.setFieldValue("selectedType", val)}
                    onBlur={() => formik.setFieldTouched("selectedType", true)}
                    error={formik.touched.selectedType && Boolean(formik.errors.selectedType)}
                    helperText={formik.touched.selectedType && formik.errors.selectedType}
                >
                    <MenuItem value={0} disabled>{t("select")}</MenuItem>
                    {
                        ticketTypes?.map(el => (
                            <MenuItem key={el?.type} value={el?.type}>
                                {isArabic ? el?.label_ar : el?.label_en}
                            </MenuItem>
                        ))
                    }
                </VerticalTextFieldSelect>

                {selectedTypeData?.requires_fee && (
                    <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {isArabic ? "الرسوم المطلوبة:" : "Required Fees:"}
                        </Typography>
                        {selectedTypeData.fees.map(fee => (
                            <Typography key={fee.id} variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <span>{isArabic ? fee.title_ar : fee.title_en}</span>
                                <span style={{ fontWeight: 'bold' }}>
                                    {me?.is_inside_yemen ? fee.inside_yemen_value : fee.outside_yemen_value}
                                </span>
                            </Typography>
                        ))}
                    </Box>
                )}

                <UploadFileField
                    title={isArabic ? "مرفقات" : "Attachment"}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    handlePickFile={() => fileInputRef.current.click()}
                    selectedToShowFile={selectedToShowFile}
                    progress={progress}
                    showInput={true}
                />

                <VerticalTextField
                    isMultiline={true}
                    title={t("Dashboard.message", { item: translateText2 })}
                    fieldID={"message"}
                    fieldName={"message"}
                    placeholder={t("Dashboard.message", { item: translateText2 })}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                />






                <SubmitButton loading={creatingTicket || initiatingPayment} t={t} />
            </Box>
        </Box>
    )
}
