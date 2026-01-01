import { Box, FormControl, InputLabel, MenuItem, Pagination, Select, Stack, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';

export default function FilterComponent({ totalPages = 10, onFilterChange }) {
    //  const [page, setPage] = useState(1);
    // const [limit, setLimit] = useState(10);
    const [searchParams, setSearchParams] = useSearchParams();
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    let page;

    if (!searchParams.get("page")) {
        page = 1;
    }
    else {
        page = Number(searchParams.get("page"));
    }

    let limit;

    if (!searchParams.get("limit")) {
        limit = 10;
    }
    else {
        limit = Number(searchParams.get("limit"));
    }
    return (
        <Box display="flex" justifyContent={
            isMobile ? "center" : "space-between"
        } flexWrap={"wrap"} alignItems={
            isMobile ? "start" : "center"
        } sx={{ my: 2 ,
            flexDirection: isMobile ? "column" : "row",
            gap: 2
          }}>

            {/* Pagination */}
            <Stack spacing={2}>
                <Pagination
                    color="primary"
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => {
                        // setPage(value);
                        searchParams.set("page", value);
                        setSearchParams(searchParams);
                    }}
                />
            </Stack>

            {/* Select Limit */}
            <FormControl sx={{ width: 120 }}>
                <InputLabel>Limit</InputLabel>
                <Select
                    value={limit}
                    label="Limit"
                    onChange={(e) => {
                        // setLimit(e.target.value);
                        searchParams.set("limit", e.target.value);
                        searchParams.set("page", 1);
                        
                        setSearchParams(searchParams);
                    }}
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
