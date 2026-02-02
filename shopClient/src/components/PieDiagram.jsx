import { PieChart } from '@mui/x-charts/PieChart';
import { Box ,Typography} from '@mui/material';

function PieDiagram({data,title=""}) {
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
            data,           
            outerRadius: '80%',
            paddingAngle: 0,
            arcLabel: (item) => item.value,
            arcLabelMinAngle: 10,
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