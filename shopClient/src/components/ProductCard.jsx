import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from "@mui/material";
import { memo } from "react";

function ProductCard({ product }) {
  const { title, price, imageUrl } = product;

  return (
    <Box sx={{ width: { xs: "100%", sm: 200, md: 250 } }}>
      <Card
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",       // keeps the card square
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image takes 60% of the height */}
        <Box sx={{ height: "50%", overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Content takes remaining 40% */}
        <CardContent
          sx={{
            flexGrow: 0,
            p: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle1" noWrap gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="primary" gutterBottom>
            ${price.toFixed(2)}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 1 }}>
          <Button size="small" variant="contained" fullWidth>
            View
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default memo(ProductCard);
