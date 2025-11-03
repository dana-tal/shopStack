import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import "./AdminNavBar.css";


function NavBar() {

    return (
    <Box className="navbar-container">
      <Stack className="navbar-stack" direction="row" flexWrap="wrap" gap={2}>
        <Button variant="contained" className="navbar-button" component={NavLink} to="categories" end >Categories</Button>
        <Button variant="contained" className="navbar-button" component={NavLink} to="admin-products">Products</Button>
        <Button variant="contained" className="navbar-button" component={NavLink} to="customers">Customers</Button>
        <Button variant="contained" className="navbar-button" component={NavLink} to="statistics">Statistics</Button>
      </Stack>
    </Box>
  );

}

export default NavBar