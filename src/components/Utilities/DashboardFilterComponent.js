import { Box, Button, Grid, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import CustomTextFieldAdmin, { CustomSelect } from './CustomTextField'
import { useSearchParams } from 'react-router-dom';

export default function DashboardFilterComponent({ t, placeholder, onFilterChange, textSearchField, statusKey , TrueOrFalseArr , selectKey , selectOptions,select2Label,select1Label="Status" }) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(() => searchParams.get(textSearchField) || "");
  const [statusSearch, setStatusSearch] = useState(() => searchParams.get(statusKey) || "0");

  const[select2Search, setSelect2Search] = useState(() => searchParams.get(selectKey) || "0");

  return (
    <Grid container sx={{ my: 2, gap: 2, display: "flex", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" , width: isMobile ?"100%" : "100%" }}>
      <Grid item xs={8} md={8} sx={{}}>
        <CustomTextFieldAdmin  value={searchValue} setValue={setSearchValue} height={"40px"} placeholder={placeholder} />
      </Grid>

      <Grid item xs={4} md={3}>
        <Box sx={{ display: "flex", gap: 1 , flexWrap: isMobile ?   "wrap" : "nowrap" , flexDirection:"row" }}>

          {
            statusKey && <CustomSelect t={t} value={statusSearch} setValue={setStatusSearch} height={"40px"}>
              <MenuItem value="0">{t(select1Label)}</MenuItem>
              {
                TrueOrFalseArr?.map((el, i) => (
                  <MenuItem key={i} value={el}>{t(el)}</MenuItem>
                ))
              }
            </CustomSelect>
          }

          {
            selectOptions&&<CustomSelect t={t} value={select2Search} setValue={setSelect2Search} height={"40px"}>
            <MenuItem value="0">{t(select2Label)}</MenuItem>
            {
              selectOptions?.map((el,i)=>(
                <MenuItem key={i} value={el}>{t(el)}</MenuItem>
              ))
            }
          </CustomSelect>
          }
          

          <Button
            onClick={() => {
              console.log("statusSearch", statusSearch);

              let filterOBJ = {};
              if (searchValue) filterOBJ[textSearchField] = searchValue?.trim();
              if (statusSearch !== "0") filterOBJ[statusKey] = statusSearch;
              if(selectKey) filterOBJ[selectKey]=select2Search;

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
