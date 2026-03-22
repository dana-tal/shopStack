import { Grid ,Box} from "@mui/material";
import ProductCard from "./ProductCard";
import { useTheme, useMediaQuery } from '@mui/material';
import LightBox from "./LightBox";
import {useState} from "react";
import { requestProductOffers } from "../utils/productRequests";
import StyledTable from "./StyledTable";


function ProductsGrid({ products }) {

  const paginationModel = { page: 0, pageSize: 10 };
 const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

const PAGE_SIZE = import.meta.env.VITE_PRODUCTS_PAGE_SIZE;

const [isLightboxOpen,setIsLightBoxOpen] = useState(false);
const [rows, setRows] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [prodName, setProdName] = useState("");


const renderStoreName = (params)=>{
    return (<a href={params.row.productPageLink} target="_blank" rel="noopener noreferrer">
      {params.row.storeName}
    </a>)
}

 const columns = [
    {
       field:'storeName',
       headerName:'store Name',
       flex:1,
       sortable:true,
       align:'left',
       type:'string',  
         renderCell: renderStoreName,    
    },
    {
        field:'price',
       headerName:'Price',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.price}`,
       align:'left',
       type:'string', 
    }

  ];

const compareHandler = async (title)=>{
  setProdName(title);
  setRows([]);   
  setIsLightBoxOpen(true);
  setIsLoading(true);
  const response = await requestProductOffers(title);
  setRows(response.data.productData);
  setIsLoading(false);
}

 const placeholders = Array.from({ length: PAGE_SIZE - products.length }, (_, i) => i);
  return (
    <>
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
          <ProductCard product={product} compareClick={compareHandler}/>
        </Grid>
      ))}

       {!isMobile && placeholders.map((i) => (
          <Box key={i} sx={{ visibility: "hidden" }}>
              <ProductCard  product={products[0]} />
        </Box>
      ))}

        
    </Grid>

       <LightBox  key={prodName}  isOpen={isLightboxOpen} onCloseCallback={() => setIsLightBoxOpen(false)} backdropColor="rgba(14, 135, 204, 0.3)">
               {rows &&  <StyledTable rows={rows} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title={`${prodName} Comparison`} loading={isLoading}/>  }
        </LightBox>

    </>
  );
}

export default ProductsGrid;
