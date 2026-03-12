import React, { useState } from "react";
import { 
  Box, Typography, Container, Grid, Card, CardContent, 
  CircularProgress, Stack, Button, TextField, useTheme, 
  InputAdornment, MenuItem, Alert, Snackbar
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import i18n from "../../i18n/i18n";
import { GET_SITE_CONFIG } from "../../graphql/siteConfigQueries";

// Icons
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

export default function UniversityContact() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data, loading } = useQuery(GET_SITE_CONFIG, {
    fetchPolicy: "cache-first",
  });

  // 1. تعريف مخطط التحقق (Yup Schema)
  const contactSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, isArabic ? "الاسم قصير جداً" : "Name is too short")
      .required(isArabic ? "الاسم الكامل مطلوب" : "Full name is required"),
    email: Yup.string()
      .email(isArabic ? "بريد إلكتروني غير صالح" : "Invalid email address")
      .required(isArabic ? "البريد الإلكتروني مطلوب" : "Email is required"),
    department: Yup.string().required(),
    message: Yup.string()
      .min(10, isArabic ? "الرسالة يجب أن تكون 10 أحرف على الأقل" : "Message must be at least 10 characters")
      .required(isArabic ? "محتوى الرسالة مطلوب" : "Message is required"),
  });

  // 2. إعداد Formik
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      department: "general",
      message: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      // هنا يتم استدعاء Mutation أو API لإرسال البيانات
      console.log("Form Data:", values);
      setTimeout(() => {
        setShowSuccess(true);
        setSubmitting(false);
        resetForm();
      }, 2000);
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const contact = data?.getSiteConfig?.contact_info || {};

  return (
    <Box sx={{ bgcolor: "background.default", pb: 10 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: '#003366', 
          color: 'white',
          py: { xs: 10, md: 15 },
          px: 3,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'ellipse(150% 100% at 50% 0%)',
          mb: 8,
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <SchoolIcon sx={{ fontSize: 50, mb: 2, opacity: 0.8 }} />
          <Typography variant="h2" component="h1" fontWeight="900" gutterBottom>
            {isArabic ? "اتصل بجامعتك" : "Contact Your University"}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 650, mx: "auto", fontWeight: 300 }}>
            {isArabic 
              ? "نحن هنا لخدمتكم وتوجيهكم في مسيرتكم الأكاديمية." 
              : "We are here to serve and guide you in your academic journey."}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={5}>
          
          {/* Sidebar - Contacts */}
          <Grid item xs={12} lg={5}>
            <Stack spacing={3}>
              <Card elevation={0} sx={{ borderRadius: 4, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <WhatsAppIcon sx={{ color: '#25D366', fontSize: 35 }} />
                    <Typography variant="h6" fontWeight="bold">{isArabic ? "الدعم عبر واتساب" : "WhatsApp Support"}</Typography>
                  </Stack>
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">{isArabic ? "فرع السعودية" : "KSA Branch"}</Typography>
                        <Typography variant="body1" fontWeight="700">🇸🇦 {contact.whatsapp_saudi}</Typography>
                      </Box>
                      <Button variant="contained" size="small" sx={{ bgcolor: '#25D366' }} href={`https://wa.me/${contact.whatsapp_saudi?.replace(/\D/g,'')}`} target="_blank">{isArabic ? "مراسلة" : "Chat"}</Button>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">{isArabic ? "فرع اليمن" : "Yemen Branch"}</Typography>
                        <Typography variant="body1" fontWeight="700">🇾🇪 {contact.whatsapp_yemeni}</Typography>
                      </Box>
                      <Button variant="contained" size="small" sx={{ bgcolor: '#25D366' }} href={`https://wa.me/${contact.whatsapp_yemeni?.replace(/\D/g,'')}`} target="_blank">{isArabic ? "مراسلة" : "Chat"}</Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <PhoneIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="bold">{isArabic ? "الإتصال المباشر (اليمن)" : "Direct Call (Yemen)"}</Typography>
                  </Stack>
                  <Typography variant="h6" component="a" href={`tel:${contact.phone_yemeni_1}`} sx={{ display: 'block', textDecoration: 'none', color: 'primary.main', fontWeight: '800', mb: 1 }}>{contact.phone_yemeni_1}</Typography>
                  <Typography variant="h6" component="a" href={`tel:${contact.phone_yemeni_2}`} sx={{ display: 'block', textDecoration: 'none', color: 'primary.main', fontWeight: '800' }}>{contact.phone_yemeni_2}</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Form with Formik Validation */}
          <Grid item xs={12} lg={7}>
             <Card elevation={0} sx={{ borderRadius: 5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
               <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                 <Typography variant="h4" fontWeight="800" gutterBottom>{isArabic ? "أرسل طلبك الآن" : "Submit Your Request"}</Typography>
                 
                 <form onSubmit={formik.handleSubmit}>
                   <Grid container spacing={3}>
                     <Grid item xs={12} md={6}>
                       <TextField 
                         fullWidth
                         id="fullName"
                         name="fullName"
                         label={isArabic ? "الاسم الكامل" : "Full Name"} 
                         variant="filled"
                         value={formik.values.fullName}
                         onChange={formik.handleChange}
                         onBlur={formik.handleBlur}
                         error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                         helperText={formik.touched.fullName && formik.errors.fullName}
                         InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                       />
                     </Grid>
                     <Grid item xs={12} md={6}>
                       <TextField 
                         fullWidth
                         id="email"
                         name="email"
                         label={isArabic ? "البريد الإلكتروني" : "Email"} 
                         variant="filled"
                         value={formik.values.email}
                         onChange={formik.handleChange}
                         onBlur={formik.handleBlur}
                         error={formik.touched.email && Boolean(formik.errors.email)}
                         helperText={formik.touched.email && formik.errors.email}
                         InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
                       />
                     </Grid>
                     <Grid item xs={12}>
                       <TextField
                         select fullWidth id="department" name="department"
                         label={isArabic ? "القسم الموجه إليه" : "Department"}
                         variant="filled" 
                         value={formik.values.department}
                         onChange={formik.handleChange}
                       >
                         <MenuItem value="general">{isArabic ? "استفسارات عامة" : "General"}</MenuItem>
                         <MenuItem value="admission">{isArabic ? "شؤون الطلاب" : "Student Affairs"}</MenuItem>
                         <MenuItem value="tech">{isArabic ? "الدعم الفني" : "Technical Support"}</MenuItem>
                       </TextField>
                     </Grid>
                     <Grid item xs={12}>
                       <TextField 
                         fullWidth multiline rows={4} 
                         id="message" name="message"
                         label={isArabic ? "رسالتك" : "Your Message"} 
                         variant="filled"
                         value={formik.values.message}
                         onChange={formik.handleChange}
                         onBlur={formik.handleBlur}
                         error={formik.touched.message && Boolean(formik.errors.message)}
                         helperText={formik.touched.message && formik.errors.message}
                       />
                     </Grid>
                     <Grid item xs={12}>
                        <Button
                          fullWidth size="large" variant="contained" type="submit"
                          disabled={formik.isSubmitting}
                          sx={{ py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem', bgcolor: '#003366' }}
                        >
                          {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : (isArabic ? "إرسال الرسالة" : "Send Message")}
                        </Button>
                     </Grid>
                   </Grid>
                 </form>
               </CardContent>
             </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Success Snackbar */}
      <Snackbar open={showSuccess} autoHideDuration={5000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {isArabic ? "تم إرسال رسالتك بنجاح! سنرد عليك قريباً." : "Message sent successfully! We will reply soon."}
        </Alert>
      </Snackbar>
    </Box>
  );
}