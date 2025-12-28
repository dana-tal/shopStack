import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FormControl } from '@mui/material';
import { useState , useEffect } from 'react';
import { requestAllCategories} from '../utils/categoryRequests';

function Filter({handleChangeCategory}) {

    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const categoryChange = (event) => {
        setCategory(event.target.value);
        handleChangeCategory(event.target.value);
  };

  
  useEffect( ()=>
    {
      const readAllCategories = async ()=>
        {
          const all = await requestAllCategories();
          console.log("all");
          console.log(all.data.categoryData);

          setCategories(all.data.categoryData);
        }
        readAllCategories();
    }, []);



  return (
    <div style={{ width:"100%", backgroundColor:"tan" , padding:"10px"}}>

    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
            labelId="category-label"
            id="category-select"
            value={category}
            label="Category"
            onChange={categoryChange}
        >
            { categories.map( cat=>{ return <MenuItem key={cat.id} value={cat.categoryName}>{ cat.categoryName}</MenuItem> })}
        </Select>
    </FormControl>
    </div>
  )
}

export default Filter