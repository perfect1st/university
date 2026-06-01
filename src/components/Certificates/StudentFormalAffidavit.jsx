import React, { useRef } from "react";
import { Box, Typography, Button, Stack, Divider, Paper } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";
import universityLogo from "../../assets/Logo.png";

const StudentFormalAffidavit = ({ ticketType, studentData, registrationData }) => {
  const printRef = useRef(null);

  const studentFullName = registrationData
    ? `${registrationData.first_name || ""} ${registrationData.second_name || ""} ${registrationData.third_name || ""} ${registrationData.fourth_name || ""}`.trim()
    : studentData?.fullname || "................";

  const faculty = registrationData?.faculty_id?.title_ar || "................";
  const department = registrationData?.faculty_department_id?.title_ar || "................";
  const registrationNo = studentData?.serial || registrationData?.registration_no || "................";
  const academicYear = registrationData?.academyTerm_id?.current_year || "................";

  // Configuration for different affidavit types
  const config = {
    registration_suspension: {
      title: "إفادة إيقاف قيد",
      body: `تفيد جامعة العلوم الأكاديمية بأن الطالب / ${studentFullName}، المقيد بكلية ${faculty}، قسم ${department}، برقم قيد (${registrationNo})، قد تقدم بطلب إيقاف قيده للعام الدراسي ${academicYear}، وقد تمت الموافقة على طلبه بناءً على الإجراءات المتبعة في الجامعة.`,
    },
    university_certificate: {
      title: "إفادة طالب",
      body: `تفيد جامعة العلوم الأكاديمية بأن الطالب / ${studentFullName}، المقيد بكلية ${faculty}، قسم ${department}، برقم قيد (${registrationNo})، هو أحد طلاب الجامعة المنتظمين للعام الدراسي ${academicYear}.`,
    },
    success_statement: {
      title: "بيان نجاح",
      body: `تفيد جامعة العلوم الأكاديمية بأن الطالب / ${studentFullName}، المقيد بكلية ${faculty}، قسم ${department}، برقم قيد (${registrationNo})، قد اجتاز بنجاح المتطلبات الأكاديمية للعام الدراسي ${academicYear}.`,
    },
    graduation_enrollment: {
      title: "إفادة قيد تخرج",
      body: `تفيد جامعة العلوم الأكاديمية بأن الطالب / ${studentFullName}، المقيد بكلية ${faculty}، قسم ${department}، برقم قيد (${registrationNo})، هو في مرحلة التخرج من الجامعة للعام الدراسي ${academicYear}.`,
    },
  };

  const currentConfig = config[ticketType] || config.university_certificate;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${currentConfig.title} - ${studentFullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 15mm; }
            body { 
              direction: rtl;
              font-family: 'Cairo', sans-serif;
              margin: 0;
              padding: 0;
              color: #1a202c;
            }
            .certificate-container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 50px;
              border: 15px double #1a4a72;
              min-height: 297mm;
              display: flex;
              flex-direction: column;
              background: #fff;
              position: relative;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .logo {
              width: 180px;
              margin-bottom: 10px;
            }
            .univ-name {
              font-size: 26px;
              font-weight: 700;
              color: #1a4a72;
              margin: 0;
            }
            .subtitle {
              font-size: 18px;
              color: #4a5568;
              margin-top: 5px;
            }
            .divider {
              height: 2px;
              background: linear-gradient(90deg, transparent, #1a4a72, transparent);
              margin: 30px 0;
            }
            .title-box {
              text-align: center;
              margin: 40px 0;
            }
            .title-box h1 {
              font-size: 36px;
              font-weight: 700;
              color: #1a4a72;
              display: inline-block;
              padding: 10px 40px;
              border-bottom: 4px solid #1a4a72;
            }
            .content {
              font-size: 22px;
              line-height: 2.2;
              text-align: justify;
              margin: 20px 0 60px 0;
              flex-grow: 1;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: auto;
            }
            .signature-block {
              text-align: center;
              width: 200px;
            }
            .signature-line {
              margin-top: 60px;
              border-top: 2px solid #1a4a72;
            }
            .qr-code {
              width: 100px;
              height: 100px;
              border: 1px solid #e2e8f0;
              padding: 5px;
            }
            @media print {
              .certificate-container { border: 15px double #1a4a72; }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="certificate-container">
            <div class="header">
              <img src="${universityLogo}" alt="University Logo" class="logo" />
              <div class="univ-name">جامعة العلوم الأكاديمية</div>
              <div class="subtitle">عمادة القبول والتسجيل</div>
            </div>

            <div class="divider"></div>

            <div class="title-box">
              <h1>${currentConfig.title}</h1>
            </div>

            <div class="content">
              ${currentConfig.body}
              <br/><br/>
              أعطيت له هذه الإفادة بناءً على طلبه دون أدنى مسؤولية على الجامعة.
            </div>

            <div class="footer">
              <div class="signature-block">
                <div style="font-weight: 600;">تاريخ الإصدار</div>
                <div style="margin-top: 10px;">${new Date().toLocaleDateString('ar-SA')}</div>
              </div>
              
              <div class="signature-block">
                <div style="font-weight: 600;">ختم الجامعة</div>
                <div style="margin-top: 20px; color: #e2e8f0; font-size: 12px;">(مساحة الختم)</div>
              </div>

              <div class="signature-block">
                <div style="font-weight: 600;">توقيع المسجل العام</div>
                <div class="signature-line"></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: 0,
      filename: `${currentConfig.title}_${studentFullName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 3 }}>
      {/* Premium Preview Component */}
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: "800px",
          bgcolor: "#fff",
          p: { xs: 2, md: 6 },
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
          direction: "rtl"
        }}
      >
        <div ref={printRef}>
          {/* Aesthetic Watermark */}
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            opacity: 0.04, 
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            <img src={universityLogo} alt="" style={{ width: '500px' }} />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Header Section */}
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <img src={universityLogo} alt="University Logo" style={{ width: '150px', marginBottom: '12px' }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a4a72', letterSpacing: 1 }}>
                  جامعة العلوم الأكاديمية
                </Typography>
                <Typography variant="h6" sx={{ color: '#4a5568', mt: 1 }}>
                  عمادة القبول والتسجيل
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 6, borderColor: '#1a4a72', borderWidth: '1px', opacity: 0.3 }} />

            {/* Document Title */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  color: '#1a4a72',
                  display: 'inline-block',
                  px: 4,
                  pb: 1,
                  borderBottom: '5px solid #1a4a72',
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                {currentConfig.title}
              </Typography>
            </Box>

            {/* Body Content */}
            <Box sx={{ px: { xs: 1, md: 4 }, minHeight: '300px' }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.5rem', 
                  lineHeight: 2.3, 
                  textAlign: 'justify',
                  color: '#2d3748',
                  fontWeight: 500
                }}
              >
                {currentConfig.body}
              </Typography>
              
              <Typography variant="body1" sx={{ fontSize: '1.5rem', mt: 6, color: '#2d3748' }}>
                أعطيت له هذه الإفادة بناءً على طلبه دون أدنى مسؤولية على الجامعة.
              </Typography>
            </Box>

            {/* Signature Area */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 12, px: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a4a72' }}>تاريخ الإصدار</Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>{new Date().toLocaleDateString('ar-SA')}</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a4a72' }}>ختم الجامعة</Typography>
                <Box sx={{ mt: 2, width: '100px', height: '100px', borderRadius: '50%', border: '2px dashed #cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                  <Typography variant="caption">مساحة الختم</Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a4a72' }}>توقيع المسجل العام</Typography>
                <Box sx={{ mt: 8, width: '180px', borderTop: '2px solid #1a4a72' }} />
              </Box>
            </Stack>
          </Box>
        </div>
      </Paper>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ 
            borderRadius: "12px", 
            px: 5, 
            py: 1.5,
            bgcolor: "#1a4a72", 
            "&:hover": { bgcolor: "#133756" },
            fontSize: '1.1rem',
            boxShadow: '0 4px 14px 0 rgba(26, 74, 114, 0.39)'
          }}
        >
          طباعة الوثيقة
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ 
            borderRadius: "12px", 
            px: 5, 
            py: 1.5,
            color: "#1a4a72", 
            borderColor: "#1a4a72",
            borderWidth: '2px',
            fontSize: '1.1rem',
            "&:hover": { borderWidth: '2px', bgcolor: 'rgba(26, 74, 114, 0.04)' }
          }}
        >
          تحميل PDF
        </Button>
      </Stack>
    </Box>
  );
};

export default StudentFormalAffidavit;
