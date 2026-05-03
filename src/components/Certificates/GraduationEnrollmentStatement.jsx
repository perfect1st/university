import React, { useRef } from "react";
import { Box, Typography, Button, Stack, useTheme, Divider } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";

const GraduationEnrollmentStatement = ({ studentData, registrationData }) => {
  const printRef = useRef(null);

  const studentFullName = registrationData
    ? `${registrationData.first_name || ""} ${registrationData.second_name || ""} ${registrationData.third_name || ""} ${registrationData.fourth_name || ""}`.trim()
    : studentData?.fullname || "................";

  const faculty = registrationData?.faculty_id?.title_ar || "................";
  const department = registrationData?.faculty_department_id?.title_ar || "................";
  const registrationNo = studentData?.serial || registrationData?.registration_no || "................";
  const academicYear = registrationData?.academyTerm_id?.current_year || "................";

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>قيد تخرج - ${studentFullName}</title>
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
              min-height: 297mm;
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
              line-height: 2.2;
              text-align: justify;
              margin-bottom: 80px;
              flex-grow: 1;
            }
            .field-value {
              font-weight: bold;
              border-bottom: 1px dotted #333;
              padding: 0 5px;
            }
            .footer {
              display: flex;
              justify-content: flex-end;
              margin-top: auto;
              padding-top: 40px;
            }
            .signature-block {
              text-align: center;
              width: 250px;
            }
            .signature-line {
              margin-top: 50px;
              border-top: 1px solid #333;
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
              <div class="univ-name" style="font-size: 18px; color: #555;">القسم الافتراضي</div>
            </div>

            <div class="title">
              <h1>قيد تخرج</h1>
            </div>

            <div class="content">
              تفيد جامعة العلوم الأكاديمية بأن الطالب / 
              <span class="field-value">${studentFullName}</span> 
              المقيد بكلية <span class="field-value">${faculty}</span> 
              قسم <span class="field-value">${department}</span> 
              برقم قيد <span class="field-value">${registrationNo}</span> 
              لعام <span class="field-value">${academicYear}</span> 
              بأنه <span style="font-weight: bold; color: #1a4a72;">على قيد التخرج</span> من الجامعة.
              <br/><br/>
              أعطيت له هذه الإفادة بناءً على طلبه دون أدنى مسؤولية على الجامعة.
            </div>

            <div class="footer">
              <div class="signature-block">
                <div style="font-weight: bold; margin-bottom: 10px;">توقيع المختص</div>
                <div style="font-size: 14px; color: #666;">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</div>
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
      margin: 10,
      filename: `Graduation_Enrollment_${studentFullName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1a4a72" }}>
        إفادة قيد تخرج
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          p: { xs: 2, md: 6 },
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
          width: "100%",
          maxWidth: "800px",
          direction: "rtl",
        }}
      >
        <div ref={printRef}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src="https://uas.edu.ye/Logo.png" alt="University Logo" style={{ width: '100px', marginBottom: '8px' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>جامعة العلوم الأكاديمية</Typography>
            <Typography variant="subtitle1" sx={{ color: '#666' }}>القسم الافتراضي</Typography>
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#1a4a72' }} />

          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, borderBottom: '4px solid #1a4a72', display: 'inline-block', pb: 1 }}>
              قيد تخرج
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 1, md: 4 }, py: 2 }}>
            <Typography variant="body1" sx={{ fontSize: '1.4rem', lineHeight: 2.2, textAlign: 'justify' }}>
              تفيد جامعة العلوم الأكاديمية بأن الطالب / 
              <Box component="span" sx={{ fontWeight: 'bold', px: 1 }}>{studentFullName}</Box> 
              المقيد بكلية <Box component="span" sx={{ fontWeight: 'bold', px: 1 }}>{faculty}</Box> 
              قسم <Box component="span" sx={{ fontWeight: 'bold', px: 1 }}>{department}</Box> 
              برقم قيد <Box component="span" sx={{ fontWeight: 'bold', px: 1 }}>{registrationNo}</Box> 
              لعام <Box component="span" sx={{ fontWeight: 'bold', px: 1 }}>{academicYear}</Box> 
              بأنه <Box component="span" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>على قيد التخرج</Box> من الجامعة.
            </Typography>
            
            <Typography variant="body1" sx={{ fontSize: '1.4rem', mt: 4 }}>
              أعطيت له هذه الإفادة بناءً على طلبه.
            </Typography>
          </Box>

          <Box sx={{ mt: 10, display: 'flex', justifyContent: 'flex-end', px: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>توقيع المختص</Typography>
              <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</Typography>
              <Box sx={{ mt: 6, width: '150px', borderTop: '2px solid #000' }} />
            </Box>
          </Box>
        </div>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderRadius: "50px", px: 4, bgcolor: "#1a4a72" }}>
          طباعة
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload} sx={{ borderRadius: "50px", px: 4, color: "#1a4a72", borderColor: "#1a4a72" }}>
          تحميل PDF
        </Button>
      </Stack>
    </Box>
  );
};

export default GraduationEnrollmentStatement;
