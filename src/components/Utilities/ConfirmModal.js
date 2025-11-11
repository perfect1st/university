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

 

export default function ConfirmModal({
    dialogOpen, setDialogOpen
}) {
    const theme=useTheme();

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
                  {/* {t("fee.paymentMethodsTitle")} */}
                </Typography>
    
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                 
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  variant="contained"
                //   onClick={async () => {
                //     console.log("paymentOBJ", data);
    
                //     if (method == "")
                //       return notify(t("fee.paymentRequired"), "error");
    
                //     if (method == "BANK_TRANSFER" && bankTransferDocument == null)
                //       return notify(t("fee.documentRequired"), "error");
    
                //     let paymentOBJ = {
                //       id: data.id,
                //       payment_method_type: method,
                //       transaction_type_id: "68fdce917bb1890cd9720a60",
                //       amount: parseFloat(total_payment),
                //     };
    
                //     console.log("paymentOBJ", paymentOBJ);
    
                //     if (method == "BANK_TRANSFER")
                //       paymentOBJ.payment_document_file = bankTransferDocument;
    
                 
    
                //     console.log("result", result);
    
                
    
                //     setDialogOpen(false);
                //   }}
                >
                save
                </Button>
              </DialogActions>
            </Dialog>
  )
}
