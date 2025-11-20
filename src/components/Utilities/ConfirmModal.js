import { 
    Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
 } from "@mui/material"
import { useTranslation } from "react-i18next";

 

export default function ConfirmModal({
    dialogOpen, setDialogOpen,title,content,onClickAction
}) {
    const theme=useTheme();
    const { t } = useTranslation();

  return (
     <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle
                sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}
              >
                
              </DialogTitle>
              <DialogContent>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
                 {title}
                </Typography>
    
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                 {content}
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  variant="contained"
                  onClick={()=>onClickAction()}
                >
                {t("submit")}
                </Button>
              </DialogActions>
            </Dialog>
  )
}
