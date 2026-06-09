import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  alpha,
  Divider,
} from "@mui/material";
import {
  CloudDownload,
  Delete,
  Info,
  AddCircle,
  Storage,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
  CloudQueue,
  Refresh,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import {
  GET_ALL_BACKUPS,
  CREATE_BACKUP,
  DELETE_BACKUP,
} from "../../graphql/backupQueries";
import TableComponent from "../../components/TableComponent/TableComponent";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import notify from "../../components/notify";
import LoadingPage from "../../components/LoadingComponent";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import logger from "../../utils/logger";

export default function BackupsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isArabic = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  // Screen permissions
  const { view, create, delete: canDelete } = usePermissionsByModule("countries");

  // Local State
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [noteText, setNoteText] = useState("");

  // Pagination variables
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  // GraphQL Variables for main list
  const queryVariables = useMemo(() => {
    const vars = {
      page,
      limit,
    };
    if (statusFilter !== "all") vars.status = statusFilter;
    if (typeFilter !== "all") vars.type = typeFilter;
    return vars;
  }, [page, limit, statusFilter, typeFilter]);

  // Main list query
  const {
    data: backupsData,
    loading: backupsLoading,
    error: backupsError,
    refetch: refetchList,
  } = useQuery(GET_ALL_BACKUPS, {
    variables: queryVariables,
    fetchPolicy: "network-only",
  });

  // Parallel queries to fetch stats counts (independent of limits/filters)
  const { data: totalCountData, refetch: refetchTotal } = useQuery(GET_ALL_BACKUPS, {
    variables: { page: 1, limit: 1 },
    fetchPolicy: "network-only",
  });

  // const { data: successCountData, refetch: refetchSuccess } = useQuery(GET_ALL_BACKUPS, {
  //   variables: { page: 1, limit: 1, status: "success" },
  //   fetchPolicy: "network-only",
  // });

  // const { data: failedCountData, refetch: refetchFailed } = useQuery(GET_ALL_BACKUPS, {
  //   variables: { page: 1, limit: 1, status: "failed" },
  //   fetchPolicy: "network-only",
  // });

  // Mutations
  const [createBackup, { loading: creatingBackup }] = useMutation(CREATE_BACKUP);
  const [deleteBackup, { loading: deletingBackup }] = useMutation(DELETE_BACKUP);

  // Sync state with URL search params when they change
  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "all");
    setTypeFilter(searchParams.get("type") || "all");
  }, [searchParams]);

  // Refresh helper
  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchList(),
        refetchTotal(),
        // refetchSuccess(),
        // refetchFailed(),
      ]);
      notify(t("success"), "success");
    } catch (err) {
      notify(t("error"), "error");
    }
  };

  // Change filters and reset page to 1
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  // Manual Backup Creation Handler
  const handleCreateBackup = async () => {
    try {
      const result = await createBackup({
        variables: {
            note: noteText,
        },
      });

      if (result.data?.createManualBackup) {
        notify(t("backups.createSuccess"), "success");
        setIsCreateOpen(false);
        setNoteText("");
        handleRefresh();
      }
    } catch (err) {
      logger.error("Create backup failed:", err);
      notify(err.message || t("error"), "error");
    }
  };

  // Delete Backup Handler
  const handleDeleteBackup = async () => {
    if (!selectedBackup) return;
    try {
      const result = await deleteBackup({
        variables: { id: selectedBackup.id },
      });

      if (result.data?.deleteBackup) {
        notify(t("backups.deleteSuccess"), "success");
        setIsDeleteOpen(false);
        setSelectedBackup(null);
        handleRefresh();
      }
    } catch (err) {
      logger.error("Delete backup failed:", err);
      notify(err.message || t("error"), "error");
    }
  };

  // Formatting helpers
  const formatBytes = (bytes) => {
    if (!bytes || isNaN(bytes)) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

const formatDate = (dateString) => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(Number(dateString));
    
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};

  const handleDownload = (downloadUrl, filename) => {
    if (!downloadUrl) return;
    const absoluteUrl = downloadUrl.startsWith("http")
      ? downloadUrl
      : `https://uas.edu.ye${downloadUrl.startsWith("/") ? "" : "/"}${downloadUrl}`;

    const link = document.createElement("a");
    link.href = absoluteUrl;
    link.setAttribute("download", filename || "backup.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Columns definition for TableComponent
  const columns = useMemo(
    () => [
      {
        key: "filename",
        label: t("backups.filename"),
        render: (row) => (
          <Tooltip title={row.filename} placement="top">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ maxWidth: 240 }}>
              <Storage
                sx={{
                  color: row.status === "failed" ? "error.main" : "primary.main",
                  fontSize: 20,
                }}
              />
              <Typography
                variant="body2"
                noWrap
                fontWeight={500}
                sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                onClick={() => {
                  setSelectedBackup(row);
                  setIsDetailsOpen(true);
                }}
              >
                {row.filename}
              </Typography>
            </Stack>
          </Tooltip>
        ),
      },
      {
        key: "fileSize",
        label: t("backups.fileSize"),
        render: (row) => (
          <Typography variant="body2" fontWeight={500}>
            {row.status === "failed" ? "-" :row.fileSize}
          </Typography>
        ),
      },
      {
        key: "type",
        label: t("backups.type"),
        render: (row) => (
          <Chip
            size="small"
            icon={row.type === "automatic" ? <Schedule sx={{ fontSize: "14px !important" }} /> : <CloudQueue sx={{ fontSize: "14px !important" }} />}
            label={row.type === "automatic" ? t("backups.automatic") : t("backups.manual")}
            sx={{
              fontWeight: "bold",
              borderRadius: "6px",
              backgroundColor:
                row.type === "automatic"
                  ? alpha(theme.palette.secondary.main, 0.15)
                  : alpha(theme.palette.info.main, 0.15),
              color:
                row.type === "automatic"
                  ? theme.palette.secondary.dark || theme.palette.secondary.main
                  : theme.palette.info.dark || theme.palette.info.main,
              border: `1px solid ${
                row.type === "automatic"
                  ? alpha(theme.palette.secondary.main, 0.3)
                  : alpha(theme.palette.info.main, 0.3)
              }`,
            }}
          />
        ),
      },
      {
        key: "status",
        label: t("backups.status"),
        render: (row) => (
          <Chip
            size="small"
            icon={row.status === "success" ? <CheckCircle sx={{ fontSize: "14px !important" }} /> : <ErrorIcon sx={{ fontSize: "14px !important" }} />}
            label={row.status === "success" ? t("backups.success") : t("backups.failed")}
            sx={{
              fontWeight: "bold",
              borderRadius: "6px",
              backgroundColor:
                row.status === "success"
                  ? alpha(theme.palette.success.main, 0.15)
                  : alpha(theme.palette.error.main, 0.15),
              color:
                row.status === "success"
                  ? theme.palette.success.dark || theme.palette.success.main
                  : theme.palette.error.dark || theme.palette.error.main,
              border: `1px solid ${
                row.status === "success"
                  ? alpha(theme.palette.success.main, 0.3)
                  : alpha(theme.palette.error.main, 0.3)
              }`,
            }}
          />
        ),
      },
      {
        key: "performedBy",
        label: t("backups.performedBy"),
        render: (row) => {
          if (!row.performedBy) {
            return (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t("backups.automatic")}
                </Typography>
              </Stack>
            );
          }
          const { fullname, username, profile_image } = row.performedBy;
          const initial = (fullname || username || "U").charAt(0).toUpperCase();
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={500}>
                {fullname || username}
              </Typography>
            </Stack>
          );
        },
      },
      {
        key: "createdAt",
        label: t("Created At"),
        render: (row) => (
          <Typography variant="body2" color="text.secondary">
            {formatDate(row.createdAt)}
          </Typography>
        ),
      },
    ],
    [theme, t, isArabic]
  );

  // Stats dashboard cards
  // const stats = useMemo(() => {
  //   const totalCount = totalCountData?.backups?.total || 0;
  //   const successCount = successCountData?.backups?.total || 0;
  //   const failedCount = failedCountData?.backups?.total || 0;

  //   return [
  //     {
  //       title: t("backups.total"),
  //       value: totalCount,
  //       color: theme.palette.primary.main,
  //       bgColor: alpha(theme.palette.primary.main, 0.08),
  //       icon: <Storage sx={{ fontSize: 32 }} />,
  //     },
  //     {
  //       title: t("backups.successCount"),
  //       value: successCount,
  //       color: theme.palette.success.main,
  //       bgColor: alpha(theme.palette.success.main, 0.08),
  //       icon: <CheckCircle sx={{ fontSize: 32 }} />,
  //     },
  //     {
  //       title: t("backups.failedCount"),
  //       value: failedCount,
  //       color: theme.palette.error.main,
  //       bgColor: alpha(theme.palette.error.main, 0.08),
  //       icon: <ErrorIcon sx={{ fontSize: 32 }} />,
  //     },
  //   ];
  // }, [totalCountData, successCountData, failedCountData, t, theme]);

  // Auth/Permissions Check
  if (!view) return <NoPermissionPage />;
  if (backupsLoading) return <LoadingPage />;

  // Pagination totals
  const totalBackups = backupsData?.backups?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalBackups / limit));
  const backupsList = backupsData?.backups?.backups || [];

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", minHeight: "100%" }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mb: 0.5 }}>
            {t("backups.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("backups.subtitle")}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{
              py: 1,
              px: 2,
              borderColor: alpha(theme.palette.primary.main, 0.4),
              "&:hover": { borderColor: theme.palette.primary.main },
            }}
          >
            {isArabic ? "تحديث" : "Refresh"}
          </Button>

          {create && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircle />}
              onClick={() => setIsCreateOpen(true)}
              sx={{
                py: 1,
                px: 2.5,
                boxShadow: "0px 4px 10px rgba(9, 86, 144, 0.2)",
              }}
            >
              {t("backups.createBackup")}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Stats Section */}
      {/* <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card
              sx={{
                border: `1px solid ${alpha(stat.color, 0.15)}`,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                  stat.color,
                  0.02
                )} 100%)`,
                borderRadius: "16px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `0 4px 20px 0 ${alpha(stat.color, 0.03)}`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 30px 0 ${alpha(stat.color, 0.1)}`,
                  borderColor: alpha(stat.color, 0.35),
                },
              }}
            >
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} color={stat.color}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      borderRadius: "12px",
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid> */}

      {/* Filter Section */}
      <Card
        sx={{
          mb: 3,
          borderRadius: "12px",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* Status Filter */}
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("backups.status")}</InputLabel>
                <Select
                  value={statusFilter}
                  label={t("backups.status")}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="all">{t("All")}</MenuItem>
                  <MenuItem value="success">{t("backups.success")}</MenuItem>
                  <MenuItem value="failed">{t("backups.failed")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Type Filter */}
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("backups.type")}</InputLabel>
                <Select
                  value={typeFilter}
                  label={t("backups.type")}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <MenuItem value="all">{t("All")}</MenuItem>
                  <MenuItem value="automatic">{t("backups.automatic")}</MenuItem>
                  <MenuItem value="manual">{t("backups.manual")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Box sx={{ width: "100%", overflow: "hidden", borderRadius: "12px", border: `1px solid ${theme.palette.divider}` }}>
        {backupsError ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <ErrorIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
            <Typography color="error" variant="h6">
              {t("error")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {backupsError.message}
            </Typography>
          </Box>
        ) : backupsList.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center", bgcolor: "background.paper" }}>
            <Storage sx={{ fontSize: 56, color: "text.secondary", mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              {isArabic ? "لا توجد نسخ احتياطية متوفرة" : "No backups available"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isArabic ? "قم بإنشاء نسخة احتياطية يدوية جديدة للبدء." : "Create a new manual backup to get started."}
            </Typography>
          </Box>
        ) : (
          <>
            <TableComponent
              columns={columns}
              data={backupsList}
              dontShowActions={false}
              showStatusChange={false}
              isInDetails={false}
              hasDeleteBtn={canDelete}
              handleDeleteClick={(row) => {
                setSelectedBackup(row);
                setIsDeleteOpen(true);
              }}
              handleDetailsClick={(row) => {
                setSelectedBackup(row);
                setIsDetailsOpen(true);
              }}
              renderCustomMenuItems={(selectedRow, handleClose) => (
                <MenuItem
                  disabled={selectedRow.status === "failed" || !selectedRow.downloadUrl}
                  onClick={() => {
                    handleDownload(selectedRow.downloadUrl, selectedRow.filename);
                    handleClose();
                  }}
                  sx={{
                    color: theme.palette.primary.main,
                    borderLeft: isArabic ? "" : `4px solid ${theme.palette.primary.main}`,
                    borderRight: isArabic ? `4px solid ${theme.palette.primary.main}` : "",
                    py: 1,
                  }}
                >
                  <CloudDownload fontSize="small" sx={{ [isArabic ? "ml" : "mr"]: 1 }} />
                  {t("backups.download")}
                </MenuItem>
              )}
            />
            <FilterComponent totalPages={totalPages} />
          </>
        )}
      </Box>

      {/* CREATE BACKUP DIALOG */}
      <Dialog
        open={isCreateOpen}
        onClose={() => !creatingBackup && setIsCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          {t("backups.newBackup")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {isArabic
              ? "سيتم إنشاء نسخة احتياطية كاملة من قاعدة بيانات النظام والملفات. يمكنك كتابة ملاحظة اختيارية لتمييز هذه النسخة."
              : "A full backup of the system database and files will be created. You can write an optional note to identify this backup."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t("backups.note")}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t("backups.notePlaceholder")}
            disabled={creatingBackup}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsCreateOpen(false)}
            color="inherit"
            disabled={creatingBackup}
            sx={{ fontWeight: "bold" }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleCreateBackup}
            color="primary"
            variant="contained"
            disabled={creatingBackup}
            sx={{ fontWeight: "bold", minWidth: 120 }}
          >
            {creatingBackup ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t("backups.createBackup")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DETAILS DIALOG */}
      <Dialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        {selectedBackup && (
          <>
            <DialogTitle
              sx={{
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 2,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Storage color="primary" />
                <Typography variant="h5" fontWeight="bold">
                  {t("backups.details")}
                </Typography>
              </Stack>
              <Chip
                size="small"
                icon={selectedBackup.status === "success" ? <CheckCircle /> : <ErrorIcon />}
                label={selectedBackup.status === "success" ? t("backups.success") : t("backups.failed")}
                color={selectedBackup.status === "success" ? "success" : "error"}
                sx={{ fontWeight: "bold" }}
              />
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("backups.filename")}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ wordBreak: "break-all" }}>
                    {selectedBackup.filename}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("backups.fileSize")}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedBackup.status === "failed" ? "-" : formatBytes(selectedBackup.fileSize)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("backups.type")}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedBackup.type === "automatic" ? t("backups.automatic") : t("backups.manual")}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("Created At")}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(selectedBackup.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("backups.performedBy")}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedBackup.performedBy
                      ? `${selectedBackup.performedBy.fullname || selectedBackup.performedBy.username} (${selectedBackup.performedBy.email})`
                      : t("backups.automatic")}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("backups.filePath")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", bgcolor: alpha(theme.palette.text.primary, 0.04), p: 1.5, borderRadius: "6px", wordBreak: "break-all" }}>
                    {selectedBackup.filePath || "-"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("backups.note")}
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: selectedBackup.note ? "normal" : "italic", color: selectedBackup.note ? "text.primary" : "text.secondary" }}>
                    {selectedBackup.note || (isArabic ? "لا توجد ملاحظة" : "No note provided")}
                  </Typography>
                </Grid>

                {selectedBackup.status === "failed" && selectedBackup.errorMessage && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="error" display="block" fontWeight="bold">
                      {t("backups.errorMessage")}
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        borderRadius: "8px",
                        color: "error.main",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        maxHeight: 200,
                        overflowY: "auto",
                      }}
                    >
                      {selectedBackup.errorMessage}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              {selectedBackup.status === "success" && selectedBackup.downloadUrl && (
                <Button
                  startIcon={<CloudDownload />}
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownload(selectedBackup.downloadUrl, selectedBackup.filename)}
                  sx={{ mr: "auto" }}
                >
                  {t("backups.download")}
                </Button>
              )}
              <Button onClick={() => setIsDetailsOpen(false)} color="inherit" variant="outlined" sx={{ fontWeight: "bold" }}>
                {isArabic ? "إغلاق" : "Close"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => !deletingBackup && setIsDeleteOpen(false)}
        PaperProps={{
          sx: { borderRadius: "12px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <Delete color="error" />
          {isArabic ? "حذف النسخة الاحتياطية" : "Delete Backup"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("backups.confirmDelete")}
            {selectedBackup && (
              <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha(theme.palette.text.primary, 0.04), borderRadius: "4px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                {selectedBackup.filename}
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsDeleteOpen(false)}
            color="inherit"
            disabled={deletingBackup}
            sx={{ fontWeight: "bold" }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleDeleteBackup}
            color="error"
            variant="contained"
            disabled={deletingBackup}
            sx={{ fontWeight: "bold", minWidth: 100 }}
          >
            {deletingBackup ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t("delete")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
