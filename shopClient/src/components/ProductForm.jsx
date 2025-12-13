import { useForm, Controller } from "react-hook-form";
import {Button,TextField,Alert,Stack, Typography,Paper,Select,
    MenuItem,FormControl,FormHelperText} from "@mui/material";
import { useEffect, useState} from "react";
import { requestAllCategories } from "../utils/categoryRequests";
import { requestProductById } from "../utils/productRequests";

const ProductForm = ({ onAddProduct , onUpdateProduct, prodId="" }) =>{

    const productForm = useForm({ defaultValues: { id:"",title: "", price:0, catId:"",imageUrl:"", description:"", }, });
    const { handleSubmit,control,formState: { errors },reset, setError}  = productForm;  

    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
  
    const titleRegex = /^[\p{L}\d\s.,!?'"-]+$/u; 
    const forbiddenChars = /[<>{}\[\]]/; // Forbidden characters: < > { } [ ]
    const scriptPattern = /(script|onerror|onload|javascript:)/i; // Script-like patterns
   
   useEffect(() => {
    if (selectedProduct) {
        reset({
             id: selectedProduct.id,
            title: selectedProduct.title,
            price: selectedProduct.price,
            catId: selectedProduct.category.id,
            imageUrl: selectedProduct.imageUrl,
            description: selectedProduct.description
        });
    }
}, [selectedProduct, reset]);

   useEffect( ()=>{
      const fetchProduct = async (id)=>{
            const response = await requestProductById(id);
            if (response.ok)
            {
                 setSelectedProduct(response.data.productData);
            }
      } 
      
      if (prodId)
      {
        fetchProduct(prodId);
      }
      else
      {
         setSelectedProduct(null);
      }

   },[prodId]);


    const onSubmit = async (data) => 
    {
        let ok;

         if (prodId)
         {
               ok = await onUpdateProduct(data, setError);
         }
         else
         {
                ok = await onAddProduct(data, setError);
         }
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
                p: 3,
                m: "auto",
                width: "100%",             // take full width of parent
                maxWidth: 1200,            // limit max width
                boxSizing: "border-box",
            }}
        >
         
        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} style={{ border:"1px solid blue", padding:"10px"}}>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
               { prodId ? 'Edit a Product': 'Add a New Product'}
            </Typography>

            <Stack spacing={2}>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ width: "100%" }}>
                    <Typography sx={{ width: { sm:80} }}>Title:</Typography>
                    <Controller
                    name="title"
                    control={control}
                      rules={{ 
                        required: "Product title is missing or has invalid type." ,
                        minLength: { value: 2, message: "Title must be at least 2 characters" },
                        maxLength: { value: 80, message: "Title cannot exceed 80 characters" },    
                        pattern: { value: titleRegex, message: "Title contains invalid characters." },
                      }}       
                    render={({ field }) => (
                        <TextField
                        {...field}
                        size="small"                        
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        placeholder="Product Title"
                         sx={{ width: "100%" }}                      
                        />
                    )}
                    />
                </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ width: "100%" }}>
                    <Typography sx={{ width:80 }}>Price:</Typography>
                    <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Price is required", min: { value: 0.1, message: "Price must be > 0" } }}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        type="number"
                        size="small"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        placeholder="Enter price"
                        sx={{ width: "50%" }}
                        />
                    )}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ width: "100%" }}>
                    <Typography sx={{ width:80 }}>Category:</Typography>
                    <Controller
                        name="catId"
                        control={control}
                         rules={{
                            required: "Category is required",
                            pattern: {
                            value: /^[0-9a-fA-F]{24}$/,
                            message: "Invalid category ID format"
                            }
                        }}
                        render={({ field }) => (
                            <FormControl sx={{ width: "100%" }} size="small" variant="outlined"   error={!!errors.catId} >
                            <Select
                                sx={{ width: { xs:"90%" , sm:"100%"} }}  
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
                             {errors.catId && (
                                    <FormHelperText>{errors.catId.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                        />


                </Stack>

                 <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ width: "100%" }}>
                    <Typography sx={{ width: 80 }}>Image Url:</Typography>
                    <Controller
                    name="imageUrl"
                    control={control}
                     rules={{
                        required: "Image URL is required",
                        pattern: {
                        value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                        message: "Invalid image URL or unsupported file type (allowed: jpg, jpeg, png, gif, webp)"
                        }
                    }}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        size="small"                        
                        error={!!errors.imageUrl}
                        helperText={errors.imageUrl?.message}
                        placeholder="Product Image Url"
                        sx={{ width: "100%" }}             
                        />
                    )}
                    />
                </Stack>

                 <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ width: "100%" }}>
                <Typography sx={{ width: 80 }}>Description:</Typography>
                <Controller
                name="description"
                control={control}
                 rules={{ 
                        required: "Product description is missing." ,
                        minLength: { value: 5, message: "Description must be at least 5 characters" },
                        maxLength: { value: 1000, message: "Description cannot exceed 1000 characters" },    
                         validate: (value) => {
                                if (forbiddenChars.test(value)) {
                                    return "Description contains forbidden characters: < > { } [ ]";
                                }
                                if (scriptPattern.test(value)) {
                                    return "Description contains unsafe script-like patterns";
                                }
                                return true; // all good
                        }
                      }}       
                render={({ field }) => (
                    <TextField
                    {...field}
                    size="small"
                    sx={{ width: "100%" }}
                    multiline
                    rows={4}
                    placeholder="Description"
                     error={!!errors.description}
                     helperText={errors.description?.message}
                    />
                )}
                />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Controller
                        name="id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                        />
                </Stack>


                <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start", mt: 1 }}>
                   {selectedProduct ? 'Update Product':'Add Product'}
                </Button>
            </Stack>
        </form>
       </Paper>
    </>
     );
}

export default ProductForm 