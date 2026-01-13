import { Box, Typography, Drawer, useMediaQuery, IconButton } from "@mui/material";
import { useState } from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";

function Cart() {
  const [open, setOpen] = useState(false);
  
  const isSmallScreen = useMediaQuery("(max-width:600px)");

const myCart = useSelector( (state)=> state.cart);

console.log( "cart products");
console.log(myCart.cartProducts);
console.log("totalPrice",myCart.totalPrice);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const cartContent = (
    <Box sx={{ width: isSmallScreen ? '100%' : 300, padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cart
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Cart is empty
      </Typography>
    </Box>
  );

  return (
    <>
        <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1300,
          bgcolor: 'primary.main',
          color: 'white',
          width: 56,
          height: 56,
          borderRadius: '50%',
          boxShadow: 3,
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        {open ? <CloseIcon fontSize="large" /> : <ShoppingCartIcon fontSize="large" />}
      </IconButton>

      <Drawer
        anchor={isSmallScreen ? 'bottom' : 'left'}
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: isSmallScreen ? '100%' : 300,
            height: isSmallScreen ? '50%' : '100%',
          },
        }}
      >
        {cartContent}
      </Drawer>
    </>
  );
}

export default Cart;
