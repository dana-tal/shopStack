import { requestSoldProducts } from "../utils/productRequests";
import { requestUserProducts } from "../utils/orderRequests";
import { useEffect ,useState} from "react";
import { Grid, Paper } from '@mui/material';
import PieDiagram from "./PieDiagram";

function Statistics() {

  const [pieProducts,setPieProducts] = useState([]);
  const [userId, setUserId ] = useState('');
  const [barProducts, setBarProducts] = useState([]);


  useEffect  (()=>{

     const fetchUserProducts = async () =>{

      const info = await requestUserProducts('6943d4acc577d09801c4d5bf');
      console.log("user products:");
      console.log(info);
    }
    if (userId)
    {
      fetchUserProducts();
    }

  },[userId])

  useEffect(()=>{
       
    const fetchSoldProducts = async ()=>{
        const info = await requestSoldProducts();
       const pieData = info.data.productData.map((product) => { return {
                                                  id: product.id,
                                                  value: product.soldUnits,
                                                  label: product.title,
                                              } } 
                                );
        setPieProducts(pieData);
    }
     fetchSoldProducts();
  },[]);
  return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                 <PieDiagram data={pieProducts} title="Sold Products Diagram"/>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                 <PieDiagram data={pieProducts} />
              </Paper>
            </Grid>
    </Grid>
  )
}

export default Statistics