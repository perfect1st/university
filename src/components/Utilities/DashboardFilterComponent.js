import { Box, Button, Grid, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import CustomTextFieldAdmin, { CustomSelect } from './CustomTextField'
import { useSearchParams } from 'react-router-dom';

export default function DashboardFilterComponent({ t, placeholder, onFilterChange, textSearchField, statusKey , TrueOrFalseArr , selectKey }) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(() => searchParams.get("search") || "");
  const [statusSearch, setStatusSearch] = useState(() => searchParams.get("status") || "0");

  return (
    <Grid container sx={{ my: 2, gap: 2, display: "flex", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
      <Grid item xs={6} md={8}>
        <CustomTextFieldAdmin value={searchValue} setValue={setSearchValue} height={"40px"} placeholder={placeholder} />
      </Grid>

      <Grid item xs={4} md={3}>
        <Box sx={{ display: "flex", gap: 1 }}>

          {
            statusKey && <CustomSelect t={t} value={statusSearch} setValue={setStatusSearch} height={"40px"}>
              <MenuItem value="0">{t("Status")}</MenuItem>
              {
                TrueOrFalseArr?.map((el, i) => (
                  <MenuItem key={i} value={el}>{t(el)}</MenuItem>
                ))
              }
            </CustomSelect>
          }

          <CustomSelect t={t} value={statusSearch} setValue={setStatusSearch} height={"40px"}>
            <MenuItem value="0">{t("Status")}</MenuItem>
            {
              TrueOrFalseArr?.map((el,i)=>(
                <MenuItem key={i} value={el}>{t(el)}</MenuItem>
              ))
            }
          </CustomSelect>

          <Button
            onClick={() => {
              console.log("statusSearch", statusSearch);

              let filterOBJ = {};
              if (searchValue) filterOBJ[textSearchField] = searchValue;
              if (statusSearch !== "0") filterOBJ[statusKey] = statusSearch;

              onFilterChange(filterOBJ);
            }}
            variant="contained"
            sx={{ background: theme.palette.info?.main, gap: 1 }}
          > {t("Search")}</Button>

          <Button
            onClick={() => setSearchParams({})}
            variant="outlined"
            color="error"
          > {t("Cancel")} </Button>
        </Box>

      </Grid>


    </Grid>
  )
}
