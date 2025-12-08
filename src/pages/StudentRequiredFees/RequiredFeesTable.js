import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';

export default function RequiredFeesTable({rows,setRows,isInSideYemen}) {
    const theme = useTheme();
    const { t } = useTranslation();

    const isArabic = i18n.language === "ar";

   // console.log("rows",rows);

    let total=0;

    rows?.map(it=>{
        total+=isInSideYemen?it?.inside_yemen_value:it?.outside_yemen_value;
    })

  return (
       <Collapse in={true} sx={{my:4}}>
            <Box sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead
                  sx={{
                    backgroundColor:
                      theme.palette.primary?.tabelHeader || "#e0e0e0",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ textAlign: "start", fontWeight: 700 }}>
                      {t("fee.table.reason")}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "start",
                        fontWeight: 700,
                        width: 140,
                        textAlign: "right",
                      }}
                    >
                      {t("fee.table.amount")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    backgroundColor:
                      theme.palette.background?.secDefault || "#fafafa",
                  }}
                >
                  {rows?.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ textAlign: "start", fontWeight: 600 }}>
                        {isArabic ? it?.title_ar : it?.title_en}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: `${isArabic ? "end" : "start"}` }}
                      >
                        {isInSideYemen
                          ? it?.inside_yemen_value
                          : it?.outside_yemen_value}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow sx={{backgroundColor:"#F39A15", padding:"5px"}}>
                      <TableCell sx={{ textAlign: "start", fontWeight: 800  }}>
                        {t("fee.table.amount")}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: `${isArabic ? "end" : "start"}` ,  fontWeight: 800 }}
                      >
                       {total}
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
  )
}
