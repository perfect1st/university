import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Paper,
  Chip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";

import Header from "../../components/PageHeader/header";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import LoadingPage from "../../components/LoadingComponent";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import formatDateToString from "../../components/Utilities/FormatDateToString";

import {
  FILTERED_PAGED_INSTALLMENTS,
  APPROVE_INSTALLMENT,
  REJECT_INSTALLMENT,
} from "../../graphql/installmentsQueries";
import { isPaidArr } from "../../constants";
import logger from "../../utils/logger";

const Installments = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  const permissions = usePermissionsByModule("installments") || {};
  const { view } = permissions;
  const canApproveOrReject = permissions.pay ?? permissions.update ?? true;

  // Dialogs state for Approve & Reject
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [
    FilteredPagedInstallments,
    {
      data: {
        filteredPagedInstallments: {
          installments = [],
          total = 0,
        } = {
          installments: [],
          total: 0,
        },
      } = {},
      loading: pageLoading,
      error,
      refetch,
    },
  ] = useLazyQuery(FILTERED_PAGED_INSTALLMENTS, {
    fetchPolicy: "network-only",
  });

  const fetchInstallments = () => {
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 10;
    let searchText = searchParams.get("search") || "";

    let variablesObj = { page, limit, search: searchText };

    if (searchParams.get("status") && searchParams.get("status") !== "ALL") {
      variablesObj.status = searchParams.get("status");
    }

    if (searchParams.get("is_paid") && searchParams.get("is_paid") !== "0") {
      variablesObj.is_paid = searchParams.get("is_paid") === "true";
    }

    FilteredPagedInstallments({ variables: variablesObj });
  };

  const refetchData = () => {
    if (refetch) {
      refetch();
    } else {
      fetchInstallments();
    }
  };

  const [approveInstallment, { loading: approving }] = useMutation(APPROVE_INSTALLMENT, {
    onCompleted: () => {
      toast.success(
        t("installments.approveSuccess") ||
          (isArabic ? "تم اعتماد القسط بنجاح" : "Installment approved successfully")
      );
      setOpenApproveModal(false);
      setSelectedInstallment(null);
      refetchData();
    },
    onError: (err) => {
      logger.error("Error approving installment", err);
      toast.error(
        err.message ||
          t("installments.approveFailed") ||
          (isArabic ? "فشل اعتماد القسط" : "Failed to approve installment")
      );
    },
  });

  const [rejectInstallment, { loading: rejecting }] = useMutation(REJECT_INSTALLMENT, {
    onCompleted: () => {
      toast.success(
        t("installments.rejectSuccess") ||
          (isArabic ? "تم رفض القسط بنجاح" : "Installment rejected successfully")
      );
      setOpenRejectModal(false);
      setSelectedInstallment(null);
      setRejectionReason("");
      refetchData();
    },
    onError: (err) => {
      logger.error("Error rejecting installment", err);
      toast.error(
        err.message ||
          t("installments.rejectFailed") ||
          (isArabic ? "فشل رفض القسط" : "Failed to reject installment")
      );
    },
  });

  const handleConfirmApprove = () => {
    if (!selectedInstallment?.id) return;
    approveInstallment({
      variables: { installment_id: selectedInstallment.id },
    });
  };

  const handleConfirmReject = () => {
    if (!selectedInstallment?.id) return;
    if (!rejectionReason.trim()) {
      toast.error(
        t("installments.rejectionReasonRequired") ||
          (isArabic ? "يرجى كتابة سبب الرفض" : "Please enter rejection reason")
      );
      return;
    }
    rejectInstallment({
      variables: {
        installment_id: selectedInstallment.id,
        rejection_reason: rejectionReason.trim(),
      },
    });
  };

  const currentStatus = searchParams.get("status") || "ALL";

  useEffect(() => {
    fetchInstallments();
  }, [searchParams]);

  if (error) {
    logger.error("Error fetching installments", error);
  }

  const onFilterChange = async (filterOBJ) => {
    let newParams = new URLSearchParams(searchParams);

    if (filterOBJ.search) {
      newParams.set("search", filterOBJ.search);
    } else {
      newParams.delete("search");
    }

    if (filterOBJ.hasOwnProperty("is_paid") && filterOBJ.is_paid !== "0") {
      newParams.set("is_paid", filterOBJ.is_paid);
    } else {
      newParams.delete("is_paid");
    }

    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleStatusTabChange = (event, newValue) => {
    let newParams = new URLSearchParams(searchParams);
    if (newValue === "ALL") {
      newParams.delete("status");
    } else {
      newParams.set("status", newValue);
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const columns = [
    { key: "serial", label: t("Serial") },
    { key: "studentName", label: t("Student Name") },
    { key: "amount", label: t("Amount") },
    { key: "studyYear", label: t("Study Year") },
    { key: "termNumber", label: t("Term") },
    { key: "createDate", label: t("CreatedAt") },
    {
      key: "status",
      label: t("Status"),
      render: (row) => {
        const st = row.status || (row.is_paid ? "ACCEPTED" : "PENDING");
        if (st === "ACCEPTED") {
          return (
            <Chip
              label={t("installments.statusAcceptedChip")}
              color="success"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          );
        }
        if (st === "UNDER_REVIEW") {
          return (
            <Chip
              label={t("installments.statusUnderReviewChip")}
              color="warning"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          );
        }
        if (st === "CANCELLED") {
          return (
            <Chip
              label={t("installments.statusCancelledChip")}
              color="error"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          );
        }
        return (
          <Chip
            label={t("installments.statusPendingChip")}
            color="info"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        );
      },
    },
  ];

  const installmentsToShow = installments?.map((inst) => {
    const timestamp = Number(inst?.createdAt);
    const date = !isNaN(timestamp) && timestamp > 0 ? new Date(timestamp) : new Date(inst?.createdAt);

    return {
      id: inst.id,
      serial: inst.serial || "-",
      studentName: inst.student_id?.fullname || inst.student_id?.username || "-",
      amount: `${inst.amount} ${t("SAR")}`,
      studyYear: inst.study_year || "-",
      termNumber: inst.term_number === 1 ? t("First Term") : inst.term_number === 2 ? t("Second Term") : inst.term_number === 3 ? t("Summer Term") : inst.term_number || "-",
      createDate: formatDateToString(date),
      is_paid: inst.is_paid,
      status: inst.status || (inst.is_paid ? "ACCEPTED" : "PENDING"),
      ...inst,
    };
  });

  const pageLimit = Number(searchParams.get("limit")) || 10;
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageLimit));

  if (!view) return <NoPermissionPage />;
  if (pageLoading) return <LoadingPage />;

  return (
    <Box sx={{ p: isSmall ? 2 : 3, backgroundColor: "background.paper", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} sx={{ overflowX: "auto" }}>
          <Header
            title={t("Installments")}
            subtitle={t("Installments Details")}
            i18n={i18n}
            haveBtn={false}
          />

          {/* Status Filter Tabs */}
          <Paper sx={{ mb: 2.5, borderRadius: 1.5, boxShadow: 1 }}>
            <Tabs
              value={currentStatus}
              onChange={handleStatusTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={t("installments.allTab")} value="ALL" sx={{ fontWeight: 700 }} />
              <Tab label={t("installments.underReviewTab")} value="UNDER_REVIEW" sx={{ fontWeight: 700 }} />
              <Tab label={t("installments.acceptedTab")} value="ACCEPTED" sx={{ fontWeight: 700 }} />
              <Tab label={t("installments.cancelledTab")} value="CANCELLED" sx={{ fontWeight: 700 }} />
              <Tab label={t("installments.pendingTab")} value="PENDING" sx={{ fontWeight: 700 }} />
            </Tabs>
          </Paper>

          <DashboardFilterComponent
            placeholder={t("installments.searchPlaceholder")}
            textSearchField="search"
            selectOptions={isPaidArr}
            arKey="arKey"
            enKey="enKey"
            selectKey="is_paid"
            select2Label="Status"
            onFilterChange={onFilterChange}
            t={t}
          />

          <TableComponent
            columns={columns}
            data={installmentsToShow}
            handleDetailsClick={(row) => navigate(`/installments/details/${row.id}`, { state: { row } })}
            renderCustomMenuItems={(row, handleClose) => {
              if (!canApproveOrReject) return null;
              const items = [];

              if (row.status !== "ACCEPTED") {
                items.push(
                  <MenuItem
                    key="approve"
                    onClick={() => {
                      handleClose();
                      setSelectedInstallment(row);
                      setOpenApproveModal(true);
                    }}
                    sx={{
                      color: "success.main",
                      borderLeft: isArabic ? "" : `4px solid ${alpha(theme.palette.success.main, 0.5)}`,
                      borderRight: isArabic ? `4px solid ${alpha(theme.palette.success.main, 0.5)}` : "",
                      py: 1,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                    <Box component="span">
                      {t("installments.approveInstallment") || (isArabic ? "اعتماد القسط" : "Approve")}
                    </Box>
                  </MenuItem>
                );
              }

              if (row.status !== "CANCELLED") {
                items.push(
                  <MenuItem
                    key="reject"
                    onClick={() => {
                      handleClose();
                      setSelectedInstallment(row);
                      setRejectionReason("");
                      setOpenRejectModal(true);
                    }}
                    sx={{
                      color: "error.main",
                      borderLeft: isArabic ? "" : `4px solid ${alpha(theme.palette.error.main, 0.5)}`,
                      borderRight: isArabic ? `4px solid ${alpha(theme.palette.error.main, 0.5)}` : "",
                      py: 1,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CancelIcon sx={{ fontSize: 18 }} />
                    <Box component="span">
                      {t("installments.rejectReceipt") || (isArabic ? "رفض القسط" : "Reject")}
                    </Box>
                  </MenuItem>
                );
              }

              return items;
            }}
            statusKey="status"
            showStatusChange={false}
            sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1, width: "100%" }}
          />

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={openApproveModal}
        onClose={() => !approving && setOpenApproveModal(false)}
        maxWidth="xs"
        fullWidth
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {t("installments.confirmApproveTitle") || (isArabic ? "تأكيد اعتماد القسط" : "Confirm Installment Approval")}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {isArabic
              ? `هل أنت متأكد من رغبتك في اعتماد القسط رقم #${selectedInstallment?.serial || ""} للطالب "${selectedInstallment?.studentName || ""}" بمبلغ ${selectedInstallment?.amount || ""}?`
              : `Are you sure you want to approve installment #${selectedInstallment?.serial || ""} for student "${selectedInstallment?.studentName || ""}" with amount ${selectedInstallment?.amount || ""}?`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenApproveModal(false)} disabled={approving}>
            {t("installments.cancel") || (isArabic ? "إلغاء" : "Cancel")}
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmApprove}
            disabled={approving}
          >
            {approving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("installments.confirmApproveBtn") || (isArabic ? "تأكيد الاعتماد" : "Confirm Approval")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog with Reason */}
      <Dialog
        open={openRejectModal}
        onClose={() => !rejecting && setOpenRejectModal(false)}
        maxWidth="sm"
        fullWidth
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {t("installments.rejectDialogTitle") || (isArabic ? "رفض القسط" : "Reject Installment")}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("installments.rejectDialogSubtitle") ||
              (isArabic
                ? "يرجى كتابة سبب رفض القسط ليتمكن الطالب من معرفة السبب."
                : "Please specify the rejection reason.")}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("installments.rejectionReasonLabel") || (isArabic ? "سبب الرفض *" : "Rejection Reason *")}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={
              t("installments.rejectionReasonPlaceholder") ||
              (isArabic ? "مثال: لم يتم استلام الحوالة أو صورة الإيصال غير واضحة..." : "Enter rejection reason...")
            }
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenRejectModal(false)} disabled={rejecting}>
            {t("installments.cancel") || (isArabic ? "إلغاء" : "Cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmReject}
            disabled={rejecting}
          >
            {rejecting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("installments.confirmRejectBtn") || (isArabic ? "تأكيد الرفض" : "Confirm Rejection")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Installments;
