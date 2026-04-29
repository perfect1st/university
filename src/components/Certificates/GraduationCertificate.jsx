import React, { useRef } from 'react';
import { useQuery } from '@apollo/client/react';
import { Box, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Barcode from 'react-barcode';
// GraphQL & Assets
import { GET_SINGLE_USER } from '../../graphql/userQueriesForAdmin';
import universityLogo from '../../assets/Logo.png';
import rigth3lines from '../../assets/rigth3lines.png';
import left3lines from '../../assets/left3lines.png';
import bottomImage from '../../assets/bottomImage.png';
import useBaseImageUrl from '../../hooks/useBaseImageUrl';

const GraduationCertificate = ({ studentId }) => {
  const certificateRef = useRef();
  const baseImageUrl = useBaseImageUrl();
  const { data: { user } = {}, loading } = useQuery(GET_SINGLE_USER, {
    variables: { id: studentId },
    fetchPolicy: "network-only",
    skip: !studentId, 
  });

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    
    // Temporarily make the element visible to capture it
    element.style.display = 'block';
    
    try {
        const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Graduation_Certificate_${user?.fullname || 'Student'}.pdf`);
    } finally {
        element.style.display = 'none'; 
    }
  };

  if (!studentId) return <Typography color="error">No Student ID provided.</Typography>;
  if (loading) return <CircularProgress />;
  if (!user) return <Typography>User not found.</Typography>;

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Button 
        variant="contained" 
        startIcon={<DownloadIcon />}
        onClick={handleDownloadPDF}
        sx={{ bgcolor: '#0f2038', color: 'white', px: 4, py: 1.5, '&:hover': { bgcolor: '#1a365d' } }}
      >
        Download Graduation Certificate
      </Button>

      {/* HIDDEN PDF CONTAINER */}
      <Box sx={{ overflow: 'hidden', height: 0, width: 0, position: 'absolute', top: -9999, left: -9999 }}>
        <Box
          ref={certificateRef}
          dir="ltr" // <--- CRITICAL FIX: Forces the entire layout to stay Left-to-Right
          sx={{
            width: '1123px',
            height: '700px',
            bgcolor: 'white',
            color: '#000',
            position: 'relative',
            boxSizing: 'border-box',
            border: '18px solid #0f2038', 
            fontFamily: 'Noto Sans Arabic, Times New Roman", Times, serif',
            display: 'none', 
          }}
        >
          {/* DECORATIVE IMAGES (Absolute Positioning) */}
          <Box component="img" src={left3lines} sx={{ position: 'absolute', top: '103px', right: '1px', width: '500px', zIndex: 1 }} />
          <Box component="img" src={rigth3lines} sx={{ position: 'absolute', top: '103px', left: '1px', width: '500px', zIndex: 1 }} />
          <Box component="img" src={bottomImage} sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '140px', zIndex: 1 }} />

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
                <Typography variant="body2" sx={{fontFamily: 'Noto Sans Arabic, Arial, sans-serif'}}>الجمهورية اليمنية</Typography>
                <Typography variant="body2" sx={{fontFamily: 'Noto Sans Arabic, Arial, sans-serif'}}>وزارة التعليم العالي</Typography>
                <Typography variant="body2" sx={{fontFamily: 'Noto Sans Arabic, Arial, sans-serif'}}>عضو في اتحاد الجامعات العربية</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold',fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>جامعة العلوم الأكاديمية الافتراضية</Typography>
                <Typography variant="body2" sx={{fontFamily: 'Noto Sans Arabic, Arial, sans-serif'}}>حضرموت</Typography>
              </Box>
            </Stack>

            {/* TITLE & PHOTO STRIP */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 4, mb: 3 }}>
               <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '36px', width: '360px', textAlign: 'left',mt:5 }}>
                 Graduation Certificate
               </Typography>
               
               <Box 
                  component="img" 
                  src={user?.profile_image ? `${baseImageUrl}${user.profile_image}` : 'https://via.placeholder.com/150'} 
                  sx={{ width: '150px', height: '170px', objectFit: 'cover', border: '1px solid #000', bgcolor: '#fff', zIndex: 3, mt:-5 }} 
               />

               <Typography dir="rtl" variant="h5" sx={{ fontWeight: 600, fontSize: '45px', fontFamily: 'Noto Sans Arabic', width: '360px', textAlign: 'right',mt:5 }}>
                 وثيقـة تخرج
               </Typography>
            </Stack>

            {/* MAIN TEXT BODY */}
            <Stack direction="row" spacing={4} sx={{ flexGrow: 1, px: 2 }}>
              {/* English Paragraph */}
              <Box sx={{ flex: 1, textAlign: 'center', fontSize: '16px', lineHeight: 1.2, fontFamily: 'Arial, sans-serif' }}>
                Upon the Resolution of UAS Council No. <br/>
                the student <Box component="span" sx={{ fontWeight: 'bold', fontSize: '20px' }}>Mr. {user.fullname}</Box><br/>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Yemeni</Box> nationality who was enrolled at this University<br/>
                in the academic year {user.register_form_id?.education_year || '2019 / 2020'} corresponding to<br/>
                registration No. ( {user.serial || '...'} ) has graduated from the College of<br/>
                {user.faculty_id?.title_en || 'Engineering and Computer science'} with a<br/>
                <Box component="span" sx={{ fontWeight: 'bold', fontSize: '20px' }}>Bachelor's degree in {user.register_form_id?.study_place || 'Information Systems'}</Box><br/>
                in 2022 / 2023 with a cumulative grade of<br/>
                <Box component="span" sx={{ fontWeight: 'bold', fontSize: '20px' }}>"Very Good".</Box>
              </Box>

              {/* Arabic Paragraph */}
              <Box dir="rtl" sx={{ flex: 1, textAlign: 'center', fontSize: '18px', lineHeight: 1.2, fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>
                بناءً على قرار مجلس جامعة العلوم الأكاديمية رقم<br/>
                (...) ، فإن الطالب / <Box component="span" sx={{ fontWeight: 'bold' }}>{user.fullname}</Box> ، يمني<br/>
                الجنسية، والذي التحق بالجامعة في العام الدراسي<br/>
                1441/0441 هـ الموافق 0202/9102م، وبرقم<br/>
                قيد ( {user.serial || '...'} )، حصل على درجة البكالوريوس من كلية<br/>
                {user.faculty_id?.title_ar || 'الهندسة وعلوم الحاسوب'} ، تخصص: <Box component="span" sx={{ fontWeight: 'bold' }}>نظم المعلومات</Box>،<br/>
                للعام الجامعي 4441/3441 هـ الموافق<br/>
                2022/2023م، وبتقدير: <Box component="span" sx={{ fontWeight: 'bold' }}>جيد جداً</Box>.
              </Box>
            </Stack>

            {/* FOOTER (Signatures & Barcode) */}
            {/* Added pb: 8 to push this up so it doesn't overlap the bottom graphic */}
           {/* FOOTER SECTION */}
<Box sx={{ mt: 'auto', px: 4, pb: 2, position: 'relative' }}>
  
  {/* Signatures Row: President on Left, Dean on Right */}
  <Stack 
    direction="row" 
    justifyContent="space-between" 
    alignItems="flex-end" 
    sx={{ my: 3, px: 2 }}
  >
    {/* Left Side: University President */}
    <Box sx={{ textAlign: 'center', width: '250px', mt:2 }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'Noto Sans Arabic, Arial' }}>
        رئيس الجامعة
      </Typography>
      <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
        (University President)
      </Typography>
    </Box>

    {/* Right Side: Dean */}
    <Box sx={{ textAlign: 'center', width: '250px', mt:2 }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'Noto Sans Arabic, Arial' }}>
        عميد الكلية
      </Typography>
      <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
        (Dean)
      </Typography>
    </Box>
  </Stack>

  {/* Barcode: Absolute positioned at the very bottom left corner */}
<Box sx={{ 
    position: 'absolute', 
    bottom: '-25px', // Adjusted to sit nicely above the very bottom edge
    right: '15px',  // Moved to the RIGHT side as requested
    textAlign: 'center',
    zIndex: 5 
}}>
    <Barcode 
        value={user?.serial || '1034578451125'} 
        format="CODE128" // Standard scannable format
        width={1.2}      // Thickness of bars
        height={15}      // Height of bars
        displayValue={true} // Shows the serial number text underneath the bars
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
    </Box>
  );
};

export default GraduationCertificate;