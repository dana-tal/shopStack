import { PieChart } from '@mui/x-charts/PieChart';
import { Box ,Typography} from '@mui/material';

function PieDiagram({data,title="",maxSlices=5}) {

   const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, maxSlices);
  const otherValue = sorted.slice(maxSlices).reduce((sum, p) => sum + p.value, 0);
  if (otherValue > 0) top.push({ id: 'other', label: 'Other', value: otherValue });

  return (
      <Box  sx={{ width: '100%', flexGrow: 1 ,alignItems: 'center'}}   
     
    >
        <Typography variant="h6" gutterBottom textAlign="center">
           {title}
        </Typography>
     
      <PieChart
          sx={{ width: '80%', height:{ xs: '45vh', sm: '35vh', md: '32vh' } , mx: 'auto' }} /* { xs: '30vh', sm: '35vh', md: '32vh' }*/ 
        series={[
          {
            data:top,           
            outerRadius: '80%',
            paddingAngle: 0,    
            arcLabel: (item) => item.value,       
            arcLinkLabel: (item) => `${item.label}: ${item.value}`,
          },
        ]}

        slotProps={{
             legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                    labelstyle: {
                            fontSize: 11,
                    },
                },
            pieArc: {
                sx: {
                stroke: 'none',
                },
            },
            }}
      />
    </Box>
  )
}

export default PieDiagram