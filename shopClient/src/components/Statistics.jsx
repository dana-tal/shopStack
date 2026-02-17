import { requestSoldProducts } from "../utils/productRequests";
import { requestUserProducts } from "../utils/orderRequests";
import { requestBuyers } from "../utils/userRequests";
import { useEffect ,useState} from "react";
import { Grid, Paper,Typography } from '@mui/material';
import PieDiagram from "./PieDiagram";
import { Box, Select, MenuItem, FormControl } from '@mui/material';
import {BarChart} from '@mui/x-charts';

function Statistics() {

  const [pieProducts,setPieProducts] = useState([]); // the info for the pie chart
  const [userId, setUserId ] = useState('');          // selected userId for the bar chart 
  const [barProducts, setBarProducts] = useState([]); // the info for the bar chart
  const [users,setUsers] = useState([]);             // the users for the select list 


  useEffect  (()=>{

     const fetchUserProducts = async () =>{

      const info = await requestUserProducts(userId); 
     // console.log("user products:");
     // console.log(info.data.orderData);

      const prods = info.data.orderData.map( (prod)=>{ return{ name:prod.title, quantity:prod.totalQuantity } } );
      console.log(prods);
      setBarProducts(prods);
    }
    if (userId)
    {
      fetchUserProducts();
    }

  },[userId])

  useEffect(()=>{
     
    const fetchBuyers = async () =>{
          const info = await requestBuyers();
          
          //console.log("buyers");
          //console.log(info.data.userData);
          setUsers(info.data.userData);
    }

    const fetchSoldProducts = async ()=>{
        const info = await requestSoldProducts();
       const pieData = info.data.productData.map((product) => { return {
                                                  id: product.id,
                                                  value: product.soldUnits,
                                                  label: product.title,
                                              } } 
                                );
     //  console.log("pieData:");
     //  console.log(pieData);
        setPieProducts(pieData);
    }
     fetchSoldProducts();
     fetchBuyers();
  },[]);

  // Total chart height
const chartHeight = Math.max(300, barProducts.length * 50);

  return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                {true && <PieDiagram data={pieProducts} title="Top 5 Sold Products Diagram"/> }
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%',position: 'relative'  }}>
                   <FormControl
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            backgroundColor: 'white',
                          }}
                        >
                      <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
                        { users.map( (user)=>(<MenuItem value={user.userId}>{user.firstName+' '+user.lastName }</MenuItem>)) }
                      </Select>
                  </FormControl>

                     <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="h3">
                      Products Baught by {userId ? users.find(u => u.userId === userId)?.firstName : 'User'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <BarChart
                            dataset={barProducts}
                            layout="horizontal"
                            xAxis={[
                              { label: 'Quantity', max: Math.max(...barProducts.map(p => p.quantity)) + 2 },
                            ]}
                            yAxis={[
                              { scaleType: 'band', dataKey: 'name', width: 140 },
                            ]}
                            series={[
                              { dataKey: 'quantity', color: '#1976d2', barLabel: 'value',           // show the value
                              barLabelPlacement: 'center', // center the label inside each bar
                              // font styling (color may still follow theme)
                              barLabelStyle: {
                                fontSize: 12,
                                fontWeight: 'bold',
                              }, },
                            ]}
                            margin={{ left: 10, right: 50, top: 20, bottom: 30 }}
                            height={chartHeight}
                            width={500}

                              sx={{
                                '& .MuiBarLabel-root': {
                                  fontSize: '11px',
                                  fill:'white'
                                },
                              }}
                          />
                </Box>
              </Paper>
            </Grid>
    </Grid>
  )
}

export default Statistics