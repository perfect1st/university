import React, { useRef } from "react";
import { Box, Typography, Button, Stack, useTheme, Divider } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";

const StudentAffidavit = ({ studentData, registrationData }) => {
  const printRef = useRef(null);
  const theme = useTheme();
  console.log("studentData", studentData);
  console.log("registrationData", registrationData);
  const studentFullName = registrationData
    ? `${registrationData.first_name || ""} ${registrationData.second_name || ""} ${registrationData.third_name || ""} ${registrationData.fourth_name || ""}`.trim()
    : studentData?.fullname || "................";

  const faculty = registrationData?.faculty_id?.title_ar || "................";
  const department = registrationData?.faculty_department_id?.title_ar || "................";
  const registrationNo = registrationData?.user_id?.qid_number || "ــ"
  const academicYear = registrationData?.academyTerm_id?.current_year || "................";

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>إفادة طالب - ${studentFullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              direction: rtl;
              font-family: 'Cairo', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              border: 1px solid #eee;
              min-height: 297mm; /* A4 height */
              display: flex;
              flex-direction: column;
              position: relative;
            }
            .header {
              text-align: center;
              margin-bottom: 50px;
            }
            .logo {
              width: 120px;
              margin-bottom: 15px;
            }
            .univ-name {
              font-size: 24px;
              font-weight: bold;
              color: #1a4a72;
              margin: 0;
            }
            .dept-name {
              font-size: 18px;
              color: #555;
              margin-top: 5px;
            }
            .title {
              text-align: center;
              margin: 60px 0;
            }
            .title h1 {
              display: inline-block;
              border-bottom: 3px solid #1a4a72;
              padding-bottom: 10px;
              font-size: 32px;
              font-weight: bold;
            }
            .content {
              font-size: 20px;
              line-height: 2;
              text-align: justify;
              margin-bottom: 80px;
              flex-grow: 1;
            }
            .field-value {
              font-weight: bold;
              border-bottom: 1px dotted #333;
              padding: 0 10px;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              margin-top: auto;
              padding-top: 40px;
            }
            .signature-block {
              text-align: center;
            }
            .signature-line {
              margin-top: 50px;
              width: 200px;
              border-top: 1px solid #333;
            }
            .disclaimer {
              font-size: 14px;
              color: #777;
              margin-top: 40px;
              text-align: center;
              font-style: italic;
            }
            @media print {
               .container { border: none; padding: 0; }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="container">
            <div class="header">
              <img src="https://uas.edu.ye/Logo.png" alt="University Logo" class="logo" />
              <div class="univ-name">جامعة العلوم الأكاديمية</div>
              <div class="dept-name">القسم الافتراضي</div>
            </div>

            <div class="title">
              <h1>إفادة طالب</h1>
            </div>

            <div class="content">
              تفيد جامعة العلوم الأكاديمية (القسم الافتراضي) بأن الطالب / 
              <span class="field-value">${studentFullName}</span> 
              مقيد بكلية <span class="field-value">${faculty}</span> 
              قسم <span class="field-value">${department}</span> 
              برقم قيد <span class="field-value">${registrationNo}</span> 
              لعام <span class="field-value">${academicYear}</span>.
              <br/><br/>
              أعطيت له هذه الإفادة بناءً على طلبه دون أدنى مسؤولية على الجامعة.
            </div>

            <div class="footer">
              <div class="signature-block">
                <div>تاريخ الإصدار</div>
                <div style="margin-top: 10px;">${new Date().toLocaleDateString('ar-SA')}</div>
              </div>
              <div class="signature-block">
                <div>توقيع المختص</div>
                <div class="signature-line"></div>
              </div>
            </div>

            <div class="disclaimer">
              هذه الوثيقة صدرت إلكترونياً ولا تحتاج إلى ختم إذا تم التحقق منها عبر رمز الاستجابة السريع.
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
      margin: 10,
      filename: `Affidavit_${studentFullName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1a4a72" }}>
        إفادة قيد طالب
      </Typography>

      {/* Preview Container */}
      <Box
        sx={{
          backgroundColor: "#fff",
          p: { xs: 2, md: 6 },
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
          width: "100%",
          maxWidth: "800px",
          minHeight: "600px",
          direction: "rtl",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div ref={printRef}>
          {/* Aesthetic Background Watermark (Optional) */}
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            opacity: 0.03, 
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            <img src="https://uas.edu.ye/Logo.png" alt="" style={{ width: '400px' }} />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <img src="https://uas.edu.ye/Logo.png" alt="University Logo" style={{ width: '100px', marginBottom: '8px' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>
                  جامعة العلوم الأكاديمية
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#666' }}>
                  القسم الافتراضي
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 4, borderColor: '#1a4a72', borderWidth: '1px' }} />

            {/* Title */}
            <Box sx={{ textAlign: 'center', my: 6 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  display: 'inline-block', 
                  pb: 1,
                  borderBottom: '4px solid #1a4a72',
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}
              >
                إفادة طالب
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ px: { xs: 1, md: 4 }, py: 2 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.25rem', 
                  lineHeight: 2.2, 
                  textAlign: 'justify',
                  color: '#333'
                }}
              >
                تفيد جامعة العلوم الأكاديمية (القسم الافتراضي) بأن الطالب / 
                <Box component="span" sx={{ fontWeight: 'bold', px: 1, textDecoration: 'underline' }}>{studentFullName}</Box> 
                مقيد بكلية <Box component="span" sx={{ fontWeight: 'bold', px: 1, textDecoration: 'underline' }}>{faculty}</Box> 
                قسم <Box component="span" sx={{ fontWeight: 'bold', px: 1, textDecoration: 'underline' }}>{department}</Box> 
                برقم قيد <Box component="span" sx={{ fontWeight: 'bold', px: 1, textDecoration: 'underline' }}>{registrationNo}</Box> 
                لعام <Box component="span" sx={{ fontWeight: 'bold', px: 1, textDecoration: 'underline' }}>{academicYear}</Box>.
              </Typography>
              
              <Typography variant="body1" sx={{ fontSize: '1.25rem', mt: 4, textAlign: 'justify' }}>
                أعطيت له هذه الإفادة بناءً على طلبه دون أدنى مسؤولية على الجامعة.
              </Typography>
            </Box>

            {/* Footer */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 10, px: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>تاريخ الإصدار</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>{new Date().toLocaleDateString('ar-SA')}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>توقيع المختص</Typography>
                <Box sx={{ mt: 6, width: '150px', borderTop: '1px solid #000' }} />
              </Box>
            </Stack>
          </Box>
        </div>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ 
            borderRadius: "50px", 
            px: 4, 
            py: 1.5,
            bgcolor: "#1a4a72", 
            "&:hover": { bgcolor: "#133756" },
            fontSize: '1.1rem',
            gap: 1
          }}
        >
          طباعة الإفادة
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ 
            borderRadius: "50px", 
            px: 4, 
            py: 1.5,
            color: "#1a4a72", 
            borderColor: "#1a4a72",
            fontSize: '1.1rem',
            gap: 1
          }}
        >
          تحميل PDF
        </Button>
      </Stack>
    </Box>
  );
};

export default StudentAffidavit;
