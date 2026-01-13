import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box ,IconButton} from "@mui/material";
import { memo, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { updateProduct, removeProduct } from "../store/cartSlice"; 
import { useDispatch, useSelector } from "react-redux";


function ProductCard({ product }) {

    const dispatch = useDispatch();
//  const count = useSelector((state) => state.counter.value);
  const allProducts = useSelector( (state)=> state.cart.cartProducts);
  let cartProduct ;
  if ( allProducts.hasOwnProperty(product.id))
  {
       cartProduct = allProducts[product.id];
  } 
  else
  {
      cartProduct = { id: product.id, price:product.price, quantity:0,name:product.title};
  }
  const quantity = cartProduct.quantity;


  const { title, price, imageUrl, inStock, soldUnits } = product;
//  const [quantity, setQuantity] = useState(0);

   const handleIncrement = () => 
  {
    if (quantity < inStock) 
    {
      const newQuantity = quantity +1;
     // setQuantity(newQuantity);
      dispatch(updateProduct({id: product.id, price: product.price, quantity:newQuantity,name:product.title}))
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) 
    {
       const newQuantity = quantity - 1;
       //setQuantity(newQuantity);
       if (newQuantity===0)
       {
          dispatch(removeProduct({id: product.id}))
       }
       else
       {
          dispatch(updateProduct({id: product.id, price: product.price, quantity:newQuantity,name:product.title}));
       }
    }
  };


  return (
    <Box sx={{ width: { xs: "90%", sm: 200, md: 220, lg:230 } }}   >
      <Card
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",       // keeps the card square
          display: "grid",
          gridTemplateRows: "1.3fr auto auto", 
          minHeight:0,
          marginLeft:{xs:"20px", sm:0,md:0}
        }}
      >
        {/* Image takes 60% of the height */}
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              minHeight:0,
            }}
          />
       
       <CardContent sx={{ p: 1, pb: 0, minHeight: 0, overflow: "hidden" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gridTemplateRows: "auto auto",
            rowGap: 0.25,
            columnGap: 1,
            alignItems: "center",
          }}
        >
          {/* Row 1 */}
          <Typography variant="subtitle2" noWrap sx={{ lineHeight: 1.2 }}>
            {title}
          </Typography>

          <Typography variant="caption" sx={{ lineHeight: 1.1 }}>
            In stock: {inStock}
          </Typography>

          {/* Row 2 */}
          <Typography variant="body2" color="primary" sx={{ lineHeight: 1.2 }}>
            ${price.toFixed(2)}
          </Typography>

          <Typography variant="caption" sx={{ lineHeight: 1.1 }}>
            Sold: {soldUnits}
          </Typography>
        </Box>
      </CardContent>

          <CardActions
          sx={{
            p: 1,
            pt: 0,
            minHeight: 0,
            mt: 0.5,
            justifyContent: "center",
            gap: 1,
          }}
        >
                {/* Decrement Button */}
          <IconButton
            size="small"
            onClick={handleDecrement}
            disabled={quantity === 0}
            sx={{
              width: 48,          // wider
              height: 32,         
              borderRadius: 1,    // rounded corners
              bgcolor: quantity === 0 ? "primary.light" : "primary.main",
              color: "white !important",
              "&:hover": {
                bgcolor: quantity === 0 ? "primary.light" : "primary.dark",
              },
              "&.Mui-disabled": {   // override MUI disabled style
                bgcolor: "primary.light",
                color: "white !important",
                opacity: 1,         // prevent disappearing
              },
            }}
          >
            <RemoveIcon />
          </IconButton>



          {/* Quantity Label */}
          <Box
            sx={{
              minWidth: 36,
              height: 32,
              borderRadius: 2, // rounded corners
              border: "1px solid",
              borderColor: "grey.400",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1.5,
              fontWeight: "bold",
              bgcolor: "background.paper",
            }}
          >
            {quantity}
          </Box>

          {/* Increment Button */}
          
          <IconButton
              size="small"
              onClick={handleIncrement}
              disabled={quantity >= inStock}
              sx={{
                width: 48,          // wider
                height: 32,         
                borderRadius: 1,
                bgcolor: quantity >= inStock ? "primary.light" : "primary.main",
                color: "white !important",
                "&:hover": {
                  bgcolor: quantity >= inStock ? "primary.light" : "primary.dark",
                },
                "&.Mui-disabled": {
                  bgcolor: "primary.light",
                  color: "white !important",
                  opacity: 1,
                },
              }}
            >
            <AddIcon />
          </IconButton>
        </CardActions>

       
      </Card>
    </Box>
  );
}

export default memo(ProductCard);
