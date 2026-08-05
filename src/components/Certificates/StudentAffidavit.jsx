/**
 * @file StudentAffidavit.jsx
 * @description Component for displaying and printing a formal Student Enrollment Affidavit (إفادة قيد طالب).
 * Header position: Republic info on Right, Logo in Center, Metadata on Left.
 * Single A4 page fit, all-black text, print-only.
 *
 * @module Certificates/StudentAffidavit
 *
 * @param {Object} props - Component props.
 * @param {Object} [props.studentData] - General student profile data.
 * @param {Object} [props.registrationData] - Detailed academic registration data.
 *
 * @returns {JSX.Element} The rendered affidavit preview with Print action button.
 */

import React, { useRef } from "react";
import { Box, Typography, Button, Stack, Divider, Paper, Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import universityLogo from "../../assets/Logo.png";

const StudentAffidavit = ({ studentData, registrationData }) => {
  /** Reference to the document preview DOM element */
  const printRef = useRef(null);

  // Extract full name from registrationData or fallback to studentData
  const studentFullName = registrationData
    ? `${registrationData.first_name || ""} ${registrationData.second_name || ""} ${registrationData.third_name || ""} ${registrationData.fourth_name || ""}`.trim()
    : studentData?.fullname || "غير محدد";

  // Academic metadata with safe fallbacks
  const faculty = registrationData?.faculty_id?.title_ar || studentData?.faculty || "كلية العلوم الأكاديمية";
  const department = registrationData?.faculty_department_id?.title_ar || studentData?.department || "القسم العام";
  const registrationNo = registrationData?.user_id?.qid_number || studentData?.serial || "ــ";
  const academicYear = registrationData?.academyTerm_id?.current_year || new Date().getFullYear().toString();
  const documentRefNo = `AFF-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  /**
   * Opens a print-optimized window rendering the affidavit in standard A4 portrait layout.
   */
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>إفادة قيد طالب - ${studentFullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
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
              background-color: #fff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .certificate-frame {
              width: 100%;
              max-width: 800px;
              height: 98vh;
              margin: 0 auto;
              padding: 30px 40px;
              border: 3px double #000000;
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
              width: 420px;
              pointer-events: none;
              z-index: 0;
              filter: grayscale(100%);
            }
            .content-layer {
              position: relative;
              z-index: 1;
            }
            .header-table {
              width: 100%;
              margin-bottom: 25px;
              border-bottom: 2px solid #000000;
              padding-bottom: 15px;
            }
            .header-title {
              font-size: 19px;
              font-weight: 800;
              color: #000000;
            }
            .header-subtitle {
              font-size: 13px;
              color: #000000;
              font-weight: 600;
            }
            .doc-title-container {
              text-align: center;
              margin: 25px 0;
            }
            .doc-title {
              font-size: 28px;
              font-weight: 800;
              color: #000000;
              display: inline-block;
              padding-bottom: 6px;
              border-bottom: 3px solid #000000;
            }
            .body-text {
              font-size: 19px;
              line-height: 2.3;
              text-align: justify;
              margin: 25px 0;
              color: #000000;
              font-weight: 600;
            }
            .highlight-text {
              font-weight: 900;
              color: #000000;
              padding: 0 4px;
            }
            .disclaimer {
              font-size: 14px;
              color: #000000;
              font-style: italic;
              margin-top: 20px;
              font-weight: 600;
            }
            .footer-section {
              margin-top: 35px;
              width: 100%;
            }
            .footer-table {
              width: 100%;
            }
            .sig-title {
              font-size: 15px;
              font-weight: 800;
              color: #000000;
              margin-bottom: 45px;
            }
            .sig-line {
              width: 170px;
              margin: 0 auto;
              border-top: 1px solid #000000;
            }
            .stamp-box {
              width: 90px;
              height: 90px;
              border: 2px dashed #000000;
              border-radius: 50%;
              margin: 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              color: #000000;
              font-weight: 700;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="certificate-frame">
            <img src="${universityLogo}" class="watermark" alt="Watermark" />
            <div class="content-layer">
              <table class="header-table">
                <tr>
                  <!-- RIGHT COLUMN: Republic Title -->
                  <td style="width: 35%; text-align: right; vertical-align: top;">
                    <div class="header-title">الجمهورية اليمنية</div>
                    <div class="header-subtitle">وزارة التعليم العالي والبحث العلمي</div>
                    <div class="header-title" style="font-size: 16px; margin-top: 3px;">جامعة العلوم الأكاديمية</div>
                  </td>
                  <!-- CENTER COLUMN: Emblem -->
                  <td style="width: 30%; text-align: center; vertical-align: top;">
                    <img src="${universityLogo}" alt="Logo" style="height: 65px; filter: grayscale(100%);" />
                  </td>
                  <!-- LEFT COLUMN: Metadata -->
                  <td style="width: 35%; text-align: left; vertical-align: top; font-size: 13px; color: #000000; line-height: 1.8; font-weight: 600;">
                    <div><strong>الرقم المرجعي:</strong> &rlm;<span dir="ltr">${documentRefNo}</span></div>
                    <div><strong>رقم القيد:</strong> &rlm;<span dir="ltr">${registrationNo}</span></div>
                    <div><strong>تاريخ الإصدار:</strong> ${issueDate}</div>
                  </td>
                </tr>
              </table>

              <div class="doc-title-container">
                <div class="doc-title">إفــــادة قــيــد طــالــب</div>
              </div>

              <div class="body-text">
                تفيد جامعة العلوم الأكاديمية بأن الطالب/ـة 
                <span class="highlight-text">${studentFullName}</span> 
                مقيد بكلية <span class="highlight-text">${faculty}</span> 
                قسم <span class="highlight-text">${department}</span> 
                برقم قيد <span class="highlight-text">${registrationNo}</span> 
                لعام <span class="highlight-text">${academicYear}</span>، ويسير في دراسته وفق النظم واللوائح الأكاديمية المتبعة بالجامعة.
              </div>

              <div class="body-text">
                أعطيت له هذه الإفادة بناءً على طلبه لتقديمها إلى من يهمه الأمر دون أدنى مسؤولية على الجامعة فيما يتعلق بالتزاماته الشخصية أو المالية.
              </div>

              <div class="disclaimer">
                * هذه الوثيقة رسمية ومعتمدة إلكترونياً، ويمكن التحقق من صحتها من خلال الرمز الضوئي المرفق.
              </div>
            </div>

            <div class="footer-section">
              <table class="footer-table">
                <tr>
                  <td style="width: 33%; text-align: center;">
                    <div class="sig-title">تاريخ الإصدار</div>
                    <div style="font-size: 15px; font-weight: 700; color: #000000;">${issueDate}</div>
                  </td>
                  <td style="width: 34%; text-align: center;">
                    <div class="sig-title">ختم الجامعة</div>
                    <div class="stamp-box">مساحة الختم</div>
                  </td>
                  <td style="width: 33%; text-align: center;">
                    <div class="sig-title">مسجل عام الجامعة</div>
                    <div class="sig-line"></div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Box sx={{ my: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {/* Printable Preview Frame */}
      <Paper
        elevation={4}
        sx={{
          backgroundColor: "#fff",
          p: { xs: 2.5, md: 5 },
          borderRadius: "10px",
          border: "2px solid #000000",
          width: "100%",
          maxWidth: "800px",
          minHeight: "680px",
          direction: "rtl",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div ref={printRef}>
          {/* Subtle Watermark Background */}
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
            <img src={universityLogo} alt="Watermark" style={{ width: "400px", filter: "grayscale(100%)" }} />
          </Box>

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Header Metadata & Emblem */}
            <Grid container alignItems="center" spacing={2} sx={{ pb: 2, borderBottom: "2px solid #000000", mb: 3 }}>
              {/* RIGHT SIDE: Republic Title */}
              <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "right" } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000" }}>
                  الجمهورية اليمنية
                </Typography>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", fontWeight: 600 }}>
                  وزارة التعليم العالي والبحث العلمي
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000", mt: 0.5 }}>
                  جامعة العلوم الأكاديمية
                </Typography>
              </Grid>

              {/* CENTER: Emblem Logo */}
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <img src={universityLogo} alt="University Logo" style={{ height: "65px", objectFit: "contain", filter: "grayscale(100%)" }} />
              </Grid>

              {/* LEFT SIDE: Metadata */}
              <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", fontWeight: 600 }}>
                  <strong>الرقم المرجعي:</strong> &rlm;<span dir="ltr">{documentRefNo}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", mt: 0.5, fontWeight: 600 }}>
                  <strong>رقم القيد:</strong> &rlm;<span dir="ltr">{registrationNo}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#000000", display: "block", mt: 0.5, fontWeight: 600 }}>
                  <strong>تاريخ الإصدار:</strong> {issueDate}
                </Typography>
              </Grid>
            </Grid>

            {/* Document Title Banner */}
            <Box sx={{ textAlign: "center", my: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#000000",
                  display: "inline-block",
                  px: 3,
                  pb: 1,
                  borderBottom: "3px solid #000000",
                  fontSize: { xs: "1.5rem", md: "2.1rem" },
                  letterSpacing: 0.5,
                }}
              >
                إفــــادة قــيــد طــالــب
              </Typography>
            </Box>

            {/* Preamble Statement (Seamless Traditional Format - No Underline) */}
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.25rem",
                lineHeight: 2.3,
                textAlign: "justify",
                color: "#000000",
                my: 3,
                fontWeight: 600,
              }}
            >
              تفيد جامعة العلوم الأكاديمية بأن الطالب/ـة{" "}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {studentFullName}
              </Box>{" "}
              مقيد بكلية{" "}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {faculty}
              </Box>{" "}
              قسم{" "}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {department}
              </Box>{" "}
              برقم قيد{" "}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {registrationNo}
              </Box>{" "}
              لعام{" "}
              <Box component="span" sx={{ fontWeight: 900, color: "#000000", px: 0.5 }}>
                {academicYear}
              </Box>
              ، ويسير في دراسته وفق النظم واللوائح الأكاديمية المتبعة بالجامعة.
            </Typography>

            {/* Closing Legal Disclaimer */}
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.15rem",
                lineHeight: 2.1,
                textAlign: "justify",
                color: "#000000",
                mt: 2,
                mb: 3,
                fontWeight: 600,
              }}
            >
              أعطيت له هذه الإفادة بناءً على طلبه لتقديمها إلى من يهمه الأمر دون أدنى مسؤولية على الجامعة فيما يتعلق بالتزاماته الشخصية أو المالية.
            </Typography>

            {/* Verification Notice */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, p: 1.2, bgcolor: "#f5f5f5", borderRadius: "6px" }}>
              <VerifiedUserIcon sx={{ color: "#000000", fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: "#000000", fontWeight: 600 }}>
                وثيقة معتمدة صدق عليها إلكترونياً بدون الحاجة لختم يدوي في حال التحقق عبر الرمز الضوئي المعتمد.
              </Typography>
            </Stack>

            <Divider sx={{ my: 3, borderColor: "#000000" }} />

            {/* Official Signatures & Seal Section */}
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2, px: 2 }}>
              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000" }}>
                  تاريخ الإصدار
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 700, color: "#000000" }}>
                  {issueDate}
                </Typography>
              </Grid>

              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000", mb: 1 }}>
                  ختم الجامعة
                </Typography>
                <Box
                  sx={{
                    width: 85,
                    height: 85,
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
                  مساحة الختم
                </Box>
              </Grid>

              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#000000" }}>
                  مسجل عام الجامعة
                </Typography>
                <Box sx={{ mt: 5, width: 140, mx: "auto", borderTop: "2px solid #000000" }} />
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>

      {/* Action Control Button - Print Only */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            borderRadius: "50px",
            px: 6,
            py: 1.4,
            bgcolor: "#000000",
            color: "#ffffff",
            "&:hover": { bgcolor: "#222222" },
            fontSize: "1.1rem",
            fontWeight: 800,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
          }}
        >
          طباعة الإفادة
        </Button>
      </Stack>
    </Box>
  );
};

export default StudentAffidavit;
