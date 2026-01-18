import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box ,IconButton} from "@mui/material";
import QuantitySetter from "./QuantitySetter";
import { memo} from "react";

function ProductCard({ product }) {

  const { title, price, imageUrl, inStock, soldUnits } = product;

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

         <QuantitySetter product={product} />
       
      </Card>
    </Box>
  );
}

export default memo(ProductCard);
