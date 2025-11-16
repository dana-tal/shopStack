import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { useForm, Controller } from "react-hook-form";
import {useState, useEffect } from "react";

import { requestCategoryAdd ,requestAllCategories} from '../utils/categoryRequests';
import {
  Box,
  Button,
  TextField,
  Alert,
   Stack,
  
} from "@mui/material";


function Categories() {

  /*
   { id: 1, categoryName: "Toys" },
    { id: 2, categoryName: "Books" }
  */

   const [rows, setRows] = useState([]);

  const columns = [
  { field: 'categoryName', headerName: 'Category', flex:1 , sortable:true, valueGetter: (value,row)=>`${row.categoryName}`},
    { 
    field: 'edit', 
    headerName: 'Edit', 
    flex:1,
    renderCell: (params) => (
      <Button
        variant="contained"
        size="small"
        onClick={() => console.log("Edit", params.row)}
        sx={{ backgroundColor:"#4E9258" }}
      >
        Edit
      </Button>
    ),
  },
  { 
    field: 'remove', 
    headerName: 'Remove', 
    flex:1,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => console.log("Remove", params.row)}
        sx={{ backgroundColor:"#CB6D51" }}
      >
        Remove
      </Button>
    ),
  },
];

 
 const paginationModel = { page: 0, pageSize: 20 };

   const categoryForm = useForm({
    defaultValues: { categoryName: "" },
  });

  const {
      handleSubmit,
      control,
      formState: { errors, isSubmitSuccessful },
      reset,
      setError
    }  = categoryForm;  

   
    const onSubmit = async (data) => 
      {

      console.log("onSubmit, data:",data);
       try
       {
          const response = await requestCategoryAdd(data);
         
          setRows((prev) => [...prev,{ id:response.data.categoryData._id, categoryName: response.data.categoryData.categoryName } ]);
          reset();  
       }
       catch(err)
       {
          console.log(err);
       }
     
    }


    useEffect( ()=>{

      const readAllCategories = async ()=>{

          const all = await requestAllCategories();
          setRows(all.data.categoryData);
      }

     readAllCategories();

    }, []);

  return (
      <Box
       width={{ xs: "90%", sm: "70%", md: "70%", lg: "40%" }}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >

        <Paper sx={{ minHeight: 400, width: '100%', marginBottom:'30px' , backgroundColor:"#FAF0E6" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20, 30]}
       
        sx={{ border: 0, backgroundColor:"#F8F0E3", 

          "& .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitleContainer": {
              display: "flex",
              justifyContent: "center",
              width: "100%",
            },
              
            "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#E1D9D1",
            display: "flex",
            justifyContent: "center",
          },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                 textAlign: "center",
                  width: "100%",
              },
                      
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },

                      "& .MuiDataGrid-row:hover": {
                backgroundColor: "#FAEBD7", // put your desired hover color here "#D3E4CD
              },
         }}
      />
    </Paper>

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      {/* isSubmitSuccessful && <Alert severity="success">Category added successfully!</Alert> */}
      <form onSubmit={handleSubmit(onSubmit)}>
         <Stack spacing={2}>
                 
                <Stack direction="row" alignItems="center" spacing={2}>
                        <Controller
                        name="categoryName"
                        control={control}                        
                         rules={{
                                  required: "Category name is required",
                                  minLength: {
                                    value: 3,
                                    message: "Category name must be at least 3 characters long",
                                  },
                                  pattern: {
                                    value: /^[A-Za-zÀ-ž\s'-]+$/,
                                    message: "Only letters ans spaces are allowed",
                                  },
                                }}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            size="small"
                            fullWidth
                            error={!!errors.category}
                            helperText={errors.category?.message}
                            placeholder="Add a new category"
                            />
                        )}
                        />

                        <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, alignSelf: "flex-start" }}
                    >
                    Add
                     </Button>
                </Stack>
                
         </Stack>
       </form>

    </Box>
  )
}

export default Categories