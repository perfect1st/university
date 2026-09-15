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
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_TRANSACTION_TYPES } from "../../graphql/transactionTypeQueries";
import { PAY_INSTALLMENT } from "../../graphql/installmentsQueries";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import logger from "../../utils/logger";
import { toast } from "react-toastify";

function LabelValueRow({ label, value, isStatus }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary?.gray || "#f5f5f5",
        borderRadius: 1,
        px: 2,
        py: 1.5,
        my: 1,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          {isStatus ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {value ? (
                <>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body1" color="success.main" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                </>
              ) : (
                <>
                  <CancelIcon color="error" fontSize="small" />
                  <Typography variant="body1" color="error.main" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                </>
              )}
            </Box>
          ) : (
            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default function InstallmentDetails() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const installmentRow = location.state?.row;

  const [openPayModal, setOpenPayModal] = useState(false);
  const [transactionTypeId, setTransactionTypeId] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState("CASH");

  const { data: transactionTypesData, loading: loadingTransactionTypes } = useQuery(GET_ALL_TRANSACTION_TYPES);

  const [payInstallment, { loading: paying }] = useMutation(PAY_INSTALLMENT, {
    onCompleted: (data) => {
      toast.success(t("Installment paid successfully"));
      setOpenPayModal(false);
      navigate("/installments");
    },
    onError: (err) => {
      logger.error("Error paying installment", err);
      toast.error(t("Error paying installment"));
    },
  });

  if (!installmentRow) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t("No installment data found. Please go back and select an installment.")}</Typography>
        <Button variant="contained" onClick={() => navigate("/installments")} sx={{ mt: 2 }}>
          {t("Back to Installments")}
        </Button>
      </Box>
    );
  }

  const handlePayClick = () => {
    setOpenPayModal(true);
  };

  const handleConfirmPay = () => {
    if (!transactionTypeId) {
      toast.error(t("Please select a transaction type"));
      return;
    }
    
    payInstallment({
      variables: {
        input: {
          installment_id: id,
          transaction_type_id: transactionTypeId,
          payment_method_type: paymentMethodType,
          payment_document_file: "", // Can be added later if needed for BANK_TRANSFER
        },
      },
    });
  };

  return (
    <Box component="main" sx={{ p: 3, width: "100%" }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" onClick={() => navigate("/installments")} sx={{ cursor: 'pointer' }}>
          {t("Installments")} &gt; {t("Installment Details")}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("Installment Details")}
        </Typography>
      </Box>

      {/* Rows */}
      <LabelValueRow label={t("Student Name")} value={installmentRow.studentName} />
      <LabelValueRow label={t("Amount")} value={installmentRow.amount} />
      <LabelValueRow label={t("Study Year")} value={installmentRow.studyYear} />
      <LabelValueRow label={t("Term")} value={installmentRow.termNumber} />
      
      {installmentRow.isPaid ? (
        <LabelValueRow label={t("Status")} value={t("Paid")} isStatus={true} />
      ) : (
        <LabelValueRow label={t("Status")} value={t("Unpaid")} isStatus={true} />
      )}

      {/* Actions */}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t("Back")}
        </Button>
        {!installmentRow.isPaid && (
          <Button variant="contained" color="success" onClick={handlePayClick}>
            {t("Pay Installment")}
          </Button>
        )}
      </Box>

      {/* Pay Modal */}
      <Dialog open={openPayModal} onClose={() => setOpenPayModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("Pay Installment")}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              select
              label={t("Transaction Type")}
              fullWidth
              value={transactionTypeId}
              onChange={(e) => setTransactionTypeId(e.target.value)}
              disabled={loadingTransactionTypes}
            >
              {transactionTypesData?.getTransactionTypes?.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {i18n.language === "ar" ? type.title_ar : type.title_en}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label={t("Payment Method")}
              fullWidth
              value={paymentMethodType}
              onChange={(e) => setPaymentMethodType(e.target.value)}
            >
              <MenuItem value="CASH">{t("Cash")}</MenuItem>
              <MenuItem value="BANK_TRANSFER">{t("Bank Transfer")}</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayModal(false)}>{t("Cancel")}</Button>
          <Button onClick={handleConfirmPay} variant="contained" disabled={paying}>
            {paying ? <CircularProgress size={24} /> : t("Confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
