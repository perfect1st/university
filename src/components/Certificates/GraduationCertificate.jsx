import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { Box, Typography, Button, Stack, CircularProgress, IconButton } from '@mui/material';
import { Download as DownloadIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Barcode from 'react-barcode';
// GraphQL & Assets
import { GET_ACADEMIC_TRANSCRIPT } from '../../graphql/studentDegreeQueries';
import universityLogo from '../../assets/Logo.png';
import rigth3lines from '../../assets/rigth3lines.png';
import left3lines from '../../assets/left3lines.png';
import bottomImage from '../../assets/bottomImage.png';
import sealImage from '../../assets/seal.png';
import useBaseImageUrl from '../../hooks/useBaseImageUrl';
import DocumentSignaturesFooter from '../DocumentSignaturesFooter';
import { baseURL } from '../../Api/apolloClient';
import { useTranslation } from 'react-i18next';

const GraduationCertificate = ({ ticketId, studentId, studentData }) => {
  const { t } = useTranslation();
  const certificateRef = useRef();
  const containerRef = useRef();
  const [scale, setScale] = useState(0.60);
  const baseImageUrl = useBaseImageUrl();

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width || containerRef.current.clientWidth;
        // Account for margins and sidebar breathing room
        const availableWidth = Math.max(300, containerWidth - 48);
        // User requested smaller preview so it fits comfortably beside sidebar:
        // Set maximum scale to 0.60 on desktop so it is compact and fits comfortably,
        // and scale down proportionally on smaller screens.
        const calculatedScale = Math.min(0.60, Math.max(0.35, availableWidth / 1123));
        setScale(Number(calculatedScale.toFixed(3)));
      }
    };

    updateScale();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateScale();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);
  const { data, loading, error } = useQuery(GET_ACADEMIC_TRANSCRIPT, {
    variables: { student_id: studentId },
    fetchPolicy: "network-only",
    skip: !studentId,
  });

  const transcript = data?.getAcademicTranscript || (studentData ? {
    student: {
      fullname: studentData.nameAr || studentData.nameEn,
      is_inside_yemen: studentData.nationalityEn === "Yemeni" || studentData.nationalityAr === "يمني",
      qid_number: studentData.registrationNo,
      serial: studentData.barcodeNumber || "1034578451125",
      profile_image: studentData.studentPhoto && !studentData.studentPhoto.includes("placeholder") ? studentData.studentPhoto : null,
    },
    faculty: { title_ar: studentData.collegeAr, title_en: studentData.collegeEn },
    faculty_department: { title_ar: studentData.majorAr, title_en: studentData.majorEn },
    overall_grade: studentData.gradeAr || studentData.gradeEn,
  } : null);
  const user = transcript?.student;

  const getHijriYearFromGregorian = (gregorianYear) => {
    // ننشئ تاريخاً في منتصف السنة الميلادية لضمان الدقة
    const date = new Date(gregorianYear, 6, 1);

    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric'
    }).format(date).replace(/\u200f/g, '').replace(' هـ', '');
  };

  let enrollmentYear = studentData?.academicYear || "2022/2023";
  let graduationYear = studentData?.graduationYear || "2023/2024";

  if (transcript?.levels && transcript.levels.length > 0) {
    const sortedLevels = [...transcript.levels].sort((a, b) => a.study_year - b.study_year);

    // Find first level term with a current_year
    for (const lvl of sortedLevels) {
      const year = lvl.terms?.find(t => t.term?.current_year)?.term?.current_year;
      if (year) {
        enrollmentYear = year;
        break;
      }
    }

    // Find last level term with a current_year
    for (let i = sortedLevels.length - 1; i >= 0; i--) {
      const year = sortedLevels[i].terms?.find(t => t.term?.current_year)?.term?.current_year;
      if (year) {
        graduationYear = year;
        break;
      }
    }
  }

  const startYear = parseInt(enrollmentYear.split('/')[0]) || 2022;
  const endYear = startYear + 1;

  const gradStartYear = parseInt(graduationYear.split('/')[0]) || 2023;
  const gradEndYear = gradStartYear + 1;

  const hijriStartYear = getHijriYearFromGregorian(startYear);
  const hijriEndYear = getHijriYearFromGregorian(endYear);

  const hijriGradStart = getHijriYearFromGregorian(gradStartYear);
  const hijriGradEnd = getHijriYearFromGregorian(gradEndYear);

  const getEnglishGrade = (arabicGrade) => {
    if (!arabicGrade) return "Very Good";
    if (arabicGrade.includes("ممتاز")) return "Excellent";
    if (arabicGrade.includes("جيد جداً")) return "Very Good";
    if (arabicGrade.includes("جيد")) return "Good";
    if (arabicGrade.includes("مقبول")) return "Pass";
    if (arabicGrade.includes("راسب")) return "Fail";
    return "Fail";
  };

  console.log("transcript", transcript);

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    const prevTransform = element.style.transform;
    element.style.transform = 'none';

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      element.style.transform = prevTransform;

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Graduation_Certificate_${user?.fullname || 'Student'}.pdf`);
    } catch (error) {
      element.style.transform = prevTransform;
      console.error("PDF Error:", error);
    }
  };

  if (!studentId && !studentData) return <Typography color="error">No Student ID provided.</Typography>;
  if (loading && !studentData) return <CircularProgress />;
  if (error && !studentData) return <Typography color="error">Error loading transcript: {error.message}</Typography>;
  if (!transcript || !user) return <Typography>User not found.</Typography>;

  const isFailed = transcript?.overall_grade === "راسب" || (typeof transcript?.overall_average === "number" && transcript?.overall_average < 50);

  if (false) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Box sx={{ p: 4, borderRadius: 3, bgcolor: "#fff5f5", border: "1px solid #feb2b2", maxWidth: 600, mx: "auto", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.1)" }}>
          <Typography variant="h6" sx={{ color: "#991b1b", fontWeight: 800, mb: 1 }}>
            عفواً، لا يمكن إصدار وثيقة تخرج
          </Typography>
          <Typography variant="body1" sx={{ color: "#b91c1c", fontWeight: 600 }}>
            الطالب لم يستوفِ شروط النجاح والتخرج (النتيجة الأكاديمية: راسب).
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, textAlign: 'center', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPDF}
          sx={{ bgcolor: '#0f2038', color: 'white', px: 3, py: 1.2, fontWeight: 600, '&:hover': { bgcolor: '#1a365d' } }}
        >
          {t("Download Graduation Certificate")}
        </Button>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: 2 }}>
          <IconButton 
            size="small" 
            onClick={() => setScale(prev => Math.max(0.35, Number((prev - 0.05).toFixed(2))))} 
            title="تصغير"
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: '42px', textAlign: 'center', fontSize: '0.8rem' }}>
            {Math.round(scale * 100)}%
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setScale(prev => Math.min(1.0, Number((prev + 0.05).toFixed(2))))} 
            title="تكبير"
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* RESPONSIVE PREVIEW CONTAINER */}
      <Box 
        ref={containerRef}
        sx={{ 
          width: '100%', 
          maxWidth: '100%',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: 3, 
          mb: 4,
          overflow: 'hidden' 
        }}
      >
        <Box
          sx={{
            width: `${1123 * scale}px`,
            height: `${700 * scale}px`,
            position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            borderRadius: 1,
            overflow: 'hidden',
            transition: 'width 0.2s ease, height 0.2s ease',
          }}
        >
          <Box
            ref={certificateRef}
            dir="ltr"
            sx={{
              width: '1123px',
              height: '700px',
              bgcolor: 'white',
              color: '#000',
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              boxSizing: 'border-box',
              border: '18px solid #0f2038', 
              fontFamily: 'Noto Sans Arabic, Times New Roman, Times, serif',
            }}
          >
            {/* DECORATIVE IMAGES (Absolute Positioning) */}
            <Box component="img" src={left3lines} sx={{ position: 'absolute', top: '103px', right: '1px', width: '500px', zIndex: 1 }} />
            <Box component="img" src={rigth3lines} sx={{ position: 'absolute', top: '103px', left: '1px', width: '500px', zIndex: 1 }} />
            <Box component="img" src={bottomImage} sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '153px', zIndex: 1 }} />

            {/* CONTENT WRAPPER */}
            <Box sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', p: '20px' }}>

              {/* HEADER */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box sx={{ textAlign: 'center', fontSize: '8px', lineHeight: 0.8, width: '280px' }}>
                  <Typography variant="body2" >Republic of Yemen</Typography>
                  <Typography variant="body2" >MINISTRY OF HIGHER EDUCATION</Typography>
                  <Typography variant="body2" >Member of the Association of Arab Universities</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>VIRTUAL UNIVERSITY OF ACADEMIC SCIENCES</Typography>
                  <Typography variant="body2" >Hadhramout</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mt: -7 }}>
                  <Box component="img" src={universityLogo} sx={{ width: '450px', height: "190px", objectFit: 'contain' }} />
                </Box>

                {/* ARABIC HEADER: Notice dir="rtl" is applied ONLY to the text, not the layout */}
                <Box dir="rtl" sx={{ textAlign: 'center', fontSize: '12px', lineHeight: 0.8, width: '280px', fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>الجمهورية اليمنية</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>وزارة التعليم العالي</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>عضو في اتحاد الجامعات العربية</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>جامعة العلوم الأكاديمية الافتراضية</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>حضرموت</Typography>
                </Box>
              </Stack>

              {/* TITLE & PHOTO STRIP */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 4, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '32px', width: '360px', textAlign: 'left', mt: 3 }}>
                  Graduation Certificate
                </Typography>

                {/* PHOTO CONTAINER */}
                <Box sx={{ position: 'relative', width: '150px', height: '170px', mt: -7, zIndex: 4 }}>
                  <Box
                    component="img"
                    src={user?.profile_image ? `${baseImageUrl}${user.profile_image}` : 'https://via.placeholder.com/150'}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #000', bgcolor: '#fff', display: 'block' }}
                  />
                </Box>

                <Typography dir="rtl" variant="h5" sx={{ fontWeight: 600, fontSize: '40px', fontFamily: 'Noto Sans Arabic', width: '360px', textAlign: 'right', mt: 3 }}>
                  وثيقـة تخرج
                </Typography>
              </Stack>

            {/* MAIN TEXT BODY */}
            <Stack direction="row" spacing={4} sx={{ flexGrow: 1, px: 1 }}>
              {/* English Paragraph */}
              <Box sx={{ flex: 1, textAlign: 'center', fontSize: '18px', lineHeight: 1.2, fontFamily: 'Arial, sans-serif' }}>
                Upon the Resolution of UAS Council No. <br />
                the student <Box component="span" sx={{ fontWeight: 'bold', fontSize: '18px' }}>Mr. {user.fullname}</Box><br />
                <Box component="span" sx={{ fontWeight: 'bold' }}>{user.is_inside_yemen ? "Yemeni" : "Non-Yemeni"}</Box> nationality who was enrolled at this University<br />
                in the academic year {`${startYear} / ${endYear}`} corresponding to<br />
                registration No. ( {user.qid_number || '...'} ) has graduated from the College of<br />
                {transcript.faculty?.title_en || 'Engineering and Computer science'} with a<br />
                <Box component="span" sx={{ fontWeight: 'bold', fontSize: '18px' }}>Bachelor's degree in {transcript.faculty_department?.title_en || 'Information Systems'}</Box><br />
                in {`${gradStartYear} / ${gradEndYear}`} with a cumulative grade of<br />
                <Box component="span" sx={{ fontWeight: 'bold', fontSize: '18px' }}>"{getEnglishGrade(transcript.overall_grade)}".</Box>
              </Box>

              {/* Arabic Paragraph */}
              <Box dir="rtl" sx={{ flex: 1, textAlign: 'center', fontSize: '18px', lineHeight: 1.2, fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>
                بناءً على قرار مجلس جامعة العلوم الأكاديمية رقم<br />
                (...) ، فإن الطالب / <Box component="span" sx={{ fontWeight: 'bold' }}>{user.fullname}</Box> ، {user?.is_inside_yemen ? "يمني الجنسية" : "غير يمني الجنسية"}<br />
                والذي التحق بالجامعة في العام الدراسي<br />
                {`${hijriStartYear} / ${hijriEndYear}`} هـ الموافق {`${startYear} / ${endYear}`} وبرقم<br />
                قيد ( {user.qid_number || '...'} )، حصل على درجة البكالوريوس من كلية<br />
                {transcript.faculty?.title_ar || 'الهندسة وعلوم الحاسوب'} ، تخصص: <Box component="span" sx={{ fontWeight: 'bold' }}>{transcript.faculty_department?.title_ar || 'نظم المعلومات'}</Box>،<br />
                للعام الجامعي {`${hijriGradStart} / ${hijriGradEnd}`} هـ الموافق<br />
                {`${gradStartYear} / ${gradEndYear}`}م، بتقدير: <Box component="span" sx={{ fontWeight: 'bold' }}>{transcript.overall_grade || 'جيد جداً'}</Box>.
              </Box>
            </Stack>

            {/* FOOTER (Signatures & Barcode) */}
            {/* Added pb: 8 to push this up so it doesn't overlap the bottom graphic */}
            {/* FOOTER SECTION (Empty for spacing) */}
            <Box sx={{ mt: 'auto' }} />

          </Box>

          {/* ABSOLUTE POSITIONED ELEMENTS (Signatures & Barcode) */}
          {ticketId && (
            <DocumentSignaturesFooter
              ticketId={ticketId}
              render={(steps) => (
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '140px', zIndex: 10 }}>
                  {steps.map((step, index) => {
                    // Determine position based on index (assuming 3 signatures max typically)
                    let positionProps = {};
                    if (index === 0) {
                      // Left signature (مدير شؤون الطلاب)
                      positionProps = { left: '14%', bottom: '5px' };
                    } else if (index === 1) {
                      // Middle signature (رئيس الجامعة)
                      positionProps = { left: '50%', bottom: '35px', transform: 'translateX(-50%)' };
                    } else if (index === 2) {
                      // Right signature (عميد الكلية)
                      positionProps = { right: '14%', bottom: '5px' };
                    }

                    return (
                      <Box key={step.id} sx={{ position: 'absolute', textAlign: 'center', width: '180px', ...positionProps }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.9rem', lineHeight: 1.2 }}>
                          {step.type_sequence_id?.job_title_id?.name_ar || step.type_sequence_id?.job_title_id?.name_en || 'المسؤول'}
                        </Typography>

                        {step.user_id?.signature ? (
                          <Box sx={{ height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', my: 0.5 }}>
                            <img
                              src={step.user_id.signature.startsWith('http') ? step.user_id.signature : `${baseURL}${step.user_id.signature.startsWith('/') ? '' : '/'}${step.user_id.signature}`}
                              alt="Signature"
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          </Box>
                        ) : (
                          <Box sx={{ height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                              No Signature
                            </Typography>
                          </Box>
                        )}

                        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.2 }}>
                          {step.user_id?.fullname}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            />
          )}

          {/* OFFICIAL UNIVERSITY SEAL (Positioned in Bottom-Left Corner where user drew the blue circle) */}
          <Box
            component="img"
            src={sealImage}
            alt="University Seal"
            style={{
              position: 'absolute',
              bottom: '0px',
              left: '20px',
              width: '110px',
              height: '110px',
              objectFit: 'contain',
              zIndex: 12,
              pointerEvents: 'none',
              transform: 'rotate(-6deg)',
              filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.2))',
            }}
          />

          {/* BARCODE (Positioned in Bottom-Right Corner) */}
          <Box 
            style={{ 
              position: 'absolute', 
              bottom: '20px', 
              right: '35px', 
              zIndex: 10, 
              textAlign: 'center' 
            }}
          >
            <Barcode
              value={user?.serial || '1034578451125'}
              format="CODE128"
              width={1.2}
              height={15}
              displayValue={true}
              fontSize={12}
              font="monospace"
              background="transparent"
              lineColor="#000"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
  );
};

export default GraduationCertificate;