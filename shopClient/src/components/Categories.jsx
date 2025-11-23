import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { useForm, Controller } from "react-hook-form";
import {useState, useEffect,useRef, forwardRef } from "react";

  
import { requestCategoryAdd ,requestAllCategories, requestCategoryRemove, requestCategoryUpdate } from '../utils/categoryRequests';
import {Box,Button,TextField,Alert,Stack, Popper,Typography,Tooltip} from "@mui/material";


function Categories() {

   const [rows, setRows] = useState([]);
   const [editValues, setEditValues] = useState({}); // a map , each id points to the updated value 
   const [updateErrors, setUpdateErrors] = useState({});  // a map , each id points to the error of this row

  const validateCategoryName = (value) => {
  if (typeof value !== "string") return "Category name is missing or has invalid type";

  const trimmed = value.trim();
  if (trimmed.length === 0) return "Category name cannot be empty or only spaces";

  const startRegex = /^[A-Za-z\u0590-\u05FF0-9]/;
  const allowedRegex = /^[A-Za-z\u0590-\u05FF0-9\s\-\()']+$/;

  if (!startRegex.test(trimmed)) {
    return "Category name must start with a letter or digit";
  }

  if (!allowedRegex.test(trimmed)) {
    return "Category name contains invalid characters";
  }

  return ""; // no error
}

  const columns = [
  { 
       field: 'categoryName',
       headerName: 'Category',
       flex:1 ,
      sortable:true,
      valueGetter: (value,row)=>`${row.categoryName}`,
      renderCell: (params)=>{
             const isEditMode = editValues.hasOwnProperty(params.row.id); 
             if (isEditMode)
             {
                  const error = updateErrors[params.row.id];
                return   <Box  sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                 <Tooltip
                    title={error || ""}
                    open={!!error}
                    placement="bottom"
                    arrow
                  >
           
                 <TextField  sx={{
                                          "& .MuiInputBase-input": {
                                            textAlign: "center",
                                          },
                                        }}
                                        required
                                        size="small"
                                        
                                        value={editValues[params.row.id]} // <-- bind to state
                                          onChange={(e) => { 
                                              const newValue = e.target.value;

                                            setEditValues((prev) => ({...prev,[params.row.id]: e.target.value})) ;   
                                          setUpdateErrors(prev => { const copy = { ...prev }; delete copy[params.row.id];return copy;});
  
                                        }}                         
                      />
                  </Tooltip>
                </Box>

             }
             else
             {
                 return params.row.categoryName;
             }
      }

  },
   
  { 
    field: 'edit', 
    headerName: 'Edit', 
    flex:1,
    renderCell: (params) => {

       const isEditMode = editValues.hasOwnProperty(params.row.id); 

        return <Button
          variant="contained"
          size="small"
          onClick={ async () => { 
                if (isEditMode) // when "Update" is clicked , we have a final value
                  {           
                      const newValue = editValues[params.row.id];
                      const errorMessage = validateCategoryName(newValue);

                       if (errorMessage) 
                        {
                            setUpdateErrors(prev => ({ ...prev, [params.row.id]: errorMessage }));
                            return; // stop update
                        }

                    const resp = await  requestCategoryUpdate( params.row.id,editValues[params.row.id] );
                    if ( resp.ok)
                    { 
                        // Update the row in your rows state
                      const updatedRows = rows.map((row) => row.id === params.row.id ? { ...row, categoryName: editValues[params.row.id] }: row );
                      setRows(updatedRows);

                       // remove server-side error
                        setUpdateErrors((prev) => {
                          const copy = { ...prev };
                          delete copy[params.row.id];
                          return copy;
                        });

                         // Remove this row from editValues to exit edit mode
                      setEditValues((prev) => {
                        const copy = { ...prev };
                        delete copy[params.row.id];
                        return copy;
                      });
                    }
                    else
                    {
                       console.log("setting errors");
                        setUpdateErrors((prev) => ({ ...prev, [params.row.id]: resp.message || "Update failed" }));
                    }  
                   
                  } 
                  else  // when "Edit" is clicked , we need to add the editable id to the editValues object 
                  {
                      setEditValues((prev) => ({
                            ...prev,
                            [params.row.id]: params.row.categoryName,
                          }));
                  }   

            
            }
          }
          sx={{ backgroundColor:"#4E9258" }}
        >
          {  
              isEditMode ? 'Update':'Edit' 
          }
        </Button>
  },

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
        onClick={ async () => {
          
          const resp = await requestCategoryRemove(params.row.id);        
          if (resp.ok)
          {
               setRows( (prev)=>{
                      const afterRemoval = [...prev].filter( (element)=>{ return element.id !== params.row.id});
                       return afterRemoval;
               })
          }
          else
          {
              console.log("Removing category failed")
          }

        }}
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

  const { handleSubmit,control,formState: { errors, isSubmitSuccessful },reset, setError}  = categoryForm;  

   
    const onSubmit = async (data) => 
      {
      try
       {
          const response = await requestCategoryAdd(data);
          if (response.ok)
          {
            setRows((prev) => [...prev,{ id:response.data.categoryData._id, categoryName: response.data.categoryData.categoryName } ]);
            reset();  
          }
          else
          {
             throw response;
          }
       }
       catch(err)
       {
          let explain;
          
          console.log(err);
           
          if ( err.message.includes("E11000"))
          {
              explain = "Adding a new category failed because the category already exists";
          }
          else
          {
            explain = err.message;
          }

           setError("root", {
            type: "server",
            message: explain || "Adding a new category failed",
            });
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
                backgroundColor: "#FAEBD7", //  "#D3E4CD
              },

               "& .MuiDataGrid-row.Mui-selected": {
                     backgroundColor:"#FFE4C4   !important",   // your selected color  #B3D9D9 "#A0D6B4 
               },
         }}
      />
    </Paper>

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
         <Stack spacing={2}>
                 
                <Stack direction="row" alignItems="center" spacing={2}>
                        <Controller
                        name="categoryName"
                        control={control}                        
                        rules={{
                                    required: "Category name is missing or has invalid type",
                                    validate: (value) => {
                                      if (typeof value !== "string") {
                                        return "Category name is missing or has invalid type";
                                      }

                                      const trimmed = value.trim();

                                      if (trimmed.length === 0) {
                                        return "Category name cannot be empty or only spaces";
                                      }

                                      const startRegex = /^[A-Za-z\u0590-\u05FF0-9]/; // must start with letter or digit
                                      const allowedRegex = /^[A-Za-z\u0590-\u05FF0-9\s\-\()']+$/; // allowed chars

                                      if (!startRegex.test(trimmed)) {
                                        return "Category name must start with a letter or digit";
                                      }

                                      if (!allowedRegex.test(trimmed)) {
                                        return "Category name contains invalid characters";
                                      }

                                      return true; // validation passed
                                    },
                                }}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            size="small"
                            fullWidth
                            error={!!errors.categoryName}
                            helperText={errors.categoryName?.message}
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