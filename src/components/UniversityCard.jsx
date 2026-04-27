import React, { useRef } from "react";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";
import useBaseImageUrl from "../hooks/useBaseImageUrl";

const UniversityCard = ({ studentData, registrationData }) => {
  const cardRef = useRef(null);
  const theme = useTheme();
  const baseImageUrl = useBaseImageUrl();

  const handlePrint = () => {
    const content = cardRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>University Card</title>
          <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 0; }
            body { 
              margin: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              width: 100%;
              background: #fff;
            }
            .id-card {
              box-shadow: none !important;
              border: 1px solid #333 !important;
            }
            ${getStyles()}
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="card-content">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const element = cardRef.current;
    const opt = {
      margin: 0,
      filename: `University_Card_${studentData?.fullname || "Student"}.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 4, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const getStyles = () => `
    .id-card {
      width: 320px;
      height: 520px;
      border: 1.5px solid #333;
      border-radius: 25px;
      padding: 0;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      font-family: 'Arial', sans-serif;
      box-sizing: border-box;
      direction: ltr;
      overflow: hidden;
    }
    .punch-hole {
      width: 60px;
      height: 15px;
      border: 1px solid #333;
      border-radius: 4px;
      margin-top: 15px;
    }
    .header-text {
      width: 100%;
      padding-right: 20px;
      text-align: right;
      font-size: 10px;
      font-weight: bold;
      line-height: 1.2;
      margin-top: 5px;
    }
    .logo-section {
      text-align: center;
      width: 100%;
      margin-top: 5px;
    }
    .logo-img {
      width: 100px;
      height: auto;
    }
    .univ-names-container {
      width: 85%;
      margin: 0 auto;
    }
    .univ-name-ar {
      font-weight: bold;
      font-size: 14px;
      color: #1a4a72;
      margin: 0;
    }
    .univ-name-en {
      font-weight: bold;
      font-size: 7px;
      color: #1a4a72;
      letter-spacing: 0.5px;
      margin-top: -2px;
    }
    .card-label-section {
      text-align: center;
      margin-top: 5px;
    }
    .card-label-ar {
      font-weight: bold;
      font-size: 11px;
      margin: 0;
    }
    .card-label-en {
      font-size: 10px;
      margin: 0;
    }
    .photo-box {
      width: 90px;
      height: 110px;
      margin-top: 5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .barcode-section {
      text-align: center;
      margin-top: 5px;
      width: 100%;
    }
    .barcode-font {
      font-family: 'Libre Barcode 128', cursive;
      font-size: 45px;
      margin: 0;
      line-height: 1;
    }
    .reg-no-below-barcode {
      font-size: 9px;
      letter-spacing: 4px;
      font-weight: bold;
      margin-top: 2px;
    }
    .info-table {
      width: 100%;
      margin-top: 10px;
      border-top: 1px solid #333;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 10px;
      border-bottom: 0.5px solid #ccc;
      font-size: 11px;
      height: 22px;
    }
    .bg-colored {
      background-color: #b8d1d8;
    }
    .label-en {
      // width: 80px;
      text-align: left;
      font-weight: 500;
    }
    .value {
      flex: 1;
      text-align: center;
      font-weight: bold;
      font-size: 10px;
    }
    .label-ar {
      // width: 70px;
      text-align: right;
      font-weight: bold;
    }
    .footer-note {
      margin-top: auto;
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      width: 100%;
      color: #333;
    }
  `;

  const registrationNo = studentData?.serial || "---";

  const studentFullName = registrationData
    ? `${registrationData.first_name || ""} ${registrationData.second_name || ""} ${registrationData.third_name || ""} ${registrationData.fourth_name || ""}`.trim()
    : studentData?.fullname;

  return (
    <Box sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        University Student Card
      </Typography>

      <Box
        ref={cardRef}
        sx={{
          backgroundColor: "#fff",
          p: 0,
          borderRadius: "25px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          border: "1px solid #eee",
        }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet" />
        <style>{getStyles()}</style>
        <div className="id-card">
          <div className="punch-hole"></div>

          <div className="header-text">
            <div>الجمهورية اليمنية</div>
            <div>وزارة التعليم العالي</div>
          </div>

          <div className="logo-section">
            <img src="https://uas.edu.ye/Logo.png" alt="University Logo" className="logo-img" />
            <div className="univ-names-container">
              <div className="univ-name-ar">جامعة العلوم الأكاديمية</div>
              <div className="univ-name-en">UNIVERSITY OF ACADEMIC SCIENCES</div>
            </div>
          </div>

          <div className="card-label-section">
            <div className="card-label-ar">البطاقة الجامعية</div>
            <div className="card-label-en">university card</div>
          </div>

          <div className="photo-box">
            <img
              src={studentData?.profile_image ? `${baseImageUrl}${studentData.profile_image}` : "/profile.jpg"}
              alt="Student"
              onError={(e) => { e.target.src = "https://via.placeholder.com/110x135?text=Photo" }}
            />
          </div>

          <div className="barcode-section">
            <div className="barcode-font">{registrationNo}</div>
            <div className="reg-no-below-barcode">{registrationNo}</div>
          </div>

          <div className="info-table">
            <div className="info-row bg-colored">
              <span className="label-en">Name:</span>
              <span className="value">{studentData?.fullname || studentFullName || "---"}</span>
              {/* <span className="value">{studentFullName || "---"}</span> */}
              <span className="label-ar">:الأسم</span>
            </div>
            <div className="info-row">
              <span className="label-en">College:</span>
              <span className="value">{registrationData?.faculty_id?.title_ar || "---"}</span>
              <span className="label-ar">:كلية</span>
            </div>
            <div className="info-row bg-colored">
              <span className="label-en">Level:</span>
              <span className="value">{registrationData?.academyTerm_id?.current_year || "---"}</span>
              <span className="label-ar">:المستوى</span>
            </div>
            <div className="info-row">
              <span className="label-en">Specialty:</span>
              <span className="value">{registrationData?.faculty_department_id?.title_ar || "---"}</span>
              <span className="label-ar">:التخصص</span>
            </div>
            <div className="info-row bg-colored">
              <span className="label-en">Start Date:</span>
              <span className="value">
                {registrationData?.createdAt
                  ? new Date(Number(registrationData.createdAt)).getFullYear()
                  : "2024"}
              </span>
              <span className="label-ar">:عام الالتحاق</span>
            </div>
            <div className="info-row">
              <span className="label-en">Reg No.:</span>
              <span className="value">{registrationNo}</span>
              <span className="label-ar">:رقم التسجيل</span>
            </div>
          </div>

          <div className="footer-note">
            يمنع استخدام البطاقة لغير حاملها شخصيا
          </div>
        </div>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 3, gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ borderRadius: "50px", px: 4, bgcolor: "#1a4a72", gap: 1 }}
        >
          Print Card
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ borderRadius: "50px", px: 4, color: "#1a4a72", borderColor: "#1a4a72", gap: 1 }}
        >
          Download PDF
        </Button>
      </Stack>
    </Box>
  );
};

export default UniversityCard;
