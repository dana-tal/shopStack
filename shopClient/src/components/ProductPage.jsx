import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cart from "./Cart";
import QuantitySetter from "./QuantitySetter";

import {Container,Grid,Typography,Box,CardMedia,Chip,Stack,Divider,Paper} from "@mui/material";
import { requestProductById, requestProdcutRecommendations } from "../utils/productRequests";
import Skeleton from "@mui/material/Skeleton";

const ProductPage = () => {

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    useEffect(() => {
        const fetchProduct = async (id) => 
        {
            const response = await requestProductById(id);
            if (response.ok) {
                setProduct(response.data.productData);
            }
        };
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    useEffect( ()=>{
           
        const fetchRecommendations = async ( name )=>
        {
            setLoadingRecommendations(true);
             const response = await requestProdcutRecommendations(name);
             if (response.ok)
             {
                setRecommendations(response.data.productData);
             }
            setLoadingRecommendations(false);
        }
          
        if (product && product.title)
        {
            fetchRecommendations(product.title)
        }

    }, [product]);

    if (!product) 
    {
        return (
            <Container sx={{ py: 5 }}>
                <Typography>
                    Loading...
                </Typography>
            </Container>
        );
    }


    const {title,price,imageUrl,long_desc,soldUnits,inStock} = product;

    const Recommendations = () => (
        <Box sx={{ mt: 3, width: "100%",maxWidth: 420 }}>
          {!loadingRecommendations &&   <Typography variant="h6" fontWeight={600} mb={2} >
                You may also like - AI-powered recommendations:
            </Typography> }

           {!loadingRecommendations && <Stack spacing={1}>
                {recommendations.map((item, index) => (
                    <Paper key={item.name} variant="outlined" sx={{ p: 1.5, cursor: "pointer", "&:hover": { backgroundColor: "action.hover"} }}>
                        <Typography variant="body2" color="primary">
                            <a href={item.link} target="_blank">{item.name}</a>
                        </Typography>
                    </Paper>
                ))}
            </Stack>}

            {loadingRecommendations &&  <Stack spacing={1}>
                <Typography variant="h6" fontWeight={600} mb={2} >
                    Finding the best AI recommendations for you...
                </Typography>

                {[1, 2, 3].map((item) => (
                    <Paper key={item} variant="outlined" sx={{ p: 1.5 }}>
                        <Skeleton variant="text" width="90%" />
                    </Paper>
                ))}
            </Stack>}
        </Box>
    );


    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Title */}
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 3, fontSize: { xs: "1.8rem", md: "2.3rem"} }}>
                {title}
            </Typography>
            <Grid container spacing={4}>

                {/* Left column for desktop . For desktop it will contain the image and "products you may like" list under it. For mobile, just the image */}
                <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {/* Product Image */}
                    <Box sx={{ width: "100%", maxWidth: 420, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <CardMedia component="img" image={imageUrl} alt={title} sx={{ width: "100%", height: { xs: 280,md: 380}, objectFit: "contain" }}/>
                    </Box>

                    {/* products you may like for desktop */}
                    <Box sx={{ display: { xs: "none", md: "block"}, width: "100%"}}>
                        { recommendations && <Recommendations /> }
                    </Box>
                </Grid>

                {/* Product Details , right column for desktop */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Stack spacing={3}>
                        {/* Price */}
                        <Typography variant="h4" color="primary" fontWeight={700}>
                            ${price}
                        </Typography>

                        {/* Status */}
                        <Stack direction="row" spacing={2}>
                            <Chip label={inStock? "In Stock": "Out of Stock"} color={inStock? "success": "error"} />
                            <Chip label={`${soldUnits} sold`} variant="outlined"/>
                        </Stack>

                        {/* Add To Cart buttons (+,-) */}
                        <Box  sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                            <QuantitySetter product={product} />
                        </Box>

                        <Divider />

                        <Box>
                            {/* Long Description */}
                            <Typography variant="h5" fontWeight={600} mb={2}>
                                Description
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: "pre-line"  }}>
                                {long_desc}
                            </Typography>

                            {/* "products you may like"  list for mobile */}
                            <Box sx={{ display: {xs: "block", md: "none"} }}>
                                { recommendations && <Recommendations /> }
                            </Box>
                        </Box>
                    </Stack>
                </Grid>


            </Grid>
            <Cart />
        </Container>

    );
};

export default ProductPage;