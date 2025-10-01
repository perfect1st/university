import React from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Pagination,
  PaginationItem,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PaginationFooter = ({ currentPage, totalPages, limit, onPageChange, onLimitChange }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePageChange = (event, value) => {
    onPageChange(event, value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Scroll to top
  };

  const handleLimitChange = (event) => {
    onLimitChange(event);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Scroll to top
  };

  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        siblingCount={1}
        boundaryCount={1}
        variant="text"
        size={isSmall ? 'small' : 'medium'}
        sx={{
          '& .MuiPaginationItem-root': {
            minWidth: 32,
            height: 32,
            borderRadius: 0,
          },
          '& .MuiPaginationItem-page.Mui-selected': {
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            background: '#fff',
          },
        }}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            components={{
              previous: ArrowBackIcon,
              next: (props) => (
                <ArrowBackIcon {...props} sx={{ transform: 'rotate(180deg)' }} />
              ),
            }}
          />
        )}
      />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Select
          size="small"
          value={limit}
          onChange={handleLimitChange}
          variant="standard"
          disableUnderline
          sx={{
            '& .MuiSelect-root': { padding: 0 },
            '& .MuiSelect-icon': { right: 0 },
            minWidth: 50,
          }}
        >
          {[5, 10, 25, 50].map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default PaginationFooter;
