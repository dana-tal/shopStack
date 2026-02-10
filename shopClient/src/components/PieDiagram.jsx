import { PieChart } from '@mui/x-charts/PieChart';
import { Box ,Typography} from '@mui/material';

function PieDiagram({data,title="",maxSlices=5}) {

   const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, maxSlices);
  const otherValue = sorted.slice(maxSlices).reduce((sum, p) => sum + p.value, 0);
  if (otherValue > 0) top.push({ id: 'other', label: 'Other', value: otherValue });

  return (
        <Box
      sx={{
        width: '100%',
        height: {
          xs: 260,
          sm: 300,
          md: 340,
        },
      }}
    >
        <Typography variant="h6" gutterBottom textAlign="center">
           {title}
        </Typography>
      <PieChart
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