import { Box, Typography, Drawer, useMediaQuery, IconButton } from "@mui/material";
import { useState } from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import CustomButton from "./CustomButton";
import { requestOrderPlace } from "../utils/orderRequests";
import { useDispatch} from "react-redux";
import { resetCart } from "../store/cartSlice"; 
import {  useNavigate } from "react-router-dom";


function Cart() {
  const [open, setOpen] = useState(false);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const info = useSelector((state) => state.auth);
  const myCart = useSelector( (state)=> state.cart);


console.log( "cart products");
console.log(myCart.cartProducts);
console.log("totalPrice",myCart.totalPrice);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOrder = async () =>{

      setError(null);
      setLoading(true);
      try
      {
          const orderInfo = { total: myCart.totalPrice, products:Object.values(myCart.cartProducts) };
          console.log("orderInfo:");
          console.log(orderInfo);
          console.log( "userId:"+info.userData.id);

          const res = await requestOrderPlace(info.userData.id,orderInfo);
          if (res.ok)
          {
              const orderId = res.data.orderData.id;
              console.log('success, orderId:'+orderId);
              console.log(res);
               dispatch(resetCart()); // empty the cart 
               navigate('/store/thankyou',  { state: { orderId: orderId } }); // navigate the user to a thank you page 
          }
          else
          {
              throw new Error(res.message);
          }
      }
      catch(err)
      {
          setError('Failed to place order: '+err.message);
      }
      finally 
      {
        setLoading(false);
      }
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
          mb: 0,
          flexWrap: "wrap",
         }}>
          <Typography   variant="body2"
            fontWeight="bold"
            sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" }, mb:0 }}
            color="#513B1C">Total:${myCart.totalPrice}</Typography>

            <CustomButton clickHandler={handleOrder}   label={loading ? 'Processing...' : 'Order'} disabled={loading} bgColor="#3B9C9C" textTransform='none'/>

           

          </Box>
           {error && (<Typography color="error" variant="body2" sx={{ mt: 0 ,backgroundColor:"#EDC9AF" ,p:1}}>
                    {error}
              </Typography>
            )}
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
