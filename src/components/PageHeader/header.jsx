import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReactComponent as ExcelIcon } from "../../assets/xsl-02.svg";
import { ReactComponent as PdfIcon } from "../../assets/pdf-02.svg";
import { ReactComponent as PrinterIcon } from "../../assets/printer.svg";
import { getUserCookie } from '../../hooks/authCookies';

const Header = ({
  title,
  subtitle,
  i18n,
  haveBtn = false,
  btn,
  btnIcon,
  onSubmit,
  isExcel = false,
  isPdf = false,
  isPrinter = false,
  onExcel,
  onPdf,
  onPrinter
}) => {
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
const user = getUserCookie()
  return (
    <Box
      component="header"
      sx={{
        direction: isRtl ? 'rtl' : 'ltr',
        display: 'flex',
        flexDirection: 'column',
        mb: 3,
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="h6">{title}</Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {subtitle}
        </Typography>

        <Box display="flex" alignItems="center" gap={1.5}>
          {haveBtn && (
            <Button
              variant="contained"
              endIcon={btnIcon}
              onClick={onSubmit}
              sx={{
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              {btn}
            </Button>
          )}
{(user?.super_admin ||user?.has_report_actions) && <>
          {isExcel && (
            <IconButton color="primary" onClick={onExcel} sx={{ p: 0.25 }}>
              <ExcelIcon width={25} height={25} />
            </IconButton>
          )}
          {isPdf && (
            <IconButton color="primary" onClick={onPdf} sx={{ p:  0.25 }}>
              <PdfIcon width={25} height={25} />
            </IconButton>
          )}
          {isPrinter && (
            <IconButton color="primary" onClick={onPrinter} sx={{ p:  0.25 }}>
              <PrinterIcon width={25} height={25} />
            </IconButton>
          )}
</>}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
