import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FormControl ,Grid, Typography, TextField} from '@mui/material';
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

  const onPriceChange = (priceVal) =>{

    const newObj = { ...filterObj, price:priceVal };
    setFilterObj( newObj);
    handleParamsChange(newObj);
     //console.log("priceVal:",priceVal);
  }

  const onNameChange = (newName) =>
  {
    const newObj = { ...filterObj, name:newName};
    setFilterObj( newObj);
    handleParamsChange(newObj);
  }
  
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
          <InputSlider changeHandler={onPriceChange} title="Price" minValue={20} maxValue={200} defaultVal={defaultPrice}/>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField id="title" label="Title" variant="outlined" />
        </Grid>

      </Grid>
  )
}

export default Filter