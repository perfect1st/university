import { Box, FormControl, InputLabel, MenuItem, Pagination, Select, Stack } from '@mui/material'
import React, { useState } from 'react'

export default function FilterComponent({ totalPages = 10, onFilterChange }) {
     const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  return (
     <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
      
      {/* Pagination */}
      <Stack spacing={2}>
        <Pagination
          color="primary"
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Stack>
      
      {/* Select Limit */}
      <FormControl sx={{ width: 120 }}>
        <InputLabel>Limit</InputLabel>
        <Select
          value={limit}
          label="Limit"
          onChange={(e) => setLimit(e.target.value)}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>

      

    </Box>
  )
}
