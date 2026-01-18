import { Grid ,Box} from "@mui/material";
import ProductCard from "./ProductCard";
import { useTheme, useMediaQuery } from '@mui/material';

function ProductsGrid({ products }) {

 const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

const PAGE_SIZE = import.meta.env.VITE_PRODUCTS_PAGE_SIZE;

 const placeholders = Array.from({ length: PAGE_SIZE - products.length }, (_, i) => i);
  return (
    <Grid
      container
      spacing={2}
       justifyContent="center"
       sx={{
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: "10px"
  }}
    >
      {products.map((product) => (
        <Grid
          item
          key={product.id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <ProductCard product={product} />
        </Grid>
      ))}

       {!isMobile && placeholders.map((i) => (
          <Box key={i} sx={{ visibility: "hidden" }}>
              <ProductCard  product={products[0]} />
        </Box>
      ))}

        
    </Grid>
  );
}

export default ProductsGrid;
