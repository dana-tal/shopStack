import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

export default function InputSlider({changeHandler,title,minValue=10,maxValue=100, value }) {

 // const [ sliderValue, setSliderValue ] = useState(typeof value === 'number' ? value : 0);
  const handleSliderChange = (event, newValue) => {
 //   setSliderValue(newValue);
    changeHandler(newValue);
  };


  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        
        <Grid size="grow">
          <Slider
            value={value}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={minValue}
            max={maxValue}
             
          />
          {`$ ${value}`}
        </Grid>
      
        
      </Grid>
    </Box>
  );
}
