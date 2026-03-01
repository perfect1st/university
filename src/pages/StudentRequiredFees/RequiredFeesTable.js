import { Box, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, Paper } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';

export default function RequiredFeesTable({ rows, isInSideYemen }) {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    // حساب الإجمالي باستخدام reduce أفضل من map
    const total = rows?.reduce((acc, it) => {
        return acc + (isInSideYemen ? (it?.inside_yemen_value || 0) : (it?.outside_yemen_value || 0));
    }, 0) || 0;

    return (
            <Box sx={{ my: 2, width: "100%", }}>
    
    
                <TableContainer sx={{
                    width: "100%",
                 
                    maxWidth: "90vw",
                    overflowX: "auto", // ✅ لو الأعمدة كتيرة بيعمل scroll تلقائي
    
    
                    whiteSpace: "nowrap" // يمنع تكسير الصفوف
                }} component={Paper}>
                <Table size="small" sx={{ minWidth: 400 }}> {/* minWidth يضمن عدم انضغاط البيانات بشكل قبيح */}
                    <TableHead
                        sx={{
                            backgroundColor: theme.palette.primary?.tabelHeader || "#e0e0e0",
                        }}
                    >
                        <TableRow>
                            <TableCell sx={{ textAlign: "start", fontWeight: 700 }}>
                                {t("fee.table.reason")}
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    width: 140,
                                    textAlign: isArabic ? "left" : "right", // تصحيح اتجاه المحاذاة للرأس
                                }}
                            >
                                {t("fee.table.amount")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((it, idx) => (
                            <TableRow key={idx}>
                                <TableCell sx={{ textAlign: "start", fontWeight: 600 }}>
                                    {isArabic ? it?.title_ar : it?.title_en}
                                </TableCell>
                                <TableCell
                                    sx={{ textAlign: isArabic ? "left" : "right" }}
                                >
                                    {(isInSideYemen ? it?.inside_yemen_value : it?.outside_yemen_value)?.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* صف الإجمالي */}
                        <TableRow sx={{ backgroundColor: "#F39A15" }}>
                            <TableCell sx={{ textAlign: "start", fontWeight: 800, color: "white" }}>
                                {t("total")} {/* يفضل استخدام مفتاح total بدلاً من إعادة amount */}
                            </TableCell>
                            <TableCell
                                sx={{ textAlign: isArabic ? "left" : "right", fontWeight: 800, color: "white" }}
                            >
                                {total?.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
          
                      {/* <Button
                          variant="contained"
                          onClick={handleAddRow}
                          sx={{ my: 2, backgroundColor: theme.palette.info.main, gap: "5px", padding: "5px" }}
                      >
                          {t("Dashboard.addSubject")}
          
                          <ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />
                      </Button> */}
                  </Box>
    )
}