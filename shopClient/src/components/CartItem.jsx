import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import QuantitySetter from "./QuantitySetter";
import { useDispatch ,useSelector} from "react-redux";
import { removeProduct } from "../store/cartSlice";
import { selectProductTotal } from "../store/cartSelector";

function CartItem({ product ,index}) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeProduct({ id: product.id }));
  };

  const productTotal = useSelector(state =>
  selectProductTotal(state, product.id)
);
  return (
    <Box
      sx={{
        /* borderBottom: "1px solid #ddd",*/
        padding: 1,
        mb: 0,
        width: "100%",
         backgroundColor: index % 2 === 0 ? '#E1D9D1' : '#F8F0E3'
      }}
    >
      {/* Top row: product name + delete button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          flexWrap: "wrap",
         
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            flex: "1 1 auto",
            minWidth: 0,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            color:"#513B1C",
            fontWeight:"bold"
          }}
        >
          {product.name}
        </Typography>
        <IconButton size="small" onClick={handleRemove}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* QuantitySetter row */}
      <Box sx={{ mb: 1 }}>
        <QuantitySetter product={product} showInCart={true} />
      </Box>

      {/* Total row */}
      <Box>
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
          color="#513B1C"
        >
          Total: ${ (productTotal).toFixed(2) }
        </Typography>
      </Box>
    </Box>
  );
}

export default CartItem;
