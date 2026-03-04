import React, { useState } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import i18n from "../../../i18n/i18n";

export default function BookCard({ book, baseURL, t }) {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const isArabic = i18n.language === "ar";
    const title = isArabic ? book.title_ar : book.title_en;

    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                position: 'relative',
                width: '100%',
                height: 400,
                perspective: '2000px', // عمق الرؤية
                cursor: 'pointer',
            }}
        >
            {/* 1. الصفحات الداخلية (المحتوى الذي يظهر عند الفتح) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 10, bottom: 10, left: 5, right: 10,
                    bgcolor: '#fff',
                    borderRadius: isArabic ? '0 4px 4px 0' : '4px 0 0 4px',
                    zIndex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.05), 5px 5px 15px rgba(0,0,0,0.1)',
                }}
            >
                {/* معاينة المحتوى بدون Scrollbars أو Toolbar */}
                <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
                    {book.file && (
                        <iframe
                            src={`${baseURL}${book.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                            style={{ 
                                width: '100%', 
                                height: '110%', // زيادة الطول لإخفاء الهوامش
                                border: 'none', 
                                marginTop: '-10%', // إزاحة للأعلى لإخفاء الـ Header الخاص بالـ PDF
                                pointerEvents: 'none' 
                            }}
                            title={title}
                        />
                    )}
                    {/* طبقة حماية شفافة فوق الـ iframe لمنع التفاعل المباشر */}
                    <Box sx={{ position: 'absolute', inset: 0, zIndex: 2 }} />
                </Box>

                {/* زر الحركة أسفل الصفحة الداخلية */}
                <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<MenuBookIcon />}
                        onClick={() => window.open(`${baseURL}${book.file}`, '_blank')}
                        sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 'bold' , gap:1 }}
                    >
                        {isArabic ? "تصفح الكتاب" : "Read Book"}
                    </Button>
                </Box>
            </Box>

            {/* 2. غلاف الكتاب (الجزء المتحرك) */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    transition: 'all 0.9s cubic-bezier(0.645, 0.045, 0.355, 1)',
                    transformOrigin: isArabic ? 'left' : 'right',
                    transform: isHovered ? 'rotateY(-120deg)' : 'rotateY(0deg)',
                    backfaceVisibility: 'hidden',
                    borderRadius: isArabic ? '0 12px 12px 0' : '12px 0 0 12px',
                    overflow: 'hidden',
                    background: `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: isHovered 
                        ? '20px 20px 50px rgba(0,0,0,0.3)' 
                        : '5px 5px 20px rgba(0,0,0,0.2)',
                }}
            >
                {/* تأثير كعب الكتاب الذهبي/الفضي */}
              {!isArabic &&  <Box sx={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, width: '40px',
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.15) 50%, rgba(0,0,0,0.3) 100%)',
                    borderRight: isArabic ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    borderLeft: isArabic ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    zIndex: 4,
                }} />}
                {/* تأثير كعب الكتاب الذهبي/الفضي */}
               {isArabic && <Box sx={{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0, width: '40px',
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.15) 50%, rgba(0,0,0,0.3) 100%)',
                    borderRight: isArabic ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    borderLeft: isArabic ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    zIndex: 4,
                }} />}
                <Box sx={{ 
                    p: 4, ml: '40px', height: '100%', 
                    display: 'flex', flexDirection: 'column', 
                    justifyContent: 'center', alignItems: 'center', 
                    textAlign: 'center', color: 'white' 
                }}>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 900, mb: 2, 
                        fontFamily: 'serif',
                        textShadow: '2px 4px 6px rgba(0,0,0,0.3)' 
                    }}>
                        {title}
                    </Typography>
                    
                    <Box sx={{ w: '50px', h: '2px', bgcolor: 'secondary.main', my: 2, width: 60, height: 3 }} />
                    
                    <Typography variant="h6" sx={{ opacity: 0.8, fontStyle: 'italic', fontWeight: 300 }}>
                        {book.author_name}
                    </Typography>

                    {/* شعار صغير في أسفل الغلاف */}
                    <Box sx={{ mt: 'auto', opacity: 0.5 }}>
                        <MenuBookIcon sx={{ fontSize: 40 }} />
                    </Box>
                </Box>
            </Box>

            {/* 3. تأثير "حزمة الورق" الجانبي */}
            <Box sx={{
                position: 'absolute',
                top: 12, bottom: 12, right: -2, width: '12px',
                background: 'repeating-linear-gradient(to bottom, #fff, #fff 2px, #e0e0e0 3px)',
                borderRadius: '0 4px 4px 0',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                zIndex: 0,
            }} />
        </Box>
    );
}