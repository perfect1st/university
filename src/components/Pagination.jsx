import React from 'react';
import { Box, Pagination as MuiPagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const handleChange = (event, value) => {
    onPageChange(value);
  };

  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 4,
        mb: 2,
        direction: isRtl ? 'rtl' : 'ltr'
      }}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'text.primary',
            margin: '0 4px',
          },
          '& .Mui-selected': {
            backgroundColor: '#00AEE9 !important',
            color: 'white',
            '&:hover': {
              backgroundColor: '#00AEE9',
            },
          },
          '& .MuiPaginationItem-page:hover': {
            backgroundColor: 'rgba(0, 174, 233, 0.1)',
          },
        }}
      />
    </Box>
  );
};

export default Pagination; 