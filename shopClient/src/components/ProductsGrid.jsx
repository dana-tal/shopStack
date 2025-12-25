import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

function ProductsGrid({ products }) {
  return (
    <Grid
      container
      spacing={2}
       justifyContent="center"
      sx={{
        maxWidth: 1200,
        marginLeft: "auto",
        marginRight: "auto",
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
    </Grid>
  );
}

export default ProductsGrid;
