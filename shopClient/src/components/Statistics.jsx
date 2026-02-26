import { requestSoldProducts } from "../utils/productRequests";
import { useEffect ,useState} from "react";
import { Grid, Paper ,Box} from '@mui/material';
import PieDiagram from "./PieDiagram";
import BarsDiagram from "./BarsDiagram";

function Statistics() {

  const [pieProducts,setPieProducts] = useState([]); // the info for the pie chart
  
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
    
   <Grid container spacing={2}  direction="column">
            <Grid item xs={12}>
              <Paper sx={{ p: 2, width: '100%' }}>
                 {true && <PieDiagram data={pieProducts} title="Top 5 Sold Products Diagram"/> }
              </Paper>
            </Grid>
            <Grid item xs={12} >
              <Paper sx={{ p: 2, width: '100%' }}>
                {true && <BarsDiagram />   }        
              </Paper>
            </Grid> 
    </Grid>
   
  )
}

export default Statistics