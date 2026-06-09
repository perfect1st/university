import React, { useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { Box, Typography, Button, Stack, CircularProgress, Divider, Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";
import { GET_ACADEMIC_TRANSCRIPT } from "../../graphql/studentDegreeQueries";
import universityLogo from "../../assets/Logo.png";

const AcademicTranscript = ({ studentId, registrationData }) => {
  const printRef = useRef(null);

  const { data, loading, error } = useQuery(GET_ACADEMIC_TRANSCRIPT, {
    variables: { student_id: studentId },
    fetchPolicy: "network-only",
    skip: !studentId,
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          حدث خطأ أثناء تحميل كشف الدرجات
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {error.message}
        </Typography>
      </Box>
    );
  }

  const transcript = data?.getAcademicTranscript;
  if (!transcript) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="textSecondary" variant="h6">
          لم يتم العثور على بيانات كشف الدرجات للطالب
        </Typography>
      </Box>
    );
  }

  const studentFullName = registrationData
    ? `${registrationData.first_name || ""} ${registrationData.second_name || ""} ${registrationData.third_name || ""} ${registrationData.fourth_name || ""}`.trim()
    : transcript.student?.fullname || "................";

  const facultyAr = transcript.faculty?.title_ar || "................";
  const departmentAr = transcript.faculty_department?.title_ar || "................";
  const registrationNo = transcript.student?.serial || "................";
  
  const enrollmentYear = registrationData?.education_year || 
                          registrationData?.academyTerm_id?.current_year || 
                          "2019 / 2020";

  const graduationYear = "2022 / 2023"; // fallback consistent with the references

  const getLevelNameAr = (num) => {
    const levels = {
      "1": "المستوى الأول",
      "2": "المستوى الثاني",
      "3": "المستوى الثالث",
      "4": "المستوى الرابع",
      "5": "المستوى الخامس",
      "6": "المستوى السادس",
      "7": "المستوى السابع",
      "8": "المستوى الثامن",
    };
    return levels[num] || `المستوى ${num}`;
  };

  const getTermNameAr = (termNum) => {
    const terms = {
      1: "الفصل الأول",
      2: "الفصل الثاني",
      3: "الفصل الثالث",
    };
    return terms[termNum] || `الفصل ${termNum}`;
  };

  const getGradeColor = (grade) => {
    if (!grade) return "#333";
    if (grade.includes("ممتاز")) return "#2e7d32";
    if (grade.includes("جيد جداً")) return "#00796b";
    if (grade.includes("جيد")) return "#0288d1";
    if (grade.includes("مقبول")) return "#ed6c02";
    return "#d32f2f"; // راسب
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>كشف درجات - ${studentFullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 6mm; }
            body { 
              direction: rtl;
              font-family: 'Cairo', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              background-color: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .container {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
              padding: 10px;
              box-sizing: border-box;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 5px;
            }
            .header-cell {
              vertical-align: middle;
              padding: 2px;
            }
            .header-right {
              text-align: right;
              font-size: 9.5px;
              line-height: 1.4;
            }
            .header-center {
              text-align: center;
            }
            .header-left {
              text-align: left;
            }
            .logo {
              width: 70px;
              height: auto;
              margin-bottom: 2px;
            }
            .univ-title {
              font-size: 11px;
              font-weight: 800;
              color: #1a4a72;
              margin: 0;
            }
            .univ-subtitle {
              font-size: 8px;
              color: #555;
              margin: 0;
            }
            .serial-box {
              border: 1px solid #1a4a72;
              padding: 4px 8px;
              border-radius: 4px;
              display: inline-block;
              text-align: right;
              font-size: 9px;
              min-width: 110px;
            }
            .divider-line {
              border-top: 2px double #1a4a72;
              margin: 4px 0;
            }
            .page-title {
              text-align: center;
              font-size: 16px;
              font-weight: 800;
              color: #1a4a72;
              margin: 2px 0;
            }
            .legend-container {
              text-align: center;
              margin-bottom: 8px;
            }
            .legend-badge {
              display: inline-block;
              padding: 1px 8px;
              font-size: 8.5px;
              font-weight: bold;
              border-radius: 20px;
              margin: 0 3px;
              border: 1px solid;
            }
            .badge-excel { color: #2e7d32; border-color: #2e7d32; background-color: #e8f5e9; }
            .badge-vgood { color: #00796b; border-color: #00796b; background-color: #e0f2f1; }
            .badge-good { color: #0288d1; border-color: #0288d1; background-color: #e1f5fe; }
            .badge-accept { color: #ed6c02; border-color: #ed6c02; background-color: #fff3e0; }
            .badge-fail { color: #d32f2f; border-color: #d32f2f; background-color: #ffebee; }

            .declaration-box {
              border: 2px double #1a4a72;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 10.5px;
              line-height: 1.5;
              text-align: justify;
              margin-bottom: 8px;
              background-color: #fafafa;
            }
            .highlight-text {
              font-weight: 700;
              color: #1a4a72;
            }
            .level-block {
              border: 1.2px solid #1a4a72;
              border-radius: 5px;
              margin-bottom: 8px;
              overflow: hidden;
              page-break-inside: avoid;
            }
            .level-header {
              background-color: #1a4a72;
              color: white;
              text-align: center;
              font-weight: bold;
              font-size: 11px;
              padding: 4px;
            }
            .term-section {
              padding: 2px 6px;
            }
            .term-header {
              text-align: center;
              font-weight: 700;
              font-size: 10px;
              color: #1a4a72;
              margin: 4px 0 2px 0;
              border-bottom: 1px dashed #1a4a72;
              padding-bottom: 1px;
            }
            .transcript-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
              margin-bottom: 4px;
            }
            .transcript-table th {
              background-color: #f0f4f8;
              color: #1a4a72;
              font-weight: bold;
              border: 1px solid #ccd8e7;
              padding: 3px;
              text-align: center;
            }
            .transcript-table td {
              border: 1px solid #ccd8e7;
              padding: 3px;
              text-align: center;
            }
            .subject-name {
              text-align: right !important;
              padding-right: 5px !important;
              font-weight: 600;
            }
            .summary-card {
              border: 1.2px solid #1a4a72;
              border-radius: 5px;
              overflow: hidden;
              margin-bottom: 8px;
              page-break-inside: avoid;
            }
            .summary-title {
              background-color: #f0f4f8;
              color: #1a4a72;
              text-align: center;
              font-weight: bold;
              font-size: 11px;
              padding: 4px;
              border-bottom: 1.2px solid #1a4a72;
            }
            .overall-stats-bar {
              border: 1.2px dashed #1a4a72;
              border-radius: 5px;
              padding: 4px 10px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              font-size: 11px;
              font-weight: bold;
              background-color: #f9fbfd;
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            .footer-signatures {
              width: 100%;
              margin-top: 15px;
              page-break-inside: avoid;
            }
            .signature-col {
              text-align: center;
              width: 33.33%;
              vertical-align: top;
              font-size: 10px;
            }
            .signature-title {
              font-weight: bold;
              color: #1a4a72;
              margin-bottom: 2px;
            }
            .stamp-circle {
              width: 50px;
              height: 50px;
              border: 1.2px dashed #bbb;
              border-radius: 50%;
              margin: 4px auto 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ccc;
              font-size: 8px;
            }
            @media print {
              .container { border: none; padding: 0; }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-cell header-right" style="width: 35%;">
                  جامعة العلوم الأكاديمية الافتراضية<br/>
                  عضو عامل باتحاد الجامعات العربية<br/>
                  وزارة التعليم العالي والبحث العلمي<br/>
                  كلية: ${facultyAr}<br/>
                  قسم: ${departmentAr}
                </td>
                <td class="header-cell header-center" style="width: 30%;">
                  <img src="${universityLogo.startsWith("http") ? universityLogo : "https://uas.edu.ye/Logo.png"}" alt="Logo" class="logo" />
                  <div class="univ-title">جامعة العلوم الأكاديمية الافتراضية</div>
                  <div class="univ-subtitle">Virtual University of Academic Sciences</div>
                </td>
                <td class="header-cell header-left" style="width: 35%;">
                  <div class="serial-box">
                    التاريخ: ${new Date(transcript.generated_at).toLocaleDateString('ar-SA')}<br/>
                    الرقم: ${registrationNo}
                  </div>
                </td>
              </tr>
            </table>

            <div class="divider-line"></div>

            <div class="page-title">كشف درجات الطالب</div>

            <div class="legend-container">
              <span class="legend-badge badge-excel">ممتاز &ge; 90</span>
              <span class="legend-badge badge-vgood">جيد جداً &ge; 80</span>
              <span class="legend-badge badge-good">جيد &ge; 70</span>
              <span class="legend-badge badge-accept">مقبول &ge; 60</span>
              <span class="legend-badge badge-fail">راسب &lt; 60</span>
            </div>

            <div class="declaration-box">
              تشهد جامعة العلوم الأكاديمية الافتراضية - كلية <span class="highlight-text">${facultyAr}</span> بأن الطالب / <span class="highlight-text">${studentFullName}</span> - يمني الجنسية - تاريخ الالتحاق <span class="highlight-text">${enrollmentYear}م</span> قد حصل على درجة البكالوريوس في دور سنة <span class="highlight-text">${graduationYear}م</span> بتقدير عام <span class="highlight-text">${transcript.overall_grade}</span> في البرنامج الأكاديمي (<span class="highlight-text">${departmentAr}</span>) وفيما يلي تقديرات المواد التي درسها بنظام الساعات:
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
              <tr>
                ${transcript.levels.map((level, lIndex) => `
                  <td style="width: 50%; padding: 0 4px; vertical-align: top;">
                    <div class="level-block">
                      <div class="level-header">${getLevelNameAr(level.study_year)}</div>
                      <div class="term-section">
                        ${level.terms.map(term => `
                          <div class="term-header">— ${getTermNameAr(term.term_number)} —</div>
                          <table class="transcript-table">
                            <thead>
                              <tr>
                                <th style="width: 50%;">المادة</th>
                                <th style="width: 15%;">الساعات</th>
                                <th style="width: 15%;">الدرجة</th>
                                <th style="width: 20%;">التقدير</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${term.subjects.map(sub => `
                                <tr>
                                  <td class="subject-name">${sub.material?.title_ar}</td>
                                  <td>${sub.hours}</td>
                                  <td>${sub.degree}</td>
                                  <td style="color: ${getGradeColor(sub.grade)}; font-weight: bold;">${sub.grade}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                        `).join('')}
                      </div>
                    </div>
                  </td>
                  ${lIndex % 2 === 1 ? '</tr><tr>' : ''}
                `).join('')}
              </tr>
            </table>

            <div class="summary-card">
              <div class="summary-title">ملخص الأداء الأكاديمي بالمستويات</div>
              <table class="transcript-table" style="margin: 0; font-size: 9.5px;">
                <thead>
                  <tr style="background-color: #f0f4f8;">
                    <th>المستوى</th>
                    <th>عدد المواد</th>
                    <th>الساعات المعتمدة</th>
                    <th>مجموع الدرجات</th>
                    <th>المعدل</th>
                    <th>التقدير</th>
                  </tr>
                </thead>
                <tbody>
                  ${transcript.summary.map(sum => `
                    <tr>
                      <td style="font-weight: bold;">${getLevelNameAr(sum.study_year)}</td>
                      <td>${sum.total_subjects}</td>
                      <td>${sum.total_hours}</td>
                      <td>${sum.total_degrees}</td>
                      <td>${sum.average}%</td>
                      <td style="color: ${getGradeColor(sum.grade)}; font-weight: bold;">${sum.grade}</td>
                    </tr>
                  `).join('')}
                  <tr style="background-color: #e3ebf6; font-weight: bold; border-top: 1.5px solid #1a4a72;">
                    <td>الإجمالي</td>
                    <td>${transcript.overall_total_subjects}</td>
                    <td>${transcript.overall_total_hours}</td>
                    <td>${transcript.overall_total_degrees}</td>
                    <td>${transcript.overall_average}%</td>
                    <td style="color: ${getGradeColor(transcript.overall_grade)}; font-weight: bold;">${transcript.overall_grade}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="overall-stats-bar">
              <div>مجموع الدرجات: <span style="color: #1a4a72;">${transcript.overall_total_degrees}</span></div>
              <div>المعدل العام: <span style="color: #1a4a72;">${transcript.overall_average}%</span></div>
              <div>التقدير العام: <span style="color: ${getGradeColor(transcript.overall_grade)};">${transcript.overall_grade}</span></div>
            </div>

            <table class="footer-signatures">
              <tr>
                <td class="signature-col">
                  <div class="signature-title">شؤون الطلاب</div>
                  <div class="stamp-circle">الختم</div>
                </td>
                <td class="signature-col">
                  <div class="signature-title">عميد الكلية</div>
                  <div class="stamp-circle">الختم</div>
                </td>
                <td class="signature-col">
                  <div class="signature-title">رئيس الجامعة</div>
                  <div class="stamp-circle">الختم</div>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Transcript_${studentFullName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1a4a72", fontFamily: "Cairo, sans-serif" }}>
        كشف درجات الطالب (بيان نجاح)
      </Typography>

      {/* Preview Container Optimized for exact single A4 page capture */}
      <Box
        sx={{
          backgroundColor: "#fff",
          p: { xs: 1.5, md: 3 },
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
          width: "100%",
          maxWidth: "850px",
          direction: "rtl",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Cairo, sans-serif"
        }}
      >
        <div ref={printRef}>
          {/* Watermark Logo */}
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            opacity: 0.02, 
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            <img src="https://uas.edu.ye/Logo.png" alt="" style={{ width: '400px' }} />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <Grid container spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Grid item xs={4} sx={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a4a72', fontSize: '0.75rem' }}>جامعة العلوم الأكاديمية الافتراضية</Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.62rem' }}>عضو عامل باتحاد الجامعات العربية</Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.62rem' }}>وزارة التعليم العالي والبحث العلمي</Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.62rem' }}>كلية: {facultyAr}</Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.62rem' }}>قسم: {departmentAr}</Typography>
              </Grid>
              
              <Grid item xs={4} sx={{ textAlign: 'center' }}>
                <Box component="img" src={universityLogo} sx={{ width: '65px', mb: 0.25, objectFit: 'contain' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a4a72', fontSize: '0.8rem', lineHeight: 1.1 }}>
                  جامعة العلوم الأكاديمية الافتراضية
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.55rem' }}>
                  Virtual University of Academic Sciences
                </Typography>
              </Grid>

              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ border: '1px solid #1a4a72', p: 0.5, borderRadius: 1, minWidth: '110px', fontSize: '0.72rem' }}>
                  <Typography variant="caption" display="block" sx={{ fontSize: '0.68rem' }}>
                    التاريخ: {new Date(transcript.generated_at).toLocaleDateString('ar-SA')}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ fontSize: '0.68rem' }}>
                    الرقم: {registrationNo}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 1, borderColor: '#1a4a72', borderWidth: '1px', borderStyle: 'double' }} />

            {/* Title */}
            <Box sx={{ textAlign: 'center', my: 1 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  display: 'inline-block', 
                  pb: 0.25,
                  color: '#1a4a72',
                  fontSize: '1.4rem'
                }}
              >
                كشف درجات الطالب
              </Typography>
            </Box>

            {/* Legend */}
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Box sx={{ border: '1px solid #2e7d32', color: '#2e7d32', bgcolor: '#e8f5e9', px: 1, py: 0.15, borderRadius: '20px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                ممتاز &ge; 90
              </Box>
              <Box sx={{ border: '1px solid #00796b', color: '#00796b', bgcolor: '#e0f2f1', px: 1, py: 0.15, borderRadius: '20px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                جيد جداً &ge; 80
              </Box>
              <Box sx={{ border: '1px solid #0288d1', color: '#0288d1', bgcolor: '#e1f5fe', px: 1, py: 0.15, borderRadius: '20px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                جيد &ge; 70
              </Box>
              <Box sx={{ border: '1px solid #ed6c02', color: '#ed6c02', bgcolor: '#fff3e0', px: 1, py: 0.15, borderRadius: '20px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                مقبول &ge; 60
              </Box>
              <Box sx={{ border: '1px solid #d32f2f', color: '#d32f2f', bgcolor: '#ffebee', px: 1, py: 0.15, borderRadius: '20px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                راسب &lt; 60
              </Box>
            </Stack>

            {/* Declaration Paragraph */}
            <Box 
              sx={{ 
                border: '2px double #1a4a72', 
                p: 1.25, 
                borderRadius: 1.5, 
                bgcolor: 'action.hover', 
                mb: 1.5,
                fontSize: '0.82rem',
                lineHeight: 1.5,
                textAlign: 'justify',
                color: '#333'
              }}
            >
              تشهد جامعة العلوم الأكاديمية الافتراضية - كلية <Box component="span" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>{facultyAr}</Box> بأن الطالب / <Box component="span" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>{studentFullName}</Box> - يمني الجنسية - تاريخ الالتحاق <Box component="span" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>{enrollmentYear}م</Box> قد حصل على درجة البكالوريوس في دور سنة <Box component="span" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>{graduationYear}م</Box> بتقدير عام <Box component="span" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>{transcript.overall_grade}</Box> في البرنامج الأكاديمي (<Box component="span" sx={{ fontWeight: 'bold', color: '#1a4a72' }}>{departmentAr}</Box>) وفيما يلي تقديرات المواد التي درسها بنظام الساعات:
            </Box>

            {/* Levels Grids (Side-by-Side Dual Column) */}
            <Grid container spacing={1} sx={{ mb: 1.5 }}>
              {transcript.levels.map((level, lIndex) => (
                <Grid item xs={12} md={6} key={lIndex}>
                  <Box sx={{ border: '1.2px solid #1a4a72', borderRadius: '5px', overflow: 'hidden', height: '100%' }}>
                    <Box sx={{ bgcolor: '#1a4a72', color: '#fff', p: 0.5, textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      {getLevelNameAr(level.study_year)}
                    </Box>
                    <Box sx={{ p: 1 }}>
                      {level.terms.map((term, tIndex) => (
                        <Box key={tIndex} sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1a4a72', mb: 0.5, borderBottom: '1px dashed #1a4a72', pb: 0.25, fontSize: '0.78rem' }}>
                            — {getTermNameAr(term.term_number)} —
                          </Typography>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f0f4f8' }}>
                                <th style={{ border: '1px solid #ccd8e7', padding: '3px', textAlign: 'right', color: '#1a4a72', fontWeight: 'bold' }}>المادة</th>
                                <th style={{ border: '1px solid #ccd8e7', padding: '3px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold', width: '15%' }}>الساعات</th>
                                <th style={{ border: '1px solid #ccd8e7', padding: '3px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold', width: '15%' }}>الدرجة</th>
                                <th style={{ border: '1px solid #ccd8e7', padding: '3px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold', width: '20%' }}>التقدير</th>
                              </tr>
                            </thead>
                            <tbody>
                              {term.subjects.map((sub, sIndex) => (
                                <tr key={sIndex}>
                                  <td style={{ border: '1px solid #ccd8e7', padding: '3px', fontWeight: '500', color: '#333' }}>{sub.material?.title_ar}</td>
                                  <td style={{ border: '1px solid #ccd8e7', padding: '3px', textAlign: 'center' }}>{sub.hours}</td>
                                  <td style={{ border: '1px solid #ccd8e7', padding: '3px', textAlign: 'center' }}>{sub.degree}</td>
                                  <td style={{ border: '1px solid #ccd8e7', padding: '3px', textAlign: 'center', fontWeight: 'bold', color: getGradeColor(sub.grade) }}>
                                    {sub.grade}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Performance Summary Table */}
            <Box sx={{ border: '1.2px solid #1a4a72', borderRadius: '5px', overflow: 'hidden', mb: 1.5 }}>
              <Box sx={{ bgcolor: '#f0f4f8', color: '#1a4a72', p: 0.5, textAlign: 'center', fontWeight: 'bold', borderBottom: '1.2px solid #1a4a72', fontSize: '0.85rem' }}>
                ملخص الأداء الأكاديمي بالمستويات
              </Box>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f8fa' }}>
                    <th style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold' }}>المستوى</th>
                    <th style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold' }}>عدد المواد</th>
                    <th style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold' }}>الساعات المعتمدة</th>
                    <th style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold' }}>مجموع الدرجات</th>
                    <th style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold' }}>المعدل</th>
                    <th style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', color: '#1a4a72', fontWeight: 'bold' }}>التقدير</th>
                  </tr>
                </thead>
                <tbody>
                  {transcript.summary.map((sum, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>{getLevelNameAr(sum.study_year)}</td>
                      <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>{sum.total_subjects}</td>
                      <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>{sum.total_hours}</td>
                      <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>{sum.total_degrees}</td>
                      <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', fontWeight: '600' }}>{sum.average}%</td>
                      <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', fontWeight: 'bold', color: getGradeColor(sum.grade) }}>
                        {sum.grade}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#e3ebf6', fontWeight: 'bold', borderTop: '1.5px solid #1a4a72' }}>
                    <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>الإجمالي</td>
                    <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>{transcript.overall_total_subjects}</td>
                    <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>{transcript.overall_total_hours}</td>
                    <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>{transcript.overall_total_degrees}</td>
                    <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center' }}>{transcript.overall_average}%</td>
                    <td style={{ border: '1px solid #ccd8e7', padding: '4px', textAlign: 'center', color: getGradeColor(transcript.overall_grade) }}>
                      {transcript.overall_grade}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>

            {/* Overall Summary Bar */}
            <Stack 
              direction="row" 
              justifyContent="space-around" 
              alignItems="center" 
              sx={{ 
                border: '1.2px dashed #1a4a72', 
                borderRadius: '5px', 
                p: 1, 
                bgcolor: '#f9fbfd', 
                fontSize: '0.85rem', 
                fontWeight: 'bold', 
                mb: 2 
              }}
            >
              <Box>مجموع الدرجات: <Box component="span" sx={{ color: '#1a4a72' }}>{transcript.overall_total_degrees}</Box></Box>
              <Box>المعدل العام: <Box component="span" sx={{ color: '#1a4a72' }}>{transcript.overall_average}%</Box></Box>
              <Box>التقدير العام: <Box component="span" sx={{ color: getGradeColor(transcript.overall_grade) }}>{transcript.overall_grade}</Box></Box>
            </Stack>

            {/* Signatures & Stamps */}
            <Grid container spacing={2} sx={{ mt: 1, textAlign: 'center' }}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a4a72', fontSize: '0.8rem' }}>شؤون الطلاب</Typography>
                <Box 
                  sx={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '1.2px dashed #ccc', 
                    borderRadius: '50%', 
                    margin: '4px auto 0 auto', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    color: '#ccc', 
                    fontSize: '0.6rem' 
                  }}
                >
                  الختم
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a4a72', fontSize: '0.8rem' }}>عميد الكلية</Typography>
                <Box 
                  sx={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '1.2px dashed #ccc', 
                    borderRadius: '50%', 
                    margin: '4px auto 0 auto', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    color: '#ccc', 
                    fontSize: '0.6rem' 
                  }}
                >
                  الختم
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a4a72', fontSize: '0.8rem' }}>رئيس الجامعة</Typography>
                <Box 
                  sx={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '1.2px dashed #ccc', 
                    borderRadius: '50%', 
                    margin: '4px auto 0 auto', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    color: '#ccc', 
                    fontSize: '0.6rem' 
                  }}
                >
                  الختم
                </Box>
              </Grid>
            </Grid>
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
            fontSize: '1rem',
            gap: 1
          }}
        >
          طباعة كشف الدرجات
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
            fontSize: '1rem',
            gap: 1
          }}
        >
          تحميل PDF
        </Button>
      </Stack>
    </Box>
  );
};

export default AcademicTranscript;
