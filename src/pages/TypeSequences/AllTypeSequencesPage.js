import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import TableComponent from "../../components/TableComponent/TableComponent";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import {
  GET_TYPE_SEQUENCES,
  DELETE_TYPE_SEQUENCE,
} from "../../graphql/typeSequenceQueries";
import logger from "../../utils/logger";

export default function AllTypeSequencesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  // Using a generic permission key or creating a new one 'typeSequences'
  // Make sure this matches your permissions module in the backend
  const { view, create, update, delete: canDelete } = usePermissionsByModule("typeSequences") || { view: true, create: true, update: true, delete: true };

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);

  const { data, loading, refetch } = useQuery(GET_TYPE_SEQUENCES, {
    fetchPolicy: "network-only",
  });

  const [deleteTypeSequence, { loading: deleting }] = useMutation(DELETE_TYPE_SEQUENCE);

  const rawList = data?.getTypeSequences || [];

  const filteredList = rawList.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.SupportTicketTypeId?.label_ar?.toLowerCase().includes(term) ||
      item.SupportTicketTypeId?.label_en?.toLowerCase().includes(term) ||
      item.job_title_id?.name_ar?.toLowerCase().includes(term) ||
      item.job_title_id?.name_en?.toLowerCase().includes(term)
    );
  });

  // Sort by arrange
  const sortedList = [...filteredList].sort((a, b) => a.arrange - b.arrange);

  const formattedData = sortedList.map((item, index) => ({
    ...item,
    serial: item.serial || index + 1,
    ticket_type_display: isArabic ? item.SupportTicketTypeId?.label_ar : item.SupportTicketTypeId?.label_en,
    job_title_display: isArabic ? item.job_title_id?.name_ar : item.job_title_id?.name_en,
  }));

  const columns = [
    { key: "serial", label: t("Serial") || "#" },
    { key: "ticket_type_display", label: isArabic ? "نوع التذكرة" : "Ticket Type" },
    { key: "job_title_display", label: isArabic ? "المسمى الوظيفي" : "Job Title" },
    { key: "arrange", label: isArabic ? "الترتيب" : "Arrange (Order)" },
    { key: "period_time_per_day", label: isArabic ? "المدة (أيام)" : "Duration (Days)" },
  ];

  const handleDetailsClick = (row) => {
    if (!update) return notify(t("no_permission.title"), "error");
    navigate(`details/${row.id}`, { state: row });
  };

  const openDeleteModal = (row) => {
    if (!canDelete) return notify(t("no_permission.title"), "error");
    setSelectedItemToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItemToDelete?.id) return;
    try {
      await deleteTypeSequence({
        variables: { id: selectedItemToDelete.id },
      });
      notify(t("success"), "success");
      setDeleteDialogOpen(false);
      setSelectedItemToDelete(null);
      refetch();
    } catch (err) {
      logger.error("Delete sequence error:", err);
      notify(t("error"), "error");
    }
  };

  const fetchAndExport = (type) => {
    try {
      const exportData = sortedList.map((item, i) => ({
        "#": item.serial || i + 1,
        [isArabic ? "نوع التذكرة" : "Ticket Type"]: isArabic ? item.SupportTicketTypeId?.label_ar : item.SupportTicketTypeId?.label_en,
        [isArabic ? "المسمى الوظيفي" : "Job Title"]: isArabic ? item.job_title_id?.name_ar : item.job_title_id?.name_en,
        [isArabic ? "الترتيب" : "Arrange"]: item.arrange,
        [isArabic ? "المدة (أيام)" : "Duration (Days)"]: item.period_time_per_day,
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "مسارات الموافقات للتذاكر" : "Ticket Approval Sequences",
        type,
      });
    } catch (err) {
      logger.error("Export error:", err);
    }
  };

  if (view === false) return <NoPermissionPage />;
  if (loading) return <LoadingPage />;

  const titleText = isArabic ? "إعدادات مسارات الموافقات" : "Approval Sequences Settings";
  const itemText = isArabic ? "خطوة مسار" : "Sequence Step";

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
                ? "ابحث باسم نوع التذكرة أو المسمى الوظيفي..."
                : "Search ticket type or job title..."
            }
            textSearchField={"search"}
            onFilterChange={(e) => setSearchTerm(e.target.value)}
            t={t}
          />

          <TableComponent
            columns={columns}
            data={formattedData}
            loading={loading}
            handleDetailsClick={handleDetailsClick}
            hasDeleteBtn={canDelete}
            handleDeleteClick={openDeleteModal}
            dontShowActions={!update && !canDelete}
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
          {isArabic ? "تأكيد حذف الخطوة" : "Confirm Delete Sequence Step"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isArabic
              ? `هل أنت متأكد من رغبتك في حذف الخطوة المخصصة لـ "${selectedItemToDelete?.job_title_id?.name_ar}" من مسار التذكرة؟`
              : `Are you sure you want to delete the step assigned to "${selectedItemToDelete?.job_title_id?.name_en}"?`}
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
