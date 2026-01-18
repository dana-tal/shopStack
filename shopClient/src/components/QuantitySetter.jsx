import { CardActions,IconButton,Box} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


import { updateProduct, removeProduct } from "../store/cartSlice"; 
import { selectProductById } from "../store/cartSelector";
import { useDispatch,useSelector} from "react-redux";


function QuantitySetter({ product, showInCart= false}) {

    const dispatch = useDispatch();

    const sizes = showInCart ? { btnW: 32, btnH: 28, qtyH: 28, qtyMinW: 28, gap: 0.5 }: { btnW: 48, btnH: 32, qtyH: 32, qtyMinW: 36, gap: 1 };

    const storeProduct = useSelector(state =>
        selectProductById(state, product.id)
    );
    const cartProduct = storeProduct ?? { id: product.id, price:product.price, quantity:0,name:product.title,inStock:product.inStock };

   

    const quantity = cartProduct.quantity;
    const inStock = cartProduct.inStock;

  const handleIncrement = () => 
  {
    if (quantity < inStock) 
    {
      const newQuantity = quantity +1;
      dispatch(updateProduct({id: cartProduct.id, price: cartProduct.price, quantity:newQuantity,name:cartProduct.name, inStock:cartProduct.inStock}))
    }
  };

  
  const handleDecrement = () => {
    if (quantity > 0) 
    {
       const newQuantity = quantity - 1;
       if (newQuantity===0)
       {
          dispatch(removeProduct({id: cartProduct.id}))
       }
       else
       {
          dispatch(updateProduct({id: cartProduct.id, price: cartProduct.price, quantity:newQuantity,name:cartProduct.name,inStock:cartProduct.inStock}));
       }
    }
  };



  return (
    <CardActions
          sx={{
            p: 1,
            pt: 0,
            minHeight: 0,
            mt: 0.5,
            justifyContent: "center",
            gap: sizes.gap,
          }}
        >
                {/* Decrement Button */}
          <IconButton
            size="small"
            onClick={handleDecrement}
            disabled={quantity === 0}
            sx={{
             width: sizes.btnW,
              height: sizes.btnH,        
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
            <RemoveIcon fontSize={showInCart ? "small" : "medium"} />
          </IconButton>



          {/* Quantity Label */}
          <Box
            sx={{
              minWidth: sizes.qtyMinW,
              height:  sizes.qtyH,
              borderRadius: 2, // rounded corners
              border: "1px solid",
              borderColor: "grey.400",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: showInCart ? 1 : 1.5,
              fontWeight: "bold",
              bgcolor: "background.paper",
              fontSize: showInCart ? "0.85rem" : "1rem",
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
                 width: sizes.btnW,
              height: sizes.btnH,         
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
            <AddIcon  fontSize={showInCart ? "small" : "medium"} />
          </IconButton>
        </CardActions>
  )
}

export default QuantitySetter