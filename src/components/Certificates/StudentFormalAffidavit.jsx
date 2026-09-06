/**
 * @file StudentFormalAffidavit.jsx
 * @description Official Formal Academic Certificate Component (الإقرار والتعهد الرسمي للطالب).
 * Header position: Republic info on Right, Logo in Center, Metadata on Left.
 * Dynamic academic statement (Result vs Success) based on student overall grade/average.
 * Single A4 page fit, all-black text, no text underlines, print-only capability.
 *
 * @module Certificates/StudentFormalAffidavit
 *
 * @param {Object} props - Component props.
 * @param {("university_certificate"|"registration_suspension"|"success_statement"|"graduation_enrollment")} [props.ticketType="university_certificate"] - Document type key.
 * @param {Object} [props.studentData] - Student profile details.
 * @param {Object} [props.registrationData] - Detailed academic registration info.
 *
 * @returns {JSX.Element} The rendered formal certificate preview with Print action button.
 */

import React, { useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { Box, Typography, Button, Stack, Divider, Paper, Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SecurityIcon from "@mui/icons-material/Security";
import { GET_ACADEMIC_TRANSCRIPT } from "../../graphql/studentDegreeQueries";
import universityLogo from "../../assets/Logo.png";

const StudentFormalAffidavit = ({ ticketType, studentData, registrationData }) => {
  /** Reference to the certificate printable DOM element */
  const printRef = useRef(null);

  // Extract student ID for academic transcript query if needed
  const studentId = studentData?.id || studentData?._id;

  // Query academic transcript to determine true overall grade and average
  const { data: transcriptQueryData } = useQuery(GET_ACADEMIC_TRANSCRIPT, {
    variables: { student_id: studentId },
    skip: !studentId || ticketType !== "success_statement",
    fetchPolicy: "cache-first",
  });

  const transcript = transcriptQueryData?.getAcademicTranscript;
  const overallGrade = transcript?.overall_grade || registrationData?.overall_grade || studentData?.overall_grade || "";
  const overallAverage = transcript?.overall_average ?? registrationData?.overall_average ?? studentData?.overall_average;

  // Determine if student has failed status
  const isFailed = overallGrade === "راسب" || (typeof overallAverage === "number" && overallAverage < 50);

  // Extract student full name safely
  const studentFullName = registrationData
    ? `${registrationData.first_name || ""} ${registrationData.second_name || ""} ${registrationData.third_name || ""} ${registrationData.fourth_name || ""}`.trim()
    : transcript?.student?.fullname || studentData?.fullname || "غير محدد";

  // Academic metadata extraction with safe fallbacks
  const faculty = registrationData?.faculty_id?.title_ar || transcript?.faculty?.title_ar || studentData?.faculty || "كلية العلوم الأكاديمية";
  const department = registrationData?.faculty_department_id?.title_ar || transcript?.faculty_department?.title_ar || studentData?.department || "القسم العام";
  const registrationNo = registrationData?.user_id?.qid_number || studentData?.serial || transcript?.student?.serial || "ــ";
  const academicYear = registrationData?.academyTerm_id?.current_year || new Date().getFullYear().toString();
  const serialNo = `REG-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const issueDate = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  /**
   * Template configurations for different types of formal academic affidavits
   */
  const documentConfigs = {
    registration_suspension: {
      title: "إفادة إيقاف قيد دراسي",
      subtitle: "صادرة عن عمادة القبول والتسجيل",
      bodyPrefix: "تفيد جامعة العلوم الأكاديمية بأن الطالب/ـة ",
      bodyMiddle: "، المقيد بكلية ",
      bodyDept: "، قسم ",
      bodyReg: "، برقم قيد (",
      bodyYear: ")، قد تقدم بطلب رسمـي لإيقاف قيده الدراسي للعام الجامعي ",
      bodySuffix: "، وقد تمت الموافقة الاعتمادية على طلبه وفقاً للشروط واللوائح الأكاديمية المنظمة بالجامعة.",
      disclaimer: "أعطيت له هذه الإفادة بناءً على طلبه لتقديمها إلى الجهات المختصة دون أدنى مسؤولية مالية أو قانونية على الجامعة.",
    },
    university_certificate: {
      title: "إفادة طالب",
      subtitle: "شهادة إثبات طالب منتظم",
      bodyPrefix: "تفيد جامعة العلوم الأكاديمية بأن الطالب/ـة ",
      bodyMiddle: "، المقيد بكلية ",
      bodyDept: "، قسم ",
      bodyReg: "، برقم قيد (",
      bodyYear: ")، هو أحد الطلاب المنتظمين بالجامعة للعام الجامعي ",
      bodySuffix: " ويسير في خطته الدراسية بصورة منتظمة.",
      disclaimer: "أعطيت له هذه الإفادة بناءً على طلبه لتقديمها لجهات الاكتفاء والجهات الرسمية دون أي مسؤولية على الجامعة.",
    },
    success_statement: isFailed
      ? {
          title: "بيان نجاح",
          subtitle: "إفادة السجل والتقدير الأكاديمي",
          bodyPrefix: "تفيد جامعة العلوم الأكاديمية بأن الطالب/ـة ",
          bodyMiddle: "، المقيد بكلية ",
          bodyDept: "، قسم ",
          bodyReg: "، برقم قيد (",
          bodyYear: ")، قد أدى امتحانات العام الجامعي ",
          bodySuffix: `، والنتيجة المسجلة بسجلاته الأكاديمية هي: ${overallGrade || "راسب"}${
            typeof overallAverage === "number" ? ` (بمعدل ${overallAverage}%)` : ""
          }.`,
          disclaimer: "أعطيت له هذه الإفادة بناءً على طلبه لتقديمها إلى الجهات المعنية لإثبات النتيجة دون أدنى مسؤولية على الجامعة.",
        }
      : {
          title: "بيان نجاح",
          subtitle: "إفادة نجاح واجتياز المتطلبات",
          bodyPrefix: "تفيد جامعة العلوم الأكاديمية بأن الطالب/ـة ",
          bodyMiddle: "، المقيد بكلية ",
          bodyDept: "، قسم ",
          bodyReg: "، برقم قيد (",
          bodyYear: ")، قد اجتاز بنجاح المتطلبات الأكاديمية المقررة للعام الجامعي ",
          bodySuffix: overallGrade
            ? ` بتقدير عام: ${overallGrade}${typeof overallAverage === "number" ? ` (بمعدل ${overallAverage}%)` : ""}.`
            : " وفق السجلات المعتمدة بشؤون الطلاب.",
          disclaimer: "أعطيت له هذه الوثيقة بناءً على طلبه لتقديمها إلى من يهمه الأمر رسمياً.",
        },
    graduation_enrollment: {
      title: "إفادة قيد وتوقع تخرج",
      subtitle: "شهادة استكمال متطلبات التخرج",
      bodyPrefix: "تفيد جامعة العلوم الأكاديمية بأن الطالب/ـة ",
      bodyMiddle: "، المقيد بكلية ",
      bodyDept: "، قسم ",
      bodyReg: "، برقم قيد (",
      bodyYear: ")، هو في المستوى النهائي ومقيد بمرحلة التخرج للعام الجامعي ",
      bodySuffix: "، وجارٍ استكمال إجراءات منحه مدرج الخريجين.",
      disclaimer: "أعطيت له هذه الإفادة بناءً على طلبه لتقديمها إلى جهات التوظيف والجهات المعنية لحين إصدار وثيقة التخرج النهائية.",
    },
  };

  // Determine current active document template configuration
  const currentConfig = documentConfigs[ticketType] || documentConfigs.university_certificate;

  /**
   * Opens print window for immediate high-fidelity physical printing
   */
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>${currentConfig.title} - ${studentFullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm 12mm;
            }
            * {
              box-sizing: border-box;
            }
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
            }
            body {
              direction: rtl;
              font-family: 'Cairo', 'Traditional Arabic', Arial, sans-serif;
              color: #000000;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .certificate-border {
              width: 100%;
              max-width: 800px;
              height: 98vh;
              margin: 0 auto;
              padding: 30px 40px;
              border: 8px double #000000;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              position: relative;
              background: #ffffff;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.04;
              width: 450px;
              pointer-events: none;
              z-index: 0;
              filter: grayscale(100%);
            }
            .content-area {
              position: relative;
              z-index: 1;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px dashed #000000;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header-text-main {
              font-size: 18px;
              font-weight: 800;
              color: #000000;
            }
            .header-text-sub {
              font-size: 13px;
              color: #000000;
            }
            .title-box {
              text-align: center;
              margin: 25px 0 20px 0;
            }
            .main-title {
              font-size: 28px;
              font-weight: 900;
              color: #000000;
              display: inline-block;
              padding: 4px 35px;
              border-bottom: 3px solid #000000;
              letter-spacing: 0.5px;
            }
            .subtitle {
              font-size: 15px;
              color: #000000;
              margin-top: 6px;
              font-weight: 700;
            }
            .body-content {
              font-size: 19px;
              line-height: 2.2;
              text-align: justify;
              margin: 25px 0 20px 0;
              color: #000000;
              font-weight: 600;
            }
            .highlight-value {
              font-weight: 900;
              color: #000000;
              padding: 0 4px;
            }
            .disclaimer-text {
              font-size: 14px;
              line-height: 1.8;
              color: #000000;
              margin-top: 15px;
              text-align: justify;
              font-weight: 600;
            }
            .footer-table {
              width: 100%;
              margin-top: 35px;
            }
            .signature-title {
              font-size: 15px;
              font-weight: 800;
              color: #000000;
              margin-bottom: 45px;
            }
            .signature-line {
              width: 170px;
              margin: 0 auto;
              border-top: 2px solid #000000;
            }
            .seal-circle {
              width: 90px;
              height: 90px;
              border: 2px dashed #000000;
              border-radius: 50%;
              margin: 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #000000;
              font-weight: 700;
            }
            .security-bar {
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px solid #000000;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #000000;
              font-weight: 700;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="certificate-border">
            <img src="${universityLogo}" class="watermark" alt="Watermark" />
            <div class="content-area">
              <table class="header-table">
                <tr>
                  <!-- RIGHT COLUMN: Republic Title & University -->
                  <td style="width: 35%; text-align: right; vertical-align: top;">
                    <div class="header-text-main">الجمهورية اليمنية</div>
                    <div class="header-text-sub">وزارة التعليم العالي والبحث العلمي</div>
                    <div class="header-text-main" style="font-size: 16px; margin-top: 3px;">جامعة العلوم الأكاديمية</div>
                    <div class="header-text-sub" style="font-weight: 700;">عمادة القبول والتسجيل</div>
                  </td>
                  <!-- CENTER COLUMN: Emblem Logo -->
                  <td style="width: 30%; text-align: center; vertical-align: top;">
                    <img src="${universityLogo}" alt="University Emblem" style="height: 65px; filter: grayscale(100%);" />
                  </td>
                  <!-- LEFT COLUMN: Metadata & Ref Info -->
                  <td style="width: 35%; text-align: left; vertical-align: top; font-size: 13px; color: #000000; line-height: 1.8; font-weight: 600;">
                    <div><strong>رقم القيد العام:</strong> &rlm;<span dir="ltr">${registrationNo}</span></div>
                    <div><strong>الرقم المرجعي:</strong> &rlm;<span dir="ltr">${serialNo}</span></div>
                    <div><strong>تاريخ الإصدار:</strong> ${issueDate}</div>
                  </td>
                </tr>
              </table>

              <div class="title-box">
                <div class="main-title">${currentConfig.title}</div>
                <div class="subtitle">${currentConfig.subtitle}</div>
              </div>

              <div class="body-content">
                ${currentConfig.bodyPrefix}
                <span class="highlight-value">${studentFullName}</span>
                ${currentConfig.bodyMiddle}
                <span class="highlight-value">${faculty}</span>
                ${currentConfig.bodyDept}
                <span class="highlight-value">${department}</span>
                ${currentConfig.bodyReg}
                <span class="highlight-value">${registrationNo}</span>
                ${currentConfig.bodyYear}
                <span class="highlight-value">${academicYear}</span>
                ${currentConfig.bodySuffix}
              </div>

              <div class="disclaimer-text">
                ${currentConfig.disclaimer}
              </div>
            </div>

            <div>
              <table class="footer-table">
                <tr>
                  <td style="width: 33%; text-align: center;">
                    <div class="signature-title">تاريخ الإصدار والاعتماد</div>
                    <div style="font-size: 14px; font-weight: 700; color: #000000;">${issueDate}</div>
                  </td>
                  <td style="width: 34%; text-align: center;">
                    <div class="signature-title">ختم عمادة القبول والتسجيل</div>
                    <div class="seal-circle">مساحة الختم الرسمية</div>
                  </td>
                  <td style="width: 33%; text-align: center;">
                    <div class="signature-title">عميد القبول والتسجيل</div>
                    <div class="signature-line"></div>
                  </td>
                </tr>
              </table>

              <div class="security-bar">
                <div style="display: flex; gap: 4px; direction: rtl;">
                  <span>الرمز الأمني:</span>
                  <span dir="ltr"><strong>${serialNo}</strong></span>
                </div>
                <div>وثيقة إلكترونية موثقة رسمياً</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 3, my: 2 }}>
      {/* Document Frame Preview */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "800px",
          bgcolor: "#fff",
          p: { xs: 2.5, md: 5 },
          borderRadius: "10px",
          border: "6px double #000000",
          position: "relative",
          overflow: "hidden",
          direction: "rtl",
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div ref={printRef}>
          {/* Central Watermark */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.04,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <img src={universityLogo} alt="Watermark" style={{ width: "420px", filter: "grayscale(100%)" }} />
          </Box>

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Header Credentials */}
            <Grid container alignItems="center" spacing={2} sx={{ pb: 2.5, borderBottom: "2px dashed #000000", mb: 3 }}>
              {/* RIGHT SIDE: Republic Title & Deanship */}
              <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "right" } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#000000", fontSize: "1.1rem" }}>
                  الجمهورية اليمنية
                </Typography>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", fontWeight: 600 }}>
                  وزارة التعليم العالي والبحث العلمي
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#000000", mt: 0.5 }}>
                  جامعة العلوم الأكاديمية
                </Typography>
                <Typography variant="caption" sx={{ color: "#000000", fontWeight: 700, display: "block" }}>
                  عمادة القبول والتسجيل
                </Typography>
              </Grid>

              {/* CENTER: Logo Emblem */}
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <img src={universityLogo} alt="University Logo" style={{ height: "65px", objectFit: "contain", filter: "grayscale(100%)" }} />
              </Grid>

              {/* LEFT SIDE: Document Metadata */}
              <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", fontWeight: 600 }}>
                  <strong>رقم القيد العام:</strong> &rlm;<span dir="ltr">{registrationNo}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", mt: 0.5, fontWeight: 600 }}>
                  <strong>الرقم المرجعي:</strong> &rlm;<span dir="ltr">{serialNo}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", mt: 0.5, fontWeight: 600 }}>
                  <strong>تاريخ الإصدار:</strong> {issueDate}
                </Typography>
              </Grid>
            </Grid>

            {/* Document Main Title Header */}
            <Box sx={{ textAlign: "center", my: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: "#000000",
                  display: "inline-block",
                  px: 4,
                  pb: 1,
                  borderBottom: "4px solid #000000",
                  fontSize: { xs: "1.7rem", md: "2.2rem" },
                  letterSpacing: 0.5,
                }}
              >
                {currentConfig.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#000000", mt: 1, fontWeight: 700 }}>
                {currentConfig.subtitle}
              </Typography>
            </Box>

            {/* Document Body Declaration Text */}
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.25rem",
                lineHeight: 2.3,
                textAlign: "justify",
                color: "#000000",
                fontWeight: 600,
                my: 4,
                px: { xs: 0, md: 1 },
              }}
            >
              {currentConfig.bodyPrefix}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {studentFullName}
              </Box>
              {currentConfig.bodyMiddle}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {faculty}
              </Box>
              {currentConfig.bodyDept}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {department}
              </Box>
              {currentConfig.bodyReg}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {registrationNo}
              </Box>
              {currentConfig.bodyYear}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {academicYear}
              </Box>
              {currentConfig.bodySuffix}
            </Typography>

            {/* Standard Disclaimer Statement */}
            <Typography variant="body1" sx={{ color: "#000000", mt: 2, mb: 4, fontSize: "1.05rem", fontWeight: 600 }}>
              {currentConfig.disclaimer}
            </Typography>

            <Divider sx={{ my: 3, borderColor: "#000000" }} />

            {/* Signature & Seal Area */}
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 3, px: 2 }}>
              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000" }}>
                  تاريخ الإصدار والاعتماد
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 700, color: "#000000" }}>
                  {issueDate}
                </Typography>
              </Grid>

              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000", mb: 1 }}>
                  ختم عمادة القبول والتسجيل
                </Typography>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    borderRadius: "50%",
                    border: "2px dashed #000000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000000",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  مساحة الختم الرسمية
                </Box>
              </Grid>

              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000" }}>
                  عميد القبول والتسجيل
                </Typography>
                <Box sx={{ mt: 6, width: 160, mx: "auto", borderTop: "2px solid #000000" }} />
              </Grid>
            </Grid>

            {/* Security Verification Bar */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 4, pt: 2, borderTop: "1px solid #000000" }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <QrCode2Icon sx={{ color: "#000000" }} />
                <Typography variant="caption" sx={{ color: "#000000", fontWeight: 700 }}>
                  الرمز الأمني: <strong dir="ltr">{serialNo}</strong>
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SecurityIcon sx={{ color: "#000000", fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: "#000000", fontWeight: 700 }}>
                  وثيقة إلكترونية موثقة رسمياً
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </div>
      </Paper>

      {/* Print-Only Action Button */}
      <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            borderRadius: "50px",
            px: 6,
            py: 1.5,
            bgcolor: "#000000",
            color: "#ffffff",
            "&:hover": { bgcolor: "#222222" },
            fontSize: "1.15rem",
            fontWeight: 800,
            boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.4)",
            letterSpacing: 0.5,
          }}
        >
          طباعة الوثيقة الرسمية
        </Button>
      </Stack>
    </Box>
  );
};

export default StudentFormalAffidavit;
