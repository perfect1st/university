import { Box, Button, Grid, IconButton, LinearProgress, Typography, useTheme } from '@mui/material';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import i18n from "../../i18n/i18n";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";


export default function UploadFileField({
  title,
  subTitle,
  description,
  fileInputRef,
  handleFileChange,
  handlePickFile,
  selectedToShowFile,
  progress,
  isMultiple = false,
  hasDownloadBtn = false,
  handleDownloadFile,
  showInput = true
}) {
  const theme = useTheme();

  return (
    <Grid item xs={12} sx={{ my: 5 , width:"100%"}}>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 , display:"flex", gap:5 , alignItems:"center" }}>
        {title}
        {
          hasDownloadBtn && (
            <Button color='primary' variant='contained' onClick={handleDownloadFile}>
              <IconButton size="small" sx={{ color: "white" }} >
              <DownloadIcon fontSize="small" color='white' />
            </IconButton>
            </Button>
            

          )
        }

      </Typography>

      {
        showInput && <Box
          sx={{
            width: "100%",
            border: `2px dashed ${theme.palette.secondary.main}`,
            p: 2,
            mt: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            {description}
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
              multiple={isMultiple}
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
      }

    </Grid>
  )
}
