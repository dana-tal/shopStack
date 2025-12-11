import { useForm, Controller } from "react-hook-form";
import {Button,TextField,Alert,Stack} from "@mui/material";
import { validateCategoryName } from "../utils/validateCategory";

function CategoryForm({ onAddCategory }) {

    const categoryForm = useForm({ defaultValues: { categoryName: "" }, });
    const { handleSubmit,control,formState: { errors },reset, setError}  = categoryForm;  

    const onSubmit = async (data) => 
    {
        const error = validateCategoryName(data.categoryName);
        if (error) return setError("categoryName", { type: "manual", message: error });

        const success = await onAddCategory(data.categoryName, setError);
        if (success) reset();
    };

    return (
    <>
        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
         <Stack spacing={2}>
                 
                <Stack direction="row" alignItems="center" spacing={2}>
                        <Controller
                        name="categoryName"
                        control={control}                        
                        rules={{ required: "Category name is missing or has invalid type" }}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            size="small"
                            
                            error={!!errors.categoryName}
                            helperText={errors.categoryName?.message}
                            placeholder="Add a new category"
                            />
                        )}
                        />

                        <Button type="submit" variant="contained" sx={{ mt: 2, alignSelf: "flex-start" }}>
                            Add
                        </Button>
                </Stack>                
         </Stack>
       </form>
    </>
  )
}

export default CategoryForm