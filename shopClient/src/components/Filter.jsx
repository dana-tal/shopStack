import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FormControl ,Grid, Typography, TextField, Button} from '@mui/material';
import { useState , useEffect } from 'react';
import { requestAllCategories} from '../utils/categoryRequests';
import InputSlider from './InputSlider';

function Filter({handleParamsChange,defaultPrice}) {

   const [filterObj, setFilterObj] = useState({catId:'',price:defaultPrice,name:''});
   const [categories, setCategories] = useState([]);

    const categoryChange = (event) => {

      const newObj = { ...filterObj, catId: event.target.value };
      setFilterObj( newObj)
      handleParamsChange(newObj);
  };

  const onPriceChange = (priceVal) => {
  setFilterObj(prev => {
    const newObj = { ...prev, price: priceVal };
    handleParamsChange(newObj);
    return newObj;
  });
};

  const onNameChange = (event) => 
  {
      const newObj = { ...filterObj, name:event.target.value};
      setFilterObj( newObj);
      handleParamsChange(newObj);
  }

  const clearFilters = () => 
  {
    const clearedObj = {
      catId: '',
      price: defaultPrice,
      name: ''
    };

    setFilterObj(clearedObj);
    handleParamsChange(clearedObj);
};

  
  useEffect( ()=>
    {
      const readAllCategories = async ()=>
        {
          const all = await requestAllCategories();
         
          setCategories(all.data.categoryData);
        }
        readAllCategories();
    }, []);



  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ width: '100%', padding: 1, backgroundColor: 'tan' }}>
        
         <Grid item xs={12} sm={6} md={3}>
         <Typography>Filter By:</Typography>
         </Grid>
        {/* Category */}
        <Grid item xs={12} sm={6} md={3}>
         
          <FormControl variant="standard" fullWidth    sx={{ width: { xs: '100%', sm: 150, md: 150 } }}> 
            <InputLabel id="category-label">Category</InputLabel>
            <Select
                labelId="category-label"
                id="category-select"
                value={filterObj.catId}
                label="Category"
                onChange={categoryChange}
            >
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.categoryName}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Price Slider */}
        <Grid item xs={12} sm={6} md={3}>
          <InputSlider changeHandler={onPriceChange} title="Price" minValue={20} maxValue={200} value={filterObj.price}/>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField id="title" label="Title" variant="outlined" onChange={onNameChange}  value={filterObj.name}/>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" onClick={clearFilters}>Clear</Button>
        </Grid>

      </Grid>
  )
}

export default Filter