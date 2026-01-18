import { Box, Typography, Drawer, useMediaQuery, IconButton } from "@mui/material";
import { useState } from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import CustomButton from "./CustomButton";


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

  const handleOrder = () =>{
       console.log("handle order");
  }

  const cartContent = (
    <Box sx={{ width: isSmallScreen ? '100%' : 300, padding: 2 ,textAlign:"center"}}>
      { myCart.totalPrice >0 && <><Typography variant="h6" gutterBottom color="#513B1C" fontWeight="bold">
        Your Cart 
        </Typography>
         {
            Object.values(myCart.cartProducts).map( (cartProduct,index)=>{
                  return <CartItem key={cartProduct.id} product={cartProduct} index={index} />                
             })
         }
         <Box sx={{padding:1, backgroundColor:"#C9C0BB" ,  display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          flexWrap: "wrap",
         }}>
          <Typography   variant="body2"
            fontWeight="bold"
            sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
            color="#513B1C">Total:${myCart.totalPrice}</Typography>

            <CustomButton clickHandler={handleOrder} label="Order" bgColor="#3B9C9C" textTransform='none'/>
          </Box>
         </>
      }
      {myCart.totalPrice ===0 && <Typography variant="body2" color="#513B1C" fontWeight="bold">
       Your cart is empty
      </Typography>}
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
            background: "linear-gradient(45deg,#357EC7,#E0FFFF,#488AC7, #FFFAF0 )"
          },
        }}
      >
        {cartContent}
      </Drawer>
    </>
  );
}

export default Cart;
