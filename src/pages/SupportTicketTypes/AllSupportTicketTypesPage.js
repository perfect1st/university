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
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import TableComponent from "../../components/TableComponent/TableComponent";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import {
  GET_ALL_SUPPORT_TICKET_TYPES,
  DELETE_SUPPORT_TICKET_TYPE,
} from "../../graphql/supportTicketQueries";
import logger from "../../utils/logger";

export default function AllSupportTicketTypesPage() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const { view, create, update, delete: canDelete } =
    usePermissionsByModule("supportTicketTypes");

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTypeToDelete, setSelectedTypeToDelete] = useState(null);

  const { data, loading, refetch } = useQuery(GET_ALL_SUPPORT_TICKET_TYPES, {
    fetchPolicy: "network-only",
  });

  const [deleteSupportTicketType, { loading: deleting }] = useMutation(
    DELETE_SUPPORT_TICKET_TYPE
  );

  const rawList = data?.getSupportTicketTypes || [];

  const filteredList = rawList.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.label_ar?.toLowerCase().includes(term) ||
      item.label_en?.toLowerCase().includes(term)
    );
  });

  const formattedData = filteredList.map((item, index) => ({
    ...item,
    serial: item.serial || index + 1,
    requires_fee_display: item.requires_fee ? (
      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
        label={isArabic ? "نعم" : "Yes"}
        color="warning"
        size="small"
        variant="outlined"
      />
    ) : (
      <Chip
        icon={<CancelIcon sx={{ fontSize: 16 }} />}
        label={isArabic ? "لا (مجاني)" : "No (Free)"}
        color="success"
        size="small"
        variant="outlined"
      />
    ),
    fees_display:
      item.fees && item.fees.length > 0
        ? item.fees
            .map((f) => (isArabic ? f.title_ar : f.title_en))
            .join("، ")
        : isArabic
        ? "لا توجد رسوم"
        : "No fees",
  }));

  const columns = [
    { key: "serial", label: t("Serial") },
    { key: "label_ar", label: t("Dashboard.NameInArabic") },
    { key: "label_en", label: t("Dashboard.NameInEnglish") },
    {
      key: "requires_fee_display",
      label: isArabic ? "يتطلب رسوم؟" : "Requires Fee?",
    },
    {
      key: "fees_display",
      label: isArabic ? "بنود الرسوم المقررة" : "Configured Fees",
    },
  ];

  const handleDetailsClick = (row) => {
    if (!update) return notify(t("no_permission.title"), "error");
    const cleanItem = {
      id: row.id,
      label_ar: row.label_ar,
      label_en: row.label_en,
      requires_fee: row.requires_fee,
      fees: row.fees,
      serial: row.serial,
    };
    navigate(`details/${row.id}`, { state: cleanItem });
  };

  const openDeleteModal = (row) => {
    if (!canDelete) return notify(t("no_permission.title"), "error");
    setSelectedTypeToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTypeToDelete?.id) return;
    try {
      await deleteSupportTicketType({
        variables: { id: selectedTypeToDelete.id },
      });
      notify(t("success"), "success");
      setDeleteDialogOpen(false);
      setSelectedTypeToDelete(null);
      refetch();
    } catch (err) {
      logger.error("Delete support ticket type error:", err);
      notify(t("error"), "error");
    }
  };

  const fetchAndExport = (type) => {
    try {
      const exportData = rawList.map((item, i) => ({
        "#": item.serial || i + 1,
        [t("Dashboard.NameInArabic")]: item.label_ar,
        [t("Dashboard.NameInEnglish")]: item.label_en,
        [isArabic ? "يتطلب رسوم؟" : "Requires Fee?"]: item.requires_fee
          ? isArabic
            ? "نعم"
            : "Yes"
          : isArabic
          ? "لا"
          : "No",
        [isArabic ? "الرسوم" : "Fees"]:
          item.fees && item.fees.length > 0
            ? item.fees
                .map((f) => (isArabic ? f.title_ar : f.title_en))
                .join("، ")
            : isArabic
            ? "مجاني"
            : "Free",
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic
          ? "أنواع تذاكر الدعم والمستندات"
          : "Support Ticket Types",
        type,
      });
    } catch (err) {
      logger.error("Export error:", err);
    }
  };

  if (!view) return <NoPermissionPage />;
  if (loading) return <LoadingPage />;

  const titleText = isArabic
    ? "أنواع تذاكر الدعم والمستندات"
    : "Ticket Types & Documents";
  const itemText = isArabic ? "نوع تذكرة / مستند" : "Ticket Type / Document";

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header
            title={titleText}
            subtitle={titleText}
            i18n={i18n}
            haveBtn={create}
            btn={t("addItem", { item: itemText })}
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
                ? "ابحث باسم نوع التذكرة أو المستند..."
                : "Search ticket type or document name..."
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
          {isArabic ? "تأكيد حذف نوع التذكرة" : "Confirm Delete Ticket Type"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isArabic
              ? `هل أنت متأكد من رغبتك في حذف "${
                  selectedTypeToDelete?.label_ar || selectedTypeToDelete?.label_en
                }"؟ لن يتمكن الطلاب من اختيار هذا النوع بعد الآن.`
              : `Are you sure you want to delete "${
                  selectedTypeToDelete?.label_en || selectedTypeToDelete?.label_ar
                }"? Students will no longer be able to select it.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            disabled={deleting}
          >
            {t("cancel")}
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
