import React, { useMemo, useState } from "react";
import { 
    Box, Grid, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Button, Typography, IconButton, 
    Stack, Divider, Chip,
    MenuItem
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import TableComponent from "../../components/TableComponent/TableComponent";
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

export default function AllContactMessagesPage() {
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [searchTerms, setSearchTerms] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [appliedFilters, setAppliedFilters] = useState({ search: "", status: "all" });

    const { data, loading: pageLoading, refetch } = useQuery(GET_CONTACT_US_MESSAGES, {
        fetchPolicy: "network-only",
    });

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
                // refetch();
            } catch (err) {
                console.error("Error marking as read:", err);
            }
        }
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

    const handleApplyFilter = () => {
        setAppliedFilters({ search: searchTerms, status: statusFilter });
    };

    const handleResetFilter = () => {
        setSearchTerms("");
        setStatusFilter("all");
        setAppliedFilters({ search: "", status: "all" });
    };

    const contactMessages = data?.getContactUsMessages || [];

    const columns = [
        { key: "serial", label: t("Serial") },
        { key: "name", label: isArabic ? "الاسم" : "Name" },
        { key: "email", label: isArabic ? "البريد الإلكتروني" : "Email" },
        { key: "phone", label: isArabic ? "الهاتف" : "Phone" },
        { key: "subject", label: isArabic ? "الموضوع" : "Subject" },
        { key: "statusDisplay", label: isArabic ? "الحالة" : "Status" },
        { key: "createDate", label: isArabic ? "التاريخ" : "Date" },
        { key: "actions", label: isArabic ? "الإجراءات" : "Actions" },
    ];

    const contactMessagesToShow = useMemo(() => {
        let filtered = contactMessages;

        if (appliedFilters.search) {
            const query = appliedFilters.search.toLowerCase();
            filtered = filtered.filter(el => 
                el.name?.toLowerCase().includes(query) ||
                el.email?.toLowerCase().includes(query) ||
                el.subject?.toLowerCase().includes(query) ||
                el.message?.toLowerCase().includes(query)
            );
        }

        if (appliedFilters.status !== "all") {
            filtered = filtered.filter(el => 
                appliedFilters.status === "new" ? (el.status === "new" || el.status === "unread") : (el.status !== "new" && el.status !== "unread")
            );
        }

        return filtered.map((el, i) => {
            const date = new Date(Number(el.createdAt));
            return {
                ...el,
                createDate: formatDateToString(date),
                statusDisplay: (
                    <Chip 
                        label={isArabic ? (el.status === "new" ? "جديد" : "تمت القراءة") : (el.status === "new" ? "New" : "Read")}
                        color={el.status === "new" ? "primary" : "default"}
                        size="small"
                        variant={el.status === "new" ? "filled" : "outlined"}
                    />
                ),
                actions: (
                    <IconButton size="small" color="primary" onClick={() => handleOpenDetails(el)}>
                        <VisibilityIcon />
                    </IconButton>
                )
            };
        });
    }, [contactMessages, isArabic, appliedFilters]);

    if (pageLoading) return <LoadingComponent />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Header
                        title={isArabic ? "رسائل اتصل بنا" : "Contact Us Messages"}
                        subtitle={isArabic ? "عرض جميع رسائل التواصل" : "View all contact messages"}
                        i18n={i18n}
                        haveBtn={false}
                    />

                    <Grid container spacing={2} sx={{ mb: 3, mt: 1, alignItems: "center" }}>
                        <Grid item xs={12} md={5}>
                            <CustomTextFieldAdmin
                                placeholder={isArabic ? "بحث بالاسم، البريد، أو الرسالة..." : "Search by name, email, or message..."}
                                value={searchTerms}
                                setValue={setSearchTerms}
                                height="45px"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <CustomSelect
                                value={statusFilter}
                                setValue={setStatusFilter}
                                height="45px"
                            >
                                <MenuItem value="all">{isArabic ? "الكل" : "All Status"}</MenuItem>
                                <MenuItem value="new">{isArabic ? "جديد" : "New"}</MenuItem>
                                <MenuItem value="read">{isArabic ? "تمت القراءة" : "Read"}</MenuItem>
                            </CustomSelect>
                        </Grid>
                        <Grid item xs={12} md={2}>
                             <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                onClick={handleApplyFilter}
                                sx={{ height: "45px", borderRadius: "8px" }}
                             >
                                {isArabic ? "بحث" : "search"}
                             </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                             <Button 
                                variant="outlined" 
                                color="error" 
                                fullWidth 
                                onClick={handleResetFilter}
                                sx={{ height: "45px", borderRadius: "8px" }}
                             >
                                {isArabic ? "إلغاء" : "Cancel"}
                             </Button>
                        </Grid>
                    </Grid>

                    <TableComponent
                        columns={columns}
                        data={contactMessagesToShow}
                        loading={pageLoading}
                        dontShowActions={true}
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

            {/* Details & Reply Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {isArabic ? "تفاصيل الرسالة" : "Message Details"}
                </DialogTitle>
                <DialogContent dividers>
                    {selectedMessage && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">{isArabic ? "من" : "From"}</Typography>
                                <Typography variant="body1" fontWeight="bold">{selectedMessage.name} ({selectedMessage.email})</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">{isArabic ? "الموضوع" : "Subject"}</Typography>
                                <Typography variant="body1">{selectedMessage.subject}</Typography>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="caption" color="text.secondary">{isArabic ? "الرسالة" : "Message"}</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                    {selectedMessage.message}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="caption" color="text.secondary">{isArabic ? "ملاحظات" : "Notes"}</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder={isArabic ? "اكتب ملاحظاتك هنا..." : "Write your notes here..."}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">
                        {isArabic ? "إغلاق" : "Close"}
                    </Button>
                    <Button 
                        onClick={handleSendReply} 
                        variant="contained" 
                        color="primary" 
                        disabled={replyLoading}
                    >
                        {replyLoading ? (isArabic ? "جاري الإرسال..." : "Sending...") : (isArabic ? "حفظ الإجراء" : "Save Action")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
