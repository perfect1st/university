import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import BadgeIcon from "@mui/icons-material/Badge";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useFormik } from "formik";
import * as Yup from "yup";

import i18n from "../../i18n/i18n";
import Header from "../../components/PageHeader/header";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import LoadingPage from "../../components/LoadingComponent";
import NoPermissionPage from "../../components/NoPermissionPage";
import notify from "../../components/notify";
import { TrueOrFalseArr } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";

import {
  GET_FILTERED_JOB_TITLES,
  CREATE_JOB_TITLE,
  UPDATE_JOB_TITLE,
  TOGGLE_JOB_TITLE,
  DELETE_JOB_TITLE,
} from "../../graphql/jobTitleQueries";

export default function AllJobTitlesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  // Permissions with safe fallback
  const permissions = usePermissionsByModule("jobTitles");
  const {
    view = true,
    create = true,
    update = true,
    delete: canDelete = true,
  } = permissions || { view: true, create: true, update: true, delete: true };

  // Dialog state (modal for create/edit)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Lazy query for filtered and paged Job Titles
  const [
    fetchJobTitles,
    {
      data: { filteredPagedJobTitles } = {},
      loading: jobTitlesLoading,
      refetch,
    },
  ] = useLazyQuery(GET_FILTERED_JOB_TITLES, { fetchPolicy: "network-only" });

  // Mutations
  const [createJobTitle, { loading: creating }] = useMutation(
    CREATE_JOB_TITLE,
    { fetchPolicy: "network-only" }
  );

  const [updateJobTitleMutation, { loading: updating }] = useMutation(
    UPDATE_JOB_TITLE,
    { fetchPolicy: "network-only" }
  );

  const [toggleJobTitleMutation, { loading: toggling }] = useMutation(
    TOGGLE_JOB_TITLE,
    { fetchPolicy: "network-only" }
  );

  const [deleteJobTitleMutation, { loading: deleting }] = useMutation(
    DELETE_JOB_TITLE,
    { fetchPolicy: "network-only" }
  );

  // Read URL search params and query data
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || null;
    let status = null;

    if (searchParams.get("status") && searchParams.get("status") !== "0") {
      status = searchParams.get("status") === "true";
    }

    fetchJobTitles({
      variables: {
        page,
        limit,
        search,
        status,
      },
    });
  }, [searchParams, fetchJobTitles]);

  // Formik setup for Add / Edit modal
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name_ar: editingItem?.name_ar || "",
      name_en: editingItem?.name_en || "",
      status: editingItem ? editingItem.status : true,
    },
    validationSchema: Yup.object({
      name_ar: Yup.string().trim().required(isArabic ? "المسمى بالعربية مطلوب" : "Arabic title is required"),
      name_en: Yup.string().trim().required(isArabic ? "المسمى بالإنجليزية مطلوب" : "English title is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingItem) {
          await updateJobTitleMutation({
            variables: {
              id: editingItem.id,
              input: {
                name_ar: values.name_ar,
                name_en: values.name_en,
                status: values.status,
              },
            },
          });
          notify(isArabic ? "تم تعديل المسمى الوظيفي بنجاح" : "Job title updated successfully", "success");
        } else {
          await createJobTitle({
            variables: {
              input: {
                name_ar: values.name_ar,
                name_en: values.name_en,
                status: values.status,
              },
            },
          });
          notify(isArabic ? "تمت إضافة المسمى الوظيفي بنجاح" : "Job title added successfully", "success");
        }
        resetForm();
        setDialogOpen(false);
        setEditingItem(null);
        refetch();
      } catch (err) {
        notify(err.message || t("error"), "error");
      }
    },
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleEditClick = (row) => {
    if (!update) return notify(t("no_permission.title"), "error");
    setEditingItem(row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    formik.resetForm();
  };

  const handleDeleteClick = (row) => {
    if (!canDelete) return notify(t("no_permission.title"), "error");
    setItemToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) return;
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await deleteJobTitleMutation({ variables: { id: itemToDelete.id } });
      notify(isArabic ? "تم الحذف بنجاح" : "Deleted successfully", "success");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      refetch();
    } catch (err) {
      notify(err.message || t("error"), "error");
    }
  };

  const onStatusChange = async (row, newStatus) => {
    try {
      const nextStatus = newStatus === "inActive" ? false : true;
      await toggleJobTitleMutation({
        variables: {
          id: row?.id,
          status: nextStatus,
        },
      });
      notify(t("success"), "success");
      refetch();
    } catch (error) {
      notify(error.message || t("error"), "error");
    }
  };

  const onFilterChange = (filterOBJ) => {
    let newParams = new URLSearchParams(searchParams);

    if (filterOBJ.search) newParams.set("search", filterOBJ.search);
    else newParams.delete("search");

    if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0") {
      newParams.set("status", filterOBJ.status);
    } else {
      newParams.delete("status");
    }

    newParams.delete("page");
    setSearchParams(newParams);
  };

  // Table Columns
  const columns = [
    { key: "serial", label: t("Serial") },
    {
      key: "name_ar",
      label: isArabic ? "المسمى بالعربية" : "Arabic Title",
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BadgeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
          <Typography sx={{ fontWeight: 600, fontSize: "0.92rem" }}>
            {row.name_ar}
          </Typography>
        </Box>
      ),
    },
    { key: "name_en", label: isArabic ? "المسمى بالإنجليزية" : "English Title" },
    { key: "createdAtFormatted", label: isArabic ? "تاريخ الإنشاء" : "Created At" },
    { key: "status", label: t("Status") },
  ];

  // Map rows to display formatted data
  const jobTitlesList = filteredPagedJobTitles?.jobTitles || [];
  const jobTitlesToShow = jobTitlesList.map((el) => {
    let dateStr = "-";
    if (el.createdAt) {
      try {
        const d = new Date(Number(el.createdAt) || el.createdAt);
        dateStr = !isNaN(d.getTime())
          ? d.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : el.createdAt;
      } catch (e) {
        dateStr = el.createdAt;
      }
    }
    return {
      ...el,
      createdAtFormatted: dateStr,
    };
  });

  const pageLimit = Number(searchParams.get("limit")) || 10;
  const totalItems = filteredPagedJobTitles?.total || 0;
  const totalPages = Math.ceil(totalItems / pageLimit) || 1;

  // Export handling
  const fetchAndExport = (type) => {
    try {
      const exportData = jobTitlesList.map((jt, i) => ({
        "#": jt.serial || i + 1,
        [isArabic ? "المسمى بالعربية" : "Arabic Title"]: jt.name_ar,
        [isArabic ? "المسمى بالإنجليزية" : "English Title"]: jt.name_en,
        [t("Status")]: jt.status
          ? isArabic
            ? "نشط"
            : "Active"
          : isArabic
          ? "غير نشط"
          : "Inactive",
      }));

      ExportExcelAndPDF({
        exportData,
        isArabic,
        reportTitle: isArabic ? "قائمة مسميات الموظفين" : "Job Titles List",
        type,
      });
    } catch (err) {
      notify(err.message, "error");
    }
  };

  if (!view) return <NoPermissionPage />;

  if (jobTitlesLoading && !dialogOpen && !filteredPagedJobTitles) {
    return <LoadingPage />;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ overflowX: "auto" }}>
          {(toggling || deleting) && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress size={26} thickness={8} sx={{ color: "primary.main" }} />
            </Box>
          )}

          <Header
            title={isArabic ? "مسميات الموظفين" : "Job Titles"}
            subtitle={isArabic ? "إدارة المسميات والرتب الوظيفية للكادر والمسؤولين" : "Manage job titles and administrative roles"}
            i18n={i18n}
            haveBtn={create}
            btn={isArabic ? "إضافة مسمى وظيفي" : "Add Job Title"}
            btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
            onSubmit={handleOpenAddModal}
            isExcel
            isPdf
            isPrinter
            onExcel={() => fetchAndExport("excel")}
            onPdf={() => fetchAndExport("pdf")}
            onPrinter={() => fetchAndExport("print")}
          />

          <DashboardFilterComponent
            placeholder={isArabic ? "البحث بالمسمى بالعربية أو الإنجليزية" : "Search by Arabic or English title"}
            textSearchField={"search"}
            statusKey={"status"}
            TrueOrFalseArr={TrueOrFalseArr}
            onFilterChange={onFilterChange}
            t={t}
          />

          <TableComponent
            columns={columns}
            data={jobTitlesToShow}
            loading={jobTitlesLoading}
            statusKey="status"
            sx={{
              flex: 1,
              overflow: "auto",
              boxShadow: 1,
              borderRadius: 1,
              width: "100%",
            }}
            hasEditBtn={update}
            handleEditClick={handleEditClick}
            hasDeleteBtn={canDelete}
            handleDeleteClick={handleDeleteClick}
            onStatusChange={onStatusChange}
            isInDetails={true}
          />

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 1 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BadgeIcon sx={{ color: theme.palette.primary.main }} />
            <span>
              {editingItem
                ? isArabic
                  ? "تعديل المسمى الوظيفي"
                  : "Edit Job Title"
                : isArabic
                ? "إضافة مسمى وظيفي جديد"
                : "Add New Job Title"}
            </span>
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
            <TextField
              fullWidth
              id="name_ar"
              name="name_ar"
              label={isArabic ? "المسمى الوظيفي بالعربية" : "Job Title (Arabic)"}
              placeholder={isArabic ? "مثال: عميد كلية، رئيس قسم، وكيل" : "e.g. Dean, Department Head"}
              value={formik.values.name_ar}
              onChange={formik.handleChange}
              error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
              helperText={formik.touched.name_ar && formik.errors.name_ar}
              autoFocus
            />

            <TextField
              fullWidth
              id="name_en"
              name="name_en"
              label={isArabic ? "المسمى الوظيفي بالإنجليزية" : "Job Title (English)"}
              placeholder="e.g. Dean, Vice Dean, Alumni Officer"
              value={formik.values.name_en}
              onChange={formik.handleChange}
              error={formik.touched.name_en && Boolean(formik.errors.name_en)}
              helperText={formik.touched.name_en && formik.errors.name_en}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.status}
                  onChange={(e) => formik.setFieldValue("status", e.target.checked)}
                  color="success"
                />
              }
              label={
                formik.values.status
                  ? isArabic
                    ? "المسمى مفعل (نشط)"
                    : "Status: Active"
                  : isArabic
                  ? "المسمى غير مفعل (معطل)"
                  : "Status: Inactive"
              }
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseDialog} color="inherit" disabled={creating || updating}>
              {t("cancel", "إلغاء")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={creating || updating}
              sx={{ minWidth: 120, fontWeight: "bold" }}
            >
              {creating || updating ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : editingItem ? (
                isArabic ? "حفظ التعديل" : "Save Changes"
              ) : (
                isArabic ? "إضافة" : "Add"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: "bold",
            color: "error.main",
            pb: 1,
          }}
        >
          <DeleteIcon color="error" />
          <span>{isArabic ? "تأكيد حذف المسمى الوظيفي" : "Confirm Delete Job Title"}</span>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <DialogContentText sx={{ fontSize: "0.95rem", color: "text.primary" }}>
            {isArabic
              ? `هل أنت متأكد من رغبتك في حذف المسمى الوظيفي "${itemToDelete?.name_ar || itemToDelete?.name_en}"؟ لا يمكن التراجع عن هذا الإجراء.`
              : `Are you sure you want to delete "${itemToDelete?.name_en || itemToDelete?.name_ar}"? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            disabled={deleting}
          >
            {t("cancel", "إلغاء")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
            sx={{ fontWeight: "bold" }}
          >
            {deleting
              ? isArabic
                ? "جاري الحذف..."
                : "Deleting..."
              : isArabic
              ? "تأكيد الحذف"
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
