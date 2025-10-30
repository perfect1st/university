import React, { useState } from "react";
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

export default function FeeCard({ data }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [method, setMethod] = useState("cash");

  const isArabic = i18n.language === "ar";
  // const isPaid = !!data?.is_paid;
  const isPaid = !!data?.is_paid;
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
              {/* {t("fee.academicYear")}&nbsp;{data.academicYear} */}
              {isArabic
                ? data?.fees_types_id?.title_ar
                : data?.fees_types_id?.title_en}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {isPaid ? (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                      window.open(data.paidDocument || "#", "_blank")
                    }
                    sx={{ textTransform: "none", gap: 1 }}
                  >
                    {t("fee.showPaidDocument")}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = data.paidDocument || "#";
                      link.download = (data.paidDocument || "")
                        .split("/")
                        .pop();
                      link.click();
                    }}
                    sx={{ textTransform: "none", gap: 1 }}
                  >
                    {t("fee.downloadPayment")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PaymentIcon />}
                    onClick={() => setDialogOpen(true)}
                    sx={{ textTransform: "none", gap: 1 }}
                  >
                    {t("fee.pay", {
                      price: data?.fees_types_id?.inside_yemen_value,
                    })}
                  </Button>
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
                  ? data?.fees_types_id?.title_ar
                  : data?.fees_types_id?.title_en,
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
                    <strong>{data.paymentDate}</strong>
                  </Typography>
                  <Typography variant="caption">
                    {t("fee.transactionSerial")}:&nbsp;
                    <strong>{data.transactionSerial}</strong>
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
          <Table size="small" component={Paper}>
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
              {data?.items?.map((it, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ textAlign: "start", fontWeight: 600 }}>
                    {it.reason}
                  </TableCell>
                  <TableCell sx={{ textAlign: "start" }}>{it.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>

      {/* Payment Dialog */}
      {/* Payment Dialog */}
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
            price: data?.fees_types_id?.inside_yemen_value,
          })}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
            {t("fee.paymentMethodsTitle")}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {["CASH", "BANK_TRANSFER", "ONLINE"].map((m) => {
              let icon;
              if (m === "CASH") icon = <AttachMoneyIcon fontSize="small" />;
              if (m === "BANK_TRANSFER") icon = <AccountBalanceIcon fontSize="small" />;
              if (m === "ONLINE") icon = <PaymentIcon fontSize="small" />;

              return (
                <Button
                  key={m}
                  variant={"contained"}
                  onClick={() => {
                    const paymentMethods = {
                      cash: "CASH",
                      bank: "BANK_TRANSFER",
                      online: "ONLINE",
                    };

                    const paymentMethod = paymentMethods[m] || "";

                    console.log('paymentMethod',paymentMethod);

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
                    <CheckCircleIcon fontSize="small" sx={{ color: "green" }} />
                  )}
                </Button>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              alert(
                `${t("fee.payNow")} ${
                  data?.fees_types_id?.inside_yemen_value
                } (${method})`
              );
              setDialogOpen(false);
            }}
          >
            {t("fee.payNowBtn", {
              price: data?.fees_types_id?.inside_yemen_value,
            })}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
