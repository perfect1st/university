import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material"
import { useTranslation } from "react-i18next";



export default function ConfirmModal({
  dialogOpen, setDialogOpen, title, content, onClickAction, isLoading = false
}) {
  const theme = useTheme();
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
        {
          title && <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
            {title}
          </Typography>
        }


        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {content}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={async() => await onClickAction()}
        >
          {
            isLoading ? <>
              <CircularProgress size={26}
                thickness={8}
                sx={{ color: "black" }} />
            </> : t("submit")
          }

        </Button>

        <Button variant="contained" size="small" color="primary" onClick={() => {
          setDialogOpen(false);

        }}>{t("form.close")}</Button>
      </DialogActions>
    </Dialog>
  )
}
