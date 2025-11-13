import { Button, CircularProgress, useTheme } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';


export default function SubmitButton({loading,t}) {
   const theme = useTheme();
  return (
     <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1, mb: 2, py: 1.5, display: "flex", gap: 0.5 , backgroundColor : theme.palette.info.main }}
              disabled={loading}
            >
    
              {
                loading ? <CircularProgress
                  size={26}
                  thickness={8}
                  sx={{ 
                    color: "#fff"
                   }}
                />
                  :
                  <>
                    {t("form.save")} <SaveIcon sx={{}} />
                  </>
              }
    
            </Button>
  )
}
