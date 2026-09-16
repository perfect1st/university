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
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

  const [activeTab, setActiveTab] = useState(0); // 0: all, 1: unpaid, 2: paid
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [transactionTypeId, setTransactionTypeId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [documentFileUrl, setDocumentFileUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(false);

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
      toast.success(t("Installment paid successfully") || "تم سداد القسط بنجاح");
      setPayModalOpen(false);
      setSelectedInstallment(null);
      setDocumentFileUrl("");
      refetch();
    },
    onError: (err) => {
      logger.error("Payment error", err);
      toast.error(err.message || t("Error paying installment") || "حدث خطأ أثناء سداد القسط");
    },
  });

  const installments = data?.getStudentInstallments || [];

  // Calculations
  const totalCount = installments.length;
  const paidInstallments = installments.filter((item) => item.is_paid);
  const unpaidInstallments = installments.filter((item) => !item.is_paid);

  const totalAmount = installments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const paidAmount = paidInstallments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const unpaidAmount = unpaidInstallments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Filter based on tab
  const displayedInstallments =
    activeTab === 1 ? unpaidInstallments : activeTab === 2 ? paidInstallments : installments;

  const handleOpenPay = (inst) => {
    setSelectedInstallment(inst);
    setPaymentMethod("CASH");
    setDocumentFileUrl("");
    setUploadProgress(0);

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
      toast.success(t("File uploaded successfully") || "تم رفع الملف بنجاح");
    } catch (err) {
      logger.error("Upload error", err);
      toast.error(t("Error uploading file") || "فشل رفع الملف");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmitPayment = () => {
    if (!transactionTypeId) {
      toast.error(t("Please select transaction type") || "يرجى تحديد نوع المعاملة");
      return;
    }

    if (paymentMethod === "BANK_TRANSFER" && !documentFileUrl) {
      toast.error(t("Please upload bank transfer document") || "يرجى رفع إيصال التحويل البنكي");
      return;
    }

    payInstallment({
      variables: {
        input: {
          installment_id: selectedInstallment.id,
          transaction_type_id: transactionTypeId,
          payment_method_type: paymentMethod,
          payment_document_file: documentFileUrl || "",
        },
      },
    });
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
            ? "عرض ومتابعة كافة الأقساط الدراسية المستحقة والمسددة"
            : "View and track all your due and completed tuition installments"}
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
                    {isArabic ? "المبلغ المسدد" : "Paid Amount"} ({paidInstallments.length})
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
          <Tab label={`${isArabic ? "جميع الأقساط" : "All Installments"} (${totalCount})`} />
          <Tab label={`${isArabic ? "المستحقة (غير المسددة)" : "Unpaid / Due"} (${unpaidInstallments.length})`} />
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
            const isPaid = inst.is_paid;
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
                    border: `1px solid ${isPaid ? "#c8e6c9" : "#ffcdd2"}`,
                    backgroundColor: isPaid ? "#fbfdfb" : "#fffbfa",
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
                      icon={isPaid ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
                      label={isPaid ? (isArabic ? "مسدد" : "Paid") : (isArabic ? "مستحق للسداد" : "Unpaid / Due")}
                      color={isPaid ? "success" : "error"}
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

                    {/* Transaction Details if Paid */}
                    {isPaid && inst.transaction_id && (
                      <>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            {isArabic ? "طريقة السداد" : "Payment Method"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {inst.transaction_id.payment_method_type || "-"}
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
                              {isArabic ? "عرض إيصال السداد" : "View Payment Document"}
                            </Button>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>

                  {/* Actions for Unpaid */}
                  {!isPaid && (
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="primary"
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
                        {isArabic ? "سداد القسط الآن" : "Pay Installment Now"}
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
            <MenuItem value="CASH">{isArabic ? "نقدي (كاش)" : "Cash"}</MenuItem>
            <MenuItem value="BANK_TRANSFER">{isArabic ? "تحويل بنكي / إيداع" : "Bank Transfer"}</MenuItem>
            <MenuItem value="ONLINE">{isArabic ? "دفع إلكتروني (أونلاين)" : "Online Payment"}</MenuItem>
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

          {/* Bank Transfer File Upload */}
          {paymentMethod === "BANK_TRANSFER" && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {isArabic ? "إرفاق إيصال التحويل البنكي *" : "Attach Bank Transfer Receipt *"}
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
                  : (isArabic ? "اختر صورة الإيصال" : "Choose receipt image")}
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
            {paying ? <CircularProgress size={24} color="inherit" /> : (isArabic ? "تأكيد السداد" : "Confirm Payment")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
