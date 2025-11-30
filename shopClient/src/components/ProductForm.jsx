import { useForm, Controller } from "react-hook-form";
import {Button,TextField,Alert,Stack, Typography,Paper,Select,
    MenuItem,FormControl} from "@mui/material";
import { useEffect, useState} from "react";
import { requestAllCategories } from "../utils/categoryRequests";


const ProductForm = ({ onAddProduct }) =>{

    const productForm = useForm({ defaultValues: { title: "", price:0, catId:"",imageUrl:"", description:"" }, });
    const { handleSubmit,control,formState: { errors },reset, setError}  = productForm;  

    const [categories, setCategories] = useState([]);

    const onSubmit = async (data) => 
    {
        console.log("form data");
        console.log(data);

        
       // const error = validateCategoryName(data.categoryName);
       // if (error) return setError("categoryName", { type: "manual", message: error });


        const ok = await onAddProduct(data, setError);
        if (ok) 
        {
            reset();
        }
    };


    useEffect( ()=>{
            
        const fetchAllCategories = async ()=>{

            const allCats = await requestAllCategories();
            if (allCats.ok)
            {
                setCategories(allCats.data.categoryData);
            }
            else
            {
                console.log( allCats.message);
            }
           
        }

        fetchAllCategories();

    }, []);

     return (
    <>
       <Paper
        elevation={0}
        sx={{
            p: 3,                 // inner padding
            m: 2,
            width: "90%",          // take 90% of screen width
            maxWidth: 1000,        // max width limit
            minWidth: 600,         // optional: prevent it from being too small
            mx: "auto",
            boxSizing: "border-box",
           
        }}
        >
         

        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} style={{ border:"1px solid blue", padding:"10px"}}>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                  Add a New Product
            </Typography>

            <Stack spacing={2}>

                 <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ width: 80 }}>Title:</Typography>
                    <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Product title is missing or has invalid type" }}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        size="small"
                        
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        placeholder="Product Title"
                        sx={{ width: 450 }}                      
                        />
                    )}
                    />
                </Stack>

                 <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ width:80 }}>Price:</Typography>
                    <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Price is required", min: { value: 0, message: "Price must be ≥ 0" } }}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        type="number"
                        size="small"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        placeholder="Enter price"
                        sx={{ width: 100 }} 
                        />
                    )}
                    />
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ width:80 }}>Category:</Typography>
                    <Controller
                        name="catId"
                        control={control}
                        render={({ field }) => (
                            <FormControl sx={{ width: 450 }} size="small" variant="outlined">
                            <Select
                                {...field}
                                displayEmpty
                                renderValue={(selected) => {
                                if (!selected) return "Category"; // placeholder
                                const selectedCat = categories.find(cat => cat.id === selected);
                                return selectedCat ? selectedCat.categoryName : selected; 
                                }}
                            >
                                {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.categoryName}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                        )}
                        />


                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ width: 80 }}>Image Url:</Typography>
                    <Controller
                    name="imageUrl"
                    control={control}
                    rules={{ required: "Product image url is missing or has invalid type" }}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        size="small"
                        
                        error={!!errors.imageUrl}
                        helperText={errors.imageUrl?.message}
                        placeholder="Product Image Url"
                        sx={{ width: 450 }}                      
                        />
                    )}
                    />
                </Stack>

                <Stack direction="row" spacing={1} alignItems="flex-start">
                <Typography sx={{ width: 80 }}>Description:</Typography>
                <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                    {...field}
                    size="small"
                     sx={{ width: 450 }}     
                    multiline
                    rows={4}
                    placeholder="Description"
                    />
                )}
                />
                </Stack>

                <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start", mt: 1 }}>
                    Add Product
                </Button>
            </Stack>
        </form>
       </Paper>
    </>
     );
}

export default ProductForm 