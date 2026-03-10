import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Badge,
  Divider,
  CircularProgress,
  Tooltip,
  Chip,
  IconButton,
  Fade,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { ReactComponent as NotificationIcon } from "../assets/natification.svg";
import {
  ArrowDropDown,
  ArrowDropUp,
  DoneAll,
  NotificationsNone,
  FiberManualRecord,
} from "@mui/icons-material";

import {
  MY_NOTIFICATIONS,
  MY_UNREAD_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
} from "../graphql/userQueriesForAdmin";

/* ─── helpers ─────────────────────────────────────────────── */

const typeConfig = {
  new_driver:             { color: "#22c55e", bg: "#dcfce7", emoji: "🚗" },
  contact_us:             { color: "#3b82f6", bg: "#dbeafe", emoji: "✉️" },
  withdraw_request:       { color: "#f59e0b", bg: "#fef3c7", emoji: "💸" },
  driver_profile_update:  { color: "#a855f7", bg: "#f3e8ff", emoji: "✏️" },
  default:                { color: "#64748b", bg: "#f1f5f9", emoji: "🔔" },
};

function timeAgo(iso, lang) {
  if (!iso) return "";
  // Support both Unix ms timestamp strings (e.g. "1773146527864") and ISO strings
  const ts = isNaN(Number(iso)) ? new Date(iso).getTime() : Number(iso);
  if (isNaN(ts)) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return lang === "ar" ? `منذ ${diff} ث`   : `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m  < 60) return lang === "ar" ? `منذ ${m} د`        : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h  < 24) return lang === "ar" ? `منذ ${h} س`        : `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return lang === "ar" ? "أمس"               : "Yesterday";
  if (d   < 7) return lang === "ar" ? `منذ ${d} أيام`     : `${d}d ago`;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short", day: "numeric",
  }).format(new Date(ts));
}

/* ─── NotificationItem ────────────────────────────────────── */

function NotificationItem({ notif, lang, onRead, theme }) {
  const isArabic = lang === "ar";
  const isRead   = !!notif.is_read;
  const cfg      = typeConfig[notif.type] || typeConfig.default;
  const title    = isArabic ? notif.title_ar : notif.title_en;
  const body     = isArabic ? notif.body_ar  : notif.body_en;

  return (
    <Box
      onClick={() => onRead(notif)}
      sx={{
        display: "flex",
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: "pointer",
        borderRadius: 2,
        mx: 1,
        mb: 0.5,
        position: "relative",
        transition: "all 0.18s ease",
        bgcolor: isRead ? "transparent" : `${cfg.color}0d`,
        "&:hover": {
          bgcolor: `${cfg.color}18`,
          transform: isArabic ? "translateX(-2px)" : "translateX(2px)",
        },
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      {/* Unread left/right stripe */}
      {!isRead && (
        <Box sx={{
          position: "absolute",
          left: isArabic ? "auto" : 0,
          right: isArabic ? 0 : "auto",
          top: "20%", bottom: "20%",
          width: 3, borderRadius: 4,
          bgcolor: cfg.color,
        }} />
      )}

      {/* Avatar */}
      <Avatar sx={{
        width: 42, height: 42,
        bgcolor: cfg.bg, fontSize: 20, flexShrink: 0,
        border: `2px solid ${cfg.color}30`,
      }}>
        {cfg.emoji}
      </Avatar>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Typography sx={{
            fontWeight: isRead ? 500 : 700,
            fontSize: 13.5, lineHeight: 1.3,
            color: isRead ? theme.palette.text.secondary : theme.palette.text.primary,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.disabled", whiteSpace: "nowrap", flexShrink: 0 }}>
            {timeAgo(notif.createdAt, lang)}
          </Typography>
        </Box>

        <Typography sx={{
          fontSize: 12.5, color: "text.secondary", mt: 0.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden", lineHeight: 1.4,
        }}>
          {body}
        </Typography>

        {!isRead && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 0.5 }}>
            <FiberManualRecord sx={{ fontSize: 7, color: cfg.color }} />
            <Typography sx={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>
              {lang === "ar" ? "جديد" : "New"}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ─── Main NotificationButton ──────────────────────────────── */

const NotificationButton = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const theme = useTheme();
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  /* ── queries ── */
  const { data, loading, refetch } = useQuery(MY_NOTIFICATIONS, {
    fetchPolicy: "network-only",
    pollInterval: 60000,
  });

  const { data: unreadData, refetch: refetchCount } = useQuery(
    MY_UNREAD_NOTIFICATIONS,
    { fetchPolicy: "network-only", pollInterval: 60000 }
  );

  /* ── mutations ── */
  const [markOneRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    // Optimistically update the cache so the item flips to read instantly
    update(cache, { data: { markNotificationAsRead } }) {
      cache.modify({
        id: cache.identify(markNotificationAsRead),
        fields: { is_read: () => true },
      });
      refetchCount();
    },
    onError: (err) => console.error("markOneRead error:", err),
  });

  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ, {
    onCompleted: () => { refetch(); refetchCount(); },
    onError: (err) => console.error("markAllRead error:", err),
  });

  /* ── derived ── */
  const notifications = data?.getMyNotifications || [];
  const unreadCount   = unreadData?.getMyUnreadNotificationsCount || 0;

  /* ── handlers ── */
  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) refetch();
  };

  const handleClose = () => setOpen(false);

  const handleReadNotif = async (notif) => {
    handleClose();
    if (!notif.is_read) {
      markOneRead({ variables: { id: notif.id } });
    }

    switch (notif.type) {
      case "new_driver":
      case "driver_profile_update":
        navigate(`/DriverDetails/${notif.related_id}`);
        break;
      case "contact_us":
        navigate("/ContactUs", { state: { openModal: true, related_id: notif.related_id } });
        break;
      case "withdraw_request":
        navigate(`/walletDetails/${notif.related_id}`);
        break;
      default:
        break;
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllRead();
    } catch (err) {
      console.error("markAllRead error:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  /* ── render ── */
  return (
    <>
      {/* ── Trigger Button ── */}
      <Box
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          px: 1.5,
          py: 0.8,
          borderRadius: 2,
          transition: "background 0.15s",
          color: theme.palette.primary.main,
          "&:hover": { bgcolor: `${theme.palette.primary.main}12` },
        }}
      >
        <Badge
          badgeContent={unreadCount || null}
          color="error"
          sx={{ "& .MuiBadge-badge": { fontSize: 10, minWidth: 18, height: 18, fontWeight: 700 } }}
        >
          <NotificationIcon style={{ width: 24, height: 24 }} />
        </Badge>

        <Typography sx={{ fontWeight: 600, fontSize: 14, display: { xs: "none", sm: "block" } }}>
          {t("notification")}
        </Typography>

        {open ? <ArrowDropUp sx={{ fontSize: 20 }} /> : <ArrowDropDown sx={{ fontSize: 20 }} />}
      </Box>

      {/* ── Dropdown Panel ── */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        style={{ zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={0}
              sx={{
                mt: 1.5,
                width: 380,
                maxHeight: 520,
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === "dark"
                  ? "0 20px 60px rgba(0,0,0,0.5)"
                  : "0 20px 60px rgba(0,0,0,0.12)",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

                  {/* Panel Header */}
                  <Box sx={{
                    px: 2.5, pt: 2, pb: 1.5,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    direction: lang === "ar" ? "rtl" : "ltr",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        {t("notifications")}
                      </Typography>
                      {unreadCount > 0 && (
                        <Chip
                          label={unreadCount}
                          size="small"
                          color="error"
                          sx={{ height: 20, fontSize: 11, fontWeight: 700, "& .MuiChip-label": { px: 1 } }}
                        />
                      )}
                    </Box>

                    {unreadCount > 0 && (
                      <Tooltip title={t("mark_all_as_read")}>
                        <IconButton
                          size="small"
                          onClick={handleMarkAllRead}
                          disabled={markingAll}
                          sx={{
                            color: theme.palette.primary.main,
                            "&:hover": { bgcolor: `${theme.palette.primary.main}15` },
                          }}
                        >
                          {markingAll
                            ? <CircularProgress size={16} />
                            : <DoneAll fontSize="small" />
                          }
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Divider />

                  {/* Notification List */}
                  <Box sx={{
                    flex: 1, overflowY: "auto", py: 1,
                    "&::-webkit-scrollbar": { width: 4 },
                    "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                    "&::-webkit-scrollbar-thumb": { bgcolor: theme.palette.divider, borderRadius: 4 },
                  }}>
                    {loading && notifications.length === 0 ? (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                        <CircularProgress size={32} />
                      </Box>
                    ) : notifications.length === 0 ? (
                      <Box sx={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        height: 200, gap: 1.5, color: "text.disabled",
                      }}>
                        <NotificationsNone sx={{ fontSize: 48, opacity: 0.35 }} />
                        <Typography fontSize={14}>{t("noNotifications")}</Typography>
                      </Box>
                    ) : (
                      notifications.map((notif) => (
                        <NotificationItem
                          key={notif.id}
                          notif={notif}
                          lang={lang}
                          onRead={handleReadNotif}
                          theme={theme}
                        />
                      ))
                    )}
                  </Box>

                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationButton;