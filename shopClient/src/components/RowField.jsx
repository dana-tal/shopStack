import { Box, Typography } from '@mui/material';

function RowField({ label, value }) {

    const renderValue = () => {
    if (value == null) return '—';

    // format only for display, without changing external data
    if (typeof value === 'number') {
      return value.toFixed(1);
    }

    return value;
  };


  return (
    <Box sx={{ display: 'flex', py: 0.5, alignItems: 'center' }}>
      <Typography variant="body2" sx={{ mr: 0.8 , fontWeight:'bold'}} >
        {label}
      </Typography>
      
       <Box>{renderValue()}</Box>
    </Box>
  );
}

export default RowField;
