import { Box, Button, Grid, LinearProgress, Typography, useTheme } from '@mui/material';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import i18n from "../../i18n/i18n";



export default function UploadFileField({
    title,
    subTitle,
    fileInputRef,
    handleFileChange,
    handlePickFile,
    selectedToShowFile,
    progress
}) {
    const theme=useTheme();

  return (
   <Grid item xs={12} sx={{my:5}}>
             <Typography variant="subtitle2">
               {title}
             </Typography>
   
             <Box
               sx={{
                 width: "100%",
                 border: `2px dashed ${theme.palette.secondary.main}`,
                 p: 2,
                 mt: 1,
                 borderRadius: 1,
               }}
             >
               <Typography variant="body2">
                 {/* {t("admissions.certificateDescription")} */}
               </Typography>
               <Box
                 sx={{
                   display: "flex",
                   justifyContent: "center",
                   mt: 2,
                   gap: 2,
                   flexDirection: "column",
                   alignItems: "center",
                 }}
               >
                 <input
                   ref={fileInputRef}
                   type="file"
                   hidden
                   onChange={handleFileChange}
                 // value={selectedFile}
                 />
                 <Button
                   variant="contained"
                   sx={{
                     background: theme.palette.secondary.main,
                     width: "150px",
                     gap: 1,
                   }}
                   endIcon={
                     <AddCircleOutlineIcon
                       sx={{
                         transform:
                           i18n.language === "ar"
                             ? "rotate(180deg)"
                             : "none",
                         transition: "transform 0.3s ease",
                       }}
                     />
                   }
                   onClick={handlePickFile}
                 >
                    {subTitle}
                   {/* {t("admissions.addFile")} */}
                 </Button>
                 <Typography
                   variant="body2"
                   sx={{ alignSelf: "center" }}
                 >
                   {selectedToShowFile ? selectedToShowFile : ""}
                 </Typography>
   
               </Box>
   
                 {progress > 0 && (
                                   <LinearProgress variant="determinate" value={progress} />
                                 )}
             
             </Box>
           </Grid>
  )
}
