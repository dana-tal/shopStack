
import { Dialog } from "@mui/material";

function LightBox({isOpen, onCloseCallback, children, useHistoryBack = false, backdropColor = "rgba(0,0,0,0.5)" }) {
  return (
         <Dialog
        open={isOpen}
        onClose={() => {    
            onCloseCallback?.();
            if (useHistoryBack)
            {
                window.history.back();
            }    
        }}
        
        slotProps={{
        backdrop: {
          sx: {
            backgroundColor: backdropColor
          }
        }
      }}
      >
       {children}
      </Dialog>
  )
}

export default LightBox