import { Box, Button, Grid, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import CustomTextFieldAdmin, { CustomSelect } from './CustomTextField'

export default function DashboardFilterComponent({t}) {

    const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Grid container sx={{ my: 2, gap: 2 ,display: "flex",flexWrap: "wrap" ,flexDirection: isMobile ? "column" : "row" }}>
                <Grid item xs={6} md={8}>
                  <CustomTextFieldAdmin searchKey={"name_ar"} height={"40px"} />
                </Grid>
    
                <Grid item xs={4} md={3}>
                  <Box sx={{display:"flex",gap:2}}>
                    <CustomSelect t={t} label={t("Status")} height={"40px"}>
                           <MenuItem value="eg">مصر</MenuItem>
                            <MenuItem value="sa">Saudi Arabia</MenuItem>
                            <MenuItem value="ae">UAE</MenuItem>
                    </CustomSelect>
                    <Button variant="contained" sx={{ background: theme.palette.info?.main, gap: 1 }}> بحث</Button>
                    <Button variant="outlined"color="error"> الغاء </Button>
                  </Box>
                
                </Grid>
    
    
              </Grid>
  )
}
