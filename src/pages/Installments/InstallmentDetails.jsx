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
      toast.success(t("installments.approveSuccess"));
      setOpenApproveModal(false);
      setCurrentData((prev) => ({
        ...prev,
        status: "ACCEPTED",
        is_paid: true,
      }));
    },
    onError: (err) => {
      logger.error("Error approving installment", err);
      toast.error(err.message || t("installments.approveFailed"));
    },
  });

  const [rejectInstallment, { loading: rejecting }] = useMutation(REJECT_INSTALLMENT, {
    onCompleted: (data) => {
      toast.success(t("installments.rejectSuccess"));
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
      toast.error(err.message || t("installments.rejectFailed"));
    },
  });

  const [payAdminCash, { loading: payingCash }] = useMutation(PAY_INSTALLMENT, {
    onCompleted: (data) => {
      toast.success(t("installments.cashPaySuccess"));
      setOpenCashModal(false);
      setCurrentData((prev) => ({
        ...prev,
        status: "ACCEPTED",
        is_paid: true,
      }));
    },
    onError: (err) => {
      logger.error("Error paying cash", err);
      toast.error(err.message || t("installments.cashPayFailed"));
    },
  });

  if (!currentData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          {t("installments.notFound")}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/installments")} sx={{ mt: 2 }}>
          {t("installments.backToInstallments")}
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
        return <Chip icon={<CheckCircleIcon />} label={t("installments.statusAcceptedDetailed")} color="success" sx={{ fontWeight: 700 }} />;
      case "UNDER_REVIEW":
        return <Chip icon={<AccessTimeIcon />} label={t("installments.statusUnderReviewDetailed")} color="warning" sx={{ fontWeight: 700 }} />;
      case "CANCELLED":
        return <Chip icon={<CancelIcon />} label={t("installments.statusCancelledDetailed")} color="error" sx={{ fontWeight: 700 }} />;
      case "PENDING":
      default:
        return <Chip icon={<ErrorOutlineIcon />} label={t("installments.statusPendingDetailed")} color="info" sx={{ fontWeight: 700 }} />;
    }
  };

  const handleConfirmApprove = () => {
    approveInstallment({
      variables: { installment_id: currentData.id },
    });
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error(t("installments.rejectionReasonRequired"));
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
          {t("installments.breadcrumb")} &gt; {t("installments.detailsBreadcrumb")}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
          {t("installments.detailsPageTitle")}
        </Typography>
      </Box>

      {/* Rejection Alert if Cancelled */}
      {currentStatus === "CANCELLED" && (currentData.rejection_reason || transaction.rejection_reason) && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t("installments.rejectionReasonTitle")}
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
            {t("installments.underReviewAlert")}
          </Typography>
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
          {t("installments.studentAndInstallmentInfo")}
        </Typography>

        <LabelValueRow label={t("Serial")} value={`#${currentData.serial || "-"}`} />
        <LabelValueRow label={t("Student Name")} value={studentName} />
        {student.email && <LabelValueRow label={t("installments.email")} value={student.email} />}
        {student.mobile && <LabelValueRow label={t("installments.mobile")} value={student.mobile} />}
        <LabelValueRow label={t("installments.amount")} value={currentData.amount ? `${currentData.amount} ${t("SAR")}` : "-"} />
        <LabelValueRow label={t("Study Year")} value={currentData.study_year || currentData.studyYear || "-"} />
        <LabelValueRow
          label={t("Term")}
          value={
            currentData.term_number === 1 || currentData.termNumber === 1
              ? t("First Term")
              : currentData.term_number === 2 || currentData.termNumber === 2
              ? t("Second Term")
              : currentData.term_number || currentData.termNumber || "-"
          }
        />
        <LabelValueRow
          label={t("installments.paymentStatus")}
          isStatus={true}
          statusNode={getStatusChip(currentStatus)}
        />
      </Paper>

      {/* Payment / Receipt Details if available */}
      {transaction && (transaction.id || receiptUrl || transaction.payment_method_type) && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
            {t("installments.transactionAndReceiptDetails")}
          </Typography>

          <LabelValueRow
            label={t("installments.paymentMethod")}
            value={
              transaction.payment_method_type === "CASH"
                ? t("installments.cashReceiptVoucher")
                : transaction.payment_method_type === "BANK_TRANSFER"
                ? t("installments.bankTransfer")
                : t("installments.onlinePayment")
            }
          />

          {transaction.transaction_serial && (
            <LabelValueRow label={t("installments.transactionSerial")} value={transaction.transaction_serial} />
          )}

          {receiptUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                {t("installments.receiptImage")}
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
                  alt={t("installments.receiptPreview")}
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
                  {t("installments.openFullSize")}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* Action Buttons for Admin */}
      <Paper sx={{ p: 2.5, borderRadius: 2, boxShadow: 1, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t("installments.back")}
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
                {t("installments.rejectReceipt")}
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => setOpenApproveModal(true)}
              >
                {t("installments.approveInstallment")}
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
              {t("installments.directCashPay")}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Approve Confirmation Dialog */}
      <Dialog open={openApproveModal} onClose={() => !approving && setOpenApproveModal(false)} maxWidth="xs" fullWidth dir={isArabic ? "rtl" : "ltr"}>
        <DialogTitle sx={{ fontWeight: 700 }}>{t("installments.confirmApproveTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t("installments.confirmApproveBody")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenApproveModal(false)} disabled={approving}>
            {t("installments.cancel")}
          </Button>
          <Button variant="contained" color="success" onClick={handleConfirmApprove} disabled={approving}>
            {approving ? <CircularProgress size={24} color="inherit" /> : t("installments.confirmApproveBtn")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog with Reason */}
      <Dialog open={openRejectModal} onClose={() => !rejecting && setOpenRejectModal(false)} maxWidth="sm" fullWidth dir={isArabic ? "rtl" : "ltr"}>
        <DialogTitle sx={{ fontWeight: 700 }}>{t("installments.rejectDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("installments.rejectDialogSubtitle")}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("installments.rejectionReasonLabel")}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={t("installments.rejectionReasonPlaceholder")}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenRejectModal(false)} disabled={rejecting}>
            {t("installments.cancel")}
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmReject} disabled={rejecting}>
            {rejecting ? <CircularProgress size={24} color="inherit" /> : t("installments.confirmRejectBtn")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Direct Cash Pay Dialog */}
      <Dialog open={openCashModal} onClose={() => !payingCash && setOpenCashModal(false)} maxWidth="xs" fullWidth dir={isArabic ? "rtl" : "ltr"}>
        <DialogTitle sx={{ fontWeight: 700 }}>{t("installments.directCashTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t("installments.directCashBody", { amount: currentData.amount })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCashModal(false)} disabled={payingCash}>
            {t("installments.cancel")}
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmCashPay} disabled={payingCash}>
            {payingCash ? <CircularProgress size={24} color="inherit" /> : t("installments.confirmPaymentBtn")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Lightbox Dialog */}
      <Dialog open={Boolean(previewImage)} onClose={() => setPreviewImage("")} maxWidth="md">
        <DialogContent sx={{ p: 1, backgroundColor: "#000", textAlign: "center" }}>
          <img src={previewImage} alt={t("installments.fullReceipt")} style={{ maxWidth: "100%", maxHeight: "80vh" }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
