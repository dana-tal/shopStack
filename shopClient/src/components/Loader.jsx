import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

function Loader() {
  return (
    <>
         <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
              <CircularProgress    sx={{ color: '#ff99c8' }} />
              <CircularProgress sx={{ color: '#fcf6bd' }}  />
              <CircularProgress sx={{ color: '#d0f4de' }}  />
               <CircularProgress sx={{ color: '#a9def9' }}  />
              <CircularProgress sx={{ color: '#e4c1f9' }}  />
          </Stack>
    </>
  )
}

export default Loader