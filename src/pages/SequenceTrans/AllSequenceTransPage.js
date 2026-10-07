import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tabs,
  Tab,
  MenuItem
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import TableComponent from "../../components/TableComponent/TableComponent";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import {
  GET_SEQUENCE_TRANS,
  DELETE_SEQUENCE_TRANS,
  UPDATE_SEQUENCE_TRANS
} from "../../graphql/typeSequenceQueries";
import logger from "../../utils/logger";
import { format } from "date-fns";

export default function AllSequenceTransPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const { view, create, update, delete: canDelete } = usePermissionsByModule("supportTicketsSequenceTrans") || { view: true, create: true, update: true, delete: true };

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [pageState, setPageState] = useState(0);
  const [limit, setLimit] = useState(10);
  const statusFilter = activeTab === 0 ? "pending" : activeTab === 1 ? "approved" : "rejected";

  const { data, loading, refetch } = useQuery(GET_SEQUENCE_TRANS, {
    variables: { search: searchTerm, status: statusFilter, page: pageState + 1, limit },
    fetchPolicy: "network-only",
  });

  const [deleteSequenceTrans, { loading: deleting }] = useMutation(DELETE_SEQUENCE_TRANS);
  const [updateSequenceTrans, { loading: updating }] = useMutation(UPDATE_SEQUENCE_TRANS);

  const rawList = data?.getSupportTicketsSequenceTrans?.transactions || [];
  const totalItems = data?.getSupportTicketsSequenceTrans?.total || 0;

  const filteredList = rawList;

  const formattedData = filteredList.map((item, index) => ({
    ...item,
    serial: item.serial || index + 1,
    ticket_subject: item.support_ticketsId?.subject,
    ticket_type_display: isArabic ? item.type_sequence_id?.SupportTicketTypeId?.label_ar : item.type_sequence_id?.SupportTicketTypeId?.label_en,
    step_arrange: item.type_sequence_id?.arrange,
    job_title_display: isArabic ? item.type_sequence_id?.job_title_id?.name_ar : item.type_sequence_id?.job_title_id?.name_en,
    user_fullname: item.user_id?.fullname,
    status_display: (item.status === 'approved' || (item.is_approved && item.status !== 'rejected')) ? (
      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
        label={isArabic ? "معتمد" : "Approved"}
        color="success"
        size="small"
        variant="outlined"
      />
    ) : item.status === 'rejected' ? (
      <Chip
        label={isArabic ? "مرفوض" : "Rejected"}
        color="error"
        size="small"
        variant="outlined"
      />
    ) : (
      <Chip
        icon={<HourglassEmptyIcon sx={{ fontSize: 16 }} />}
        label={isArabic ? "قيد الانتظار" : "Pending"}
        color="warning"
        size="small"
        variant="outlined"
      />
    ),
    date_display: item.approved_datetime ? format(new Date(Number(item.approved_datetime)), "yyyy-MM-dd hh:mm a") : "-",
  }));

  const columns = [
    { key: "serial", label: t("Serial") || "#" },
    { key: "ticket_subject", label: isArabic ? "موضوع التذكرة" : "Ticket Subject" },
    { key: "ticket_type_display", label: isArabic ? "نوع التذكرة" : "Ticket Type" },
    { key: "step_arrange", label: isArabic ? "رقم الخطوة" : "Step No." },
    { key: "job_title_display", label: isArabic ? "المسمى الوظيفي" : "Job Title" },
    { key: "user_fullname", label: isArabic ? "الموظف المسؤول" : "Assignee" },
    { key: "status_display", label: isArabic ? "الحالة" : "Status" },
    { key: "date_display", label: isArabic ? "تاريخ الموافقة" : "Approval Date" },
  ];

  const handleDetailsClick = (row) => {
    if (!update) return notify(t("no_permission.title"), "error");
    const originalItem = filteredList.find(item => item.id === row.id) || row;
    navigate(`details/${row.id}`, { state: originalItem });
  };

  const openDeleteModal = (row) => {
    if (!canDelete) return notify(t("no_permission.title"), "error");
    setSelectedItemToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItemToDelete?.id) return;
    try {
      await deleteSequenceTrans({
        variables: { id: selectedItemToDelete.id },
      });
      notify(t("success"), "success");
      setDeleteDialogOpen(false);
      setSelectedItemToDelete(null);
      refetch();
    } catch (err) {
      logger.error("Delete trans error:", err);
      notify(t("error"), "error");
    }
  };

  const handleApprove = async (row, closeMenu) => {
    try {
      await updateSequenceTrans({
        variables: {
          id: row.id,
          input: {
            support_ticketsId: row.support_ticketsId?.id,
            type_sequence_id: row.type_sequence_id?.id,
            user_id: row.user_id?.id,
            is_approved: true,
            status: 'approved',
            approved_datetime: String(new Date().getTime()),
          }
        }
      });
      notify(isArabic ? "تم الاعتماد بنجاح" : "Approved successfully", "success");
      closeMenu();
      refetch();
    } catch (err) {
      notify(t("error"), "error");
    }
  };

  const handleReject = async (row, closeMenu) => {
    try {
      await updateSequenceTrans({
        variables: {
          id: row.id,
          input: {
            support_ticketsId: row.support_ticketsId?.id,
            type_sequence_id: row.type_sequence_id?.id,
            user_id: row.user_id?.id,
            is_approved: false,
            status: 'rejected',
          }
        }
      });
      notify(isArabic ? "تم الرفض" : "Rejected", "success");
      closeMenu();
      refetch();
    } catch (err) {
      notify(t("error"), "error");
    }
  };

  const fetchAndExport = (type) => {
    try {
      const exportData = filteredList.map((item, i) => ({
        "#": item.serial || i + 1,
        [isArabic ? "موضوع التذكرة" : "Ticket Subject"]: item.support_ticketsId?.subject,
        [isArabic ? "نوع التذكرة" : "Ticket Type"]: isArabic ? item.type_sequence_id?.SupportTicketTypeId?.label_ar : item.type_sequence_id?.SupportTicketTypeId?.label_en,
        [isArabic ? "الخطوة" : "Step"]: item.type_sequence_id?.arrange,
        [isArabic ? "الموظف" : "Assignee"]: item.user_id?.fullname,
        [isArabic ? "الحالة" : "Status"]: (item.status === 'approved' || item.is_approved) ? (isArabic ? "معتمد" : "Approved") : item.status === 'rejected' ? (isArabic ? "مرفوض" : "Rejected") : (isArabic ? "انتظار" : "Pending"),
        [isArabic ? "التاريخ" : "Date"]: item.approved_datetime ? format(new Date(Number(item.approved_datetime)), "yyyy-MM-dd") : "-",
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "حركات موافقات التذاكر" : "Tickets Approval Transactions",
        type,
      });
    } catch (err) {
      logger.error("Export error:", err);
    }
  };

  if (view === false) return <NoPermissionPage />;
  if (loading) return <LoadingPage />;

  const titleText = isArabic ? "سجل حركات الموافقات" : "Approval Transactions Log";
  const itemText = isArabic ? "حركة" : "Transaction";

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header
            title={titleText}
            subtitle={titleText}
            i18n={i18n}
            haveBtn={create}
            btn={t("addItem", { item: itemText }) || `إضافة ${itemText}`}
            btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
            onSubmit={() => navigate("add")}
            isExcel
            isPdf
            isPrinter
            onExcel={() => fetchAndExport("excel")}
            onPdf={() => fetchAndExport("pdf")}
            onPrinter={() => fetchAndExport("print")}
          />

          <DashboardFilterComponent
            placeholder={
              isArabic
                ? "ابحث باسم الموظف أو موضوع التذكرة..."
                : "Search assignee or ticket subject..."
            }
            textSearchField={"search"}
            onFilterChange={(e) => setSearchTerm(e.target.value)}
            t={t}
          />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: 1 }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} aria-label="approval tabs">
              <Tab label={isArabic ? "قيد الانتظار" : "Pending"} />
              <Tab label={isArabic ? "معتمد" : "Approved"} />
              <Tab label={isArabic ? "مرفوض" : "Rejected"} />
            </Tabs>
          </Box>

          <TableComponent
            columns={columns}
            data={formattedData}
            loading={loading || updating}
            serverPagination
            totalItems={totalItems}
            page={pageState}
            rowsPerPage={limit}
            onPageChange={(e, newPage) => setPageState(newPage)}
            onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPageState(0); }}
            handleDetailsClick={handleDetailsClick}
            hasDeleteBtn={canDelete && activeTab === 0}
            handleDeleteClick={openDeleteModal}
            dontShowActions={activeTab !== 0}
            renderCustomMenuItems={activeTab === 0 ? (row, closeMenu) => [
              <MenuItem key="approve" onClick={() => handleApprove(row, closeMenu)} sx={{ color: "success.main" }}>
                {isArabic ? "قبول" : "Accept"}
              </MenuItem>,
              <MenuItem key="reject" onClick={() => handleReject(row, closeMenu)} sx={{ color: "error.main" }}>
                {isArabic ? "رفض" : "Reject"}
              </MenuItem>
            ] : null}
            showStatusChange={false}
            sx={{
              flex: 1,
              overflow: "auto",
              boxShadow: 1,
              borderRadius: 1,
              width: "100%",
            }}
          />
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {isArabic ? "تأكيد حذف الحركة" : "Confirm Delete Transaction"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isArabic
              ? `هل أنت متأكد من رغبتك في حذف حركة الموافقة للتذكرة "${selectedItemToDelete?.support_ticketsId?.subject}"؟`
              : `Are you sure you want to delete the approval transaction for ticket "${selectedItemToDelete?.support_ticketsId?.subject}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            disabled={deleting}
          >
            {t("cancel") || "إلغاء"}
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isArabic ? "حذف نهائي" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
