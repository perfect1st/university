import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Collapse,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  TextField,
  LinearProgress,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";
import money from "../../assets/money.png";
import i18n from "../../i18n/i18n";
import { useMutation } from "@apollo/client/react";
import { PAY_USER_REQUIRED_FEES } from "../../graphql/usersQueries";
import notify from "../notify";
import { paymentMethodsArr } from "../../constants";
import { baseURL } from "../../Api/apolloClient";

export default function FeeCard({
  data,
  is_inside_yemen,
  GetUsersRequiredFeesByStudent,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [method, setMethod] = useState("");
  const [bankTransferDocument, setBankTransferDocument] = useState(null);
  const [progress, setProgress] = useState(0);

  const [
    PayUserRequiredFees,
    {
      data: { payUserRequiredFees } = {},
      loading: payFeesLoading,
      error: payFeesError,
    },
  ] = useMutation(PAY_USER_REQUIRED_FEES, { fetchPolicy: "network-only" });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0] ?? null;
    const formData = new FormData();
    formData.append("file", file);
    try {
     
      setProgress(0);

      const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      console.log("res", res?.data?.url);

      setBankTransferDocument(`${baseURL}${res?.data?.url}`);
    } catch (error) {
      notify(t("errorUplaod"), "error");
      console.log("error", error.message);
    }
  };

  console.log("bankTransferDocument", bankTransferDocument);

  const isArabic = i18n.language === "ar";
  // const isPaid = !!data?.is_paid;
  const isPaid = !!data?.is_paid;

  let total_payment = 0;

  console.log("is_inside_yemen", is_inside_yemen);

  data?.fees_types_ids?.map((fee) => {
    if (is_inside_yemen == true) {
      total_payment += fee?.inside_yemen_value;
    } else {
      total_payment += fee?.outside_yemen_value;
    }
  });

  total_payment = total_payment.toFixed(2);

  console.log("total_payment", total_payment);
  console.log("data", data);
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container alignItems="center" spacing={2}>
        {/* IMAGE */}
        <Grid item>
          <Box
            component="img"
            src={money}
            alt={"fee icon"}
            sx={{ width: 66, height: 66, objectFit: "cover", borderRadius: 1 }}
          />
        </Grid>

        {/* MAIN ROWS */}
        <Grid item xs>
          {/* Top row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {isArabic ? data?.title_ar : data?.title_en}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {isPaid &&
              data?.transactions_id.payment_method_type == "BANK_TRANSFER" ? (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      try {
                        window.open(
                          data?.transactions_id?.payment_document_file || "#",
                          "_blank"
                        );
                      } catch (error) {
                        console.log("error", error);
                      }
                    }}
                    sx={{ textTransform: "none", gap: 1 }}
                  >
                    {t("fee.showPaidDocument")}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={async () => {
                      try {
                        let url = data?.transactions_id?.payment_document_file;

                        if (!url) return;
                        // تحميل الصورة كـ Blob
                        const response = await fetch(url, { mode: "cors" });
                        const blob = await response.blob();

                        // إنشاء لينك مؤقت للتحميل
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = url.split("/").pop(); // اسم الملف من آخر جزء في الرابط
                        document.body.appendChild(link);
                        link.click();

                        // تنظيف الرابط بعد التحميل
                        document.body.removeChild(link);
                        URL.revokeObjectURL(link.href);
                      } catch (error) {
                        console.log("error", error);
                      }
                    }}
                    sx={{ textTransform: "none", gap: 1 }}
                  >
                    {t("fee.downloadPayment")}
                  </Button>
                </>
              ) : (
                <>
                  {!isPaid && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PaymentIcon />}
                      onClick={() => setDialogOpen(true)}
                      sx={{ textTransform: "none", gap: 1 }}
                    >
                      {t("fee.pay", {
                        price: total_payment,
                      })}
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>

          {/* Bottom row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {t("fee.feeTitle", {
                semester: isArabic
                  ? data?.description_ar
                  : data?.description_en,
              })}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {isPaid && (
                <>
                  <Typography variant="caption">
                    {t("fee.paymentDate")}:&nbsp;
                    <strong>{data?.transactions_id?.transaction_date}</strong>
                  </Typography>
                  <Typography variant="caption">
                    {t("fee.transactionSerial")}:&nbsp;
                    <strong>{data?.transactions_id?.transaction_serial}</strong>
                  </Typography>
                </>
              )}

              {/* Status chip */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.4,
                  borderRadius: 1,
                  backgroundColor: isPaid ? "#ECFDF3" : "#FEF3F2",
                  border: `1px solid ${isPaid ? "#ABEFC6" : "#FECDCA"}`,
                }}
              >
                <FiberManualRecordIcon
                  sx={{ fontSize: 10, color: isPaid ? "#085D3A" : "#912018" }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isPaid ? "#085D3A" : "#912018",
                    fontWeight: 700,
                  }}
                >
                  {isPaid ? t("fee.paid") : t("fee.unpaid")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Toggle arrow */}
        <Grid item>
          <Box
            sx={{
              bgcolor: theme.palette.primary?.gray || "#f0f0f0",
              borderRadius: 1,
              p: 0.5,
            }}
          >
            <IconButton size="small" onClick={() => setOpen((s) => !s)}>
              {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Collapsible table */}
      <Collapse in={open} timeout="auto">
        <Box sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead
              sx={{
                backgroundColor:
                  theme.palette.primary?.tabelHeader || "#e0e0e0",
              }}
            >
              <TableRow>
                <TableCell sx={{ textAlign: "start", fontWeight: 700 }}>
                  {t("fee.table.reason")}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "start",
                    fontWeight: 700,
                    width: 140,
                    textAlign: "right",
                  }}
                >
                  {t("fee.table.amount")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                backgroundColor:
                  theme.palette.background?.secDefault || "#fafafa",
              }}
            >
              {data?.fees_types_ids?.map((it, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ textAlign: "start", fontWeight: 600 }}>
                    {isArabic ? it?.title_ar : it?.title_en}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: `${isArabic ? "end" : "start"}` }}
                  >
                    {it.is_inside_yemen
                      ? it.inside_yemen_value
                      : it.outside_yemen_value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>

      {/* Payment Dialog */}
      {/* Payment Dialog */}

      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}
          >
            {t("fee.payDialogTitle", {
              price: total_payment,
            })}
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
              {t("fee.paymentMethodsTitle")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {paymentMethodsArr.map((m) => {
                let icon;
                if (m === "CASH") icon = <AttachMoneyIcon fontSize="small" />;
                if (m === "BANK_TRANSFER")
                  icon = <AccountBalanceIcon fontSize="small" />;
                if (m === "ONLINE") icon = <PaymentIcon fontSize="small" />;

                // documentRequired
                return (
                  <Button
                    key={m}
                    variant={"contained"}
                    onClick={() => {
                      setMethod(m);
                    }}
                    sx={{
                      backgroundColor:
                        method === m ? "primary.main" : "background.gray",
                      borderColor:
                        method === m ? "primary.main" : "background.gray",
                      color: method === m ? "text.sec" : "text.primary",
                      justifyContent: "space-between",
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    {/* Left: Icon + Label */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {icon}
                      <Typography>{t(`fee.method.${m}`)}</Typography>
                    </Box>

                    {/* Right: Check icon if selected */}
                    {method === m && (
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "green" }}
                      />
                    )}
                  </Button>
                );
              })}
              {method == "BANK_TRANSFER" && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 500, mt: 2, mb: 2 }}
                  >
                    {t("fee.documentRequired")}
                  </Typography>

                  <TextField
                    type="file"
                    fullWidth
                    inputProps={{ accept: "image/*" }}
                    variant="outlined"
                    onChange={(e) => handleFileChange(e)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" }, // يشيل البوردر الخارجي
                        padding: 0, // يشيل أي padding جوه الـ root
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: 0, // يشيل الـ padding الداخلي حوالين النص
                      },
                    }}
                  />

                  {progress > 0 && (
                    <LinearProgress variant="determinate" value={progress} />
                  )}
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              variant="contained"
              onClick={async () => {
                console.log("paymentOBJ", data);

                if (method == "")
                  return notify(t("fee.paymentRequired"), "error");

                if (method == "BANK_TRANSFER" && bankTransferDocument == null)
                  return notify(t("fee.documentRequired"), "error");

                let paymentOBJ = {
                  id: data.id,
                  payment_method_type: method,
                  transaction_type_id: "68fdce917bb1890cd9720a60",
                  amount: parseFloat(total_payment),
                };

                console.log("paymentOBJ", paymentOBJ);

                if (method == "BANK_TRANSFER")
                  paymentOBJ.payment_document_file = bankTransferDocument;

                const result = await PayUserRequiredFees({
                  variables: {
                    // payUserRequiredFeesId: data.id,
                    input: paymentOBJ,
                  },
                });

                console.log("result", result);

                await GetUsersRequiredFeesByStudent({
                  variables: { student_id: data?.student_id?.id },
                });

                setDialogOpen(false);
              }}
            >
              {payFeesLoading ? (
                <CircularProgress
                  size={25}
                  sx={{
                    color:
                      theme.components.MuiButton.styleOverrides.containedPrimary
                        .color,
                  }}
                />
              ) : (
                t("fee.payNowBtn", { price: total_payment })
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
}
