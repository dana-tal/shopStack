import { Paper, Typography, Box, Select, MenuItem, FormControl } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { requestBuyers } from "../utils/userRequests";
import { requestUserProducts } from "../utils/orderRequests";
import { useEffect, useState } from "react";

const BarsDiagram = () => {
  const [users, setUsers] = useState([]);             // the users for the select list 
  const [userId, setUserId] = useState('');          // selected userId for the bar chart 
  const [barProducts, setBarProducts] = useState([]); // the info for the bar chart

  // Responsive chart height: 35% of viewport height, min 200px
  const chartHeight = Math.max(200, window.innerHeight * 0.35); 

  // Fetch users for the select dropdown
  useEffect(() => {
    const fetchBuyers = async () => {
      const info = await requestBuyers();     
      setUsers(info.data.userData);
    }
    fetchBuyers();
  }, []);

  // Fetch selected user's products
  useEffect(() => {
    const fetchUserProducts = async () => {
      const info = await requestUserProducts(userId); 
      const prods = info.data.orderData.map(prod => ({
        name: prod.title,
        quantity: prod.totalQuantity
      }));
      setBarProducts(prods);
    }
    if (userId) fetchUserProducts();
  }, [userId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Header + User Select */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2,gap:1 }}>
        <Typography variant="h6" component="h3"  sx={{ textAlign: 'center', width: '100%' }}>
          Products Bought by {userId ? users.find(u => u.userId === userId)?.firstName : 'User'}
        </Typography>
        <FormControl size="small" sx={{ mt: { xs: 1, sm: 0 }, minWidth: 150 }}>
          <Select 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)}
            sx={{ width: 180 }}
          >
            {users.map(user => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.firstName + ' ' + user.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Centered BarChart */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 600 }}> {/* maxWidth keeps margins consistent with PieDiagram */}
          <BarChart
            dataset={barProducts}
            layout="horizontal"
            xAxis={[
              { label: 'Quantity', max: barProducts.length ? Math.max(...barProducts.map(p => p.quantity)) + 2 : 10 },
            ]}
            yAxis={[
              { scaleType: 'band', dataKey: 'name', width: 140 },
            ]}
            series={[
              { 
                dataKey: 'quantity', 
                color: '#1976d2', 
                barLabel: 'value', 
                barLabelPlacement: 'center',
                barLabelStyle: { fontSize: 12, fontWeight: 'bold' },
              },
            ]}
            margin={{ left: 10, right: 10, top: 20, bottom: 30 }}
            height={chartHeight}
            sx={{
              width: '100%',
              '& .MuiBarLabel-root': { fontSize: '11px', fill:'white' }
            }}
          />
        </Box>
      </Box>

   </Box>
  );
}

export default BarsDiagram;