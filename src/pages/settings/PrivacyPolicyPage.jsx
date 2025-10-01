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

const PrivacyPolicyPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { setting, loading } = useSelector((state) => state.setting);

  const [privacyAr, setPrivacyAr] = useState("");
  const [privacyEn, setPrivacyEn] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (!setting) {
      dispatch(getAllSetting());
    } else {
      setPrivacyAr(setting.privacy_ar || "");
      setPrivacyEn(setting.privacy_en || "");
    }
  }, [dispatch, setting]);

  const handleSave = () => {
    if (!privacyAr || !privacyEn) return;

    dispatch(
      updateSetting({
        id: setting._id,
        data: {
          privacy_ar: privacyAr,
          privacy_en: privacyEn,
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
        {t("privacyPolicy.title")}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {isEditing ? (
        <>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {t("privacyPolicy.ar")}
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={privacyAr}
            onChange={(e) => setPrivacyAr(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {t("privacyPolicy.en")}
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={privacyEn}
            onChange={(e) => setPrivacyEn(e.target.value)}
            sx={{ mb: 3 }}
          />

<Box sx={{display:"flex", gap:2}}>
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
            {t("privacyPolicy.current")}
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
            {i18n.language === "ar" ? privacyAr : privacyEn}
          </Box>

          <Button variant="contained" onClick={() => setIsEditing(true)}>
            {t("common.edit")}
          </Button>
        </>
      )}
    </Box>
  );
};

export default PrivacyPolicyPage;
