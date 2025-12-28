import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

 const Paginator =({ totalPages = 20, page, pageChangedHandler }) => 
{

  const handleChange = (event, value) => {
    pageChangedHandler(value);
  };

  return (
    <Stack direction="column" gap={2} flexWrap="wrap" sx={{ mt: 1 , mb:1 }} justifyContent="center">
      <Stack direction="row" gap={2} flexWrap="wrap" sx={{ mt: 1 }} justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" />
      </Stack>
    </Stack>
  );
}

export default Paginator;
