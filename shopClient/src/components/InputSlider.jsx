import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
/* import VolumeUp from '@mui/icons-material/VolumeUp'; */
import {useState} from "react";

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider({changeHandler,title,minValue=10,maxValue=100, defaultVal=30 }) {
  const [value, setValue] = useState(defaultVal);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    changeHandler(newValue);
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    setValue(newValue);
    changeHandler(newValue);
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > maxValue) {
      setValue(maxValue);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        
        <Grid size="grow">
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
          {`$ ${value}`}
        </Grid>
        {/* <Grid>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: minValue,
              max: maxValue,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          /> 
        </Grid> */}
      </Grid>
    </Box>
  );
}
