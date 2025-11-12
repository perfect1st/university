import { Button, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';


export default function SubmitButton({loading,t}) {
  return (
     <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1, mb: 2, py: 1.5, display: "flex", gap: 0.5 }}
              disabled={loading}
            >
    
              {
                loading ? <CircularProgress
                  size={26}
                  thickness={8}
                  sx={{ color: "#fff" }}
                />
                  :
                  <>
                    {t("form.save")} <SaveIcon sx={{}} />
                  </>
              }
    
            </Button>
  )
}
