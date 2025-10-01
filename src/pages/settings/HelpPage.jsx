import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAllSetting, updateSetting } from "../../redux/slices/setting/thunk";

const HelpPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { setting, loading } = useSelector((state) => state.setting);

  const [helpAr, setHelpAr] = useState("");
  const [helpEn, setHelpEn] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (!setting) {
      dispatch(getAllSetting());
    } else {
      setHelpAr(setting.help_ar || "");
      setHelpEn(setting.help_en || "");
    }
  }, [dispatch, setting]);

  const handleSave = () => {
    if (!helpAr || !helpEn) return;

    dispatch(
      updateSetting({
        id: setting._id,
        data: {
          help_ar: helpAr,
          help_en: helpEn,
        },
      })
    );
    setIsEditing(false);
  };

  if (loading && !setting) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {t("helpPage.title")}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {isEditing ? (
        <>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {t("helpPage.ar")}
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={helpAr}
            onChange={(e) => setHelpAr(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {t("helpPage.en")}
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={helpEn}
            onChange={(e) => setHelpEn(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {loading ? <CircularProgress size={22} /> : t("common.save")}
            </Button>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              {t("common.cancel")}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {t("helpPage.current")}
          </Typography>

          <Box
            sx={{
              bgcolor: "#f9f9f9",
              p: 2,
              borderRadius: 2,
              mb: 3,
              whiteSpace: "pre-line",
            }}
          >
            {i18n.language === "ar" ? helpAr : helpEn}
          </Box>

          <Button variant="contained" onClick={() => setIsEditing(true)}>
            {t("common.edit")}
          </Button>
        </>
      )}
    </Box>
  );
};

export default HelpPage;
