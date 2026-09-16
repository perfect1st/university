import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  PAY_INSTALLMENT,
  APPROVE_INSTALLMENT,
  REJECT_INSTALLMENT,
} from "../../graphql/installmentsQueries";
import { GET_ALL_TRANSACTION_TYPES } from "../../graphql/transactionTypeQueries";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import logger from "../../utils/logger";
import { toast } from "react-toastify";
import formatDateToString from "../../components/Utilities/FormatDateToString";

function LabelValueRow({ label, value, isStatus, statusNode }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary?.gray || "#f9f9f9",
        borderRadius: 1.5,
        px: 2.5,
        py: 1.5,
        my: 1,
        border: "1px solid #eee",
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          {isStatus ? (
            statusNode
          ) : (
            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
              {value || "-"}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default function InstallmentDetails() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentData, setCurrentData] = useState(location.state?.row || null);

  // Modals state
  const [openCashModal, setOpenCashModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const { pay: canPay } = usePermissionsByModule("installments");

  const [approveInstallment, { loading: approving }] = useMutation(APPROVE_INSTALLMENT, {
    onCompleted: (data) => {
      toast.success(isArabic ? "تم اعتماد القسط بنجاح" : "Installment approved successfully");
      setOpenApproveModal(false);
      setCurrentData((prev) => ({
        ...prev,
        status: "ACCEPTED",
        is_paid: true,
      }));
    },
    onError: (err) => {
      logger.error("Error approving installment", err);
      toast.error(err.message || (isArabic ? "فشل اعتماد القسط" : "Failed to approve installment"));
    },
  });

  const [rejectInstallment, { loading: rejecting }] = useMutation(REJECT_INSTALLMENT, {
    onCompleted: (data) => {
      toast.success(isArabic ? "تم رفض الإيصال بنجاح" : "Installment receipt rejected");
      setOpenRejectModal(false);
      setCurrentData((prev) => ({
        ...prev,
        status: "CANCELLED",
        is_paid: false,
        rejection_reason: rejectionReason,
      }));
    },
    onError: (err) => {
      logger.error("Error rejecting installment", err);
      toast.error(err.message || (isArabic ? "فشل رفض الإيصال" : "Failed to reject installment"));
    },
  });

  const [payAdminCash, { loading: payingCash }] = useMutation(PAY_INSTALLMENT, {
    onCompleted: (data) => {
      toast.success(isArabic ? "تم تسجيل الدفع النقدي بنجاح واعتماد القسط" : "Cash payment recorded and installment approved");
      setOpenCashModal(false);
      setCurrentData((prev) => ({
        ...prev,
        status: "ACCEPTED",
        is_paid: true,
      }));
    },
    onError: (err) => {
      logger.error("Error paying cash", err);
      toast.error(err.message || (isArabic ? "فشل تسجيل الدفع النقدي" : "Failed to record cash payment"));
    },
  });

  if (!currentData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          {isArabic ? "لم يتم العثور على بيانات القسط. يرجى الرجوع واختيار القسط من الجدول." : "No installment data found. Please go back and select from the list."}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/installments")} sx={{ mt: 2 }}>
          {isArabic ? "الرجوع للأقساط" : "Back to Installments"}
        </Button>
      </Box>
    );
  }

  const currentStatus = currentData.status || (currentData.is_paid ? "ACCEPTED" : "PENDING");
  const student = currentData.student_id || {};
  const studentName = currentData.studentName || student.fullname || student.username || "-";
  const transaction = currentData.transaction_id || {};
  const receiptUrl = transaction.payment_document_file || "";

  const getStatusChip = (st) => {
    switch (st) {
      case "ACCEPTED":
        return <Chip icon={<CheckCircleIcon />} label={isArabic ? "معتمد ومسدد" : "Accepted & Paid"} color="success" sx={{ fontWeight: 700 }} />;
      case "UNDER_REVIEW":
        return <Chip icon={<AccessTimeIcon />} label={isArabic ? "تحت المراجعة والتدقيق" : "Under Review"} color="warning" sx={{ fontWeight: 700 }} />;
      case "CANCELLED":
        return <Chip icon={<CancelIcon />} label={isArabic ? "مرفوض / ملغي" : "Cancelled / Rejected"} color="error" sx={{ fontWeight: 700 }} />;
      case "PENDING":
      default:
        return <Chip icon={<ErrorOutlineIcon />} label={isArabic ? "قيد الانتظار (غير مسدد)" : "Pending"} color="info" sx={{ fontWeight: 700 }} />;
    }
  };

  const handleConfirmApprove = () => {
    approveInstallment({
      variables: { installment_id: currentData.id },
    });
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error(isArabic ? "يرجى كتابة سبب الرفض" : "Please provide a rejection reason");
      return;
    }
    rejectInstallment({
      variables: {
        installment_id: currentData.id,
        rejection_reason: rejectionReason,
      },
    });
  };

  const handleConfirmCashPay = () => {
    payAdminCash({
      variables: {
        input: {
          installment_id: currentData.id,
          payment_method_type: "CASH",
        },
      },
    });
  };

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 }, width: "100%", maxWidth: 1100, mx: "auto" }}>
      {/* Breadcrumbs & Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          onClick={() => navigate("/installments")}
          sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
        >
          {isArabic ? "الأقساط الدراسية" : "Installments"} &gt; {isArabic ? "تفاصيل القسط" : "Installment Details"}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
          {isArabic ? "تفاصيل القسط الدراسي" : "Tuition Installment Details"}
        </Typography>
      </Box>

      {/* Rejection Alert if Cancelled */}
      {currentStatus === "CANCELLED" && (currentData.rejection_reason || transaction.rejection_reason) && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {isArabic ? "سبب رفض الإيصال من قبل الإدارة:" : "Rejection Reason:"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {currentData.rejection_reason || transaction.rejection_reason}
          </Typography>
        </Alert>
      )}

      {/* Under Review Notice */}
      {currentStatus === "UNDER_REVIEW" && (
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {isArabic
              ? "هذا القسط بانتظار مراجعة الإدارة والتحقق من صحة الإيصال المرفق لاعتماده أو رفضه."
              : "This installment is awaiting admin verification of the attached payment receipt."}
          </Typography>
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
          {isArabic ? "بيانات الطالب والقسط" : "Student & Installment Info"}
        </Typography>

        <LabelValueRow label={isArabic ? "رقم السيريال" : "Serial"} value={`#${currentData.serial || "-"}`} />
        <LabelValueRow label={isArabic ? "اسم الطالب" : "Student Name"} value={studentName} />
        {student.email && <LabelValueRow label={isArabic ? "البريد الإلكتروني" : "Email"} value={student.email} />}
        {student.mobile && <LabelValueRow label={isArabic ? "رقم الجوال" : "Mobile"} value={student.mobile} />}
        <LabelValueRow label={isArabic ? "قيمة القسط" : "Amount"} value={currentData.amount ? `${currentData.amount} ${t("SAR")}` : "-"} />
        <LabelValueRow label={isArabic ? "السنة الدراسية" : "Study Year"} value={currentData.study_year || currentData.studyYear || "-"} />
        <LabelValueRow
          label={isArabic ? "الفصل الدراسي" : "Term"}
          value={
            currentData.term_number === 1 || currentData.termNumber === 1
              ? (isArabic ? "الفصل الأول" : "First Term")
              : (isArabic ? "الفصل الثاني" : "Second Term")
          }
        />
        <LabelValueRow
          label={isArabic ? "حالة السداد" : "Status"}
          isStatus={true}
          statusNode={getStatusChip(currentStatus)}
        />
      </Paper>

      {/* Payment / Receipt Details if available */}
      {transaction && (transaction.id || receiptUrl || transaction.payment_method_type) && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
            {isArabic ? "بيانات المعاملة وإيصال السداد" : "Transaction & Receipt Details"}
          </Typography>

          <LabelValueRow
            label={isArabic ? "طريقة السداد" : "Payment Method"}
            value={
              transaction.payment_method_type === "CASH"
                ? (isArabic ? "نقدي (سند قبض من الخزينة)" : "Cash (Receipt Voucher)")
                : transaction.payment_method_type === "BANK_TRANSFER"
                ? (isArabic ? "تحويل بنكي / إيداع" : "Bank Transfer")
                : (isArabic ? "دفع إلكتروني (ماي فاتورة)" : "Online Payment")
            }
          />

          {transaction.transaction_serial && (
            <LabelValueRow label={isArabic ? "رقم المعاملة" : "Transaction Serial"} value={transaction.transaction_serial} />
          )}

          {receiptUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                {isArabic ? "صورة الإيصال / سند السداد:" : "Payment Receipt / Voucher Image:"}
              </Typography>
              <Box
                sx={{
                  display: "inline-block",
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  maxWidth: 350,
                }}
                onClick={() => setPreviewImage(receiptUrl)}
              >
                <img
                  src={receiptUrl}
                  alt="Receipt Preview"
                  style={{ width: "100%", maxHeight: 250, objectFit: "contain", display: "block" }}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  href={receiptUrl}
                  target="_blank"
                >
                  {isArabic ? "فتح الإيصال بالحجم الكامل" : "Open full size"}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* Action Buttons for Admin */}
      <Paper sx={{ p: 2.5, borderRadius: 2, boxShadow: 1, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {isArabic ? "رجوع" : "Back"}
        </Button>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {/* UNDER_REVIEW actions: Approve & Reject */}
          {currentStatus === "UNDER_REVIEW" && canPay && (
            <>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setRejectionReason("");
                  setOpenRejectModal(true);
                }}
              >
                {isArabic ? "رفض الإيصال" : "Reject Receipt"}
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => setOpenApproveModal(true)}
              >
                {isArabic ? "اعتماد القسط" : "Approve Installment"}
              </Button>
            </>
          )}

          {/* PENDING or CANCELLED actions: Admin Cash Pay */}
          {(currentStatus === "PENDING" || currentStatus === "CANCELLED") && canPay && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<MonetizationOnIcon />}
              onClick={() => setOpenCashModal(true)}
            >
              {isArabic ? "سداد نقدي مباشر (CASH)" : "Direct Cash Payment"}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Approve Confirmation Dialog */}
      <Dialog open={openApproveModal} onClose={() => !approving && setOpenApproveModal(false)} maxWidth="xs" fullWidth dir={isArabic ? "rtl" : "ltr"}>
        <DialogTitle sx={{ fontWeight: 700 }}>{isArabic ? "تأكيد اعتماد القسط" : "Confirm Installment Approval"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {isArabic
              ? "هل أنت متأكد من صحة إيصال السداد واعتماد هذا القسط كمسدد رسمياً؟"
              : "Are you sure you want to approve this installment as officially paid?"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenApproveModal(false)} disabled={approving}>
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button variant="contained" color="success" onClick={handleConfirmApprove} disabled={approving}>
            {approving ? <CircularProgress size={24} color="inherit" /> : (isArabic ? "تأكيد الاعتماد" : "Confirm Approval")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog with Reason */}
      <Dialog open={openRejectModal} onClose={() => !rejecting && setOpenRejectModal(false)} maxWidth="sm" fullWidth dir={isArabic ? "rtl" : "ltr"}>
        <DialogTitle sx={{ fontWeight: 700 }}>{isArabic ? "رفض إيصال القسط" : "Reject Installment Receipt"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isArabic
              ? "يرجى كتابة سبب رفض الإيصال ليتمكن الطالب من معرفة السبب وإعادة رفع الإيصال الصحيح."
              : "Please specify the reason for rejection so the student can re-upload a valid receipt."}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={isArabic ? "سبب الرفض *" : "Rejection Reason *"}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={isArabic ? "مثال: صورة الإيصال غير واضحة أو لا يظهر فيها الختم البنكي..." : "e.g. Receipt image is blurry or bank stamp missing..."}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenRejectModal(false)} disabled={rejecting}>
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmReject} disabled={rejecting}>
            {rejecting ? <CircularProgress size={24} color="inherit" /> : (isArabic ? "تأكيد الرفض" : "Confirm Rejection")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Direct Cash Pay Dialog */}
      <Dialog open={openCashModal} onClose={() => !payingCash && setOpenCashModal(false)} maxWidth="xs" fullWidth dir={isArabic ? "rtl" : "ltr"}>
        <DialogTitle sx={{ fontWeight: 700 }}>{isArabic ? "تسجيل دفع نقدي مباشر" : "Record Direct Cash Payment"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {isArabic
              ? `هل تريد تأكيد استلام مبلغ (${currentData.amount} ريال) نقداً من الطالب في الخزينة واعتماد القسط فوراً؟`
              : `Confirm receiving (${currentData.amount} SAR) in cash and approving the installment immediately?`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCashModal(false)} disabled={payingCash}>
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmCashPay} disabled={payingCash}>
            {payingCash ? <CircularProgress size={24} color="inherit" /> : (isArabic ? "تأكيد السداد" : "Confirm Payment")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Lightbox Dialog */}
      <Dialog open={Boolean(previewImage)} onClose={() => setPreviewImage("")} maxWidth="md">
        <DialogContent sx={{ p: 1, backgroundColor: "#000", textAlign: "center" }}>
          <img src={previewImage} alt="Full Receipt" style={{ maxWidth: "100%", maxHeight: "80vh" }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
