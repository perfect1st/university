import React, { useMemo, useState, useEffect } from "react";
import {
  Box, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Typography, IconButton,
  Stack, Divider, Chip, MenuItem, Paper, TablePagination,
  useTheme, alpha, Fade, Zoom, Tooltip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import i18n from "../../i18n/i18n";
import TableComponent from "../../components/TableComponent/TableComponent";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import Header from "../../components/PageHeader/header";
import {
  GET_CONTACT_US_MESSAGES,
  MARK_CONTACT_US_AS_READ,
  REPLY_CONTACT_US
} from "../../graphql/contactQueries";
import CustomTextFieldAdmin, { CustomSelect } from "../../components/Utilities/CustomTextField";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import LoadingComponent from "../../components/LoadingComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';
import notify from "../../components/notify";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function AllContactMessagesPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";

  const [searchParams, setSearchParams] = useSearchParams();

  // Extract from URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";
  const statusFromUrl = searchParams.get("status") || "all";

  // Input states (only for UI before submit)
  const [searchTerms, setSearchTerms] = useState(searchFromUrl);
  const [statusFilter, setStatusFilter] = useState(statusFromUrl);

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const { data, loading: pageLoading, refetch } = useQuery(GET_CONTACT_US_MESSAGES, {
    variables: {
      search: searchFromUrl || null,
      status: statusFromUrl === "all" ? null : statusFromUrl,
      page: page,
      limit: limit
    },
    fetchPolicy: "network-only",
  });

  // Sync state if URL changes directly
  useEffect(() => {
    setSearchTerms(searchFromUrl);
    setStatusFilter(statusFromUrl);
  }, [searchFromUrl, statusFromUrl]);

  const [markContactUsAsRead] = useMutation(MARK_CONTACT_US_AS_READ);
  const [replyContactUs, { loading: replyLoading }] = useMutation(REPLY_CONTACT_US, {
    onCompleted: () => {
      notify(isArabic ? "تم حفظ الإجراء بنجاح" : "Action saved successfully", "success");
      setOpenDialog(false);
      refetch();
    },
    onError: (err) => {
      notify(err.message, "error");
    }
  });

  const handleOpenDetails = async (message) => {
    setSelectedMessage(message);
    setReplyText(message.admin_reply || "");
    setOpenDialog(true);

    // Mark as read if it's new
    if (message.status === "new" || message.status === "unread") {
      try {
        await markContactUsAsRead({ variables: { id: message.id } });
        // We don't necessarily need to refetch immediately here if we don't want to break UX
        // but we should update the local state or refetch after dialog close
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    refetch(); // Refetch to update status in the list
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      notify(isArabic ? "يرجى كتابة الرد أولاً" : "Please enter a reply first", "error");
      return;
    }
    replyContactUs({
      variables: {
        id: selectedMessage.id,
        admin_reply: replyText
      }
    });
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (searchTerms) {
      newParams.set("search", searchTerms);
    } else {
      newParams.delete("search");
    }
    
    if (statusFilter !== "all" && statusFilter !== "") {
      newParams.set("status", statusFilter);
    } else {
      newParams.delete("status");
    }
    
    newParams.set("page", 1);
    setSearchParams(newParams);
  };

  const handleResetFilter = () => {
    setSearchTerms("");
    setStatusFilter("all");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.delete("status");
    newParams.set("page", 1);
    setSearchParams(newParams);
  };

  const messagesData = data?.getContactUsMessages?.contactUsMessages || [];
  const totalCount = data?.getContactUsMessages?.total || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const columns = [
    { key: "serial", label: t("Serial") },
    { key: "name", label: isArabic ? "الاسم" : "Name" },
    { key: "email", label: isArabic ? "البريد الإلكتروني" : "Email" },
    { key: "subject", label: isArabic ? "الموضوع" : "Subject" },
    { key: "statusDisplay", label: isArabic ? "الحالة" : "Status" },
    { key: "createDate", label: isArabic ? "التاريخ" : "Date" },
    { key: "actions", label: isArabic ? "الإجراءات" : "Actions" },
  ];

  const contactMessagesToShow = useMemo(() => {
    return messagesData.map((el) => {
      const date = new Date(Number(el.createdAt));
      const status = el.status;
      const isNew = status === "new" || status === "unread";
      const isReplied = status === "replied";

      let statusLabel = "";
      let statusIcon = null;
      let statusStyles = {};

      if (isNew) {
        statusLabel = isArabic ? "جديد" : "New";
        statusIcon = <MailOutlineIcon />;
        statusStyles = {
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.8)})`,
          color: '#fff',
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}` },
            '70%': { boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}` },
            '100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}` }
          }
        };
      } else if (isReplied) {
        statusLabel = isArabic ? "تم الرد" : "Replied";
        statusIcon = <DoneAllIcon />;
        statusStyles = {
          background: `linear-gradient(45deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.light, 0.8)})`,
          color: '#fff',
          boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
          animation: 'none'
        };
      } else {
        statusLabel = isArabic ? "تمت القراءة" : "Read";
        statusIcon = <CheckCircleOutlineIcon />;
        statusStyles = {
          background: `linear-gradient(45deg, ${alpha(theme.palette.grey[400], 0.2)}, ${alpha(theme.palette.grey[500], 0.1)})`,
          color: theme.palette.text.secondary,
          boxShadow: 'none',
          animation: 'none'
        };
      }

      return {
        ...el,
        createDate: formatDateToString(date),
        statusDisplay: (
          <Chip
            label={statusLabel}
            icon={statusIcon}
            sx={{
              fontWeight: 'bold',
              borderRadius: '8px',
              ...statusStyles
            }}
          />
        ),
        actions: (
          <Tooltip title={isArabic ? "عرض التفاصيل" : "View Details"}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDetails(el)}
              sx={{
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.2)',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        )
      };
    });
  }, [messagesData, isArabic, theme]);

  if (pageLoading && !data) return <LoadingComponent />;

  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      minHeight: "100vh",
      background: theme.palette.mode === 'light'
        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, #ffffff 100%)`
        : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${theme.palette.background.default} 100%)`
    }}>
      <Fade in={true} timeout={800}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Header
              title={isArabic ? "إدارة رسائل التواصل" : "Contact Messages Management"}
              subtitle={isArabic ? "متابعة استفسارات المستخدمين والرد عليها" : "Monitor and respond to user inquiries"}
              i18n={i18n}
              haveBtn={false}
            />

            {/* Filter Section with Glassmorphism Effect */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                mt: 2,
                borderRadius: 4,
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <CustomTextFieldAdmin
                    placeholder={isArabic ? "بحث بالاسم، البريد، أو الرسالة..." : "Search by name, email, or message..."}
                    value={searchTerms}
                    setValue={setSearchTerms}
                    height="48px"
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <CustomSelect
                    value={statusFilter}
                    setValue={setStatusFilter}
                    height="48px"
                    label={isArabic ? "تصفية حسب الحالة" : "Filter by Status"}
                  >
                    <MenuItem value="all">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FilterListIcon fontSize="small" />
                        <Typography>{isArabic ? "جميع الحالات" : "All Status"}</Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="new">
                      <Typography color="primary.main" fontWeight="bold">
                        {isArabic ? "الرسائل الجديدة" : "New Messages"}
                      </Typography>
                    </MenuItem>
                    <MenuItem value="read">
                      <Typography color="text.secondary">
                        {isArabic ? "الرسائل المقروءة" : "Read Messages"}
                      </Typography>
                    </MenuItem>
                    <MenuItem value="replied">
                      <Typography color="success.main" fontWeight="bold">
                        {isArabic ? "الرسائل المجاب عليها" : "Replied Messages"}
                      </Typography>
                    </MenuItem>
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSearch}
                    sx={{
                      height: "48px",
                      borderRadius: "12px",
                      fontWeight: 'bold',
                      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`
                    }}
                  >
                    {isArabic ? "تطبيق البحث" : "Search"}
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    onClick={handleResetFilter}
                    sx={{
                      height: "48px",
                      borderRadius: "12px",
                      borderColor: alpha(theme.palette.divider, 0.2)
                    }}
                  >
                    {isArabic ? "إعادة تعيين" : "Reset"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Table Section */}
            <Box sx={{ position: 'relative' }}>
              {pageLoading && (
                <Box sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  borderRadius: 4
                }}>
                  <LoadingComponent />
                </Box>
              )}
              <TableComponent
                columns={columns}
                data={contactMessagesToShow}
                dontShowActions={true}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
                  '& .MuiTableCell-head': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    fontWeight: '800'
                  }
                }}
              />
              <FilterComponent totalPages={totalPages} />
            </Box>
          </Grid>
        </Grid>
      </Fade>

      {/* Details & Reply Dialog with Enhanced Layout */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: { borderRadius: 5, p: 1 }
        }}
      >
        <DialogTitle sx={{
          fontWeight: '900',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <MailOutlineIcon color="primary" fontSize="large" />
          {isArabic ? "تفاصيل طلب التواصل" : "Contact Inquiry Details"}
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="primary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                    {isArabic ? "معلومات التواصل" : "Contact Information"}
                  </Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{isArabic ? "الاسم" : "Name"}</Typography>
                      <Typography variant="body1" fontWeight="700">{selectedMessage.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{isArabic ? "البريد الإلكتروني" : "Email"}</Typography>
                      <Typography variant="body1" fontWeight="500" color="primary">{selectedMessage.email}</Typography>
                    </Box>
                    {selectedMessage.phone && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">{isArabic ? "رقم الهاتف" : "Phone"}</Typography>
                        <Typography variant="body1">{selectedMessage.phone}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="primary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                    {isArabic ? "معلومات الرسالة" : "Message Details"}
                  </Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{isArabic ? "الموضوع" : "Subject"}</Typography>
                      <Typography variant="body1" fontWeight="700">{selectedMessage.subject}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{isArabic ? "بتاريخ" : "Date"}</Typography>
                      <Typography variant="body1">{formatDateToString(new Date(Number(selectedMessage.createdAt)))}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main }} />
                    {isArabic ? "محتوى الرسالة:" : "Message Content:"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    whiteSpace: 'pre-wrap',
                    bgcolor: alpha(theme.palette.grey[200], 0.3),
                    p: 3,
                    borderRadius: 4,
                    border: `1px dashed ${theme.palette.divider}`,
                    fontSize: '1.05rem',
                    lineHeight: 1.7
                  }}>
                    {selectedMessage.message}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="secondary">
                    {isArabic ? "إضافة رد أو ملاحظات داخلية:" : "Add Reply or Internal Notes:"}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="filled"
                    placeholder={isArabic ? "اكتب ردك أو ملاحظاتك هنا ليتم حفظها بالمحرر..." : "Write your response or notes here..."}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    sx={{
                      mt: 1,
                      '& .MuiFilledInput-root': {
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        '&:before, &:after': { display: 'none' }
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 3, px: 3 }}
          >
            {isArabic ? "إغلاق" : "Close"}
          </Button>
          <Button
            onClick={handleSendReply}
            variant="contained"
            color="primary"
            disabled={replyLoading}
            startIcon={!replyLoading && <CheckCircleOutlineIcon />}
            sx={{
              borderRadius: 3,
              px: 4,
              fontWeight: 'bold',
              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            {replyLoading ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ الإجراء" : "Save Action")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
