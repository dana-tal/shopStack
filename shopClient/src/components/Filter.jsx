import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FormControl ,Grid, Typography, TextField, Button} from '@mui/material';
import { useState , useEffect ,useMemo } from 'react';
import { requestAllCategories} from '../utils/categoryRequests';
import InputSlider from './InputSlider';
import debounce from 'lodash.debounce';

function Filter({handleParamsChange,defaultPrice}) {

   const [filterObj, setFilterObj] = useState({catId:'',price:defaultPrice,name:''});
   const [categories, setCategories] = useState([]);


  const debouncedParamsChange = useMemo( () => debounce(handleParamsChange, 500),[handleParamsChange]);

    const categoryChange = (event) => {

        setFilterObj(prev => {
                          const newObj = { ...prev, catId: event.target.value==='All' ? '':event.target.value};
                          debouncedParamsChange(newObj);
                          return newObj;
                        });

  };

  const onPriceChange =  (priceVal) => {
  setFilterObj(prev => {
                          const newObj = { ...prev, price: priceVal };
                          debouncedParamsChange(newObj);
                          return newObj;
                        });
};

  const onNameChange = (value) => 
  {
    setFilterObj(prev => {
                          const newObj = { ...prev, name:value};
                          debouncedParamsChange(newObj);
                          return newObj;
                        });    
  };

  const clearFilters = () => 
  {
    const clearedObj = {
      catId: '',
      price: defaultPrice,
      name: ''
    };

    setFilterObj(clearedObj);
    debouncedParamsChange.cancel();
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

useEffect(() => {
  return () => {
    debouncedParamsChange.cancel();
  };
}, [debouncedParamsChange]);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ width: '100%', padding: 1, backgroundColor: 'tan' }}>
        
        
        {/* Category */}
        <Grid item xs={12} sm={6} md={3}>
         
          <FormControl variant="standard" fullWidth    sx={{ width: { xs: '100%', sm: 150, md: 150 } }}> 
            <InputLabel id="category-label">Category</InputLabel>
            <Select
                labelId="category-label"
                id="category-select"
                value={filterObj.catId || 'All'}
                label="Category"
                onChange={categoryChange}               
            >
                <MenuItem key='All' value='All'>All</MenuItem>
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
          <TextField id="title" label="Title" variant="outlined" onChange={(e) => onNameChange(e.target.value)}  value={filterObj.name}/>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" onClick={clearFilters}>Clear</Button>
        </Grid>

      </Grid>
  )
}

export default Filter