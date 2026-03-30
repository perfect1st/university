import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";

// Icons
import GavelIcon from '@mui/icons-material/Gavel';
import ShareIcon from '@mui/icons-material/Share';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SaveIcon from '@mui/icons-material/Save';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { AiFillTikTok } from "react-icons/ai";
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description';
import PolicyIcon from '@mui/icons-material/Policy';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

import Header from "../../components/PageHeader/header";
import LoadingPage from "../../components/LoadingComponent";
import notify from "../../components/notify";
import { GET_SITE_CONFIG, UPDATE_SITE_CONFIG } from "../../graphql/siteConfigQueries";

// --- Custom TabPanel Component ---
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`legal-tabpanel-${index}`}
      aria-labelledby={`legal-tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && (
        <Box sx={{ pt: { xs: 2, md: 3 }, height: "100%" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SiteSettings() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    privacy_policy_ar: "",
    privacy_policy_en: "",
    terms_of_service_ar: "",
    terms_of_service_en: "",
    accessibility_ar: "",
    accessibility_en: "",
    social_media: {
      facebook: "",
      tiktok: "",
      twitter: "",
    },
    contact_info: {
      email: "",
      whatsapp_saudi: "",
      whatsapp_yemeni: "",
      phone_yemeni_1: "",
      phone_yemeni_2: "",
    },
  });

  const [tabIndex, setTabIndex] = useState(0);

  const { data, loading: configLoading } = useQuery(GET_SITE_CONFIG, {
    fetchPolicy: "network-only",
  });
  const [updateConfig, { loading: updating }] = useMutation(UPDATE_SITE_CONFIG);

  useEffect(() => {
    if (data?.getSiteConfig) {
      const config = data.getSiteConfig;
      setFormData({
        privacy_policy_ar: config.privacy_policy_ar || "",
        privacy_policy_en: config.privacy_policy_en || "",
        terms_of_service_ar: config.terms_of_service_ar || "",
        terms_of_service_en: config.terms_of_service_en || "",
        accessibility_ar: config.accessibility_ar || "",
        accessibility_en: config.accessibility_en || "",
        social_media: {
          facebook: config.social_media?.facebook || "",
          tiktok: config.social_media?.tiktok || "",
          twitter: config.social_media?.twitter || "",
        },
        contact_info: {
          email: config.contact_info?.email || "",
          whatsapp_saudi: config.contact_info?.whatsapp_saudi || "",
          whatsapp_yemeni: config.contact_info?.whatsapp_yemeni || "",
          phone_yemeni_1: config.contact_info?.phone_yemeni_1 || "",
          phone_yemeni_2: config.contact_info?.phone_yemeni_2 || "",
        },
      });
    }
  }, [data]);

  const handleChange = (field, value, category = null) => {
    if (category) {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const input = {
        privacy_policy_ar: formData.privacy_policy_ar,
        privacy_policy_en: formData.privacy_policy_en,
        terms_of_service_ar: formData.terms_of_service_ar,
        terms_of_service_en: formData.terms_of_service_en,
        accessibility_ar: formData.accessibility_ar,
        accessibility_en: formData.accessibility_en,
        social_media: {
          facebook: formData.social_media.facebook,
          twitter: formData.social_media.twitter,
          tiktok: formData.social_media.tiktok
        },
        contact_info: {
          email: formData.contact_info.email,
          whatsapp_saudi: formData.contact_info.whatsapp_saudi,
          whatsapp_yemeni: formData.contact_info.whatsapp_yemeni,
          phone_yemeni_1: formData.contact_info.phone_yemeni_1,
          phone_yemeni_2: formData.contact_info.phone_yemeni_2,
        },
      };

      await updateConfig({ variables: { input } });
      notify(isArabic ? "تم تحديث الإعدادات بنجاح" : "Settings updated successfully", "success");
    } catch (err) {
      notify(err.message || t("error"), "error");
    }
  };

  if (configLoading) return <LoadingPage />;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1400px', mx: 'auto' }}>
      <Header
        title={isArabic ? "إعدادات الموقع" : "Site Settings"}
        subtitle={isArabic ? "إدارة التكوين والروابط والجوانب القانونية" : "Manage configuration, links, and legal aspects"}
        i18n={i18n}
      />

      <form onSubmit={handleSubmit}>
        <Stack spacing={4} sx={{ mt: 3 }}>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab icon={<PolicyIcon sx={{ mr: isArabic ? 0 : 1, ml: isArabic ? 1 : 0 }} fontSize="small" />} iconPosition="start" label={isArabic ? "سياسة الخصوصية" : "Privacy Policy"} sx={{ fontWeight: 'bold' }} />
              <Tab icon={<DescriptionIcon sx={{ mr: isArabic ? 0 : 1, ml: isArabic ? 1 : 0 }} fontSize="small" />} iconPosition="start" label={isArabic ? "شروط الخدمة" : "Terms of Service"} sx={{ fontWeight: 'bold' }} />
              <Tab icon={<AccessibilityNewIcon sx={{ mr: isArabic ? 0 : 1, ml: isArabic ? 1 : 0 }} fontSize="small" />} iconPosition="start" label={isArabic ? "إمكانية الوصول" : "Accessibility"} sx={{ fontWeight: 'bold' }} />
              <Tab icon={<ShareIcon sx={{ mr: isArabic ? 0 : 1, ml: isArabic ? 1 : 0 }} fontSize="small" />} iconPosition="start" label={isArabic ? "التواصل الاجتماعي" : "Social Media"} sx={{ fontWeight: 'bold' }} />
              <Tab icon={<ContactPhoneIcon sx={{ mr: isArabic ? 0 : 1, ml: isArabic ? 1 : 0 }} fontSize="small" />} iconPosition="start" label={isArabic ? "معلومات الاتصال" : "Contact Info"} sx={{ fontWeight: 'bold' }} />
            </Tabs>
          </Box>

          <Box sx={{ flex: 1 }}>
            {/* TAB 0: Privacy Policy */}
            <TabPanel value={tabIndex} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                    🌐 {isArabic ? "النسخة العربية" : "Arabic Version"}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={isArabic ? 18 : 12} // Slightly more rows for Arabic if needed, but adjusted
                    value={formData.privacy_policy_ar}
                    onChange={(e) => handleChange("privacy_policy_ar", e.target.value)} variant="outlined"
                    placeholder={isArabic ? "اكتب محتوى سياسة الخصوصية هنا..." : "Enter privacy policy here..."}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                    🌐 {isArabic ? "النسخة الإنجليزية" : "English Version"}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={isArabic ? 18 : 12}
                    value={formData.privacy_policy_en}
                    onChange={(e) => handleChange("privacy_policy_en", e.target.value)} variant="outlined"
                    placeholder={isArabic ? "Enter privacy policy here..." : "Enter privacy policy here..."}
                    InputProps={{ sx: { direction: "ltr" } }}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 1: Terms of Service */}
            <TabPanel value={tabIndex} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                    🌐 {isArabic ? "النسخة العربية" : "Arabic Version"}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={18}
                    value={formData.terms_of_service_ar}
                    onChange={(e) => handleChange("terms_of_service_ar", e.target.value)} variant="outlined"
                    placeholder={isArabic ? "اكتب محتوى شروط الخدمة هنا..." : "Enter terms of service here..."}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                    🌐 {isArabic ? "النسخة الإنجليزية" : "English Version"}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={18}
                    value={formData.terms_of_service_en}
                    onChange={(e) => handleChange("terms_of_service_en", e.target.value)} variant="outlined"
                    placeholder={isArabic ? "Enter terms of service here..." : "Enter terms of service here..."}
                    InputProps={{ sx: { direction: "ltr" } }}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 2: Accessibility */}
            <TabPanel value={tabIndex} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                    🌐 {isArabic ? "النسخة العربية" : "Arabic Version"}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={18}
                    value={formData.accessibility_ar}
                    onChange={(e) => handleChange("accessibility_ar", e.target.value)} variant="outlined"
                    placeholder={isArabic ? "اكتب محتوى إمكانية الوصول هنا..." : "Enter accessibility content here..."}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                    🌐 {isArabic ? "النسخة الإنجليزية" : "English Version"}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={18}
                    value={formData.accessibility_en}
                    onChange={(e) => handleChange("accessibility_en", e.target.value)} variant="outlined"
                    placeholder={isArabic ? "Enter accessibility content here..." : "Enter accessibility content here..."}
                    InputProps={{ sx: { direction: "ltr" } }}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabIndex} index={3}>
              <Stack spacing={3} sx={{ maxWidth: { xs: '100%', sm: '600px' }, mx: 'auto' }}>
                <TextField
                  fullWidth label="Facebook"
                  value={formData.social_media.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value, "social_media")} variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <FacebookIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth label="Twitter"
                  value={formData.social_media.twitter}
                  onChange={(e) => handleChange("twitter", e.target.value, "social_media")} variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <TwitterIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth label="TikTok"
                  value={formData.social_media.tiktok}
                  onChange={(e) => handleChange("tiktok", e.target.value, "social_media")} variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <AiFillTikTok size={24} color="gray" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </TabPanel>

            <TabPanel value={tabIndex} index={4}>
              <Stack spacing={3} sx={{ maxWidth: { xs: '100%', sm: '600px' }, mx: 'auto' }}>
                <TextField
                  fullWidth label={isArabic ? "البريد الإلكتروني" : "Email"}
                  value={formData.contact_info.email}
                  onChange={(e) => handleChange("email", e.target.value, "contact_info")} type="email" variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth label={isArabic ? "واتساب (السعودية)" : "WhatsApp (Saudi)"}
                  value={formData.contact_info.whatsapp_saudi}
                  onChange={(e) => handleChange("whatsapp_saudi", e.target.value, "contact_info")} variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <WhatsAppIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth label={isArabic ? "واتساب (اليمن)" : "WhatsApp (Yemen)"}
                  value={formData.contact_info.whatsapp_yemeni}
                  onChange={(e) => handleChange("whatsapp_yemeni", e.target.value, "contact_info")} variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <WhatsAppIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth label={isArabic ? "هاتف (اليمن) 1" : "Phone (Yemen) 1"}
                  value={formData.contact_info.phone_yemeni_1}
                  onChange={(e) => handleChange("phone_yemeni_1", e.target.value, "contact_info")} variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth label={isArabic ? "هاتف (اليمن) 2" : "Phone (Yemen) 2"}
                  value={formData.contact_info.phone_yemeni_2}
                  onChange={(e) => handleChange("phone_yemeni_2", e.target.value, "contact_info")} variant="outlined"
                  InputProps={{
                    sx: { direction: "ltr" }, startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </TabPanel>
          </Box>

          <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={updating}
                startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ px: 5, py: 1.5, borderRadius: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                {updating ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ التغييرات" : "Save Changes")}
              </Button>
            </Stack>
          </Paper>

        </Stack>
      </form>
    </Box>
  );
}
