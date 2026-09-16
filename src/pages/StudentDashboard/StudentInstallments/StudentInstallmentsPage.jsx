import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";

import { GET_STUDENT_INSTALLMENTS, PAY_INSTALLMENT } from "../../../graphql/installmentsQueries";
import { GET_ALL_TRANSACTION_TYPES } from "../../../graphql/transactionTypeQueries";
import LoadingPage from "../../../components/LoadingComponent";
import formatDateToString from "../../../components/Utilities/FormatDateToString";
import { baseURL } from "../../../Api/apolloClient";
import logger from "../../../utils/logger";

export default function StudentInstallmentsPage() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const me = useSelector((state) => state.user.loggedUser);
  const studentId = me?.id;

  const [activeTab, setActiveTab] = useState(0); // 0: all, 1: due, 2: under review, 3: paid
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [transactionTypeId, setTransactionTypeId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [documentFileUrl, setDocumentFileUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Online payment inputs
  const [onlineName, setOnlineName] = useState("");
  const [onlineEmail, setOnlineEmail] = useState("");
  const [onlineMobile, setOnlineMobile] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_STUDENT_INSTALLMENTS, {
    variables: { student_id: studentId },
    skip: !studentId,
    fetchPolicy: "network-only",
  });

  const { data: transactionTypesData } = useQuery(GET_ALL_TRANSACTION_TYPES, {
    fetchPolicy: "network-only",
  });

  const [payInstallment, { loading: paying }] = useMutation(PAY_INSTALLMENT, {
    onCompleted: (res) => {
      const paymentUrl = res?.data?.payInstallment?.myfatoorah_payment_url;
      if (paymentMethod === "ONLINE" && paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      toast.success(
        isArabic
          ? "تم إرسال إيصال السداد بنجاح وهو الآن قيد مراجعة الإدارة"
          : "Payment receipt submitted successfully and is under review"
      );
      setPayModalOpen(false);
      setSelectedInstallment(null);
      setDocumentFileUrl("");
      refetch();
    },
    onError: (err) => {
      logger.error("Payment error", err);
      toast.error(err.message || (isArabic ? "حدث خطأ أثناء سداد القسط" : "Error paying installment"));
    },
  });

  const installments = data?.getStudentInstallments || [];

  // Groupings & Calculations
  const totalCount = installments.length;
  const paidInstallments = installments.filter((item) => item.status === "ACCEPTED" || item.is_paid);
  const underReviewInstallments = installments.filter((item) => item.status === "UNDER_REVIEW");
  const unpaidInstallments = installments.filter(
    (item) => item.status === "PENDING" || item.status === "CANCELLED" || (!item.is_paid && item.status !== "UNDER_REVIEW")
  );

  const totalAmount = installments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const paidAmount = paidInstallments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const unpaidAmount = unpaidInstallments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Filter based on tab
  const displayedInstallments =
    activeTab === 1
      ? unpaidInstallments
      : activeTab === 2
      ? underReviewInstallments
      : activeTab === 3
      ? paidInstallments
      : installments;

  const handleOpenPay = (inst) => {
    setSelectedInstallment(inst);
    setPaymentMethod("CASH");
    setDocumentFileUrl("");
    setUploadProgress(0);
    setOnlineName(me?.fullname || "");
    setOnlineEmail(me?.email || "");
    setOnlineMobile(me?.mobile || "");

    const types = transactionTypesData?.getAllTransactionTypes || transactionTypesData?.getTransactionTypes || [];
    if (types.length > 0) {
      setTransactionTypeId(types[0].id);
    }
    setPayModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingFile(true);
      setUploadProgress(0);

      const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      const url = res?.data?.url ? `${baseURL}${res.data.url}` : "";
      setDocumentFileUrl(url);
      toast.success(isArabic ? "تم رفع الملف بنجاح" : "File uploaded successfully");
    } catch (err) {
      logger.error("Upload error", err);
      toast.error(isArabic ? "فشل رفع الملف" : "Error uploading file");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmitPayment = () => {
    if ((paymentMethod === "CASH" || paymentMethod === "BANK_TRANSFER") && !documentFileUrl) {
      toast.error(
        paymentMethod === "CASH"
          ? (isArabic ? "يرجى إرفاق صورة سند القبض النقدي" : "Please attach cash receipt voucher")
          : (isArabic ? "يرجى إرفاق صورة إشعار التحويل البنكي" : "Please attach bank transfer receipt")
      );
      return;
    }

    const input = {
      installment_id: selectedInstallment.id,
      payment_method_type: paymentMethod,
    };

    if (transactionTypeId) {
      input.transaction_type_id = transactionTypeId;
    }

    if (paymentMethod === "CASH" || paymentMethod === "BANK_TRANSFER") {
      input.payment_document_file = documentFileUrl;
    } else if (paymentMethod === "ONLINE") {
      input.customer_name = onlineName || me?.fullname || "Student";
      input.customer_email = onlineEmail || me?.email || "student@uas.edu.ye";
      input.customer_mobile = onlineMobile || me?.mobile || "0000000000";
      input.language = isArabic ? "ar" : "en";
    }

    payInstallment({
      variables: { input },
    });
  };

  const getStatusBadge = (inst) => {
    const st = inst.status || (inst.is_paid ? "ACCEPTED" : "PENDING");
    switch (st) {
      case "ACCEPTED":
        return {
          label: isArabic ? "تم السداد (معتمد)" : "Paid & Approved",
          color: "success",
          icon: <CheckCircleIcon />,
          bg: "#fbfdfb",
          border: "#c8e6c9",
        };
      case "UNDER_REVIEW":
        return {
          label: isArabic ? "قيد المراجعة" : "Under Review",
          color: "warning",
          icon: <AccessTimeIcon />,
          bg: "#fffdfa",
          border: "#ffe0b2",
        };
      case "CANCELLED":
        return {
          label: isArabic ? "مرفوض" : "Rejected",
          color: "error",
          icon: <CancelIcon />,
          bg: "#fffbfa",
          border: "#ffcdd2",
        };
      case "PENDING":
      default:
        return {
          label: isArabic ? "مستحق للسداد" : "Due for Payment",
          color: "info",
          icon: <ErrorOutlineIcon />,
          bg: "#f9fbff",
          border: "#bbdefb",
        };
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <Box sx={{ p: isSmall ? 2 : 3, backgroundColor: "background.default", minHeight: "100vh" }}>
      {/* Page Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main, mb: 0.5 }}>
          {isArabic ? "الأقساط الدراسية" : "Student Installments"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isArabic
            ? "عرض ومتابعة كافة الأقساط الدراسية المستحقة والمسددة وقيد المراجعة"
            : "View and track all your due, under review, and completed tuition installments"}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, borderTop: `4px solid ${theme.palette.info.main}` }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {isArabic ? "إجمالي الأقساط" : "Total Installments"}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {totalCount}
                  </Typography>
                </Box>
                <EventNoteIcon sx={{ fontSize: 40, color: theme.palette.info.main, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, borderTop: `4px solid ${theme.palette.primary.main}` }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {isArabic ? "المبلغ الكلي المطلوب" : "Total Required Amount"}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {totalAmount} {isArabic ? "ريال" : "SAR"}
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ fontSize: 40, color: theme.palette.primary.main, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, borderTop: `4px solid ${theme.palette.success.main}` }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {isArabic ? "المبلغ المسدد المعتمد" : "Paid & Approved"} ({paidInstallments.length})
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "success.main", mt: 0.5 }}>
                    {paidAmount} {isArabic ? "ريال" : "SAR"}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: "success.main", opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, borderTop: `4px solid ${theme.palette.error.main}` }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {isArabic ? "المتبقي للاستحقاق" : "Remaining Due"} ({unpaidInstallments.length})
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "error.main", mt: 0.5 }}>
                    {unpaidAmount} {isArabic ? "ريال" : "SAR"}
                  </Typography>
                </Box>
                <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main", opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          indicatorColor="primary"
          textColor="primary"
          variant={isSmall ? "fullWidth" : "standard"}
        >
          <Tab label={`${isArabic ? "جميع الأقساط" : "All"} (${totalCount})`} />
          <Tab label={`${isArabic ? "المستحقة" : "Due"} (${unpaidInstallments.length})`} />
          <Tab label={`${isArabic ? "قيد المراجعة" : "Under Review"} (${underReviewInstallments.length})`} />
          <Tab label={`${isArabic ? "المسددة" : "Paid"} (${paidInstallments.length})`} />
        </Tabs>
      </Paper>

      {/* Installments List */}
      {displayedInstallments.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: 2 }}>
          <ReceiptIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5, mb: 1 }} />
          <Typography variant="h6" color="text.secondary">
            {isArabic ? "لا توجد أقساط في هذا القسم" : "No installments found in this category"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {displayedInstallments.map((inst) => {
            const statusInfo = getStatusBadge(inst);
            const isAccepted = inst.status === "ACCEPTED" || inst.is_paid;
            const isUnderReview = inst.status === "UNDER_REVIEW";
            const isCancelled = inst.status === "CANCELLED";

            const termTitle = isArabic
              ? inst.academy_term_id?.title_ar || `${inst.study_year} - ترم ${inst.term_number}`
              : inst.academy_term_id?.title_en || `${inst.study_year} - Term ${inst.term_number}`;

            const dateStr = inst.createdAt ? formatDateToString(new Date(Number(inst.createdAt) || inst.createdAt)) : "-";

            return (
              <Grid item xs={12} md={6} key={inst.id}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    boxShadow: 2,
                    border: `1px solid ${statusInfo.border}`,
                    backgroundColor: statusInfo.bg,
                    position: "relative",
                  }}
                >
                  {/* Top Bar: Serial & Status */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {termTitle}
                      </Typography>
                      {inst.serial && (
                        <Chip
                          label={`#${inst.serial}`}
                          size="small"
                          sx={{ fontWeight: 600, backgroundColor: "#f0f0f0" }}
                        />
                      )}
                    </Box>

                    <Chip
                      icon={statusInfo.icon}
                      label={statusInfo.label}
                      color={statusInfo.color}
                      sx={{ fontWeight: 700, borderRadius: 1 }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Details Grid */}
                  <Grid container spacing={1.5}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        {isArabic ? "قيمة القسط" : "Amount"}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                        {inst.amount} {isArabic ? "ريال" : "SAR"}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        {isArabic ? "السنة الدراسية" : "Study Year"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {inst.study_year || "-"}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        {isArabic ? "رقم الفصل" : "Term Number"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {inst.term_number === 1 ? (isArabic ? "الفصل الأول" : "First Term") : (isArabic ? "الفصل الثاني" : "Second Term")}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        {isArabic ? "تاريخ الإنشاء" : "Created At"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {dateStr}
                      </Typography>
                    </Grid>

                    {/* Transaction Details if available */}
                    {inst.transaction_id && (
                      <>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            {isArabic ? "طريقة السداد" : "Payment Method"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {inst.transaction_id.payment_method_type === "CASH"
                              ? (isArabic ? "نقدي (سند)" : "Cash")
                              : inst.transaction_id.payment_method_type === "BANK_TRANSFER"
                              ? (isArabic ? "تحويل بنكي" : "Bank Transfer")
                              : (isArabic ? "دفع إلكتروني" : "Online")}
                          </Typography>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            {isArabic ? "رقم المعاملة" : "Transaction Serial"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {inst.transaction_id.transaction_serial || inst.transaction_id.serial || "-"}
                          </Typography>
                        </Grid>

                        {inst.transaction_id.payment_document_file && (
                          <Grid item xs={12}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              href={inst.transaction_id.payment_document_file}
                              target="_blank"
                              sx={{ mt: 1, textTransform: "none" }}
                            >
                              {isArabic ? "عرض إيصال / سند السداد" : "View Payment Document"}
                            </Button>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>

                  {/* Rejection notice if Cancelled */}
                  {isCancelled && inst.rejection_reason && (
                    <Box sx={{ mt: 2, p: 1.5, backgroundColor: "#ffebee", borderRadius: 1.5, border: "1px solid #ffcdd2" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "error.main", display: "block" }}>
                        {isArabic ? "سبب الرفض من الإدارة:" : "Rejection Reason from Administration:"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "error.dark", mt: 0.5, fontWeight: 500 }}>
                        {inst.rejection_reason}
                      </Typography>
                    </Box>
                  )}

                  {/* Under review notice */}
                  {isUnderReview && (
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1, backgroundColor: "#fff8e1", p: 1.5, borderRadius: 1.5, border: "1px solid #ffe082" }}>
                      <AccessTimeIcon fontSize="small" sx={{ color: "warning.dark" }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "warning.dark" }}>
                        {isArabic
                          ? "تم رفع إيصال السداد، والطلب قيد المراجعة والاعتماد من قبل إدارة الجامعة."
                          : "Receipt uploaded, pending review and approval by administration."}
                      </Typography>
                    </Box>
                  )}

                  {/* Actions */}
                  {!isAccepted && !isUnderReview && (
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color={isCancelled ? "warning" : "primary"}
                        startIcon={<PaymentIcon />}
                        onClick={() => handleOpenPay(inst)}
                        sx={{
                          fontWeight: 700,
                          borderRadius: 1.5,
                          px: 3,
                          py: 1,
                          textTransform: "none",
                        }}
                      >
                        {isCancelled
                          ? (isArabic ? "إعادة إرفاق الإيصال والسداد" : "Re-submit Receipt & Pay")
                          : (isArabic ? "سداد القسط الآن" : "Pay Installment Now")}
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Pay Modal Dialog */}
      <Dialog
        open={payModalOpen}
        onClose={() => !paying && setPayModalOpen(false)}
        maxWidth="sm"
        fullWidth
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: "1px solid #eee" }}>
          {isArabic ? "سداد القسط الدراسي" : "Pay Tuition Installment"}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {selectedInstallment && (
            <Box sx={{ mb: 2.5, p: 2, backgroundColor: "#f9f9f9", borderRadius: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                {isArabic ? "المبلغ المستحق للسداد:" : "Amount Due:"}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main, mt: 0.5 }}>
                {selectedInstallment.amount} {isArabic ? "ريال" : "SAR"}
              </Typography>
            </Box>
          )}

          {/* Payment Method Select */}
          <TextField
            select
            fullWidth
            label={isArabic ? "طريقة الدفع" : "Payment Method"}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="CASH">{isArabic ? "نقدي كاش (سند قبض من الخزينة)" : "Cash (Receipt Voucher)"}</MenuItem>
            <MenuItem value="BANK_TRANSFER">{isArabic ? "تحويل بنكي / إيداع" : "Bank Transfer"}</MenuItem>
            <MenuItem value="ONLINE">{isArabic ? "دفع إلكتروني (ماي فاتورة)" : "Online Payment (MyFatoorah)"}</MenuItem>
          </TextField>

          {/* Transaction Type Select */}
          <TextField
            select
            fullWidth
            label={isArabic ? "نوع المعاملة المالية" : "Transaction Type"}
            value={transactionTypeId}
            onChange={(e) => setTransactionTypeId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {(transactionTypesData?.getAllTransactionTypes || transactionTypesData?.getTransactionTypes || []).map(
              (tType) => (
                <MenuItem key={tType.id} value={tType.id}>
                  {isArabic ? tType.title_ar : tType.title_en}
                </MenuItem>
              )
            )}
          </TextField>

          {/* CASH & BANK_TRANSFER File Upload (Mandatory for student) */}
          {(paymentMethod === "CASH" || paymentMethod === "BANK_TRANSFER") && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {paymentMethod === "CASH"
                  ? (isArabic ? "إرفاق صورة سند القبض النقدي المستلم من الجامعة *" : "Attach Cash Receipt Voucher *")
                  : (isArabic ? "إرفاق صورة إشعار التحويل البنكي *" : "Attach Bank Transfer Receipt *")}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={uploadingFile}
                sx={{ py: 1.5, borderStyle: "dashed" }}
              >
                {documentFileUrl
                  ? (isArabic ? "تم اختيار الملف بنجاح (اضغط للتغيير)" : "File selected (click to change)")
                  : (isArabic ? "اختر صورة الإيصال / السند" : "Choose receipt image")}
                <input type="file" hidden accept="image/*,.pdf" onChange={handleFileUpload} />
              </Button>

              {uploadingFile && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 0.5 }}>
                    {uploadProgress}%
                  </Typography>
                </Box>
              )}

              {documentFileUrl && !uploadingFile && (
                <Box sx={{ mt: 1.5, textAlign: "center" }}>
                  <img
                    src={documentFileUrl}
                    alt="Receipt preview"
                    style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8 }}
                  />
                </Box>
              )}

              <Alert severity="info" sx={{ mt: 1.5 }}>
                {isArabic
                  ? "ملاحظة: ستتم مراجعة الإيصال وتدقيقه من قبل الإدارة قبل اعتماد السداد نهائياً."
                  : "Note: The receipt will be reviewed and verified by administration before final approval."}
              </Alert>
            </Box>
          )}

          {/* ONLINE Payment Fields */}
          {paymentMethod === "ONLINE" && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={isArabic ? "الاسم الكامل للعميل" : "Customer Full Name"}
                value={onlineName}
                onChange={(e) => setOnlineName(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                label={isArabic ? "البريد الإلكتروني" : "Customer Email"}
                value={onlineEmail}
                onChange={(e) => setOnlineEmail(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                label={isArabic ? "رقم الجوال" : "Customer Mobile"}
                value={onlineMobile}
                onChange={(e) => setOnlineMobile(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Alert severity="info">
                {isArabic
                  ? "سيتم تحويلك مباشرة إلى بوابة الدفع الإلكتروني (ماي فاتورة) لإتمام عملية السداد بأمان."
                  : "You will be redirected to MyFatoorah payment gateway to complete the transaction securely."}
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setPayModalOpen(false)} disabled={paying} sx={{ fontWeight: 600 }}>
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitPayment}
            disabled={paying || uploadingFile}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {paying ? (
              <CircularProgress size={24} color="inherit" />
            ) : paymentMethod === "ONLINE" ? (
              (isArabic ? "الانتقال للدفع أونلاين" : "Proceed to Online Payment")
            ) : (
              (isArabic ? "إرسال الإيصال للاعتماد" : "Submit Receipt for Approval")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
